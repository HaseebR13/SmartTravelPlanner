using Microsoft.AspNetCore.Mvc;
using SmartTravelAPI.Data;
using SmartTravelAPI.Models;

namespace SmartTravelAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FavouritesController(FavouriteRepository repo) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetByUser([FromQuery] string user)
    {
        if (string.IsNullOrWhiteSpace(user))
            return BadRequest(new { message = "user query is required." });
        return Ok(await repo.GetByUserAsync(user));
    }

    [HttpPost]
    public async Task<IActionResult> Add([FromBody] Favourite fav)
    {
        if (string.IsNullOrWhiteSpace(fav.UserName))
            return BadRequest(new { message = "UserName is required." });
        if (fav.DestinationID is null && fav.HotelID is null && fav.PlaceID is null)
            return BadRequest(new { message = "Favourite must target a destination, hotel, or place." });

        var id = await repo.AddAsync(fav);
        fav.FavouriteID = id;
        fav.CreatedAt = DateTime.UtcNow;
        return Ok(fav);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Remove(int id)
    {
        var ok = await repo.RemoveAsync(id);
        return ok ? Ok(new { message = "Removed" }) : NotFound();
    }
}
