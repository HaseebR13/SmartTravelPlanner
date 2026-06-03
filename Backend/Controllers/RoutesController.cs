using Microsoft.AspNetCore.Mvc;
using SmartTravelAPI.Data;

namespace SmartTravelAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RoutesController(RouteRepository repo) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetRoute(
        [FromQuery] int from,
        [FromQuery] int to,
        [FromQuery] string mode)
    {
        var route = await repo.GetRouteAsync(from, to, mode);
        return route is null ? NotFound(new { message = "No route found" }) : Ok(route);
    }

    [HttpGet("modes")]
    public async Task<IActionResult> GetModes([FromQuery] int from, [FromQuery] int to)
    {
        var modes = await repo.GetAvailableModesAsync(from, to);
        return Ok(modes);
    }
}