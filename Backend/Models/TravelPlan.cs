namespace SmartTravelAPI.Models;

public class TravelPlan
{
    public int PlanID { get; set; }
    public string UserName { get; set; } = string.Empty;
    public int Members { get; set; }
    public int FromLocationID { get; set; }
    public int ToLocationID { get; set; }
    public string FromCity { get; set; } = string.Empty;
    public string ToCity { get; set; } = string.Empty;
    public string FromName { get; set; } = string.Empty;
    public string ToName { get; set; } = string.Empty;
    public int TotalDays { get; set; }
    public decimal TotalBudget { get; set; }
    public string TravelMode { get; set; } = string.Empty;
    public string Module { get; set; } = string.Empty;
    public string CountryName { get; set; } = string.Empty;
    public decimal TravelCost { get; set; }
    public decimal HotelCost { get; set; }
    public decimal PlacesCost { get; set; }
    public DateTime CreatedAt { get; set; }
    public List<DayPlan> DayPlans { get; set; } = [];
    public RouteInfo? Route { get; set; }
}