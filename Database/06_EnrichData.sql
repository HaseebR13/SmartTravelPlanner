/* ════════════════════════════════════════════════════════════════════════
   SMART TRAVEL PLANNER — DATA ENRICHMENT
   File 06: Fills every existing row with real coordinates, ratings,
            review counts, opening hours, descriptions and image URLs.
   Run AFTER 05_AddSpatialColumns.sql
   Image URLs use picsum.photos with stable seeds so they always render.
   Swap to your own /images/... paths whenever you wish.
   ════════════════════════════════════════════════════════════════════════ */
USE SmartTravelDB;
GO

PRINT '── Enriching Locations, Hotels and Places ──';
GO

/* ═══════════════════════ LOCATIONS (cities) ═══════════════════════════ */
-- Pakistan
UPDATE Locations SET Latitude=24.860700, Longitude=67.001100, ImageURL='https://picsum.photos/seed/karachi-central/1200/700', ShortDescription='Pakistan''s largest metropolis — Arabian Sea coastline, colonial architecture and a vibrant food scene.', BestSeason='Nov – Feb' WHERE LocationID=1;
UPDATE Locations SET Latitude=31.582100, Longitude=74.329400, ImageURL='https://picsum.photos/seed/lahore-oldcity/1200/700', ShortDescription='The cultural heart of Pakistan: Mughal forts, Sufi shrines and the country''s most legendary food streets.', BestSeason='Oct – Mar' WHERE LocationID=2;
UPDATE Locations SET Latitude=33.715000, Longitude=73.059300, ImageURL='https://picsum.photos/seed/islamabad-f7/1200/700', ShortDescription='A green, planned capital tucked beneath the Margalla Hills — wide boulevards and crisp mountain air.', BestSeason='Mar – May, Sep – Nov' WHERE LocationID=3;
UPDATE Locations SET Latitude=33.597000, Longitude=73.047900, ImageURL='https://picsum.photos/seed/rawalpindi-saddar/1200/700', ShortDescription='Islamabad''s lively twin city: bustling bazaars, British-era barracks and great street food.', BestSeason='Oct – Mar' WHERE LocationID=4;
UPDATE Locations SET Latitude=34.015100, Longitude=71.552400, ImageURL='https://picsum.photos/seed/peshawar-cantt/1200/700', ShortDescription='The ancient frontier city — Pashtun heritage, Gandhara art and the famous storytellers'' bazaar.', BestSeason='Oct – Mar' WHERE LocationID=5;
UPDATE Locations SET Latitude=30.179800, Longitude=66.975000, ImageURL='https://picsum.photos/seed/quetta-city/1200/700', ShortDescription='Balochistan''s mountain capital — fruit orchards, alpine valleys and a uniquely cool climate.', BestSeason='Apr – Oct' WHERE LocationID=6;
UPDATE Locations SET Latitude=30.197900, Longitude=71.472400, ImageURL='https://picsum.photos/seed/multan-shrine/1200/700', ShortDescription='The city of Sufi saints — 1000-year-old shrines and the famous blue pottery of southern Punjab.', BestSeason='Nov – Feb' WHERE LocationID=7;
UPDATE Locations SET Latitude=31.418700, Longitude=73.079100, ImageURL='https://picsum.photos/seed/faisalabad-clock/1200/700', ShortDescription='Pakistan''s textile powerhouse — eight bazaars radiating from the iconic British-era Clock Tower.', BestSeason='Oct – Mar' WHERE LocationID=8;
UPDATE Locations SET Latitude=33.907000, Longitude=73.394300, ImageURL='https://picsum.photos/seed/murree-hills/1200/700', ShortDescription='A classic colonial hill station — pine forests, snowfall in winter and the famous Mall Road.', BestSeason='May – Sep (summer) / Dec – Feb (snow)' WHERE LocationID=9;
UPDATE Locations SET Latitude=36.316700, Longitude=74.650000, ImageURL='https://picsum.photos/seed/hunza-valley/1200/700', ShortDescription='A breath-taking Karakoram valley — glaciers, 7000m peaks and centuries-old stone villages.', BestSeason='Apr – Oct' WHERE LocationID=10;

-- UAE
UPDATE Locations SET Latitude=25.197200, Longitude=55.274400, ImageURL='https://picsum.photos/seed/dubai-downtown/1200/700', ShortDescription='The dazzling heart of Dubai — Burj Khalifa, dancing fountains and the world''s biggest mall.', BestSeason='Nov – Mar' WHERE LocationID=11;
UPDATE Locations SET Latitude=25.080500, Longitude=55.140300, ImageURL='https://picsum.photos/seed/dubai-marina/1200/700', ShortDescription='A glittering waterfront district — skyscrapers, super-yachts and a 7km promenade.', BestSeason='Nov – Mar' WHERE LocationID=12;
UPDATE Locations SET Latitude=24.475000, Longitude=54.370000, ImageURL='https://picsum.photos/seed/abudhabi-corniche/1200/700', ShortDescription='The UAE capital''s seafront — Sheikh Zayed Mosque, the Louvre and the Emirates Palace.', BestSeason='Nov – Mar' WHERE LocationID=13;
UPDATE Locations SET Latitude=25.357300, Longitude=55.390500, ImageURL='https://picsum.photos/seed/sharjah-heritage/1200/700', ShortDescription='The UAE''s cultural capital — restored heritage quarter, museums and traditional souks.', BestSeason='Nov – Mar' WHERE LocationID=14;

-- Turkey
UPDATE Locations SET Latitude=41.008200, Longitude=28.978400, ImageURL='https://picsum.photos/seed/istanbul-sultanahmet/1200/700', ShortDescription='Where Europe meets Asia — Hagia Sophia, Topkapi Palace and the Grand Bazaar.', BestSeason='Apr – Jun, Sep – Nov' WHERE LocationID=15;
UPDATE Locations SET Latitude=41.041900, Longitude=29.009400, ImageURL='https://picsum.photos/seed/istanbul-bosphorus/1200/700', ShortDescription='Istanbul''s elegant European shore — Ottoman palaces and the famous Bosphorus cruise.', BestSeason='Apr – Jun, Sep – Nov' WHERE LocationID=16;
UPDATE Locations SET Latitude=39.933400, Longitude=32.859700, ImageURL='https://picsum.photos/seed/ankara-centre/1200/700', ShortDescription='Turkey''s modern capital — Atatürk''s mausoleum and outstanding archaeological museums.', BestSeason='Apr – Jun, Sep – Oct' WHERE LocationID=17;
UPDATE Locations SET Latitude=36.884100, Longitude=30.705600, ImageURL='https://picsum.photos/seed/antalya-kaleici/1200/700', ShortDescription='The Turkish Riviera''s crown — Roman gates, turquoise Mediterranean and resort beaches.', BestSeason='Apr – Oct' WHERE LocationID=18;

-- UK
UPDATE Locations SET Latitude=51.499700, Longitude=-0.124800, ImageURL='https://picsum.photos/seed/london-westminster/1200/700', ShortDescription='The political heart of Britain — Big Ben, Westminster Abbey and Buckingham Palace.', BestSeason='May – Sep' WHERE LocationID=19;
UPDATE Locations SET Latitude=51.515200, Longitude=-0.071900, ImageURL='https://picsum.photos/seed/london-eastend/1200/700', ShortDescription='London''s creative quarter — street art, Brick Lane curry houses and trendy Shoreditch.', BestSeason='May – Sep' WHERE LocationID=20;
UPDATE Locations SET Latitude=55.953300, Longitude=-3.188300, ImageURL='https://picsum.photos/seed/edinburgh-oldtown/1200/700', ShortDescription='Scotland''s storybook capital — a medieval Old Town crowned by Edinburgh Castle.', BestSeason='May – Sep' WHERE LocationID=21;
UPDATE Locations SET Latitude=53.480800, Longitude=-2.242600, ImageURL='https://picsum.photos/seed/manchester-city/1200/700', ShortDescription='Northern England''s cultural powerhouse — Victorian Gothic architecture and football royalty.', BestSeason='May – Sep' WHERE LocationID=22;

