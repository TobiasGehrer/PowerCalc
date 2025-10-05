using PowerCalc.Models;
using PowerCalc.Services.Abstractions;
using System.Text.Json;

namespace PowerCalc.Services
{
    public class ProgramService : IProgramService
    {
        private readonly string _configPath;

        public ProgramService(IConfiguration configuration, IWebHostEnvironment env)
        {
            var relativePath = configuration["ConfigurationPaths:Programs"] ?? "Configuration/programs.json";
            _configPath = Path.Combine(env.ContentRootPath, relativePath);
        }

        public List<TrainingProgram> GetAllPrograms()
        {
            var data = LoadConfig();
            return data.Programs;
        }

        public TrainingProgram? GetProgram(string name)
        {
            var programs = GetAllPrograms();
            return programs.FirstOrDefault(p => p.Name.Equals(name, StringComparison.OrdinalIgnoreCase));
        }

        public WorkoutDay? GetWorkout(string programName, int week, int day)
        {
            var program = GetProgram(programName);
            return program?.Workouts.FirstOrDefault(w => w.Week == week && w.Day == day);
        }

        public CalculatedWorkout CalculatedWorkout(string programName, int week, int day, Lifter lifter)
        {
            var workout = GetWorkout(programName, week, day);

            if (workout == null)
            {
                throw new KeyNotFoundException($"Workout not found for {programName}, Week {week}, Day {day}");
            }

            var calculated = new CalculatedWorkout
            {
                Week = week,
                Day = day,
                LifterName = lifter.Name,
                Exercises = new List<CalculatedExercise>()
            };

            foreach (var exercise in workout.Exercises)
            {
                var calcEx = new CalculatedExercise
                {
                    Name = exercise.Name,                    
                    Reps = exercise.Reps,
                    Intensity = exercise.Intensity,
                    RestSeconds = exercise.RestSeconds,
                    LiftType = exercise.LiftType,
                    Note = exercise.Note,
                    
                };

                // Calculate sets
                int setCount = int.TryParse(exercise.Sets.Split('+')[0], out var count) ? count : 1;

                for (int i = 1; i <= setCount; i++)
                {
                    var weight = CalculateWeight(exercise, lifter);
                    calcEx.Sets.Add(new SetInfo
                    {
                        SetNumber = i,
                        Reps = exercise.Reps,
                        Weight = weight
                    });
                }

                calculated.Exercises.Add(calcEx);
            }

            return calculated;
        }

        private decimal CalculateWeight(Exercise exercise, Lifter lifter)
        {
            var liftType = GetBaseLiftType(exercise.LiftType);

            if (!lifter.OneRepMaxes.TryGetValue(liftType, out var max))
            {
                return 0;
            }

            // Handle pause variations (95% of main lift)
            if (exercise.LiftType.StartsWith("pause"))
            {
                max *= 0.95m;            
            }

            // Handle dual intensity (take first value)
            var intensityStr = exercise.Intensity.Contains('/') ? exercise.Intensity.Split('/')[0] : exercise.Intensity;

            var intesity = decimal.Parse(intensityStr);
            var weight = max * intesity / 100m;
            // ROund to nearest 2.5kg
            return Math.Round(weight / 2.5m) * 2.5m;
        }
        
        private string GetBaseLiftType(string liftType)
        {
            return liftType switch
            {
                "pauseSquat" => "squat",
                "pauseBench" => "bench",
                "pauseDeadlift" => "deadlift",
                _ => liftType
            };
        }

        private ProgramConfig LoadConfig()
        {
            if (!File.Exists(_configPath))
            {
                return new ProgramConfig();
            }

            var json = File.ReadAllText(_configPath);
            return JsonSerializer.Deserialize<ProgramConfig>(json, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true,               
            }) ?? new ProgramConfig();
        }

        private class ProgramConfig
        {
            public List<TrainingProgram> Programs { get; set; } = new();
        }
    }
}
