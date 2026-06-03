USE SmartTravelDB;
GO

-- ── Get locations by country code ────────────────────────────────────────────
CREATE OR ALTER PROCEDURE sp_GetLocationsByCountry
    @CountryCode NVARCHAR(10)
AS
BEGIN
    SELECT l.LocationID, l.CountryID, l.Name, l.City,
           c.Name AS CountryName, c.Code AS CountryCode, c.Module
    FROM Locations l
    INNER JOIN Countries c ON l.CountryID = c.CountryID
    WHERE c.Code = @CountryCode
    ORDER BY l.City, l.Name;
END;
GO

-- ── Get all countries ────────────────────────────────────────────────────────
CREATE OR ALTER PROCEDURE sp_GetAllCountries
AS
BEGIN
    SELECT CountryID, Name, Code, Module
    FROM Countries
    ORDER BY Module, Name;
END;
GO

-- ── Get route info ───────────────────────────────────────────────────────────
CREATE OR ALTER PROCEDURE sp_GetRoute
    @FromLocationID INT,
    @ToLocationID   INT,
    @TravelMode     NVARCHAR(30)
AS
BEGIN
    SELECT r.RouteID, r.FromLocationID, r.ToLocationID,
           fl.City AS FromCity, tl.City AS ToCity,
           r.TravelMode, r.Cost, r.DurationHours
    FROM Routes r
    INNER JOIN Locations fl ON r.FromLocationID = fl.LocationID
    INNER JOIN Locations tl ON r.ToLocationID   = tl.LocationID
    WHERE r.FromLocationID = @FromLocationID
      AND r.ToLocationID   = @ToLocationID
      AND r.TravelMode     = @TravelMode;
END;
GO

-- ── Get hotels by location and budget ───────────────────────────────────────
CREATE OR ALTER PROCEDURE sp_GetHotelsByBudget
    @LocationID    INT,
    @MaxPerNight   DECIMAL(18,2)
AS
BEGIN
    SELECT HotelID, LocationID, Name, PricePerNight, StarRating, Description, Amenities
    FROM Hotels
    WHERE LocationID = @LocationID
      AND PricePerNight <= @MaxPerNight
    ORDER BY StarRating DESC, PricePerNight DESC;
END;
GO

-- ── Get places by location ───────────────────────────────────────────────────
CREATE OR ALTER PROCEDURE sp_GetPlacesByLocation
    @LocationID INT
AS
BEGIN
    SELECT PlaceID, LocationID, Name, Type, EntryFee, Description
    FROM Places
    WHERE LocationID = @LocationID
    ORDER BY EntryFee DESC;
END;
GO

-- ── Get all saved plans ──────────────────────────────────────────────────────
CREATE OR ALTER PROCEDURE sp_GetAllPlans
AS
BEGIN
    SELECT tp.PlanID, tp.UserName, tp.Members, tp.TotalDays, tp.TotalBudget,
           tp.TravelMode, tp.Module, tp.CountryName,
           tp.TravelCost, tp.HotelCost, tp.PlacesCost,
           tp.CreatedAt,
           fl.City AS FromCity, tl.City AS ToCity,
           fl.Name AS FromName, tl.Name AS ToName
    FROM TravelPlans tp
    INNER JOIN Locations fl ON tp.FromLocationID = fl.LocationID
    INNER JOIN Locations tl ON tp.ToLocationID   = tl.LocationID
    ORDER BY tp.CreatedAt DESC;
END;
GO

PRINT 'Stored procedures created.';