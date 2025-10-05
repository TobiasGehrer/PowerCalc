namespace PowerCalc.Models
{
    public class TrainingProgram
    {
        public string Name { get; set; } = string.Empty;
        public int Weeks { get; set; }
        public int Days { get; set; }
        public List<WorkoutDay> Workouts { get; set; } = new();
    }
}
