USE SmartTravelDB;
GO

-- ── Countries ───────────────────────────────────────────────────────────────
INSERT INTO Countries (Name, Code, Module) VALUES
('Pakistan', 'PK', 'Pakistan'),
('United Arab Emirates', 'AE', 'Foreign'),
('Turkey', 'TR', 'Foreign'),
('United Kingdom', 'GB', 'Foreign'),
('Thailand', 'TH', 'Foreign');
GO

-- ── Pakistan Locations ──────────────────────────────────────────────────────
INSERT INTO Locations (CountryID, Name, City) VALUES
(1, 'Karachi Central', 'Karachi'),
(1, 'Lahore Old City', 'Lahore'),
(1, 'Islamabad F-7', 'Islamabad'),
(1, 'Rawalpindi Saddar', 'Rawalpindi'),
(1, 'Peshawar Cantt', 'Peshawar'),
(1, 'Quetta City', 'Quetta'),
(1, 'Multan Shrine', 'Multan'),
(1, 'Faisalabad Clock Tower', 'Faisalabad'),
(1, 'Murree Hills', 'Murree'),
(1, 'Hunza Valley', 'Hunza');
GO

-- ── UAE Locations ───────────────────────────────────────────────────────────
INSERT INTO Locations (CountryID, Name, City) VALUES
(2, 'Dubai Downtown', 'Dubai'),
(2, 'Dubai Marina', 'Dubai'),
(2, 'Abu Dhabi Corniche', 'Abu Dhabi'),
(2, 'Sharjah Heritage', 'Sharjah');
GO

-- ── Turkey Locations ────────────────────────────────────────────────────────
INSERT INTO Locations (CountryID, Name, City) VALUES
(3, 'Istanbul Old Quarter', 'Istanbul'),
(3, 'Istanbul Bosphorus', 'Istanbul'),
(3, 'Ankara Centre', 'Ankara'),
(3, 'Antalya Kaleiçi', 'Antalya');
GO

-- ── UK Locations ─────────────────────────────────────────────────────────────
INSERT INTO Locations (CountryID, Name, City) VALUES
(4, 'London Westminster', 'London'),
(4, 'London East End', 'London'),
(4, 'Edinburgh Old Town', 'Edinburgh'),
(4, 'Manchester City', 'Manchester');
GO

-- ── Thailand Locations ───────────────────────────────────────────────────────
INSERT INTO Locations (CountryID, Name, City) VALUES
(5, 'Bangkok Grand Palace', 'Bangkok'),
(5, 'Bangkok Sukhumvit', 'Bangkok'),
(5, 'Chiang Mai Old City', 'Chiang Mai'),
(5, 'Phuket Beach Road', 'Phuket');
GO

-- ─────────────────────────────────────────────────────────────────────────────
-- PAKISTAN ROUTES  (LocationIDs 1-10)
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO Routes (FromLocationID, ToLocationID, TravelMode, Cost, DurationHours) VALUES
-- Karachi <-> Lahore
(1,2,'Plane',15000,2),(2,1,'Plane',15000,2),
(1,2,'Train',3500,14),(2,1,'Train',3500,14),
(1,2,'Bus',2800,18),(2,1,'Bus',2800,18),
-- Lahore <-> Islamabad
(2,3,'Plane',8000,1),(3,2,'Plane',8000,1),
(2,3,'Train',2200,5),(3,2,'Train',2200,5),
(2,3,'Car',1800,4),(3,2,'Car',1800,4),
(2,3,'Bus',1200,5),(3,2,'Bus',1200,5),
-- Islamabad <-> Rawalpindi
(3,4,'Car',300,1),(4,3,'Car',300,1),
(3,4,'Bus',150,1),(4,3,'Bus',150,1),
-- Islamabad <-> Peshawar
(3,5,'Bus',1800,3),(5,3,'Bus',1800,3),
(3,5,'Car',2200,3),(5,3,'Car',2200,3),
-- Islamabad <-> Murree
(3,9,'Car',1200,2),(9,3,'Car',1200,2),
-- Islamabad <-> Hunza
(3,10,'Car',8000,14),(10,3,'Car',8000,14),
-- Lahore <-> Multan
(2,7,'Train',1800,5),(7,2,'Train',1800,5),
(2,7,'Bus',1200,6),(7,2,'Bus',1200,6),
-- Lahore <-> Faisalabad
(2,8,'Train',900,2),(8,2,'Train',900,2),
(2,8,'Car',1100,2),(8,2,'Car',1100,2),
-- Karachi <-> Quetta
(1,6,'Plane',12000,1),(6,1,'Plane',12000,1),
(1,6,'Train',4000,15),(6,1,'Train',4000,15);
GO

