namespace PowerCalc.Models
{
    public class WorkoutDay
    {
        public int Week { get; set; }
        public int Day { get; set; }
        public string LifterName { get; set; } = string.Empty;
        public List<Exercise> Exercises { get; set; } = new();
    }

    public class CalculatedExercise : Exercise
    {
        public string Weight { get; set; } = string.Empty;
    }

    public class CalculatedWorkout
    {
        public int Week { get; set; }
        public int Day { get; set; }
        public string LifterName { get; set; } = string.Empty;
        public List<CalculatedExercise> Exercises { get; set; } = new();
    }
}
