using Microsoft.AspNetCore.Mvc;
using SmartTravelAPI.Data;

namespace SmartTravelAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DestinationsController(DestinationRepository repo) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] string? badge = null)
        => Ok(await repo.GetAllAsync(badge));

    [HttpGet("trending")]
    public async Task<IActionResult> GetTrending()
        => Ok(await repo.GetTrendingAsync());

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var d = await repo.GetByIdAsync(id);
        return d is null ? NotFound() : Ok(d);
    }
}
