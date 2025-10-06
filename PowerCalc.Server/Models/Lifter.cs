namespace PowerCalc.Models
{
    public class Lifter
    {
        public string Name { get; set; } = string.Empty;
        public Dictionary<string, decimal> OneRepMaxes { get; set; } = new();
    }
}
