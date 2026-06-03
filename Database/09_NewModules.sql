-- ============================================================================
-- 09_NewModules.sql  — New tables for all 5 architecture modules
-- Run AFTER the original 01–08 scripts in SQL Server Management Studio.
-- Database: SmartTravelDB
-- ============================================================================
USE SmartTravelDB;
GO

-- ─────────────────────────────────────────────────────────────────────────────
-- MODULE 1: Spatial Coordinates on Places and Locations
-- Add Latitude/Longitude to existing tables
-- ─────────────────────────────────────────────────────────────────────────────
IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('Places') AND name = 'Latitude')
    ALTER TABLE Places ADD Latitude  FLOAT NOT NULL DEFAULT 0;
IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('Places') AND name = 'Longitude')
    ALTER TABLE Places ADD Longitude FLOAT NOT NULL DEFAULT 0;

IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('Locations') AND name = 'Latitude')
    ALTER TABLE Locations ADD Latitude  FLOAT NOT NULL DEFAULT 0;
IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('Locations') AND name = 'Longitude')
    ALTER TABLE Locations ADD Longitude FLOAT NOT NULL DEFAULT 0;
GO

-- Index on spatial columns for faster radius queries
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Places_LatLng' AND object_id = OBJECT_ID('Places'))
    CREATE INDEX IX_Places_LatLng ON Places (Latitude, Longitude);
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Locations_LatLng' AND object_id = OBJECT_ID('Locations'))
    CREATE INDEX IX_Locations_LatLng ON Locations (Latitude, Longitude);
GO

-- ─────────────────────────────────────────────────────────────────────────────
-- MODULE 2: Scheduling — Opening hours and capacity for places
-- ─────────────────────────────────────────────────────────────────────────────
IF OBJECT_ID('PlaceSchedules', 'U') IS NULL
CREATE TABLE PlaceSchedules (
    ScheduleID      INT IDENTITY(1,1) PRIMARY KEY,
    PlaceID         INT           NOT NULL,
    DayOfWeek       TINYINT       NOT NULL CHECK (DayOfWeek BETWEEN 0 AND 6), -- 0=Sun
    OpenTime        TIME(0)       NOT NULL DEFAULT '08:00:00',
    CloseTime       TIME(0)       NOT NULL DEFAULT '18:00:00',
    TypicalDuration INT           NOT NULL DEFAULT 90,   -- minutes
    MaxCapacity     INT           NULL,                  -- NULL = unlimited
    CONSTRAINT FK_Sched_Place FOREIGN KEY (PlaceID) REFERENCES Places(PlaceID) ON DELETE CASCADE
);
GO

-- ─────────────────────────────────────────────────────────────────────────────
-- MODULE 3: Dynamic Pricing Rules (DB-Driven Promotions Engine)
-- ─────────────────────────────────────────────────────────────────────────────
IF OBJECT_ID('PromotionRules', 'U') IS NULL
CREATE TABLE PromotionRules (
    RuleID          INT IDENTITY(1,1) PRIMARY KEY,
    Name            NVARCHAR(100)  NOT NULL,
    Description     NVARCHAR(300)  NOT NULL DEFAULT '',
    ConditionType   NVARCHAR(50)   NOT NULL,   -- MinDays, MinMembers, Module, TravelMode, SeasonMonth, AlwaysTrue
    ConditionValue  DECIMAL(18,2)  NOT NULL DEFAULT 0,
    ConditionString NVARCHAR(100)  NOT NULL DEFAULT '',
    DiscountType    NVARCHAR(20)   NOT NULL,   -- 'Percent' | 'Fixed'
    DiscountValue   DECIMAL(18,2)  NOT NULL,
    Stackable       BIT            NOT NULL DEFAULT 1,
    Priority        INT            NOT NULL DEFAULT 1,
    IsActive        BIT            NOT NULL DEFAULT 1,
    ExpiresAt       DATETIME       NULL,
    CreatedAt       DATETIME       NOT NULL DEFAULT GETDATE()
);
GO

-- Seed some sample promotions
IF NOT EXISTS (SELECT 1 FROM PromotionRules WHERE Name = 'Weekend Discount')
INSERT INTO PromotionRules (Name, Description, ConditionType, ConditionValue, DiscountType, DiscountValue, Priority)
VALUES
('Weekend Discount',    '5% off on weekends',               'SeasonMonth',  5,   'Percent', 5.00,  1),
('Group Discount',      '10% off for 5+ travelers',          'MinMembers',   5,   'Percent', 10.00, 2),
('Long Trip Bonus',     '8% off for trips 7+ days',          'MinDays',      7,   'Percent', 8.00,  2),
('Pakistan Promo',      'PKR 500 off Pakistan module trips',  'Module',       0,   'Fixed',   500,   3),
('Budget Saver',        '3% off budgets under PKR 30,000',   'MaxBudget',    30000,'Percent', 3.00, 1),
('Premium Boost',       'Free upgrade for high-budget trips','MinBudget',    50000,'Fixed',   0,    1);
GO

