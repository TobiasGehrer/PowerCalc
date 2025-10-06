namespace PowerCalc.Models
{
    public class SessionRequest
    {
        public string ProgramName { get; set; } = string.Empty;
        public int Week { get; set; }
        public int Day { get; set; }
        public List<string> LifterNames { get; set; } = new();
    }
}