-- Thailand
UPDATE Locations SET Latitude=13.750000, Longitude=100.491400, ImageURL='https://picsum.photos/seed/bangkok-grandpalace/1200/700', ShortDescription='Bangkok''s sacred royal quarter — the Grand Palace and the breathtaking Wat Phra Kaew.', BestSeason='Nov – Feb' WHERE LocationID=23;
UPDATE Locations SET Latitude=13.737200, Longitude=100.560200, ImageURL='https://picsum.photos/seed/bangkok-sukhumvit/1200/700', ShortDescription='Bangkok''s modern artery — rooftop bars, sky-trains and a non-stop nightlife scene.', BestSeason='Nov – Feb' WHERE LocationID=24;
UPDATE Locations SET Latitude=18.788300, Longitude=98.985300, ImageURL='https://picsum.photos/seed/chiangmai-oldcity/1200/700', ShortDescription='Northern Thailand''s atmospheric old kingdom — 300 temples and the Lanna mountain culture.', BestSeason='Nov – Feb' WHERE LocationID=25;
UPDATE Locations SET Latitude=7.880400, Longitude=98.392300, ImageURL='https://picsum.photos/seed/phuket-beachroad/1200/700', ShortDescription='Thailand''s tropical island playground — limestone islands, white-sand beaches and Sino-Portuguese charm.', BestSeason='Nov – Apr' WHERE LocationID=26;
GO

-- Build the GEOGRAPHY value for every location
UPDATE Locations
SET    GeoLocation = geography::Point(Latitude, Longitude, 4326)
WHERE  Latitude IS NOT NULL;
GO

PRINT '✔ Locations enriched (26 rows).';
GO

/* ═══════════════════════════ HOTELS ═══════════════════════════════════ */
-- Each hotel gets unique coordinates near its city centre (real-world offsets),
-- a star-appropriate rating, review count, opening hours and a stable image URL.

UPDATE Hotels SET Latitude=24.846100, Longitude=67.030600, UserRating=4.60, ReviewCount=2847, ContactPhone='+92-21-111-505-505', CheckInTime='14:00', CheckOutTime='12:00', ImageURL='https://picsum.photos/seed/hotel-pc-karachi/800/500' WHERE HotelID=1;
UPDATE Hotels SET Latitude=24.811700, Longitude=67.030500, UserRating=4.55, ReviewCount=2104, ContactPhone='+92-21-111-223-344', CheckInTime='15:00', CheckOutTime='12:00', ImageURL='https://picsum.photos/seed/hotel-marriott-khi/800/500' WHERE HotelID=2;
UPDATE Hotels SET Latitude=24.870400, Longitude=67.034700, UserRating=3.90, ReviewCount=612,  ContactPhone='+92-21-3565-1111', CheckInTime='14:00', CheckOutTime='11:00', ImageURL='https://picsum.photos/seed/hotel-mehran/800/500' WHERE HotelID=3;
UPDATE Hotels SET Latitude=24.857800, Longitude=67.041800, UserRating=3.70, ReviewCount=485,  ContactPhone='+92-21-3568-9601', CheckInTime='14:00', CheckOutTime='11:00', ImageURL='https://picsum.photos/seed/hotel-regent-plaza/800/500' WHERE HotelID=4;

UPDATE Hotels SET Latitude=31.521400, Longitude=74.351900, UserRating=4.65, ReviewCount=3120, ContactPhone='+92-42-111-505-505', CheckInTime='14:00', CheckOutTime='12:00', ImageURL='https://picsum.photos/seed/hotel-pc-lahore/800/500' WHERE HotelID=5;
UPDATE Hotels SET Latitude=31.516700, Longitude=74.343800, UserRating=4.45, ReviewCount=1876, ContactPhone='+92-42-3636-6366', CheckInTime='15:00', CheckOutTime='12:00', ImageURL='https://picsum.photos/seed/hotel-avari-lahore/800/500' WHERE HotelID=6;
UPDATE Hotels SET Latitude=31.512800, Longitude=74.346200, UserRating=4.10, ReviewCount=894,  ContactPhone='+92-42-111-468-101', CheckInTime='14:00', CheckOutTime='12:00', ImageURL='https://picsum.photos/seed/hotel-one-gulberg/800/500' WHERE HotelID=7;
UPDATE Hotels SET Latitude=31.561300, Longitude=74.314200, UserRating=4.30, ReviewCount=1245, ContactPhone='+92-42-3636-3946', CheckInTime='14:00', CheckOutTime='12:00', ImageURL='https://picsum.photos/seed/hotel-falettis/800/500' WHERE HotelID=8;

UPDATE Hotels SET Latitude=33.732800, Longitude=73.090300, UserRating=4.75, ReviewCount=2654, ContactPhone='+92-51-111-133-133', CheckInTime='14:00', CheckOutTime='12:00', ImageURL='https://picsum.photos/seed/hotel-serena-isb/800/500' WHERE HotelID=9;
UPDATE Hotels SET Latitude=33.722400, Longitude=73.081300, UserRating=4.55, ReviewCount=2010, ContactPhone='+92-51-282-6121', CheckInTime='15:00', CheckOutTime='12:00', ImageURL='https://picsum.photos/seed/hotel-marriott-isb/800/500' WHERE HotelID=10;
UPDATE Hotels SET Latitude=33.728900, Longitude=73.094400, UserRating=4.00, ReviewCount=540,  ContactPhone='+92-51-282-7311', CheckInTime='14:00', CheckOutTime='12:00', ImageURL='https://picsum.photos/seed/hotel-islamabad/800/500' WHERE HotelID=11;
UPDATE Hotels SET Latitude=33.707300, Longitude=73.050400, UserRating=3.85, ReviewCount=420,  ContactPhone='+92-51-282-8731', CheckInTime='14:00', CheckOutTime='11:00', ImageURL='https://picsum.photos/seed/hotel-margalla/800/500' WHERE HotelID=12;

UPDATE Hotels SET Latitude=33.597900, Longitude=73.058400, UserRating=4.20, ReviewCount=687,  ContactPhone='+92-51-111-100-100', CheckInTime='14:00', CheckOutTime='12:00', ImageURL='https://picsum.photos/seed/hotel-ramada-rwp/800/500' WHERE HotelID=13;
UPDATE Hotels SET Latitude=33.601900, Longitude=73.044700, UserRating=3.80, ReviewCount=312,  ContactPhone='+92-51-111-468-101', CheckInTime='14:00', CheckOutTime='12:00', ImageURL='https://picsum.photos/seed/hotel-one-rwp/800/500' WHERE HotelID=14;

UPDATE Hotels SET Latitude=34.011400, Longitude=71.556700, UserRating=4.50, ReviewCount=1102, ContactPhone='+92-91-111-505-505', CheckInTime='14:00', CheckOutTime='12:00', ImageURL='https://picsum.photos/seed/hotel-pc-peshawar/800/500' WHERE HotelID=15;
UPDATE Hotels SET Latitude=34.019800, Longitude=71.553200, UserRating=3.95, ReviewCount=445,  ContactPhone='+92-91-525-3306', CheckInTime='14:00', CheckOutTime='12:00', ImageURL='https://picsum.photos/seed/hotel-greens-pew/800/500' WHERE HotelID=16;

UPDATE Hotels SET Latitude=30.180000, Longitude=66.976400, UserRating=4.40, ReviewCount=824,  ContactPhone='+92-81-111-133-133', CheckInTime='14:00', CheckOutTime='12:00', ImageURL='https://picsum.photos/seed/hotel-serena-quetta/800/500' WHERE HotelID=17;
UPDATE Hotels SET Latitude=30.186200, Longitude=66.969900, UserRating=3.70, ReviewCount=268,  ContactPhone='+92-81-282-9111', CheckInTime='14:00', CheckOutTime='12:00', ImageURL='https://picsum.photos/seed/hotel-bloomstar/800/500' WHERE HotelID=18;

