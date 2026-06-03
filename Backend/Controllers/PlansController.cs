using Microsoft.AspNetCore.Mvc;
using SmartTravelAPI.Data;
using SmartTravelAPI.DTOs;
using SmartTravelAPI.Services;

namespace SmartTravelAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PlansController(PlanRepository planRepo, ItineraryService itineraryService) : ControllerBase
{
    [HttpPost("generate")]
    public async Task<IActionResult> Generate([FromBody] GeneratePlanRequest request)
    {
        try
        {
            var plan = await itineraryService.GenerateAndSaveAsync(request);
            return Ok(plan);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var plans = await planRepo.GetAllPlansAsync();
        return Ok(plans);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var plan = await planRepo.GetPlanByIdAsync(id);
        return plan is null ? NotFound() : Ok(plan);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await planRepo.DeletePlanAsync(id);
        return deleted ? Ok(new { message = "Plan deleted" }) : NotFound();
    }
}