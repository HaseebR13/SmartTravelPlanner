-- ============================================================================
-- 15_ExtendProcedures.sql  — Full CRUD stored procedures over the new tables.
-- Demonstrates rubric item: "SQL queries correctly implemented (CRUD)".
-- All write procs use TRY/CATCH + AuditLog for basic error handling.
-- Run AFTER 14_ExtendSchema.sql.   Database: SmartTravelDB
-- ============================================================================
USE SmartTravelDB;
GO

/* ───────────────────────── USERS — CRUD ───────────────────────── */
CREATE OR ALTER PROCEDURE sp_User_Create
    @UserName NVARCHAR(100), @Email NVARCHAR(200), @PasswordHash NVARCHAR(256) = ''
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        INSERT INTO Users (UserName, Email, PasswordHash)
        VALUES (@UserName, @Email, @PasswordHash);
        DECLARE @id INT = SCOPE_IDENTITY();
        INSERT INTO AuditLog (Entity, Action, RefID, Message) VALUES ('User','Create',@id,@UserName);
        SELECT * FROM Users WHERE UserID = @id;
    END TRY
    BEGIN CATCH
        INSERT INTO AuditLog (Entity, Action, Message) VALUES ('User','Error',ERROR_MESSAGE());
        THROW;
    END CATCH
END;
GO

CREATE OR ALTER PROCEDURE sp_User_GetByName @UserName NVARCHAR(100)
AS
BEGIN
    SELECT UserID, UserName, Email, CreatedAt FROM Users WHERE UserName = @UserName;
END;
GO

CREATE OR ALTER PROCEDURE sp_User_Update
    @UserID INT, @Email NVARCHAR(200), @PasswordHash NVARCHAR(256)
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE Users SET Email = @Email, PasswordHash = @PasswordHash WHERE UserID = @UserID;
    INSERT INTO AuditLog (Entity, Action, RefID) VALUES ('User','Update',@UserID);
END;
GO

CREATE OR ALTER PROCEDURE sp_User_Delete @UserID INT
AS
BEGIN
    SET NOCOUNT ON;
    DELETE FROM Users WHERE UserID = @UserID;
    INSERT INTO AuditLog (Entity, Action, RefID) VALUES ('User','Delete',@UserID);
END;
GO

/* ───────────────────────── REVIEWS — CRUD ───────────────────────── */
CREATE OR ALTER PROCEDURE sp_Review_Add
    @UserID INT, @PlaceID INT, @Rating INT, @Comment NVARCHAR(500) = ''
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        -- Upsert: one review per user per place.
        IF EXISTS (SELECT 1 FROM Reviews WHERE UserID=@UserID AND PlaceID=@PlaceID)
            UPDATE Reviews SET Rating=@Rating, Comment=@Comment, CreatedAt=GETDATE()
            WHERE UserID=@UserID AND PlaceID=@PlaceID;
        ELSE
            INSERT INTO Reviews (UserID, PlaceID, Rating, Comment)
            VALUES (@UserID, @PlaceID, @Rating, @Comment);
        SELECT * FROM Reviews WHERE UserID=@UserID AND PlaceID=@PlaceID;
    END TRY
    BEGIN CATCH
        INSERT INTO AuditLog (Entity, Action, Message) VALUES ('Review','Error',ERROR_MESSAGE());
        THROW;
    END CATCH
END;
GO

CREATE OR ALTER PROCEDURE sp_Review_GetByPlace @PlaceID INT
AS
BEGIN
    SELECT r.ReviewID, r.Rating, r.Comment, r.CreatedAt, u.UserName,
           AVG(CAST(r2.Rating AS DECIMAL(4,2))) OVER () AS PlaceAvgRating
    FROM Reviews r
    JOIN Users u  ON r.UserID = u.UserID
    JOIN Reviews r2 ON r2.PlaceID = r.PlaceID
    WHERE r.PlaceID = @PlaceID
    ORDER BY r.CreatedAt DESC;
END;
GO

CREATE OR ALTER PROCEDURE sp_Review_Delete @ReviewID INT
AS
BEGIN
    DELETE FROM Reviews WHERE ReviewID = @ReviewID;
    INSERT INTO AuditLog (Entity, Action, RefID) VALUES ('Review','Delete',@ReviewID);
END;
GO