UPDATE Hotels SET Latitude=30.193700, Longitude=71.471400, UserRating=4.30, ReviewCount=623,  ContactPhone='+92-61-111-100-100', CheckInTime='14:00', CheckOutTime='12:00', ImageURL='https://picsum.photos/seed/hotel-ramada-multan/800/500' WHERE HotelID=19;
UPDATE Hotels SET Latitude=30.203000, Longitude=71.478300, UserRating=3.75, ReviewCount=298,  ContactPhone='+92-61-111-468-101', CheckInTime='14:00', CheckOutTime='12:00', ImageURL='https://picsum.photos/seed/hotel-one-multan/800/500' WHERE HotelID=20;

UPDATE Hotels SET Latitude=31.422700, Longitude=73.084500, UserRating=4.45, ReviewCount=912,  ContactPhone='+92-41-111-133-133', CheckInTime='14:00', CheckOutTime='12:00', ImageURL='https://picsum.photos/seed/hotel-serena-fsd/800/500' WHERE HotelID=21;
UPDATE Hotels SET Latitude=31.414500, Longitude=73.075300, UserRating=3.80, ReviewCount=341,  ContactPhone='+92-41-111-468-101', CheckInTime='14:00', CheckOutTime='12:00', ImageURL='https://picsum.photos/seed/hotel-one-fsd/800/500' WHERE HotelID=22;

UPDATE Hotels SET Latitude=33.909000, Longitude=73.392300, UserRating=4.25, ReviewCount=754,  ContactPhone='+92-51-111-468-101', CheckInTime='14:00', CheckOutTime='12:00', ImageURL='https://picsum.photos/seed/hotel-one-murree/800/500' WHERE HotelID=23;
UPDATE Hotels SET Latitude=33.905100, Longitude=73.396800, UserRating=3.85, ReviewCount=412,  ContactPhone='+92-51-329-0001', CheckInTime='14:00', CheckOutTime='12:00', ImageURL='https://picsum.photos/seed/hotel-shangrila/800/500' WHERE HotelID=24;

UPDATE Hotels SET Latitude=36.319800, Longitude=74.661200, UserRating=4.65, ReviewCount=587,  ContactPhone='+92-58-145-7777', CheckInTime='14:00', CheckOutTime='12:00', ImageURL='https://picsum.photos/seed/hotel-eaglenest/800/500' WHERE HotelID=25;
UPDATE Hotels SET Latitude=36.312100, Longitude=74.658800, UserRating=4.50, ReviewCount=478,  ContactPhone='+92-58-145-7000', CheckInTime='14:00', CheckOutTime='12:00', ImageURL='https://picsum.photos/seed/hotel-serena-karimabad/800/500' WHERE HotelID=26;

-- UAE Hotels
UPDATE Hotels SET Latitude=25.141200, Longitude=55.185300, UserRating=4.80, ReviewCount=8214, ContactPhone='+971-4-301-7777', CheckInTime='15:00', CheckOutTime='12:00', ImageURL='https://picsum.photos/seed/hotel-burjalarab/800/500' WHERE HotelID=27;
UPDATE Hotels SET Latitude=25.130400, Longitude=55.117200, UserRating=4.65, ReviewCount=7821, ContactPhone='+971-4-426-2000', CheckInTime='15:00', CheckOutTime='12:00', ImageURL='https://picsum.photos/seed/hotel-atlantis/800/500' WHERE HotelID=28;
UPDATE Hotels SET Latitude=25.199700, Longitude=55.273100, UserRating=4.70, ReviewCount=4523, ContactPhone='+971-4-436-8888', CheckInTime='15:00', CheckOutTime='12:00', ImageURL='https://picsum.photos/seed/hotel-address-downtown/800/500' WHERE HotelID=29;
UPDATE Hotels SET Latitude=25.193100, Longitude=55.275600, UserRating=4.30, ReviewCount=1987, ContactPhone='+971-4-561-9999', CheckInTime='15:00', CheckOutTime='12:00', ImageURL='https://picsum.photos/seed/hotel-rove-downtown/800/500' WHERE HotelID=30;
UPDATE Hotels SET Latitude=25.078200, Longitude=55.141700, UserRating=4.55, ReviewCount=3211, ContactPhone='+971-4-448-4848', CheckInTime='15:00', CheckOutTime='12:00', ImageURL='https://picsum.photos/seed/hotel-sofitel-marina/800/500' WHERE HotelID=31;
UPDATE Hotels SET Latitude=25.082600, Longitude=55.144000, UserRating=4.00, ReviewCount=872,  ContactPhone='+971-4-447-8800', CheckInTime='14:00', CheckOutTime='12:00', ImageURL='https://picsum.photos/seed/hotel-marina-inn/800/500' WHERE HotelID=32;
UPDATE Hotels SET Latitude=24.461700, Longitude=54.317200, UserRating=4.85, ReviewCount=5642, ContactPhone='+971-2-690-9000', CheckInTime='15:00', CheckOutTime='12:00', ImageURL='https://picsum.photos/seed/hotel-emiratespalace/800/500' WHERE HotelID=33;
UPDATE Hotels SET Latitude=24.467500, Longitude=54.605700, UserRating=4.50, ReviewCount=2310, ContactPhone='+971-2-656-4000', CheckInTime='15:00', CheckOutTime='12:00', ImageURL='https://picsum.photos/seed/hotel-yas-rotana/800/500' WHERE HotelID=34;
UPDATE Hotels SET Latitude=25.359400, Longitude=55.390100, UserRating=4.20, ReviewCount=1043, ContactPhone='+971-6-575-3535', CheckInTime='14:00', CheckOutTime='12:00', ImageURL='https://picsum.photos/seed/hotel-sharjah-grand/800/500' WHERE HotelID=35;

-- Turkey Hotels
UPDATE Hotels SET Latitude=41.007900, Longitude=28.977700, UserRating=4.90, ReviewCount=4123, ContactPhone='+90-212-638-8200', CheckInTime='14:00', CheckOutTime='12:00', ImageURL='https://picsum.photos/seed/hotel-fourseasons-sultanahmet/800/500' WHERE HotelID=36;
UPDATE Hotels SET Latitude=41.008500, Longitude=28.979200, UserRating=4.75, ReviewCount=2876, ContactPhone='+90-212-528-0808', CheckInTime='14:00', CheckOutTime='12:00', ImageURL='https://picsum.photos/seed/hotel-hagiasofia-mansions/800/500' WHERE HotelID=37;
UPDATE Hotels SET Latitude=41.009200, Longitude=28.974800, UserRating=4.30, ReviewCount=1267, ContactPhone='+90-212-526-0200', CheckInTime='14:00', CheckOutTime='11:00', ImageURL='https://picsum.photos/seed/hotel-cheers-hostel/800/500' WHERE HotelID=38;
UPDATE Hotels SET Latitude=41.043200, Longitude=29.008100, UserRating=4.95, ReviewCount=3654, ContactPhone='+90-212-326-4646', CheckInTime='14:00', CheckOutTime='12:00', ImageURL='https://picsum.photos/seed/hotel-ciragan-palace/800/500' WHERE HotelID=39;
UPDATE Hotels SET Latitude=41.038900, Longitude=29.011300, UserRating=4.70, ReviewCount=2895, ContactPhone='+90-212-326-1100', CheckInTime='14:00', CheckOutTime='12:00', ImageURL='https://picsum.photos/seed/hotel-swissotel/800/500' WHERE HotelID=40;
UPDATE Hotels SET Latitude=39.929800, Longitude=32.864300, UserRating=4.45, ReviewCount=1543, ContactPhone='+90-312-455-0000', CheckInTime='14:00', CheckOutTime='12:00', ImageURL='https://picsum.photos/seed/hotel-hilton-ankara/800/500' WHERE HotelID=41;
UPDATE Hotels SET Latitude=39.936800, Longitude=32.857100, UserRating=4.20, ReviewCount=987,  ContactPhone='+90-312-455-0010', CheckInTime='14:00', CheckOutTime='12:00', ImageURL='https://picsum.photos/seed/hotel-ankara-hilton/800/500' WHERE HotelID=42;
UPDATE Hotels SET Latitude=36.880100, Longitude=30.710900, UserRating=4.65, ReviewCount=4321, ContactPhone='+90-242-249-4949', CheckInTime='14:00', CheckOutTime='12:00', ImageURL='https://picsum.photos/seed/hotel-rixos-antalya/800/500' WHERE HotelID=43;
UPDATE Hotels SET Latitude=36.881700, Longitude=30.703800, UserRating=4.40, ReviewCount=1876, ContactPhone='+90-242-249-0700', CheckInTime='14:00', CheckOutTime='12:00', ImageURL='https://picsum.photos/seed/hotel-su-antalya/800/500' WHERE HotelID=44;

