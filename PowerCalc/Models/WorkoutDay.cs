namespace PowerCalc.Models
{
    public class WorkoutDay
    {
        public int Week { get; set; }
        public int Day { get; set; }
        public List<Exercise> Exercises { get; set; } = new();
    }
}
