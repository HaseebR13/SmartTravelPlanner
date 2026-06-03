namespace SmartTravelAPI.Models;

public class DayPlan
{
    public int DayPlanID { get; set; }
    public int PlanID { get; set; }
    public int DayNumber { get; set; }
    public int? HotelID { get; set; }
    public Hotel? Hotel { get; set; }
    public decimal DayCost { get; set; }
    public List<Place> Places { get; set; } = [];
}