-- UK Hotels
UPDATE Hotels SET Latitude=51.507400, Longitude=-0.142000, UserRating=4.85, ReviewCount=6234, ContactPhone='+44-20-7493-8181', CheckInTime='15:00', CheckOutTime='12:00', ImageURL='https://picsum.photos/seed/hotel-ritz-london/800/500' WHERE HotelID=45;
UPDATE Hotels SET Latitude=51.512600, Longitude=-0.147700, UserRating=4.90, ReviewCount=5478, ContactPhone='+44-20-7629-8860', CheckInTime='15:00', CheckOutTime='12:00', ImageURL='https://picsum.photos/seed/hotel-claridges/800/500' WHERE HotelID=46;
UPDATE Hotels SET Latitude=51.501700, Longitude=-0.126200, UserRating=4.30, ReviewCount=3245, ContactPhone='+44-871-527-9334', CheckInTime='14:00', CheckOutTime='12:00', ImageURL='https://picsum.photos/seed/hotel-premier-inn-westminster/800/500' WHERE HotelID=47;
UPDATE Hotels SET Latitude=51.525700, Longitude=-0.078500, UserRating=4.60, ReviewCount=1987, ContactPhone='+44-20-7739-5040', CheckInTime='15:00', CheckOutTime='12:00', ImageURL='https://picsum.photos/seed/hotel-shoreditch-house/800/500' WHERE HotelID=48;
UPDATE Hotels SET Latitude=51.524000, Longitude=-0.080800, UserRating=4.45, ReviewCount=2843, ContactPhone='+44-20-7550-1000', CheckInTime='15:00', CheckOutTime='12:00', ImageURL='https://picsum.photos/seed/hotel-hoxton-shoreditch/800/500' WHERE HotelID=49;
UPDATE Hotels SET Latitude=55.952900, Longitude=-3.189400, UserRating=4.80, ReviewCount=2154, ContactPhone='+44-131-556-2414', CheckInTime='15:00', CheckOutTime='12:00', ImageURL='https://picsum.photos/seed/hotel-balmoral-edinburgh/800/500' WHERE HotelID=50;
UPDATE Hotels SET Latitude=55.948500, Longitude=-3.196700, UserRating=4.70, ReviewCount=1843, ContactPhone='+44-131-225-5613', CheckInTime='15:00', CheckOutTime='12:00', ImageURL='https://picsum.photos/seed/hotel-witchery/800/500' WHERE HotelID=51;
UPDATE Hotels SET Latitude=55.951300, Longitude=-3.192700, UserRating=3.95, ReviewCount=1543, ContactPhone='+44-131-240-7000', CheckInTime='14:00', CheckOutTime='12:00', ImageURL='https://picsum.photos/seed/hotel-ibis-edinburgh/800/500' WHERE HotelID=52;
UPDATE Hotels SET Latitude=53.478500, Longitude=-2.243700, UserRating=4.55, ReviewCount=1432, ContactPhone='+44-161-829-3000', CheckInTime='15:00', CheckOutTime='12:00', ImageURL='https://picsum.photos/seed/hotel-kimpton-manchester/800/500' WHERE HotelID=53;
UPDATE Hotels SET Latitude=53.483400, Longitude=-2.238900, UserRating=4.40, ReviewCount=987,  ContactPhone='+44-161-200-1900', CheckInTime='15:00', CheckOutTime='12:00', ImageURL='https://picsum.photos/seed/hotel-dakota-manchester/800/500' WHERE HotelID=54;

-- Thailand Hotels
UPDATE Hotels SET Latitude=13.724700, Longitude=100.514600, UserRating=4.90, ReviewCount=5876, ContactPhone='+66-2-659-9000', CheckInTime='15:00', CheckOutTime='12:00', ImageURL='https://picsum.photos/seed/hotel-mandarin-bangkok/800/500' WHERE HotelID=55;
UPDATE Hotels SET Latitude=13.722800, Longitude=100.510400, UserRating=4.85, ReviewCount=4732, ContactPhone='+66-2-020-2888', CheckInTime='14:00', CheckOutTime='12:00', ImageURL='https://picsum.photos/seed/hotel-peninsula-bangkok/800/500' WHERE HotelID=56;
UPDATE Hotels SET Latitude=13.726300, Longitude=100.518900, UserRating=4.10, ReviewCount=1576, ContactPhone='+66-2-659-2888', CheckInTime='14:00', CheckOutTime='12:00', ImageURL='https://picsum.photos/seed/hotel-ibis-bangkok/800/500' WHERE HotelID=57;
UPDATE Hotels SET Latitude=13.722400, Longitude=100.529500, UserRating=4.65, ReviewCount=3654, ContactPhone='+66-2-344-4000', CheckInTime='15:00', CheckOutTime='12:00', ImageURL='https://picsum.photos/seed/hotel-w-bangkok/800/500' WHERE HotelID=58;
UPDATE Hotels SET Latitude=13.737800, Longitude=100.560000, UserRating=4.40, ReviewCount=2543, ContactPhone='+66-2-797-0000', CheckInTime='14:00', CheckOutTime='12:00', ImageURL='https://picsum.photos/seed/hotel-novotel-sukhumvit/800/500' WHERE HotelID=59;
UPDATE Hotels SET Latitude=18.796200, Longitude=98.961100, UserRating=4.85, ReviewCount=2876, ContactPhone='+66-53-298-181', CheckInTime='15:00', CheckOutTime='12:00', ImageURL='https://picsum.photos/seed/hotel-fourseasons-chiangmai/800/500' WHERE HotelID=60;
UPDATE Hotels SET Latitude=18.788500, Longitude=98.985200, UserRating=4.60, ReviewCount=1654, ContactPhone='+66-53-418-896', CheckInTime='14:00', CheckOutTime='12:00', ImageURL='https://picsum.photos/seed/hotel-tamarind-village/800/500' WHERE HotelID=61;
UPDATE Hotels SET Latitude=7.872100, Longitude=98.276300, UserRating=4.95, ReviewCount=2143, ContactPhone='+66-76-324-333', CheckInTime='15:00', CheckOutTime='12:00', ImageURL='https://picsum.photos/seed/hotel-amanpuri/800/500' WHERE HotelID=62;
UPDATE Hotels SET Latitude=7.811400, Longitude=98.301700, UserRating=4.80, ReviewCount=1865, ContactPhone='+66-76-370-777', CheckInTime='15:00', CheckOutTime='12:00', ImageURL='https://picsum.photos/seed/hotel-katarocks/800/500' WHERE HotelID=63;
UPDATE Hotels SET Latitude=7.892100, Longitude=98.298400, UserRating=3.90, ReviewCount=987,  ContactPhone='+66-76-340-200', CheckInTime='14:00', CheckOutTime='12:00', ImageURL='https://picsum.photos/seed/hotel-patong-budget/800/500' WHERE HotelID=64;
GO

-- Compute GEOGRAPHY for every hotel
UPDATE Hotels
SET    GeoLocation = geography::Point(Latitude, Longitude, 4326)
WHERE  Latitude IS NOT NULL;
GO