-- ─────────────────────────────────────────────────────────────────────────────
-- PAKISTAN HOTELS (by LocationID 1-10)
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO Hotels (LocationID, Name, PricePerNight, StarRating, Description, Amenities) VALUES
-- Karachi (1)
(1,'Pearl Continental Karachi',18000,5,'Iconic luxury hotel in the heart of Karachi','Pool, Spa, Gym, 5 Restaurants'),
(1,'Marriott Karachi',14000,5,'Premium business hotel with sea-facing rooms','Pool, Business Centre, Fine Dining'),
(1,'Hotel Mehran',6500,3,'Comfortable mid-range hotel near city centre','WiFi, Restaurant, Parking'),
(1,'Regent Plaza',5000,3,'Great value hotel with city views','WiFi, Rooftop Restaurant'),
-- Lahore (2)
(2,'Pearl Continental Lahore',16000,5,'Grand hotel in Gulberg, Lahore''s finest','Heated Pool, Spa, 3 Restaurants'),
(2,'Avari Hotel Lahore',12000,5,'Landmark luxury hotel near Liberty Market','Pool, Gym, Business Centre'),
(2,'Hotel One Gulberg',4500,3,'Modern comfortable hotel in Gulberg','WiFi, Rooftop Cafe, Gym'),
(2,'Faletti''s Hotel',8000,4,'Historic colonial-era hotel with character','Garden, Restaurant, Bar'),
-- Islamabad (3)
(3,'Serena Hotel Islamabad',22000,5,'The finest hotel in the capital','Heated Pool, Spa, 4 Restaurants'),
(3,'Marriott Islamabad',18000,5,'Premier luxury in the diplomatic enclave','Pool, Business Centre, Spa'),
(3,'Islamabad Hotel',7000,4,'Government-owned heritage hotel','Restaurant, Parking, Garden'),
(3,'The Margalla Hotel',5000,3,'Good value near Centaurus Mall','WiFi, Restaurant'),
-- Rawalpindi (4)
(4,'Ramada Rawalpindi',9000,4,'Modern hotel near Raja Bazaar','Pool, Restaurant, WiFi'),
(4,'Hotel One Rawalpindi',4000,3,'Budget friendly with good facilities','WiFi, Restaurant'),
-- Peshawar (5)
(5,'Pearl Continental Peshawar',12000,5,'Luxury hotel in the city of flowers','Pool, Gym, Fine Dining'),
(5,'Greens Hotel Peshawar',4500,3,'Comfortable stay in central Peshawar','WiFi, Restaurant, Parking'),
-- Quetta (6)
(6,'Serena Hotel Quetta',11000,5,'Oasis of luxury in Balochistan','Pool, Restaurant, Garden'),
(6,'Bloom Star Hotel',3500,3,'Reliable mid-range option in Quetta','WiFi, Restaurant'),
-- Multan (7)
(7,'Ramada Multan',8500,4,'Modern comfort near Hussain Agahi','Pool, Restaurant, WiFi'),
(7,'Hotel One Multan',3800,3,'Budget hotel with good connectivity','WiFi, Parking, Restaurant'),
-- Faisalabad (8)
(8,'Serena Faisalabad',9000,4,'Luxury in the city of lights','Pool, Spa, Restaurant'),
(8,'Hotel One Faisalabad',3500,3,'Affordable comfort in textile city','WiFi, Restaurant'),
-- Murree (9)
(9,'Hotel One Murree',6000,4,'Scenic hill-station hotel with valley views','Heated Rooms, Restaurant, Fireplace'),
(9,'Shangrila Murree',4500,3,'Cosy mountain retreat','Restaurant, Fireplace, Parking'),
-- Hunza (10)
(10,'Eagle Nest Hotel Hunza',5500,4,'Spectacular views of Rakaposhi peak','Restaurant, Garden, Mountain Views'),
(10,'Serena Karimabad',8000,4,'Luxury mountain experience in Hunza','Restaurant, Heated Rooms, WiFi');
GO

