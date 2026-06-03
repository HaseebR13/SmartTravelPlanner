namespace SmartTravelAPI.Models;

public class Place
{
    public int PlaceID { get; set; }
    public int LocationID { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public decimal EntryFee { get; set; }
    public string Description { get; set; } = string.Empty;
}