PRINT '✔ Hotels enriched.';
GO

/* ═══════════════════════════ PLACES ═══════════════════════════════════ */
-- Each place gets exact landmark coordinates (real-world), ratings,
-- opening hours, an "average visit time" and best season.

-- Karachi
UPDATE Places SET Latitude=24.821000, Longitude=67.022300, UserRating=4.30, ReviewCount=18435, OpeningTime='06:00', ClosingTime='22:00', AverageVisitMinutes=120, BestTimeToVisit='Evening for sunset', ImageURL='https://picsum.photos/seed/place-clifton-beach/800/500' WHERE PlaceID=1;
UPDATE Places SET Latitude=24.806300, Longitude=67.030800, UserRating=4.50, ReviewCount=2843,  OpeningTime='11:00', ClosingTime='18:00', AverageVisitMinutes=90,  BestTimeToVisit='Afternoon', ImageURL='https://picsum.photos/seed/place-mohatta-palace/800/500' WHERE PlaceID=2;
UPDATE Places SET Latitude=24.851700, Longitude=67.017800, UserRating=4.10, ReviewCount=1276,  OpeningTime='08:00', ClosingTime='20:00', AverageVisitMinutes=60,  BestTimeToVisit='Morning', ImageURL='https://picsum.photos/seed/place-frere-hall/800/500' WHERE PlaceID=3;
UPDATE Places SET Latitude=24.875200, Longitude=67.041400, UserRating=4.40, ReviewCount=987,   OpeningTime='09:00', ClosingTime='17:00', AverageVisitMinutes=75,  BestTimeToVisit='Morning', ImageURL='https://picsum.photos/seed/place-quaid-museum/800/500' WHERE PlaceID=4;
UPDATE Places SET Latitude=24.836200, Longitude=67.064100, UserRating=4.20, ReviewCount=8753,  OpeningTime='10:00', ClosingTime='23:00', AverageVisitMinutes=120, BestTimeToVisit='Evening', ImageURL='https://picsum.photos/seed/place-dolmen-mall/800/500' WHERE PlaceID=5;

-- Lahore
UPDATE Places SET Latitude=31.588200, Longitude=74.315000, UserRating=4.70, ReviewCount=12435, OpeningTime='08:30', ClosingTime='18:00', AverageVisitMinutes=180, BestTimeToVisit='Morning', ImageURL='https://picsum.photos/seed/place-lahore-fort/800/500' WHERE PlaceID=6;
UPDATE Places SET Latitude=31.588000, Longitude=74.310300, UserRating=4.85, ReviewCount=21567, OpeningTime='05:00', ClosingTime='22:00', AverageVisitMinutes=90,  BestTimeToVisit='Sunset (golden light)', ImageURL='https://picsum.photos/seed/place-badshahi-mosque/800/500' WHERE PlaceID=7;
UPDATE Places SET Latitude=31.586800, Longitude=74.382300, UserRating=4.40, ReviewCount=5432,  OpeningTime='08:00', ClosingTime='19:00', AverageVisitMinutes=120, BestTimeToVisit='Late afternoon', ImageURL='https://picsum.photos/seed/place-shalimar-gardens/800/500' WHERE PlaceID=8;
UPDATE Places SET Latitude=31.583700, Longitude=74.315700, UserRating=4.65, ReviewCount=9876,  OpeningTime='17:00', ClosingTime='02:00', AverageVisitMinutes=120, BestTimeToVisit='Night (8-11 pm)', ImageURL='https://picsum.photos/seed/place-food-street/800/500' WHERE PlaceID=9;
UPDATE Places SET Latitude=31.557400, Longitude=74.310100, UserRating=4.20, ReviewCount=3654,  OpeningTime='09:00', ClosingTime='17:00', AverageVisitMinutes=120, BestTimeToVisit='Morning', ImageURL='https://picsum.photos/seed/place-lahore-museum/800/500' WHERE PlaceID=10;

-- Islamabad
UPDATE Places SET Latitude=33.730200, Longitude=73.037800, UserRating=4.80, ReviewCount=18934, OpeningTime='04:30', ClosingTime='22:30', AverageVisitMinutes=90,  BestTimeToVisit='Sunset', ImageURL='https://picsum.photos/seed/place-faisal-mosque/800/500' WHERE PlaceID=11;
UPDATE Places SET Latitude=33.693900, Longitude=73.068600, UserRating=4.60, ReviewCount=6543,  OpeningTime='09:00', ClosingTime='22:00', AverageVisitMinutes=60,  BestTimeToVisit='Evening', ImageURL='https://picsum.photos/seed/place-pak-monument/800/500' WHERE PlaceID=12;
UPDATE Places SET Latitude=33.738500, Longitude=73.058100, UserRating=4.50, ReviewCount=4321,  OpeningTime='06:00', ClosingTime='19:00', AverageVisitMinutes=180, BestTimeToVisit='Early morning', ImageURL='https://picsum.photos/seed/place-margalla-trail/800/500' WHERE PlaceID=13;
UPDATE Places SET Latitude=33.692800, Longitude=73.072900, UserRating=4.30, ReviewCount=2187,  OpeningTime='09:00', ClosingTime='18:00', AverageVisitMinutes=90,  BestTimeToVisit='Afternoon', ImageURL='https://picsum.photos/seed/place-lokvirsa/800/500' WHERE PlaceID=14;
UPDATE Places SET Latitude=33.744300, Longitude=73.063700, UserRating=4.55, ReviewCount=5876,  OpeningTime='08:00', ClosingTime='21:00', AverageVisitMinutes=60,  BestTimeToVisit='Sunset', ImageURL='https://picsum.photos/seed/place-damanekoh/800/500' WHERE PlaceID=15;

-- Rawalpindi
UPDATE Places SET Latitude=33.598300, Longitude=73.043600, UserRating=4.20, ReviewCount=4532,  OpeningTime='09:00', ClosingTime='22:00', AverageVisitMinutes=120, BestTimeToVisit='Evening', ImageURL='https://picsum.photos/seed/place-raja-bazaar/800/500' WHERE PlaceID=16;
UPDATE Places SET Latitude=33.600100, Longitude=73.060800, UserRating=3.90, ReviewCount=687,   OpeningTime='09:00', ClosingTime='17:00', AverageVisitMinutes=75,  BestTimeToVisit='Morning', ImageURL='https://picsum.photos/seed/place-rwp-museum/800/500' WHERE PlaceID=17;

-- Peshawar
UPDATE Places SET Latitude=34.012400, Longitude=71.566500, UserRating=4.60, ReviewCount=2876,  OpeningTime='09:00', ClosingTime='16:30', AverageVisitMinutes=120, BestTimeToVisit='Morning', ImageURL='https://picsum.photos/seed/place-peshawar-museum/800/500' WHERE PlaceID=18;
UPDATE Places SET Latitude=34.011400, Longitude=71.572300, UserRating=4.50, ReviewCount=4321,  OpeningTime='08:00', ClosingTime='22:00', AverageVisitMinutes=90,  BestTimeToVisit='Evening', ImageURL='https://picsum.photos/seed/place-qissa-khwani/800/500' WHERE PlaceID=19;
UPDATE Places SET Latitude=34.020500, Longitude=71.561200, UserRating=4.30, ReviewCount=1543,  OpeningTime='08:00', ClosingTime='18:00', AverageVisitMinutes=90,  BestTimeToVisit='Late afternoon', ImageURL='https://picsum.photos/seed/place-bala-hisar/800/500' WHERE PlaceID=20;

-- Quetta
UPDATE Places SET Latitude=30.103400, Longitude=66.910200, UserRating=4.40, ReviewCount=987,   OpeningTime='07:00', ClosingTime='18:00', AverageVisitMinutes=240, BestTimeToVisit='Spring/Autumn morning', ImageURL='https://picsum.photos/seed/place-hazarganji/800/500' WHERE PlaceID=21;
UPDATE Places SET Latitude=30.181500, Longitude=66.978500, UserRating=4.30, ReviewCount=1276,  OpeningTime='09:00', ClosingTime='21:00', AverageVisitMinutes=90,  BestTimeToVisit='Afternoon', ImageURL='https://picsum.photos/seed/place-quetta-bazaar/800/500' WHERE PlaceID=22;

