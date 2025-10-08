using PowerCalc.Models;

namespace PowerCalc.Services.Abstractions
{
    public interface IProgramService
    {
        List<TrainingProgram> GetAllPrograms();
        TrainingProgram? GetProgram(string name);
        WorkoutDay? GetWorkout(string programName, int week, int day);
        CalculatedWorkout CalculatedWorkout(string programName, int week, int day, Lifter lifter);
        void CreateProgram(TrainingProgram program);
        void UpdateProgram(string name, TrainingProgram program);
        void DeleteProgram(string name);
    }
}
