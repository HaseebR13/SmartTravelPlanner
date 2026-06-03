USE SmartTravelDB;
GO

-- ── Drop in dependency order ────────────────────────────────────────────────
IF OBJECT_ID('dbo.DayPlanPlaces','U') IS NOT NULL DROP TABLE dbo.DayPlanPlaces;
IF OBJECT_ID('dbo.DayPlans','U')      IS NOT NULL DROP TABLE dbo.DayPlans;
IF OBJECT_ID('dbo.TravelPlans','U')   IS NOT NULL DROP TABLE dbo.TravelPlans;
IF OBJECT_ID('dbo.Places','U')        IS NOT NULL DROP TABLE dbo.Places;
IF OBJECT_ID('dbo.Hotels','U')        IS NOT NULL DROP TABLE dbo.Hotels;
IF OBJECT_ID('dbo.Routes','U')        IS NOT NULL DROP TABLE dbo.Routes;
IF OBJECT_ID('dbo.Locations','U')     IS NOT NULL DROP TABLE dbo.Locations;
IF OBJECT_ID('dbo.Countries','U')     IS NOT NULL DROP TABLE dbo.Countries;
GO

-- ── Countries ───────────────────────────────────────────────────────────────
CREATE TABLE Countries (
    CountryID   INT IDENTITY(1,1) PRIMARY KEY,
    Name        NVARCHAR(100) NOT NULL,
    Code        NVARCHAR(10)  NOT NULL UNIQUE,
    Module      NVARCHAR(20)  NOT NULL   -- 'Pakistan' | 'Foreign'
);

-- ── Locations ───────────────────────────────────────────────────────────────
CREATE TABLE Locations (
    LocationID  INT IDENTITY(1,1) PRIMARY KEY,
    CountryID   INT NOT NULL,
    Name        NVARCHAR(100) NOT NULL,
    City        NVARCHAR(100) NOT NULL,
    CONSTRAINT FK_Loc_Country FOREIGN KEY (CountryID) REFERENCES Countries(CountryID)
);

-- ── Routes ──────────────────────────────────────────────────────────────────
CREATE TABLE Routes (
    RouteID         INT IDENTITY(1,1) PRIMARY KEY,
    FromLocationID  INT NOT NULL,
    ToLocationID    INT NOT NULL,
    TravelMode      NVARCHAR(30)   NOT NULL,
    Cost            DECIMAL(18,2)  NOT NULL,
    DurationHours   INT            NOT NULL,
    CONSTRAINT FK_Route_From FOREIGN KEY (FromLocationID) REFERENCES Locations(LocationID),
    CONSTRAINT FK_Route_To   FOREIGN KEY (ToLocationID)   REFERENCES Locations(LocationID)
);

-- ── Hotels ──────────────────────────────────────────────────────────────────
CREATE TABLE Hotels (
    HotelID       INT IDENTITY(1,1) PRIMARY KEY,
    LocationID    INT NOT NULL,
    Name          NVARCHAR(150)  NOT NULL,
    PricePerNight DECIMAL(18,2)  NOT NULL,
    StarRating    INT            NOT NULL,
    Description   NVARCHAR(300)  NOT NULL DEFAULT '',
    Amenities     NVARCHAR(300)  NOT NULL DEFAULT '',
    CONSTRAINT FK_Hotel_Loc FOREIGN KEY (LocationID) REFERENCES Locations(LocationID)
);

-- ── Places ──────────────────────────────────────────────────────────────────
CREATE TABLE Places (
    PlaceID     INT IDENTITY(1,1) PRIMARY KEY,
    LocationID  INT NOT NULL,
    Name        NVARCHAR(150)  NOT NULL,
    Type        NVARCHAR(60)   NOT NULL,
    EntryFee    DECIMAL(18,2)  NOT NULL,
    Description NVARCHAR(300)  NOT NULL DEFAULT '',
    CONSTRAINT FK_Place_Loc FOREIGN KEY (LocationID) REFERENCES Locations(LocationID)
);

-- ── TravelPlans ─────────────────────────────────────────────────────────────
CREATE TABLE TravelPlans (
    PlanID          INT IDENTITY(1,1) PRIMARY KEY,
    UserName        NVARCHAR(100)  NOT NULL,
    Members         INT            NOT NULL DEFAULT 1,
    FromLocationID  INT NOT NULL,
    ToLocationID    INT NOT NULL,
    TotalDays       INT            NOT NULL,
    TotalBudget     DECIMAL(18,2)  NOT NULL,
    TravelMode      NVARCHAR(30)   NOT NULL,
    Module          NVARCHAR(20)   NOT NULL DEFAULT 'Pakistan',
    CountryName     NVARCHAR(100)  NOT NULL DEFAULT 'Pakistan',
    TravelCost      DECIMAL(18,2)  NOT NULL DEFAULT 0,
    HotelCost       DECIMAL(18,2)  NOT NULL DEFAULT 0,
    PlacesCost      DECIMAL(18,2)  NOT NULL DEFAULT 0,
    CreatedAt       DATETIME       NOT NULL DEFAULT GETDATE(),
    CONSTRAINT FK_Plan_From FOREIGN KEY (FromLocationID) REFERENCES Locations(LocationID),
    CONSTRAINT FK_Plan_To   FOREIGN KEY (ToLocationID)   REFERENCES Locations(LocationID)
);

-- ── DayPlans ────────────────────────────────────────────────────────────────
CREATE TABLE DayPlans (
    DayPlanID   INT IDENTITY(1,1) PRIMARY KEY,
    PlanID      INT NOT NULL,
    DayNumber   INT NOT NULL,
    HotelID     INT NULL,
    DayCost     DECIMAL(18,2) NOT NULL,
    CONSTRAINT FK_Day_Plan  FOREIGN KEY (PlanID)   REFERENCES TravelPlans(PlanID) ON DELETE CASCADE,
    CONSTRAINT FK_Day_Hotel FOREIGN KEY (HotelID)  REFERENCES Hotels(HotelID)
);

-- ── DayPlanPlaces ───────────────────────────────────────────────────────────
CREATE TABLE DayPlanPlaces (
    DayPlanID  INT NOT NULL,
    PlaceID    INT NOT NULL,
    CONSTRAINT PK_DPP PRIMARY KEY (DayPlanID, PlaceID),
    CONSTRAINT FK_DPP_Day   FOREIGN KEY (DayPlanID) REFERENCES DayPlans(DayPlanID) ON DELETE CASCADE,
    CONSTRAINT FK_DPP_Place FOREIGN KEY (PlaceID)   REFERENCES Places(PlaceID)
);
GO
PRINT 'Schema created.';