-- Multan
UPDATE Places SET Latitude=30.197300, Longitude=71.471300, UserRating=4.70, ReviewCount=5432,  OpeningTime='04:30', ClosingTime='22:30', AverageVisitMinutes=60,  BestTimeToVisit='Evening', ImageURL='https://picsum.photos/seed/place-rukne-alam/800/500' WHERE PlaceID=23;
UPDATE Places SET Latitude=30.198500, Longitude=71.470200, UserRating=4.20, ReviewCount=1876,  OpeningTime='09:00', ClosingTime='18:00', AverageVisitMinutes=90,  BestTimeToVisit='Morning', ImageURL='https://picsum.photos/seed/place-multan-fort/800/500' WHERE PlaceID=24;
UPDATE Places SET Latitude=30.196100, Longitude=71.477800, UserRating=4.40, ReviewCount=2187,  OpeningTime='10:00', ClosingTime='21:00', AverageVisitMinutes=90,  BestTimeToVisit='Afternoon', ImageURL='https://picsum.photos/seed/place-multan-handicrafts/800/500' WHERE PlaceID=25;

-- Faisalabad
UPDATE Places SET Latitude=31.418700, Longitude=73.079100, UserRating=4.30, ReviewCount=3654,  OpeningTime='09:00', ClosingTime='23:00', AverageVisitMinutes=60,  BestTimeToVisit='Evening', ImageURL='https://picsum.photos/seed/place-fsd-clocktower/800/500' WHERE PlaceID=26;
UPDATE Places SET Latitude=31.422100, Longitude=73.090400, UserRating=4.10, ReviewCount=1432,  OpeningTime='06:00', ClosingTime='21:00', AverageVisitMinutes=60,  BestTimeToVisit='Evening', ImageURL='https://picsum.photos/seed/place-jinnah-garden/800/500' WHERE PlaceID=27;

-- Murree
UPDATE Places SET Latitude=33.907900, Longitude=73.391500, UserRating=4.40, ReviewCount=15432, OpeningTime='08:00', ClosingTime='23:00', AverageVisitMinutes=120, BestTimeToVisit='Evening', ImageURL='https://picsum.photos/seed/place-mall-road-murree/800/500' WHERE PlaceID=28;
UPDATE Places SET Latitude=33.831000, Longitude=73.408900, UserRating=4.60, ReviewCount=4321,  OpeningTime='09:00', ClosingTime='17:00', AverageVisitMinutes=120, BestTimeToVisit='Late morning', ImageURL='https://picsum.photos/seed/place-patriata-chairlift/800/500' WHERE PlaceID=29;
UPDATE Places SET Latitude=33.917800, Longitude=73.394500, UserRating=4.50, ReviewCount=2876,  OpeningTime='07:00', ClosingTime='19:00', AverageVisitMinutes=60,  BestTimeToVisit='Sunset', ImageURL='https://picsum.photos/seed/place-pindi-point/800/500' WHERE PlaceID=30;

-- Hunza
UPDATE Places SET Latitude=36.327700, Longitude=74.668400, UserRating=4.80, ReviewCount=3210,  OpeningTime='08:00', ClosingTime='18:00', AverageVisitMinutes=120, BestTimeToVisit='Morning', ImageURL='https://picsum.photos/seed/place-baltit-fort/800/500' WHERE PlaceID=31;
UPDATE Places SET Latitude=36.351900, Longitude=74.857300, UserRating=4.85, ReviewCount=8765,  OpeningTime='06:00', ClosingTime='20:00', AverageVisitMinutes=180, BestTimeToVisit='Mid-day (turquoise water)', ImageURL='https://picsum.photos/seed/place-attabad-lake/800/500' WHERE PlaceID=32;
UPDATE Places SET Latitude=36.453200, Longitude=74.881600, UserRating=4.90, ReviewCount=4567,  OpeningTime='00:00', ClosingTime='23:59', AverageVisitMinutes=60,  BestTimeToVisit='Sunrise / Sunset', ImageURL='https://picsum.photos/seed/place-passu-cones/800/500' WHERE PlaceID=33;
UPDATE Places SET Latitude=36.151700, Longitude=74.487900, UserRating=4.95, ReviewCount=2876,  OpeningTime='00:00', ClosingTime='23:59', AverageVisitMinutes=45,  BestTimeToVisit='Sunrise', ImageURL='https://picsum.photos/seed/place-rakaposhi-view/800/500' WHERE PlaceID=34;

-- UAE Places
UPDATE Places SET Latitude=25.197100, Longitude=55.274300, UserRating=4.70, ReviewCount=89234, OpeningTime='10:00', ClosingTime='22:00', AverageVisitMinutes=120, BestTimeToVisit='Sunset', ImageURL='https://picsum.photos/seed/place-burj-khalifa/800/500' WHERE PlaceID=35;
UPDATE Places SET Latitude=25.197200, Longitude=55.279700, UserRating=4.60, ReviewCount=67821, OpeningTime='10:00', ClosingTime='00:00', AverageVisitMinutes=240, BestTimeToVisit='All day', ImageURL='https://picsum.photos/seed/place-dubai-mall/800/500' WHERE PlaceID=36;
UPDATE Places SET Latitude=25.195400, Longitude=55.275400, UserRating=4.80, ReviewCount=45213, OpeningTime='18:00', ClosingTime='23:30', AverageVisitMinutes=45,  BestTimeToVisit='Every 30 min after 18:00', ImageURL='https://picsum.photos/seed/place-dubai-fountain/800/500' WHERE PlaceID=37;
UPDATE Places SET Latitude=25.234800, Longitude=55.300100, UserRating=4.50, ReviewCount=18234, OpeningTime='09:00', ClosingTime='21:00', AverageVisitMinutes=90,  BestTimeToVisit='Sunset', ImageURL='https://picsum.photos/seed/place-dubai-frame/800/500' WHERE PlaceID=38;
UPDATE Places SET Latitude=24.853600, Longitude=55.589900, UserRating=4.85, ReviewCount=23456, OpeningTime='15:00', ClosingTime='22:00', AverageVisitMinutes=360, BestTimeToVisit='Late afternoon (sunset safari)', ImageURL='https://picsum.photos/seed/place-desert-safari/800/500' WHERE PlaceID=39;
UPDATE Places SET Latitude=25.077500, Longitude=55.142200, UserRating=4.40, ReviewCount=15432, OpeningTime='00:00', ClosingTime='23:59', AverageVisitMinutes=90,  BestTimeToVisit='Evening', ImageURL='https://picsum.photos/seed/place-marina-walk/800/500' WHERE PlaceID=40;
UPDATE Places SET Latitude=25.078800, Longitude=55.138100, UserRating=4.50, ReviewCount=8765,  OpeningTime='12:00', ClosingTime='00:00', AverageVisitMinutes=45,  BestTimeToVisit='Sunset', ImageURL='https://picsum.photos/seed/place-dubai-eye/800/500' WHERE PlaceID=41;
UPDATE Places SET Latitude=24.412700, Longitude=54.474800, UserRating=4.90, ReviewCount=98765, OpeningTime='09:00', ClosingTime='22:00', AverageVisitMinutes=120, BestTimeToVisit='Sunset (illuminated)', ImageURL='https://picsum.photos/seed/place-zayed-mosque/800/500' WHERE PlaceID=42;
UPDATE Places SET Latitude=24.533700, Longitude=54.398100, UserRating=4.70, ReviewCount=23456, OpeningTime='10:00', ClosingTime='18:30', AverageVisitMinutes=180, BestTimeToVisit='Late afternoon', ImageURL='https://picsum.photos/seed/place-louvre-abudhabi/800/500' WHERE PlaceID=43;
UPDATE Places SET Latitude=24.488100, Longitude=54.602900, UserRating=4.65, ReviewCount=15432, OpeningTime='10:00', ClosingTime='18:00', AverageVisitMinutes=360, BestTimeToVisit='Full day', ImageURL='https://picsum.photos/seed/place-yas-waterworld/800/500' WHERE PlaceID=44;
UPDATE Places SET Latitude=25.357300, Longitude=55.390500, UserRating=4.50, ReviewCount=4321,  OpeningTime='08:00', ClosingTime='20:00', AverageVisitMinutes=120, BestTimeToVisit='Morning', ImageURL='https://picsum.photos/seed/place-sharjah-islamic-museum/800/500' WHERE PlaceID=45;
UPDATE Places SET Latitude=25.323400, Longitude=55.395800, UserRating=4.60, ReviewCount=8765,  OpeningTime='09:00', ClosingTime='23:00', AverageVisitMinutes=120, BestTimeToVisit='Evening (illuminated)', ImageURL='https://picsum.photos/seed/place-al-noor-island/800/500' WHERE PlaceID=46;

