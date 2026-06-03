namespace SmartTravelAPI.Models;

// Review for either a Hotel or a Place. EXACTLY one of HotelID/PlaceID is set.
public class Review
{
    public int      ReviewID   { get; set; }
    public int?     HotelID    { get; set; }
    public int?     PlaceID    { get; set; }
    public string   AuthorName { get; set; } = string.Empty;
    public int      Stars      { get; set; }
    public string   Title      { get; set; } = string.Empty;
    public string   Body       { get; set; } = string.Empty;
    public DateTime CreatedAt  { get; set; }
}
