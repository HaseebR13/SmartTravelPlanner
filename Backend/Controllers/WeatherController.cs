using Microsoft.AspNetCore.Mvc;
using SmartTravelAPI.Data;

namespace SmartTravelAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class WeatherController(WeatherRepository repo) : ControllerBase
{
    [HttpGet("{locationId}")]
    public async Task<IActionResult> GetForLocation(int locationId)
        => Ok(await repo.GetForLocationAsync(locationId));

    [HttpGet("{locationId}/best-time")]
    public async Task<IActionResult> GetBestTime(int locationId)
        => Ok(await repo.GetBestTimeAsync(locationId));
}
