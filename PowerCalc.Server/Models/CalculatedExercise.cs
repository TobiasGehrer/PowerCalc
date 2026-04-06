namespace PowerCalc.Models
{
    public class CalculatedExercise : Exercise
    {
        public List<SetInfo> Sets { get; set; } = new();
    }
}
