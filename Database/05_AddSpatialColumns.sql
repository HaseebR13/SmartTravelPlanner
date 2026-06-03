/* ════════════════════════════════════════════════════════════════════════
   SMART TRAVEL PLANNER — SCHEMA EXTENSION
   File 05: Adds Spatial Proximity columns + data enrichment columns
   Run AFTER 02_Schema.sql and 03_SeedData.sql
   ════════════════════════════════════════════════════════════════════════ */
USE SmartTravelDB;
GO

PRINT '── Extending schema for Spatial Proximity & richer data ──';
GO

-- ─────────────────────────────────────────────────────────────────────────
-- LOCATIONS  →  city-level geography + cover image + descriptive metadata
-- ─────────────────────────────────────────────────────────────────────────
IF COL_LENGTH('dbo.Locations','Latitude') IS NULL
ALTER TABLE Locations
    ADD Latitude          DECIMAL(9,6)   NULL,
        Longitude         DECIMAL(9,6)   NULL,
        GeoLocation       GEOGRAPHY      NULL,
        ImageURL          NVARCHAR(500)  NULL,
        ShortDescription  NVARCHAR(400)  NULL,
        BestSeason        NVARCHAR(50)   NULL;
GO

-- ─────────────────────────────────────────────────────────────────────────
-- HOTELS  →  precise geography + ratings + opening hours + cover photo
-- ─────────────────────────────────────────────────────────────────────────
IF COL_LENGTH('dbo.Hotels','Latitude') IS NULL
ALTER TABLE Hotels
    ADD ImageURL          NVARCHAR(500)  NULL,
        UserRating        DECIMAL(3,2)   NULL,        -- e.g. 4.65 / 5.00
        ReviewCount       INT            NULL,
        ContactPhone      NVARCHAR(30)   NULL,
        CheckInTime       TIME           NULL,
        CheckOutTime      TIME           NULL,
        Latitude          DECIMAL(9,6)   NULL,
        Longitude         DECIMAL(9,6)   NULL,
        GeoLocation       GEOGRAPHY      NULL;
GO

-- ─────────────────────────────────────────────────────────────────────────
-- PLACES  →  precise geography + ratings + opening hours + visit duration
-- ─────────────────────────────────────────────────────────────────────────
IF COL_LENGTH('dbo.Places','Latitude') IS NULL
ALTER TABLE Places
    ADD ImageURL             NVARCHAR(500)  NULL,
        UserRating           DECIMAL(3,2)   NULL,
        ReviewCount          INT            NULL,
        OpeningTime          TIME           NULL,
        ClosingTime          TIME           NULL,
        AverageVisitMinutes  INT            NULL,
        BestTimeToVisit      NVARCHAR(100)  NULL,
        Latitude             DECIMAL(9,6)   NULL,
        Longitude            DECIMAL(9,6)   NULL,
        GeoLocation          GEOGRAPHY      NULL;
GO

PRINT '✔ Columns added to Locations, Hotels and Places.';
PRINT '  Next:  run 06_EnrichData.sql to populate them.';
GO