-- Turkey Places
UPDATE Places SET Latitude=41.008500, Longitude=28.980000, UserRating=4.80, ReviewCount=125432, OpeningTime='09:00', ClosingTime='19:00', AverageVisitMinutes=120, BestTimeToVisit='Early morning', ImageURL='https://picsum.photos/seed/place-hagia-sophia/800/500' WHERE PlaceID=47;
UPDATE Places SET Latitude=41.011500, Longitude=28.983400, UserRating=4.70, ReviewCount=98432,  OpeningTime='09:00', ClosingTime='18:00', AverageVisitMinutes=180, BestTimeToVisit='Morning', ImageURL='https://picsum.photos/seed/place-topkapi/800/500' WHERE PlaceID=48;
UPDATE Places SET Latitude=41.010800, Longitude=28.968000, UserRating=4.60, ReviewCount=67432,  OpeningTime='09:00', ClosingTime='19:00', AverageVisitMinutes=180, BestTimeToVisit='Afternoon', ImageURL='https://picsum.photos/seed/place-grand-bazaar/800/500' WHERE PlaceID=49;
UPDATE Places SET Latitude=41.005400, Longitude=28.976800, UserRating=4.85, ReviewCount=89234,  OpeningTime='08:30', ClosingTime='18:30', AverageVisitMinutes=60,  BestTimeToVisit='Outside prayer times', ImageURL='https://picsum.photos/seed/place-blue-mosque/800/500' WHERE PlaceID=50;
UPDATE Places SET Latitude=41.008300, Longitude=28.977800, UserRating=4.40, ReviewCount=34532,  OpeningTime='09:00', ClosingTime='19:00', AverageVisitMinutes=60,  BestTimeToVisit='Morning', ImageURL='https://picsum.photos/seed/place-basilica-cistern/800/500' WHERE PlaceID=51;
UPDATE Places SET Latitude=41.026200, Longitude=28.973600, UserRating=4.50, ReviewCount=18765,  OpeningTime='10:00', ClosingTime='19:00', AverageVisitMinutes=120, BestTimeToVisit='Sunset cruise', ImageURL='https://picsum.photos/seed/place-bosphorus-cruise/800/500' WHERE PlaceID=52;
UPDATE Places SET Latitude=41.039300, Longitude=29.000100, UserRating=4.55, ReviewCount=23432,  OpeningTime='09:00', ClosingTime='17:00', AverageVisitMinutes=120, BestTimeToVisit='Morning', ImageURL='https://picsum.photos/seed/place-dolmabahce/800/500' WHERE PlaceID=53;
UPDATE Places SET Latitude=39.925300, Longitude=32.836700, UserRating=4.75, ReviewCount=21432,  OpeningTime='09:00', ClosingTime='17:00', AverageVisitMinutes=120, BestTimeToVisit='Morning', ImageURL='https://picsum.photos/seed/place-anitkabir/800/500' WHERE PlaceID=54;
UPDATE Places SET Latitude=39.940500, Longitude=32.862700, UserRating=4.60, ReviewCount=8765,   OpeningTime='08:30', ClosingTime='17:30', AverageVisitMinutes=120, BestTimeToVisit='Morning', ImageURL='https://picsum.photos/seed/place-anatolian-museum/800/500' WHERE PlaceID=55;
UPDATE Places SET Latitude=36.884100, Longitude=30.705600, UserRating=4.65, ReviewCount=23456,  OpeningTime='00:00', ClosingTime='23:59', AverageVisitMinutes=180, BestTimeToVisit='Late afternoon', ImageURL='https://picsum.photos/seed/place-antalya-oldtown/800/500' WHERE PlaceID=56;
UPDATE Places SET Latitude=36.853400, Longitude=30.787400, UserRating=4.55, ReviewCount=12345,  OpeningTime='08:00', ClosingTime='19:00', AverageVisitMinutes=90,  BestTimeToVisit='Morning', ImageURL='https://picsum.photos/seed/place-duden-falls/800/500' WHERE PlaceID=57;
UPDATE Places SET Latitude=36.886200, Longitude=30.689500, UserRating=4.50, ReviewCount=8765,   OpeningTime='09:00', ClosingTime='18:00', AverageVisitMinutes=120, BestTimeToVisit='Morning', ImageURL='https://picsum.photos/seed/place-antalya-museum/800/500' WHERE PlaceID=58;

