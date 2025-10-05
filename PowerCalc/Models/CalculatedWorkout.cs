namespace PowerCalc.Models
{
    public class CalculatedWorkout
    {
        public int Week { get; set; }
        public int Day { get; set; }
        public string LifterName { get; set; } = string.Empty;
        public List<CalculatedExercise> Exercises { get; set; } = new();
    }
}
