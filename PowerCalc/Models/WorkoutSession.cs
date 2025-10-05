namespace PowerCalc.Models
{
    public class WorkoutSession
    {
        public int Week { get; set; }
        public int Day { get; set; }
        public string ProgramName { get; set; } = string.Empty;
        public List<string> PresentLifters { get; set; } = new();
        public List<CalculatedWorkout> Workouts { get; set; } = new();
    }
}
