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
                    LiftType = exercise.LiftType
                };

                // Parse sets: "1/2" or "3"
                var setCountsStr = exercise.Sets.Split('/');
                var setCounts = new List<int>();
                foreach (var s in setCountsStr)
                {
                    if (int.TryParse(s, out var count))
                        setCounts.Add(count);
                }

                // If single number, treat as one group
                if (setCounts.Count == 0)
                    setCounts.Add(int.TryParse(exercise.Sets, out var c) ? c : 1);

                // Parse intensity: "81/76" or "70"
                var intensitiesStr = exercise.Intensity.Split('/');
                var intensities = new List<decimal>();
                foreach (var i in intensitiesStr)
                {
                    if (decimal.TryParse(i, out var intensity))
                        intensities.Add(intensity);
                }

                if (intensities.Count == 0)
                    intensities.Add(70);

                // Generate sets
                int setNumber = 1;
                for (int i = 0; i < setCounts.Count; i++)
                {
                    var intensity = i < intensities.Count ? intensities[i] : intensities[0];
                    var weight = CalculateWeight(lifter, exercise.LiftType, intensity);

                    for (int j = 0; j < setCounts[i]; j++)
                    {
                        calcEx.Sets.Add(new SetInfo
                        {
                            SetNumber = setNumber++,
                            Reps = exercise.Reps,
                            Weight = weight
                        });
                    }
                }

                calculated.Exercises.Add(calcEx);
            }

            return calculated;
        }

        private decimal CalculateWeight(Lifter lifter, string liftType, decimal intensity)
        {
            var baseLiftType = GetBaseLiftType(liftType);

            if (!lifter.OneRepMaxes.TryGetValue(baseLiftType, out var max))
            {
                return 0;
            }

            // Handle pause variations (95% of main lift)
            if (liftType.StartsWith("pause"))
            {
                max *= 0.95m;
            }

            var weight = max * intensity / 100m;
            // Round to nearest 2.5kg
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
