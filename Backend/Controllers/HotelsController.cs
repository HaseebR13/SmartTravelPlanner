using Microsoft.AspNetCore.Mvc;
using SmartTravelAPI.Data;

namespace SmartTravelAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HotelsController(HotelRepository repo) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetHotels(
        [FromQuery] int locationId,
        [FromQuery] decimal maxPrice = 999999)
    {
        var hotels = await repo.GetByBudgetAsync(locationId, maxPrice);
        return Ok(hotels);
    }
}