-- ─────────────────────────────────────────────────────────────────────────────
-- PAKISTAN PLACES (by LocationID 1-10)
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO Places (LocationID, Name, Type, EntryFee, Description) VALUES
-- Karachi (1)
(1,'Clifton Beach','Beach',200,'Iconic beach with food stalls and camel rides'),
(1,'Mohatta Palace','Museum',500,'Stunning heritage palace turned art museum'),
(1,'Frere Hall','Historical',200,'Colonial-era British building with lovely gardens'),
(1,'Quaid Museum','Museum',300,'Birthplace and residence of Pakistan''s founder'),
(1,'Dolmen Mall','Shopping',0,'Karachi''s premier shopping destination'),
-- Lahore (2)
(2,'Lahore Fort','Historical',1000,'UNESCO World Heritage Site – Mughal masterpiece'),
(2,'Badshahi Mosque','Religious',0,'One of the world''s largest mosques'),
(2,'Shalimar Gardens','Heritage',500,'17th century Mughal garden – UNESCO listed'),
(2,'Walled City Food Street','Food',0,'Famous food street with traditional cuisine'),
(2,'Lahore Museum','Museum',400,'Finest museum in Pakistan'),
-- Islamabad (3)
(3,'Faisal Mosque','Religious',0,'World''s 4th largest mosque, iconic landmark'),
(3,'Pakistan Monument','Historical',200,'Stunning monument representing national unity'),
(3,'Margalla Hills Trail','Nature',0,'Scenic hiking trails with city views'),
(3,'Lok Virsa Museum','Museum',300,'Showcase of Pakistani folk heritage'),
(3,'Daman-e-Koh','Scenic',200,'Hilltop viewpoint overlooking the city'),
-- Rawalpindi (4)
(4,'Raja Bazaar','Market',0,'Oldest and busiest bazaar in Rawalpindi'),
(4,'Rawalpindi Museum','Museum',200,'Regional museum with Gandhara art'),
-- Peshawar (5)
(5,'Peshawar Museum','Museum',400,'Finest Gandhara sculpture collection in the world'),
(5,'Qissa Khwani Bazaar','Market',0,'Famous storytellers bazaar with historic charm'),
(5,'Bala Hisar Fort','Historical',200,'Ancient fort overlying the city'),
-- Quetta (6)
(6,'Hazarganji Chiltan National Park','Nature',300,'Alpine park with unique wildlife'),
(6,'Quetta Bazaar','Market',0,'Colourful market famous for dry fruits'),
-- Multan (7)
(7,'Shah Rukn-e-Alam Shrine','Religious',0,'One of the greatest monuments of the subcontinent'),
(7,'Multan Fort','Historical',300,'Historic Mughal fort with panoramic views'),
(7,'Multan Handicrafts Bazaar','Shopping',0,'Famous for blue pottery and handicrafts'),
-- Faisalabad (8)
(8,'Clock Tower','Historical',0,'Iconic 8-bazar landmark from British era'),
(8,'Jinnah Garden','Nature',100,'Peaceful city park with a small lake'),
-- Murree (9)
(9,'Mall Road Murree','Scenic',0,'Famous promenade with shops and views'),
(9,'Patriata Chairlift','Adventure',800,'Scenic chairlift with Himalayan views'),
(9,'Pindi Point','Scenic',200,'Stunning viewpoint with panoramic valley vistas'),
-- Hunza (10)
(10,'Baltit Fort','Historical',700,'900-year-old fort with breathtaking views'),
(10,'Attabad Lake','Nature',300,'Stunning turquoise lake formed by landslide'),
(10,'Passu Cones','Nature',0,'Dramatic Cathedral spires of Passu'),
(10,'Rakaposhi Viewpoint','Nature',0,'Stunning views of 7788m Rakaposhi peak');
GO

