using PowerCalc.Models;

namespace PowerCalc.Services.Abstractions
{
    public interface IProgramService
    {
        WorkoutDay GetWorkout(int week, int day);
        CalculatedWorkout GetCalculatedWorkout(int week, int day, string lifterName);
    }
}
