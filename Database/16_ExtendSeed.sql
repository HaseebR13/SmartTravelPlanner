-- ============================================================================
-- 16_ExtendSeed.sql  — Seed the new tables with demo data so the extension is
--                      immediately usable in the evaluation demo.
-- Run AFTER 15_ExtendProcedures.sql.   Database: SmartTravelDB
-- ============================================================================
USE SmartTravelDB;
GO
SET NOCOUNT ON;

-- ── Users ───────────────────────────────────────────────────────────────────
IF NOT EXISTS (SELECT 1 FROM Users)
INSERT INTO Users (UserName, Email, PasswordHash) VALUES
('asad',   'asad@example.com',   'demo'),
('waiz',   'waiz@example.com',   'demo'),
('hina',   'hina@example.com',   'demo'),
('bilal',  'bilal@example.com',  'demo');
GO

-- ── Reviews (Rating 1..5 enforced by CHECK) ─────────────────────────────────
-- Uses the first few PlaceIDs which exist after 03/06 seed.
IF NOT EXISTS (SELECT 1 FROM Reviews)
INSERT INTO Reviews (UserID, PlaceID, Rating, Comment) VALUES
(1, 1, 5, 'Stunning views, well worth it.'),
(2, 1, 4, 'Crowded but beautiful.'),
(1, 2, 5, 'A must-see — go early morning.'),
(3, 3, 4, 'Great history, bring water.'),
(4, 4, 3, 'Nice but pricey entry fee.'),
(2, 5, 5, 'Best food street in the country.');
GO

-- ── Favourites (M:N User ↔ Location) ────────────────────────────────────────
IF NOT EXISTS (SELECT 1 FROM Favourites)
INSERT INTO Favourites (UserID, LocationID) VALUES
(1, 2),  -- asad ♥ Lahore
(1, 10), -- asad ♥ Hunza
(2, 3),  -- waiz ♥ Islamabad
(3, 10); -- hina ♥ Hunza
GO

-- ── Bookings (Nights is computed; CheckOut > CheckIn enforced) ───────────────
IF NOT EXISTS (SELECT 1 FROM Bookings)
INSERT INTO Bookings (PlanID, HotelID, CheckIn, CheckOut, Status)
SELECT TOP 1 tp.PlanID, h.HotelID, '2026-07-01', '2026-07-04', 'Confirmed'
FROM TravelPlans tp CROSS JOIN (SELECT TOP 1 HotelID FROM Hotels ORDER BY HotelID) h
ORDER BY tp.PlanID;
GO

-- ── Backfill plan ownership where the username matches a user ───────────────
UPDATE tp SET tp.UserID = u.UserID
FROM TravelPlans tp JOIN Users u ON u.UserName = tp.UserName
WHERE tp.UserID IS NULL;
GO

PRINT '16_ExtendSeed complete.';
PRINT 'Quick check:';
SELECT 'Users' AS Tbl, COUNT(*) AS Rows FROM Users
UNION ALL SELECT 'Reviews', COUNT(*) FROM Reviews
UNION ALL SELECT 'Favourites', COUNT(*) FROM Favourites
UNION ALL SELECT 'Bookings', COUNT(*) FROM Bookings;
GO