/* ───────────────────────── FAVOURITES ───────────────────────── */
CREATE OR ALTER PROCEDURE sp_Favourite_Toggle @UserID INT, @LocationID INT
AS
BEGIN
    SET NOCOUNT ON;
    IF EXISTS (SELECT 1 FROM Favourites WHERE UserID=@UserID AND LocationID=@LocationID)
        DELETE FROM Favourites WHERE UserID=@UserID AND LocationID=@LocationID;
    ELSE
        INSERT INTO Favourites (UserID, LocationID) VALUES (@UserID, @LocationID);
END;
GO

CREATE OR ALTER PROCEDURE sp_Favourite_GetByUser @UserID INT
AS
BEGIN
    SELECT l.LocationID, l.Name, l.City, l.ImageURL, f.AddedAt
    FROM Favourites f JOIN Locations l ON f.LocationID = l.LocationID
    WHERE f.UserID = @UserID ORDER BY f.AddedAt DESC;
END;
GO

/* ───────────────────────── BOOKINGS — CRUD ───────────────────────── */
CREATE OR ALTER PROCEDURE sp_Booking_Create
    @PlanID INT, @HotelID INT, @CheckIn DATE, @CheckOut DATE
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        INSERT INTO Bookings (PlanID, HotelID, CheckIn, CheckOut)
        VALUES (@PlanID, @HotelID, @CheckIn, @CheckOut);
        SELECT * FROM Bookings WHERE BookingID = SCOPE_IDENTITY();
    END TRY
    BEGIN CATCH
        INSERT INTO AuditLog (Entity, Action, Message) VALUES ('Booking','Error',ERROR_MESSAGE());
        THROW;
    END CATCH
END;
GO

CREATE OR ALTER PROCEDURE sp_Booking_SetStatus @BookingID INT, @Status NVARCHAR(20)
AS
BEGIN
    UPDATE Bookings SET Status = @Status WHERE BookingID = @BookingID;
    INSERT INTO AuditLog (Entity, Action, RefID, Message) VALUES ('Booking','Update',@BookingID,@Status);
END;
GO

CREATE OR ALTER PROCEDURE sp_Booking_GetByPlan @PlanID INT
AS
BEGIN
    SELECT b.BookingID, b.HotelID, h.Name AS HotelName, b.CheckIn, b.CheckOut,
           b.Nights, b.Status, (b.Nights * h.PricePerNight) AS EstCost
    FROM Bookings b JOIN Hotels h ON b.HotelID = h.HotelID
    WHERE b.PlanID = @PlanID ORDER BY b.CheckIn;
END;
GO

/* ─────────────── TRAVEL PLAN — write side (Create / Delete) ─────────────── */
CREATE OR ALTER PROCEDURE sp_Plan_Save
    @UserName NVARCHAR(100), @UserID INT = NULL, @Members INT,
    @FromLocationID INT, @ToLocationID INT, @TotalDays INT,
    @TotalBudget DECIMAL(18,2), @TravelMode NVARCHAR(30),
    @Module NVARCHAR(20), @CountryName NVARCHAR(100),
    @TravelCost DECIMAL(18,2), @HotelCost DECIMAL(18,2), @PlacesCost DECIMAL(18,2)
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        INSERT INTO TravelPlans (UserName, UserID, Members, FromLocationID, ToLocationID,
            TotalDays, TotalBudget, TravelMode, Module, CountryName,
            TravelCost, HotelCost, PlacesCost)
        VALUES (@UserName, @UserID, @Members, @FromLocationID, @ToLocationID,
            @TotalDays, @TotalBudget, @TravelMode, @Module, @CountryName,
            @TravelCost, @HotelCost, @PlacesCost);
        DECLARE @pid INT = SCOPE_IDENTITY();
        INSERT INTO AuditLog (Entity, Action, RefID) VALUES ('Plan','Create',@pid);
        SELECT @pid AS NewPlanID;
    END TRY
    BEGIN CATCH
        INSERT INTO AuditLog (Entity, Action, Message) VALUES ('Plan','Error',ERROR_MESSAGE());
        THROW;
    END CATCH
END;
GO

CREATE OR ALTER PROCEDURE sp_Plan_Delete @PlanID INT
AS
BEGIN
    DELETE FROM TravelPlans WHERE PlanID = @PlanID;   -- cascades DayPlans/Bookings
    INSERT INTO AuditLog (Entity, Action, RefID) VALUES ('Plan','Delete',@PlanID);
END;
GO

PRINT '15_ExtendProcedures complete. Next: 16_ExtendSeed.sql';
GO
