using Microsoft.AspNetCore.Mvc;
using SmartTravelAPI.Data;

namespace SmartTravelAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TipsController(TipRepository repo) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] string? category = null)
        => Ok(await repo.GetAllAsync(category));

    [HttpGet("categories")]
    public async Task<IActionResult> GetCategories()
        => Ok(await repo.GetCategoriesAsync());
}