-- UK Places
UPDATE Places SET Latitude=51.500700, Longitude=-0.124600, UserRating=4.70, ReviewCount=234567, OpeningTime='00:00', ClosingTime='23:59', AverageVisitMinutes=45,  BestTimeToVisit='Evening (illuminated)', ImageURL='https://picsum.photos/seed/place-westminster/800/500' WHERE PlaceID=59;
UPDATE Places SET Latitude=51.501400, Longitude=-0.141900, UserRating=4.55, ReviewCount=178432, OpeningTime='09:30', ClosingTime='19:00', AverageVisitMinutes=120, BestTimeToVisit='Morning (changing of guards)', ImageURL='https://picsum.photos/seed/place-buckingham/800/500' WHERE PlaceID=60;
UPDATE Places SET Latitude=51.508900, Longitude=-0.128400, UserRating=4.60, ReviewCount=156432, OpeningTime='10:00', ClosingTime='18:00', AverageVisitMinutes=180, BestTimeToVisit='Afternoon', ImageURL='https://picsum.photos/seed/place-national-gallery/800/500' WHERE PlaceID=61;
UPDATE Places SET Latitude=51.508100, Longitude=-0.076100, UserRating=4.65, ReviewCount=145678, OpeningTime='09:00', ClosingTime='17:30', AverageVisitMinutes=180, BestTimeToVisit='Morning', ImageURL='https://picsum.photos/seed/place-tower-london/800/500' WHERE PlaceID=62;
UPDATE Places SET Latitude=51.507300, Longitude=-0.165700, UserRating=4.70, ReviewCount=98432,  OpeningTime='05:00', ClosingTime='00:00', AverageVisitMinutes=120, BestTimeToVisit='Sunny day morning', ImageURL='https://picsum.photos/seed/place-hyde-park/800/500' WHERE PlaceID=63;
UPDATE Places SET Latitude=51.505500, Longitude=-0.075400, UserRating=4.55, ReviewCount=87654,  OpeningTime='09:30', ClosingTime='18:00', AverageVisitMinutes=60,  BestTimeToVisit='Sunset', ImageURL='https://picsum.photos/seed/place-tower-bridge/800/500' WHERE PlaceID=64;
UPDATE Places SET Latitude=51.507600, Longitude=-0.099500, UserRating=4.60, ReviewCount=76543,  OpeningTime='10:00', ClosingTime='18:00', AverageVisitMinutes=180, BestTimeToVisit='Weekday morning', ImageURL='https://picsum.photos/seed/place-tate-modern/800/500' WHERE PlaceID=65;
UPDATE Places SET Latitude=51.505400, Longitude=-0.090700, UserRating=4.70, ReviewCount=45678,  OpeningTime='08:00', ClosingTime='17:00', AverageVisitMinutes=120, BestTimeToVisit='Sat morning', ImageURL='https://picsum.photos/seed/place-borough-market/800/500' WHERE PlaceID=66;
UPDATE Places SET Latitude=55.948500, Longitude=-3.199700, UserRating=4.75, ReviewCount=89432,  OpeningTime='09:30', ClosingTime='18:00', AverageVisitMinutes=180, BestTimeToVisit='Morning', ImageURL='https://picsum.photos/seed/place-edinburgh-castle/800/500' WHERE PlaceID=67;
UPDATE Places SET Latitude=55.950400, Longitude=-3.190900, UserRating=4.65, ReviewCount=67432,  OpeningTime='00:00', ClosingTime='23:59', AverageVisitMinutes=120, BestTimeToVisit='Late afternoon', ImageURL='https://picsum.photos/seed/place-royal-mile/800/500' WHERE PlaceID=68;
UPDATE Places SET Latitude=55.944100, Longitude=-3.162000, UserRating=4.80, ReviewCount=34567,  OpeningTime='05:00', ClosingTime='22:00', AverageVisitMinutes=120, BestTimeToVisit='Sunrise', ImageURL='https://picsum.photos/seed/place-arthurs-seat/800/500' WHERE PlaceID=69;
UPDATE Places SET Latitude=55.946800, Longitude=-3.190100, UserRating=4.70, ReviewCount=23456,  OpeningTime='10:00', ClosingTime='17:00', AverageVisitMinutes=180, BestTimeToVisit='Rainy day', ImageURL='https://picsum.photos/seed/place-scottish-museum/800/500' WHERE PlaceID=70;
UPDATE Places SET Latitude=53.463100, Longitude=-2.291300, UserRating=4.70, ReviewCount=45678,  OpeningTime='09:30', ClosingTime='17:00', AverageVisitMinutes=180, BestTimeToVisit='Morning', ImageURL='https://picsum.photos/seed/place-mufc-museum/800/500' WHERE PlaceID=71;
UPDATE Places SET Latitude=53.482100, Longitude=-2.241700, UserRating=4.50, ReviewCount=12345,  OpeningTime='10:00', ClosingTime='17:00', AverageVisitMinutes=120, BestTimeToVisit='Afternoon', ImageURL='https://picsum.photos/seed/place-manchester-gallery/800/500' WHERE PlaceID=72;
UPDATE Places SET Latitude=53.481000, Longitude=-2.241400, UserRating=4.75, ReviewCount=9876,   OpeningTime='10:00', ClosingTime='17:00', AverageVisitMinutes=60,  BestTimeToVisit='Afternoon', ImageURL='https://picsum.photos/seed/place-john-rylands/800/500' WHERE PlaceID=73;

-- Thailand Places
UPDATE Places SET Latitude=13.751000, Longitude=100.491600, UserRating=4.70, ReviewCount=156432, OpeningTime='08:30', ClosingTime='15:30', AverageVisitMinutes=180, BestTimeToVisit='Early morning', ImageURL='https://picsum.photos/seed/place-grand-palace/800/500' WHERE PlaceID=74;
UPDATE Places SET Latitude=13.746400, Longitude=100.493200, UserRating=4.75, ReviewCount=98765,  OpeningTime='08:00', ClosingTime='18:30', AverageVisitMinutes=90,  BestTimeToVisit='Morning', ImageURL='https://picsum.photos/seed/place-wat-pho/800/500' WHERE PlaceID=75;
UPDATE Places SET Latitude=13.749100, Longitude=100.502700, UserRating=4.65, ReviewCount=45678,  OpeningTime='16:00', ClosingTime='22:00', AverageVisitMinutes=120, BestTimeToVisit='Sunset', ImageURL='https://picsum.photos/seed/place-chao-phraya/800/500' WHERE PlaceID=76;
UPDATE Places SET Latitude=13.799600, Longitude=100.550200, UserRating=4.50, ReviewCount=78432,  OpeningTime='09:00', ClosingTime='18:00', AverageVisitMinutes=240, BestTimeToVisit='Sat/Sun morning', ImageURL='https://picsum.photos/seed/place-chatuchak/800/500' WHERE PlaceID=77;
UPDATE Places SET Latitude=13.730400, Longitude=100.541000, UserRating=4.60, ReviewCount=23456,  OpeningTime='04:30', ClosingTime='21:00', AverageVisitMinutes=120, BestTimeToVisit='Early morning', ImageURL='https://picsum.photos/seed/place-lumpini/800/500' WHERE PlaceID=78;
UPDATE Places SET Latitude=13.723400, Longitude=100.516100, UserRating=4.55, ReviewCount=34567,  OpeningTime='17:00', ClosingTime='01:00', AverageVisitMinutes=120, BestTimeToVisit='Sunset', ImageURL='https://picsum.photos/seed/place-sky-bar/800/500' WHERE PlaceID=79;
UPDATE Places SET Latitude=18.804500, Longitude=98.921800, UserRating=4.70, ReviewCount=45678,  OpeningTime='06:00', ClosingTime='18:00', AverageVisitMinutes=180, BestTimeToVisit='Morning', ImageURL='https://picsum.photos/seed/place-doi-suthep/800/500' WHERE PlaceID=80;
UPDATE Places SET Latitude=18.789100, Longitude=98.985200, UserRating=4.60, ReviewCount=23456,  OpeningTime='17:00', ClosingTime='23:00', AverageVisitMinutes=180, BestTimeToVisit='Sun evening', ImageURL='https://picsum.photos/seed/place-sunday-market/800/500' WHERE PlaceID=81;
UPDATE Places SET Latitude=19.150500, Longitude=98.852300, UserRating=4.85, ReviewCount=18765,  OpeningTime='08:00', ClosingTime='17:00', AverageVisitMinutes=480, BestTimeToVisit='Full day', ImageURL='https://picsum.photos/seed/place-elephant-park/800/500' WHERE PlaceID=82;
UPDATE Places SET Latitude=7.731900, Longitude=98.770200, UserRating=4.80, ReviewCount=67432,   OpeningTime='07:00', ClosingTime='17:00', AverageVisitMinutes=480, BestTimeToVisit='Early morning departure', ImageURL='https://picsum.photos/seed/place-phi-phi/800/500' WHERE PlaceID=83;
UPDATE Places SET Latitude=7.827400, Longitude=98.310000, UserRating=4.60, ReviewCount=23456,   OpeningTime='06:00', ClosingTime='19:30', AverageVisitMinutes=90,  BestTimeToVisit='Sunset', ImageURL='https://picsum.photos/seed/place-big-buddha/800/500' WHERE PlaceID=84;
UPDATE Places SET Latitude=7.884600, Longitude=98.389000, UserRating=4.55, ReviewCount=12345,   OpeningTime='00:00', ClosingTime='23:59', AverageVisitMinutes=120, BestTimeToVisit='Late afternoon', ImageURL='https://picsum.photos/seed/place-old-phuket/800/500' WHERE PlaceID=85;
GO

-- Compute GEOGRAPHY for every place
UPDATE Places
SET    GeoLocation = geography::Point(Latitude, Longitude, 4326)
WHERE  Latitude IS NOT NULL;
GO

PRINT '✔ Places enriched.';
PRINT '── Verification ────────────────────────────';
SELECT 'Locations' AS Tbl, COUNT(*) AS Total, COUNT(GeoLocation) AS WithCoords FROM Locations
UNION ALL
SELECT 'Hotels',          COUNT(*),         COUNT(GeoLocation) FROM Hotels
UNION ALL
SELECT 'Places',          COUNT(*),         COUNT(GeoLocation) FROM Places;
GO

PRINT '✔ Data enrichment complete.';
PRINT '  Next:  run 07_SpatialProcedures.sql';
GO
