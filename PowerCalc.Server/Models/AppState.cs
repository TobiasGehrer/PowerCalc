namespace PowerCalc.Models
{
    public class AppState
    {
        public string CurrentProgram { get; set; } = string.Empty;
        public int CurrentWeek { get; set; }
        public int CurrentDay { get; set; }
        public List<string> SelectedLifters { get; set; } = new List<string>();
    }
}
