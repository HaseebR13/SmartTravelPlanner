-- ============================================================================
-- 14_ExtendSchema.sql  — Database extension (Users, Reviews, Favourites,
--                        Bookings, AuditLog). Adds normalization (3NF),
--                        PK/FK, CHECK / UNIQUE / DEFAULT integrity, indexes.
-- Run AFTER 09_NewModules.sql.  Database: SmartTravelDB
-- ============================================================================
USE SmartTravelDB;
GO
SET NOCOUNT ON;
PRINT '== 14_ExtendSchema: adding new normalized tables ==';
GO

-- ── Users ──────────────────────────────────────────────────────────────────
-- Owns saved plans, reviews and favourites. UserName UNIQUE = integrity.
IF OBJECT_ID('dbo.Users','U') IS NULL
CREATE TABLE Users (
    UserID        INT IDENTITY(1,1) PRIMARY KEY,
    UserName      NVARCHAR(100) NOT NULL UNIQUE,
    Email         NVARCHAR(200) NOT NULL UNIQUE,
    PasswordHash  NVARCHAR(256) NOT NULL DEFAULT '',
    CreatedAt     DATETIME      NOT NULL DEFAULT GETDATE()
);
GO

-- Link saved plans to a user (nullable so old rows stay valid).
IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id=OBJECT_ID('TravelPlans') AND name='UserID')
    ALTER TABLE TravelPlans ADD UserID INT NULL
        CONSTRAINT FK_Plan_User REFERENCES Users(UserID);
GO

-- ── Reviews ──────────────────────────────────────────────────────────────────
-- Rating constrained 1..5 (CHECK). One review per user per place (UNIQUE).
IF OBJECT_ID('dbo.Reviews','U') IS NULL
CREATE TABLE Reviews (
    ReviewID   INT IDENTITY(1,1) PRIMARY KEY,
    UserID     INT           NOT NULL,
    PlaceID    INT           NOT NULL,
    Rating     INT           NOT NULL CHECK (Rating BETWEEN 1 AND 5),
    Comment    NVARCHAR(500) NOT NULL DEFAULT '',
    CreatedAt  DATETIME      NOT NULL DEFAULT GETDATE(),
    CONSTRAINT FK_Review_User  FOREIGN KEY (UserID)  REFERENCES Users(UserID)  ON DELETE CASCADE,
    CONSTRAINT FK_Review_Place FOREIGN KEY (PlaceID) REFERENCES Places(PlaceID) ON DELETE CASCADE,
    CONSTRAINT UQ_Review_User_Place UNIQUE (UserID, PlaceID)
);
GO

-- ── Favourites (many-to-many User ↔ Location) ───────────────────────────────
IF OBJECT_ID('dbo.Favourites','U') IS NULL
CREATE TABLE Favourites (
    UserID      INT      NOT NULL,
    LocationID  INT      NOT NULL,
    AddedAt     DATETIME NOT NULL DEFAULT GETDATE(),
    CONSTRAINT PK_Favourite PRIMARY KEY (UserID, LocationID),
    CONSTRAINT FK_Fav_User FOREIGN KEY (UserID)     REFERENCES Users(UserID)        ON DELETE CASCADE,
    CONSTRAINT FK_Fav_Loc  FOREIGN KEY (LocationID) REFERENCES Locations(LocationID) ON DELETE CASCADE
);
GO

-- ── Bookings (a hotel booking inside a plan) ─────────────────────────────────
IF OBJECT_ID('dbo.Bookings','U') IS NULL
CREATE TABLE Bookings (
    BookingID  INT IDENTITY(1,1) PRIMARY KEY,
    PlanID     INT           NOT NULL,
    HotelID    INT           NOT NULL,
    CheckIn    DATE          NOT NULL,
    CheckOut   DATE          NOT NULL,
    Nights     AS (DATEDIFF(DAY, CheckIn, CheckOut)) PERSISTED,   -- derived, no anomaly
    Status     NVARCHAR(20)  NOT NULL DEFAULT 'Pending'
               CHECK (Status IN ('Pending','Confirmed','Cancelled')),
    CreatedAt  DATETIME      NOT NULL DEFAULT GETDATE(),
    CONSTRAINT FK_Book_Plan  FOREIGN KEY (PlanID)  REFERENCES TravelPlans(PlanID) ON DELETE CASCADE,
    CONSTRAINT FK_Book_Hotel FOREIGN KEY (HotelID) REFERENCES Hotels(HotelID),
    CONSTRAINT CK_Book_Dates CHECK (CheckOut > CheckIn)
);
GO

-- ── AuditLog (used by procs for basic error/operation logging) ───────────────
IF OBJECT_ID('dbo.AuditLog','U') IS NULL
CREATE TABLE AuditLog (
    LogID      INT IDENTITY(1,1) PRIMARY KEY,
    Entity     NVARCHAR(50)  NOT NULL,
    Action     NVARCHAR(20)  NOT NULL,
    RefID      INT           NULL,
    Message    NVARCHAR(400) NOT NULL DEFAULT '',
    CreatedAt  DATETIME      NOT NULL DEFAULT GETDATE()
);
GO

-- ── Indexes for common lookups ───────────────────────────────────────────────
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name='IX_Reviews_Place')
    CREATE INDEX IX_Reviews_Place ON Reviews(PlaceID);
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name='IX_Bookings_Plan')
    CREATE INDEX IX_Bookings_Plan ON Bookings(PlanID);
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name='IX_Plans_User')
    CREATE INDEX IX_Plans_User ON TravelPlans(UserID);
GO

PRINT '14_ExtendSchema complete. Next: 15_ExtendProcedures.sql';
GO
