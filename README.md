# SmartTravelPlanner

SmartTravelPlanner is a 2nd semester group project designed to help users explore destinations, hotels, routes, weather, travel tips, reviews, favourites, and day-wise travel plans.

The system is built with a separate frontend, backend, and database structure. It uses a modern web interface with a backend API and SQL Server database scripts.

## Features

* View destinations and travel locations
* Search hotels and places
* Generate travel plans
* Manage favourite locations
* View routes and travel information
* Check weather information
* Add and view reviews
* View travel tips
* SQL database with stored procedures and seed data
* Spatial/geographic support for better location-based planning

## Tech Stack

### Frontend

* React
* Vite
* JavaScript
* Axios
* Leaflet / Maps support
* CSS

### Backend

* ASP.NET Core Web API
* C#
* .NET 8
* Repository pattern
* REST API controllers

### Database

* SQL Server
* Stored Procedures
* Spatial columns
* Seed data scripts

## Project Structure

```text
SmartTravelPlanner/
│
├── Backend/
│   ├── Controllers/
│   ├── Data/
│   ├── DTOs/
│   ├── Models/
│   ├── Services/
│   ├── Program.cs
│   └── SmartTravelAPI.csproj
│
├── Frontend/
│   ├── src/
│   ├── package.json
│   └── vite-project/
│
├── Database/
│   ├── 00_CleanReset.sql
│   ├── 01_CreateDatabase.sql
│   ├── 02_Schema.sql
│   ├── 03_SeedData.sql
│   └── Other database scripts
│
├── Docs/
├── README.md
└── WHATS_NEW.md
```

## How to Run the Project

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/SmartTravelPlanner.git
cd SmartTravelPlanner
```

### 2. Setup the Database

Open SQL Server Management Studio and run the SQL scripts from the `Database` folder in order.

Recommended order:

```text
00_CleanReset.sql
01_CreateDatabase.sql
02_Schema.sql
03_SeedData.sql
04_StoredProcedures.sql
05_AddSpatialColumns.sql
06_EnrichData.sql
07_SpatialProcedures.sql
```

After running the scripts, update the database connection string in the backend if needed.

### 3. Run the Backend

```bash
cd Backend
dotnet restore
dotnet run
```

The backend API will start locally.

### 4. Run the Frontend

Open another terminal:

```bash
cd Frontend
npm install
npm run dev
```

Then open the local frontend URL shown in the terminal.

## Main Backend Modules

* Destinations Controller
* Hotels Controller
* Locations Controller
* Plans Controller
* Routes Controller
* Weather Controller
* Reviews Controller
* Favourites Controller
* Tips Controller

## Team

This project was created as a 2nd semester group project.

## Notes

Do not upload unnecessary generated folders such as:

```text
node_modules/
bin/
obj/
.vs/
```

These folders should be ignored using `.gitignore`.
