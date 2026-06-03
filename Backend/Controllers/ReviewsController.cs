using Microsoft.AspNetCore.Mvc;
using SmartTravelAPI.Data;
using SmartTravelAPI.Models;

namespace SmartTravelAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReviewsController(ReviewRepository repo) : ControllerBase
{
    [HttpGet("hotel/{id}")]
    public async Task<IActionResult> GetForHotel(int id)
        => Ok(await repo.GetForHotelAsync(id));

    [HttpGet("place/{id}")]
    public async Task<IActionResult> GetForPlace(int id)
        => Ok(await repo.GetForPlaceAsync(id));

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] Review review)
    {
        if (review.Stars < 1 || review.Stars > 5)
            return BadRequest(new { message = "Stars must be 1–5." });
        if (string.IsNullOrWhiteSpace(review.AuthorName))
            return BadRequest(new { message = "Author name is required." });
        if (review.HotelID is null && review.PlaceID is null)
            return BadRequest(new { message = "Review must target a HotelID or PlaceID." });

        var id = await repo.CreateAsync(review);
        review.ReviewID = id;
        review.CreatedAt = DateTime.UtcNow;
        return CreatedAtAction(nameof(GetForHotel), new { id = review.HotelID ?? review.PlaceID }, review);
    }
}
