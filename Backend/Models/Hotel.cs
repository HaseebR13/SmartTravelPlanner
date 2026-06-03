namespace SmartTravelAPI.Models;

public class Hotel
{
    public int HotelID { get; set; }
    public int LocationID { get; set; }
    public string Name { get; set; } = string.Empty;
    public decimal PricePerNight { get; set; }
    public int StarRating { get; set; }
    public string Description { get; set; } = string.Empty;
    public string Amenities { get; set; } = string.Empty;
}