-- ─────────────────────────────────────────────────────────────────────────────
-- UAE DATA  (LocationIDs: Dubai Downtown=11, Dubai Marina=12, Abu Dhabi=13, Sharjah=14)
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO Routes (FromLocationID, ToLocationID, TravelMode, Cost, DurationHours) VALUES
(11,12,'Car',800,1),(12,11,'Car',800,1),
(11,13,'Car',3500,2),(13,11,'Car',3500,2),
(11,13,'Plane',9000,1),(13,11,'Plane',9000,1),
(11,14,'Car',1200,1),(14,11,'Car',1200,1),
(12,13,'Car',3200,2),(13,12,'Car',3200,2),
(12,14,'Car',1500,1),(14,12,'Car',1500,1);
GO

INSERT INTO Hotels (LocationID, Name, PricePerNight, StarRating, Description, Amenities) VALUES
(11,'Burj Al Arab Jumeirah',120000,7,'World''s most iconic luxury hotel on its own island','Private Beach, Helipad, 9 Restaurants, Butler Service'),
(11,'Atlantis The Palm',45000,5,'Legendary resort on Palm Jumeirah','Aquaventure Waterpark, Private Beach, 23 Restaurants'),
(11,'Address Downtown Dubai',38000,5,'Stunning views of Burj Khalifa and fountains','Infinity Pool, Spa, Multiple Restaurants'),
(11,'Rove Downtown',12000,3,'Modern affordable hotel in heart of Downtown','Rooftop Pool, Gym, Co-working Space'),
(12,'Sofitel Dubai Marina',32000,5,'Sophisticated French luxury on the marina','Marina View Pool, Spa, Fine Dining'),
(12,'Marina Inn Dubai',9000,3,'Budget-friendly with great marina access','Pool, WiFi, Restaurant'),
(13,'Emirates Palace Abu Dhabi',95000,7,'Gold-gilded palace hotel of Abu Dhabi','Private Beach, Helipad, 14 Bars & Restaurants'),
(13,'Yas Island Rotana',22000,5,'Luxury resort near Yas F1 Circuit','Pool, Beach, Ferrari World Access'),
(14,'Sharjah Grand Hotel',8000,4,'Comfortable hotel in the cultural heart of Sharjah','Pool, Restaurant, Spa');
GO

INSERT INTO Places (LocationID, Name, Type, EntryFee, Description) VALUES
(11,'Burj Khalifa','Landmark',7500,'World''s tallest building – 828m of awe-inspiring views'),
(11,'Dubai Mall','Shopping',0,'World''s largest shopping mall with aquarium'),
(11,'Dubai Fountain','Attraction',0,'World''s largest choreographed fountain show'),
(11,'Dubai Frame','Landmark',5500,'Iconic picture-frame monument with panoramic views'),
(11,'Dubai Desert Safari','Adventure',18000,'Dune bashing, camel ride and BBQ under the stars'),
(12,'Marina Walk','Scenic',0,'4km promenade along the glittering marina'),
(12,'Dubai Eye','Attraction',9000,'Ferris wheel with spectacular marina views'),
(13,'Sheikh Zayed Grand Mosque','Religious',0,'One of the world''s largest and most beautiful mosques'),
(13,'Louvre Abu Dhabi','Museum',12000,'World-class art museum on Saadiyat Island'),
(13,'Yas Waterworld','Adventure',25000,'Award-winning waterpark on Yas Island'),
(14,'Sharjah Museum of Islamic Civilization','Museum',3000,'Outstanding collection of Islamic art and artefacts'),
(14,'Al Noor Island','Nature',3500,'Butterfly house and sculpture park on the lagoon');
GO

