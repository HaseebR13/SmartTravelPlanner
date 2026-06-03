using Microsoft.Data.SqlClient;
using SmartTravelAPI.Data;
using SmartTravelAPI.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new() { Title = "SmartTravel API", Version = "v1" });
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact", policy =>
        policy.WithOrigins("http://localhost:5173", "http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod());
});

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")!;
builder.Services.AddScoped(_ => new SqlConnection(connectionString));

// Existing repositories — keep untouched
builder.Services.AddScoped<LocationRepository>();
builder.Services.AddScoped<RouteRepository>();
builder.Services.AddScoped<HotelRepository>();
builder.Services.AddScoped<PlaceRepository>();
builder.Services.AddScoped<PlanRepository>();
builder.Services.AddScoped<ItineraryService>();

// NEW repositories for the new modules
builder.Services.AddScoped<DestinationRepository>();
builder.Services.AddScoped<ReviewRepository>();
builder.Services.AddScoped<TipRepository>();
builder.Services.AddScoped<WeatherRepository>();
builder.Services.AddScoped<FavouriteRepository>();

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();
app.UseCors("AllowReact");
app.UseAuthorization();
app.MapControllers();
app.Run("http://localhost:5000");
