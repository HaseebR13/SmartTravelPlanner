namespace SmartTravelAPI.DTOs;

public class GeneratePlanRequest
{
    public string UserName { get; set; } = string.Empty;
    public int Members { get; set; } = 1;
    public decimal TotalBudget { get; set; }
    public int FromLocationID { get; set; }
    public int ToLocationID { get; set; }
    public int Days { get; set; }
    public string TravelMode { get; set; } = string.Empty;
    public string Module { get; set; } = "Pakistan";
    public string CountryCode { get; set; } = "PK";
    public string CountryName { get; set; } = "Pakistan";
}