-- ─────────────────────────────────────────────────────────────────────────────
-- MODULE 4: Real-Time Collaboration Mapping
-- Tracks which users are editing which plan session
-- ─────────────────────────────────────────────────────────────────────────────
IF OBJECT_ID('CollaborationSessions', 'U') IS NULL
CREATE TABLE CollaborationSessions (
    SessionID       INT IDENTITY(1,1) PRIMARY KEY,
    RoomID          NVARCHAR(100)  NOT NULL,   -- matches SignalR group name
    PlanID          INT            NULL,
    CreatedBy       NVARCHAR(100)  NOT NULL,
    CreatedAt       DATETIME       NOT NULL DEFAULT GETDATE(),
    IsActive        BIT            NOT NULL DEFAULT 1
);

IF OBJECT_ID('SessionParticipants', 'U') IS NULL
CREATE TABLE SessionParticipants (
    ParticipantID   INT IDENTITY(1,1) PRIMARY KEY,
    SessionID       INT            NOT NULL,
    UserName        NVARCHAR(100)  NOT NULL,
    JoinedAt        DATETIME       NOT NULL DEFAULT GETDATE(),
    LastSeen        DATETIME       NOT NULL DEFAULT GETDATE(),
    CONSTRAINT FK_Part_Session FOREIGN KEY (SessionID)
        REFERENCES CollaborationSessions(SessionID) ON DELETE CASCADE
);
GO

-- ─────────────────────────────────────────────────────────────────────────────
-- MODULE 5: Temporal Tables — Hotels with full price history
-- Converts Hotels to a system-versioned temporal table.
-- ─────────────────────────────────────────────────────────────────────────────

-- Step 1: Add plain (non-generated) period columns if not already present.
--         We add them as plain DATETIME2 first so we can UPDATE existing rows
--         to the exact MAX sentinel before SQL Server validates the period.
IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('Hotels') AND name = 'SysStartTime')
BEGIN
    ALTER TABLE Hotels ADD
        SysStartTime DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
        SysEndTime   DATETIME2 NOT NULL DEFAULT CONVERT(DATETIME2(7), '9999-12-31 23:59:59.9999999');
    PRINT 'Added SysStartTime / SysEndTime columns to Hotels.';
END
GO

-- Step 2: Guarantee every row carries the exact MAX datetime2 sentinel.
--         (Rows inserted before this script may have a truncated value.)
UPDATE Hotels
SET    SysEndTime = CONVERT(DATETIME2(7), '9999-12-31 23:59:59.9999999')
WHERE  SysEndTime <> CONVERT(DATETIME2(7), '9999-12-31 23:59:59.9999999');
GO

-- Step 3: Add the SYSTEM_TIME period (now safe — all rows satisfy the MAX check).
IF NOT EXISTS (
    SELECT 1 FROM sys.periods p
    JOIN   sys.tables t ON p.object_id = t.object_id
    WHERE  t.name = 'Hotels' AND t.schema_id = SCHEMA_ID('dbo')
)
BEGIN
    ALTER TABLE Hotels
        ADD PERIOD FOR SYSTEM_TIME (SysStartTime, SysEndTime);
    PRINT 'Added PERIOD FOR SYSTEM_TIME to Hotels.';
END
GO

-- Step 4: Enable system versioning (creates Hotels_History automatically).
IF OBJECTPROPERTY(OBJECT_ID('dbo.Hotels'), 'TableTemporalType') = 0
BEGIN
    ALTER TABLE Hotels
        SET (SYSTEM_VERSIONING = ON (HISTORY_TABLE = dbo.Hotels_History));
    PRINT 'Hotels table is now system-versioned. History table: Hotels_History.';
END
ELSE
    PRINT 'Hotels is already temporal — skipped.';
GO

-- ─────────────────────────────────────────────────────────────────────────────
-- SEED: Update popular city coordinates for spatial queries
-- ─────────────────────────────────────────────────────────────────────────────
UPDATE Locations SET Latitude =  31.5204, Longitude =  74.3587 WHERE City = 'Lahore'    AND Latitude = 0;
UPDATE Locations SET Latitude =  33.6844, Longitude =  73.0479 WHERE City = 'Islamabad' AND Latitude = 0;
UPDATE Locations SET Latitude =  24.8607, Longitude =  67.0011 WHERE City = 'Karachi'   AND Latitude = 0;
UPDATE Locations SET Latitude =  34.0151, Longitude =  71.5249 WHERE City = 'Peshawar'  AND Latitude = 0;
UPDATE Locations SET Latitude =  30.1798, Longitude =  66.9750 WHERE City = 'Quetta'    AND Latitude = 0;
UPDATE Locations SET Latitude =  36.3167, Longitude =  74.6500 WHERE City = 'Gilgit'    AND Latitude = 0;
UPDATE Locations SET Latitude =  36.2831, Longitude =  74.5948 WHERE City = 'Hunza'     AND Latitude = 0;
UPDATE Locations SET Latitude =  32.0740, Longitude =  72.6861 WHERE City = 'Sargodha'  AND Latitude = 0;
UPDATE Locations SET Latitude =  35.2227, Longitude =  72.4258 WHERE City = 'Swat'      AND Latitude = 0;
UPDATE Locations SET Latitude =  35.9208, Longitude =  75.3500 WHERE City = 'Skardu'    AND Latitude = 0;
GO

PRINT '09_NewModules.sql complete.';
GO
