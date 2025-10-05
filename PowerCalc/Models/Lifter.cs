namespace PowerCalc.Models
{
    public class Lifter
    {
        public string Name { get; set; } = string.Empty;
        public Dictionary<string, decimal> OneRepMaxes { get; set; } = new();
    }

    public class LiftersConfiguration
    {
        public List<Lifter> Lifters { get; set; } = new();
    }
}
