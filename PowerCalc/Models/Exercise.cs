namespace PowerCalc.Models
{
    public class Exercise
    {
        public string Name { get; set; } = string.Empty;
        public string Sets { get; set; } = string.Empty;
        public string Reps { get; set; } = string.Empty;
        public string Intensity { get; set; } = string.Empty;
        public int RestSeconds { get; set; }
        public string LiftType { get; set; } = string.Empty;
        public string? Note { get; set; }
    }
}