-- ─────────────────────────────────────────────────────────────────────────────
-- TURKEY DATA (Istanbul Old=15, Istanbul Bos=16, Ankara=17, Antalya=18)
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO Routes (FromLocationID, ToLocationID, TravelMode, Cost, DurationHours) VALUES
(15,16,'Car',1500,1),(16,15,'Car',1500,1),
(15,17,'Plane',12000,1),(17,15,'Plane',12000,1),
(15,17,'Train',6000,4),(17,15,'Train',6000,4),
(15,18,'Plane',11000,1),(18,15,'Plane',11000,1),
(16,17,'Train',6500,5),(17,16,'Train',6500,5),
(16,18,'Plane',10000,1),(18,16,'Plane',10000,1);
GO

INSERT INTO Hotels (LocationID, Name, PricePerNight, StarRating, Description, Amenities) VALUES
(15,'Four Seasons Sultanahmet',55000,5,'Stunning hotel inside a former Ottoman prison','Spa, Fine Dining, Bosphorus Views'),
(15,'Hagia Sofia Mansions',42000,5,'Luxury amid the great Byzantine heritage','Hammam, Restaurant, Rooftop Views'),
(15,'Cheers Hostel & Hotel',3500,2,'Budget-friendly with great Old City access','WiFi, Breakfast, Rooftop Terrace'),
(16,'Ciragan Palace Kempinski',80000,5,'Former Ottoman palace on the Bosphorus','Private Beach, Pool, Palace Rooms'),
(16,'Swissotel The Bosphorus',38000,5,'Iconic hotel with panoramic Bosphorus views','Multiple Pools, Spa, Fine Dining'),
(17,'Hilton Ankara',12000,4,'Premier business hotel in the capital','Pool, Gym, Business Centre'),
(17,'Ankara HiltonSA',9000,4,'Comfortable mid-range in the business district','Restaurant, Gym, WiFi'),
(18,'Rixos Downtown Antalya',28000,5,'Luxurious all-inclusive resort in Antalya','Private Beach, 8 Pools, All-Inclusive'),
(18,'Hotel Su Antalya',7000,4,'Stylish design hotel near Antalya Marina','Pool, Spa, Restaurant');
GO

INSERT INTO Places (LocationID, Name, Type, EntryFee, Description) VALUES
(15,'Hagia Sophia Museum','Museum',3500,'1500-year-old Byzantine masterpiece, now a mosque'),
(15,'Topkapi Palace','Historical',5000,'Ottoman imperial palace with priceless artefacts'),
(15,'Grand Bazaar','Shopping',0,'World''s oldest covered market with 4000 shops'),
(15,'Blue Mosque','Religious',0,'Ottoman mosque with stunning blue Iznik tiles'),
(15,'Basilica Cistern','Historical',2500,'Ancient Roman underground cistern'),
(16,'Bosphorus Cruise','Scenic',4000,'Boat tour between two continents'),
(16,'Dolmabahce Palace','Historical',4500,'Last Ottoman palace on the European shore'),
(17,'Anıtkabir','Historical',0,'Monumental mausoleum of Turkey''s founding father'),
(17,'Museum of Anatolian Civilisations','Museum',3000,'Outstanding collection tracing 10,000 years of history'),
(18,'Antalya Old Town','Historical',0,'Ancient walled harbour quarter with Roman gates'),
(18,'Duden Waterfalls','Nature',1500,'Spectacular waterfalls plunging into the Mediterranean'),
(18,'Antalya Museum','Museum',2500,'One of Turkey''s finest archaeological museums');
GO

