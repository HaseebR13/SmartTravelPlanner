namespace SmartTravelAPI.Models;

// A single travel tip displayed in the Smart Tips section. Grouped by Category
// (e.g. "Safety", "Money", "Packing") so the UI can filter.
public class Tip
{
    public int    TipID    { get; set; }
    public string Category { get; set; } = "General";
    public string Icon     { get; set; } = "💡";
    public string Title    { get; set; } = string.Empty;
    public string Body     { get; set; } = string.Empty;
    public int    Priority { get; set; } = 50; // higher = surfaced first
}
