-- ════════════════════════════════════════════════════════════════════════════
--  00_CleanReset.sql — Wipe SmartTravelDB cleanly so you can re-run 01–09.
--
--  USE THIS WHEN you see:
--    • "Could not drop object 'dbo.Places' because it is referenced by a
--      FOREIGN KEY constraint."
--    • "There is already an object named 'Countries' in the database."
--
--  WHY IT'S NEEDED: when 02_Schema.sql tries to drop the core tables, the
--  foreign keys created later by 09_NewModules.sql (FK_Sched_Place → Places,
--  etc.) block the drop. This script drops EVERY foreign key first, then
--  every table, in any order — guaranteed clean slate.
--
--  RUN ORDER FROM SCRATCH:
--    00_CleanReset.sql        ← this script (wipes everything)
--    01_CreateDatabase.sql
--    02_Schema.sql
--    03_SeedData.sql
--    04_StoredProcedures.sql
--    05_AddSpatialColumns.sql
--    06_EnrichData.sql
--    07_SpatialProcedures.sql
--    08_DemoQueries.sql
--    09_NewModules.sql
-- ════════════════════════════════════════════════════════════════════════════

USE SmartTravelDB;
GO

SET NOCOUNT ON;

-- ─── Step 1: Drop every user-defined FOREIGN KEY in the database ──────────
PRINT '── Dropping all foreign keys ──';
DECLARE @sql NVARCHAR(MAX) = N'';
SELECT @sql = @sql + N'ALTER TABLE ' + QUOTENAME(s.name) + N'.' + QUOTENAME(t.name)
              + N' DROP CONSTRAINT ' + QUOTENAME(fk.name) + N';' + CHAR(13)
FROM   sys.foreign_keys fk
JOIN   sys.tables  t ON fk.parent_object_id = t.object_id
JOIN   sys.schemas s ON t.schema_id          = s.schema_id;
IF LEN(@sql) > 0 EXEC sp_executesql @sql;
GO

-- ─── Step 2: Drop every table that this project creates ──────────────────
PRINT '── Dropping all project tables ──';

-- New-modules tables (09_NewModules.sql)
IF OBJECT_ID('dbo.SessionParticipants','U')   IS NOT NULL DROP TABLE dbo.SessionParticipants;
IF OBJECT_ID('dbo.CollaborationSessions','U') IS NOT NULL DROP TABLE dbo.CollaborationSessions;
IF OBJECT_ID('dbo.PromotionRules','U')        IS NOT NULL DROP TABLE dbo.PromotionRules;
IF OBJECT_ID('dbo.PlaceSchedules','U')        IS NOT NULL DROP TABLE dbo.PlaceSchedules;

-- Optional UI-module tables (only present if you also added Destinations etc.)
IF OBJECT_ID('dbo.Favourites','U')             IS NOT NULL DROP TABLE dbo.Favourites;
IF OBJECT_ID('dbo.Reviews','U')                IS NOT NULL DROP TABLE dbo.Reviews;
IF OBJECT_ID('dbo.WeatherForecasts','U')       IS NOT NULL DROP TABLE dbo.WeatherForecasts;
IF OBJECT_ID('dbo.BestTimes','U')              IS NOT NULL DROP TABLE dbo.BestTimes;
IF OBJECT_ID('dbo.Tips','U')                   IS NOT NULL DROP TABLE dbo.Tips;
IF OBJECT_ID('dbo.Destinations','U')           IS NOT NULL DROP TABLE dbo.Destinations;

-- Core tables (02_Schema.sql) — dependency order
IF OBJECT_ID('dbo.DayPlanPlaces','U')          IS NOT NULL DROP TABLE dbo.DayPlanPlaces;
IF OBJECT_ID('dbo.DayPlans','U')               IS NOT NULL DROP TABLE dbo.DayPlans;
IF OBJECT_ID('dbo.TravelPlans','U')            IS NOT NULL DROP TABLE dbo.TravelPlans;
IF OBJECT_ID('dbo.Places','U')                 IS NOT NULL DROP TABLE dbo.Places;
IF OBJECT_ID('dbo.Hotels','U')                 IS NOT NULL DROP TABLE dbo.Hotels;
IF OBJECT_ID('dbo.Routes','U')                 IS NOT NULL DROP TABLE dbo.Routes;
IF OBJECT_ID('dbo.Locations','U')              IS NOT NULL DROP TABLE dbo.Locations;
IF OBJECT_ID('dbo.Countries','U')              IS NOT NULL DROP TABLE dbo.Countries;
GO

-- ─── Step 3: Drop project stored procedures (so re-creates never warn) ────
PRINT '── Dropping all project stored procedures ──';
DECLARE @sql2 NVARCHAR(MAX) = N'';
SELECT @sql2 = @sql2 + N'DROP PROCEDURE ' + QUOTENAME(s.name) + N'.' + QUOTENAME(p.name) + N';' + CHAR(13)
FROM   sys.procedures p
JOIN   sys.schemas    s ON p.schema_id = s.schema_id
WHERE  p.name LIKE 'sp_%';
IF LEN(@sql2) > 0 EXEC sp_executesql @sql2;
GO

PRINT '';
PRINT '✔ Database is now empty.';
PRINT '   Next: run 01_CreateDatabase.sql through 09_NewModules.sql in order.';
PRINT '';
GO