-- ─────────────────────────────────────────────────────────────────────────────
-- UK DATA (London West=19, London East=20, Edinburgh=21, Manchester=22)
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO Routes (FromLocationID, ToLocationID, TravelMode, Cost, DurationHours) VALUES
(19,20,'Train',2000,1),(20,19,'Train',2000,1),
(19,21,'Train',18000,5),(21,19,'Train',18000,5),
(19,21,'Plane',22000,1),(21,19,'Plane',22000,1),
(19,22,'Train',14000,2),(22,19,'Train',14000,2),
(20,21,'Train',17000,5),(21,20,'Train',17000,5),
(21,22,'Train',9000,2),(22,21,'Train',9000,2);
GO

INSERT INTO Hotels (LocationID, Name, PricePerNight, StarRating, Description, Amenities) VALUES
(19,'The Ritz London',90000,5,'The most iconic luxury hotel in London','Michelin Restaurant, Spa, Butler Service'),
(19,'Claridge''s Hotel',75000,5,'Art Deco masterpiece in Mayfair','Spa, Fine Dining, Cocktail Bar'),
(19,'Premier Inn Westminster',15000,3,'Great value steps from Big Ben','Restaurant, WiFi, Comfortable Beds'),
(20,'Shoreditch House',25000,4,'Trendy members club hotel in East London','Rooftop Pool, Gym, Restaurant'),
(20,'The Hoxton Shoreditch',18000,4,'Hipster-cool hotel in the creative quarter','Restaurant, Bar, Gym'),
(21,'Balmoral Hotel Edinburgh',48000,5,'Grand Victorian railway hotel at the heart of Edinburgh','Spa, Michelin Restaurant, Whisky Bar'),
(21,'The Witchery by the Castle',35000,4,'Gothic luxury beside Edinburgh Castle','Fine Dining, Unique Themed Suites'),
(21,'Ibis Edinburgh Centre',9000,2,'Affordable and well-located in the Old Town','WiFi, Bar, Breakfast'),
(22,'Kimpton Clocktower Manchester',22000,5,'Victorian Gothic masterpiece transformed into luxury','Spa, Restaurant, Bar'),
(22,'Dakota Manchester',18000,4,'Sleek and sophisticated Northern Quarter hotel','Bar, Restaurant, Gym');
GO

INSERT INTO Places (LocationID, Name, Type, EntryFee, Description) VALUES
(19,'Westminster & Big Ben','Landmark',0,'London''s most iconic political and architectural landmark'),
(19,'Buckingham Palace','Landmark',3500,'The official London residence of the British Royal Family'),
(19,'National Gallery','Museum',0,'One of the world''s greatest art collections'),
(19,'Tower of London','Historical',5000,'900-year-old fortress housing the Crown Jewels'),
(19,'Hyde Park','Nature',0,'London''s most famous royal park – 350 acres of green space'),
(20,'Tower Bridge','Landmark',1800,'London''s most recognisable bridge with glass walkway'),
(20,'Tate Modern','Museum',0,'World-class modern art museum in a former power station'),
(20,'Borough Market','Shopping',0,'London''s most famous food market since 1756'),
(21,'Edinburgh Castle','Historical',5500,'Ancient fortress dominating the city skyline'),
(21,'Royal Mile','Historical',0,'Iconic medieval street connecting castle and palace'),
(21,'Arthur''s Seat','Nature',0,'Ancient volcano with stunning views of Edinburgh'),
(21,'Scottish National Museum','Museum',0,'6000 years of Scottish history under one roof'),
(22,'Manchester United Museum','Museum',3500,'Old Trafford museum celebrating football heritage'),
(22,'Manchester Art Gallery','Museum',0,'World-class art collection in the city centre'),
(22,'John Rylands Library','Historical',0,'Neo-Gothic Victorian masterpiece and research library');
GO

