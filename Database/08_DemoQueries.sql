/* ════════════════════════════════════════════════════════════════════════
   SMART TRAVEL PLANNER — EVALUATION DEMO QUERIES
   File 08:  Copy-paste these one at a time during the evaluation.
             Each query showcases a different capability of the
             Spatial Proximity & Geographic Routing Engine.
   ════════════════════════════════════════════════════════════════════════ */
USE SmartTravelDB;
GO


/* ───── DEMO 1 : Quick proof that every row has coordinates ───── */
SELECT  'Locations' AS Tbl, COUNT(*) AS Total, COUNT(GeoLocation) AS WithCoords FROM Locations
UNION ALL SELECT 'Hotels',  COUNT(*), COUNT(GeoLocation) FROM Hotels
UNION ALL SELECT 'Places',  COUNT(*), COUNT(GeoLocation) FROM Places;
GO


/* ───── DEMO 2 : Air-line distance Lahore → Karachi ───── */
EXEC sp_GetDistanceBetween @FromLocationID = 2, @ToLocationID = 1;
GO
-- Expected: ~1030 km (real-world air distance is 1029 km).


/* ───── DEMO 3 : All attractions within 5 km of Faisal Mosque (PlaceID 11) ───── */
EXEC sp_GetNearbyPlaces @HotelID = 9, @RadiusKm = 5;   -- Serena Islamabad
GO


/* ───── DEMO 4 : Five-star hotels within 3 km of the Burj Khalifa ───── */
DECLARE @Burj GEOGRAPHY;
SELECT  @Burj = GeoLocation FROM Places WHERE Name = 'Burj Khalifa';

SELECT  h.Name,
        h.StarRating,
        h.UserRating,
        h.PricePerNight,
        CAST(@Burj.STDistance(h.GeoLocation)/1000.0 AS DECIMAL(8,2)) AS DistanceKm
FROM    Hotels h
WHERE   h.StarRating >= 5
  AND   @Burj.STDistance(h.GeoLocation) <= 3000   -- 3 km
ORDER BY DistanceKm;
GO


/* ───── DEMO 5 : Cheap (< 8 000 PKR) hotels within 2 km of Lahore Fort ───── */
EXEC sp_GetNearbyHotels @PlaceID = 6, @RadiusKm = 2, @MaxPerNight = 8000;
GO


/* ───── DEMO 6 : Top-rated attractions within 25 km of Hunza Valley ───── */
EXEC sp_GetPlacesNearLocation @LocationID = 10, @RadiusKm = 25;
GO


/* ───── DEMO 7 : Plan an optimal day tour in Old Lahore ─────
        Start at PC Lahore (Hotel 5) and visit:
            6  - Lahore Fort
            7  - Badshahi Mosque
            8  - Shalimar Gardens
            9  - Walled City Food Street
            10 - Lahore Museum
        The proc returns them in shortest-path order using a greedy
        nearest-neighbour heuristic on the spatial index. */
EXEC sp_OptimizeDayRoute @HotelID = 5, @PlaceIDsCSV = '6,7,8,9,10';
GO


/* ───── DEMO 8 : Inspect a raw spatial column to show GEOGRAPHY type ───── */
SELECT TOP 3
        Name,
        Latitude, Longitude,
        GeoLocation                       AS RawGeography,
        GeoLocation.ToString()            AS WellKnownText,
        GeoLocation.STAsBinary()          AS WellKnownBinary
FROM    Hotels;
GO


/* ───── DEMO 9 : Prove the spatial index is being used (execution plan) ───── */
-- SET SHOWPLAN_TEXT must be the only statement in its batch, so it has its own GO blocks.
SET STATISTICS IO ON;
GO

DECLARE @Origin GEOGRAPHY = (SELECT GeoLocation FROM Places WHERE PlaceID = 35); -- Burj Khalifa

SELECT  COUNT(*) AS HotelsWithin10Km
FROM    Hotels
WHERE   @Origin.STDistance(GeoLocation) <= 10000;
GO

SET STATISTICS IO OFF;
GO


/* ───── DEMO 10 : Show every spatial object on the SSMS spatial-results tab ─────
        SSMS will render this as an interactive world map. */
SELECT  Name, GeoLocation
FROM    Places
WHERE   LocationID IN (2, 11, 15, 19, 23);   -- one place from each country
GO

PRINT 'All demo queries ready. Run them one at a time and walk the';
PRINT 'examiner through each result.';
GO


-- End of 08_DemoQueries.sql