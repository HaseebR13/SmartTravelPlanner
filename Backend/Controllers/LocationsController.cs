using Microsoft.AspNetCore.Mvc;
using SmartTravelAPI.Data;

namespace SmartTravelAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LocationsController(LocationRepository repo) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetLocations([FromQuery] string countryCode = "PK")
    {
        var locations = await repo.GetByCountryAsync(countryCode);
        return Ok(locations);
    }

    [HttpGet("countries")]
    public async Task<IActionResult> GetCountries()
    {
        var countries = await repo.GetAllCountriesAsync();
        return Ok(countries);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetLocation(int id)
    {
        var loc = await repo.GetByIdAsync(id);
        return loc is null ? NotFound() : Ok(loc);
    }
}