-- ─────────────────────────────────────────────────────────────────────────────
-- THAILAND DATA (Bangkok Palace=23, Bangkok Suk=24, Chiang Mai=25, Phuket=26)
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO Routes (FromLocationID, ToLocationID, TravelMode, Cost, DurationHours) VALUES
(23,24,'Car',1200,1),(24,23,'Car',1200,1),
(23,25,'Plane',9000,1),(25,23,'Plane',9000,1),
(23,26,'Plane',12000,1),(26,23,'Plane',12000,1),
(24,25,'Plane',9000,1),(25,24,'Plane',9000,1),
(24,26,'Plane',11000,1),(26,24,'Plane',11000,1),
(25,26,'Plane',13000,1),(26,25,'Plane',13000,1);
GO

INSERT INTO Hotels (LocationID, Name, PricePerNight, StarRating, Description, Amenities) VALUES
(23,'Mandarin Oriental Bangkok',65000,5,'The legendary grande dame of Asian luxury hotels','Riverside Pool, Spa, 5 Restaurants'),
(23,'The Peninsula Bangkok',55000,5,'Iconic twin tower on the Chao Phraya River','River Pool, Helipad, Fine Dining'),
(23,'Ibis Bangkok Riverside',8000,2,'Affordable with stunning riverside views','Pool, Restaurant, WiFi'),
(24,'W Bangkok Sukhumvit',35000,5,'Ultra-cool lifestyle hotel in the entertainment district','WET Pool, BLISS Spa, WOOBAR'),
(24,'Novotel Bangkok Sukhumvit',15000,4,'Comfortable upscale hotel near the BTS','Pool, Restaurant, Gym'),
(25,'Four Seasons Chiang Mai',48000,5,'Luxury paddy field resort north of the city','Spa, Cooking School, Infinity Pool'),
(25,'Tamarind Village',12000,4,'Boutique hotel in a century-old Lanna village','Pool, Restaurant, Spa'),
(26,'Amanpuri Phuket',120000,5,'The original Aman resort – legendary beachfront luxury','Private Beach, Boats, Multiple Restaurants'),
(26,'Kata Rocks Resort',45000,5,'Award-winning cliff-top infinity pool resort','Infinity Pool, Yacht, Fine Dining'),
(26,'Patong Budget Hotel',5000,2,'No-frills budget stay steps from Patong Beach','WiFi, Fan, Restaurant');
GO

INSERT INTO Places (LocationID, Name, Type, EntryFee, Description) VALUES
(23,'Grand Palace & Wat Phra Kaew','Historical',2200,'Thailand''s most sacred temple and former royal palace'),
(23,'Wat Pho (Temple of the Reclining Buddha)','Religious',600,'Home of the 46m gold reclining Buddha'),
(23,'Chao Phraya River Cruise','Scenic',1500,'Scenic boat journey past iconic Bangkok landmarks'),
(24,'Chatuchak Weekend Market','Shopping',0,'World''s largest weekend market with 15,000 stalls'),
(24,'Lumpini Park','Nature',0,'Bangkok''s green lung – cycling, tai-chi, and lake'),
(24,'Sky Bar (State Tower)','Scenic',0,'World-famous rooftop bar from The Hangover II'),
(25,'Doi Suthep Temple','Religious',800,'Golden mountaintop temple with panoramic city views'),
(25,'Sunday Night Walking Street','Market',0,'Stunning handicraft market closing the old city roads'),
(25,'Elephant Nature Park','Nature',4500,'Ethical elephant sanctuary and rescue centre'),
(26,'Phi Phi Islands Day Trip','Nature',6500,'Stunning island-hopping to Maya Bay and beyond'),
(26,'Big Buddha Phuket','Religious',0,'45m white marble Buddha on Nakkerd Hill'),
(26,'Old Phuket Town','Historical',0,'Charming Sino-Portuguese architecture and street art');
GO

PRINT 'All seed data inserted successfully.';