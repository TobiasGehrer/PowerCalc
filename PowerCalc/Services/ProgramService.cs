using PowerCalc.Models;
using PowerCalc.Services.Abstractions;

namespace PowerCalc.Services
{
    public class ProgramService : IProgramService
    {
        private readonly ILifterService _lifterService;
        private readonly Dictionary<(int week, int day), WorkoutDay> _program;

        public ProgramService(ILifterService lifterService)
        {
            _lifterService = lifterService;
            _program = InitializeProgram();            
        }

        public WorkoutDay GetWorkout(int week, int day)
        {
            if (_program.TryGetValue((week, day), out var workoutDay))
            {
                return workoutDay;
            }

            throw new KeyNotFoundException($"Workout for week {week}, day {day} not found.");
        }

        public CalculatedWorkout GetCalculatedWorkout(int week, int day, string lifterName)
        {
            var workout = GetWorkout(week, day);
            var lifter = _lifterService.GetLifter(lifterName);

            if (lifter == null)
            {
                throw new KeyNotFoundException($"Lifter '{lifterName}' not found.");
            }

            var calculated = new CalculatedWorkout
            {
                Week = week,
                Day = day,
                LifterName = lifterName,
                Exercises = new List<CalculatedExercise>()
            };

            foreach (var exercise in workout.Exercises)
            {
                var calcEx = new CalculatedExercise
                {
                    Name = exercise.Name,
                    Sets = exercise.Sets,
                    Reps = exercise.Reps,
                    Intensity = exercise.Intensity,
                    RestSeconds = exercise.RestSeconds,
                    LiftType = exercise.LiftType,
                    Note = exercise.Note,
                    Weight = CalculateWeight(exercise, lifter)
                };

                calculated.Exercises.Add(calcEx);
            }

            return calculated;
        }

        private string CalculateWeight(Exercise exercise, Lifter lifter)
        {
            var liftType = GetBaseLiftType(exercise.LiftType);

            if (!lifter.OneRepMaxes.TryGetValue(liftType, out var max))
            {
                return "-";
            }

            // Handle pause variations (95% of main lift)
            if (exercise.LiftType.StartsWith("pause"))
            {
                max *= 0.95m;            
            }

            // Handle dual intensity ((e.g., "81/76)
            if (exercise.Intensity.Contains('/'))
            {
                var intensities = exercise.Intensity.Split('/');
                var weight1 = Math.Round(max * decimal.Parse(intensities[0]) / 100m * 2m) / 2m;
                var weight2 = Math.Round(max * decimal.Parse(intensities[1]) / 100m * 2m) / 2m;
                return $"{weight1} / {weight2}";
            }

            var intesity = decimal.Parse(exercise.Intensity);
            var weight = Math.Round(max * intesity / 100m * 2m) / 2m;
            return weight.ToString("0.#");
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

        private Dictionary<(int, int), WorkoutDay> InitializeProgram()
        {
            var program = new Dictionary<(int, int), WorkoutDay>();

            // Week 1 - Days 1, 2, 3
            program[(1, 1)] = new WorkoutDay
            {
                Week = 1,
                Day = 1,
                Exercises = new List<Exercise>
            {
                new() { Name = "Squat", Sets = "3", Reps = "4", Intensity = "78", RestSeconds = 180, LiftType = "squat" },
                new() { Name = "Squat (Volume)", Sets = "3", Reps = "6", Intensity = "65", RestSeconds = 180, LiftType = "squat" },
                new() { Name = "Bench Press", Sets = "4", Reps = "4", Intensity = "78", RestSeconds = 180, LiftType = "bench" },
                new() { Name = "Bench Press (Volume)", Sets = "3", Reps = "6", Intensity = "65", RestSeconds = 180, LiftType = "bench" },
                new() { Name = "Biceps Curls", Sets = "2", Reps = "8-12", Intensity = "70", RestSeconds = 90, LiftType = "curl" }
            }
            };

            program[(1, 2)] = new WorkoutDay
            {
                Week = 1,
                Day = 2,
                Exercises = new List<Exercise>
            {
                new() { Name = "Deadlift", Sets = "3", Reps = "4", Intensity = "78", RestSeconds = 180, LiftType = "deadlift" },
                new() { Name = "Deadlift (Volume)", Sets = "3", Reps = "6", Intensity = "65", RestSeconds = 180, LiftType = "deadlift" },
                new() { Name = "Pause Bench Press", Sets = "3", Reps = "5", Intensity = "76", RestSeconds = 180, LiftType = "pauseBench" },
                new() { Name = "Crunches", Sets = "2", Reps = "8-12", Intensity = "70", RestSeconds = 90, LiftType = "crunch" },
                new() { Name = "Triceps Pushdown", Sets = "2", Reps = "8-12", Intensity = "70", RestSeconds = 90, LiftType = "triceps" }
            }
            };

            program[(1, 3)] = new WorkoutDay
            {
                Week = 1,
                Day = 3,
                Exercises = new List<Exercise>
            {
                new() { Name = "Squat", Sets = "3", Reps = "6", Intensity = "65", RestSeconds = 180, LiftType = "squat" },
                new() { Name = "Romanian Deadlift", Sets = "4", Reps = "9", Intensity = "71", RestSeconds = 90, LiftType = "rdl" },
                new() { Name = "Row", Sets = "4", Reps = "10", Intensity = "70", RestSeconds = 90, LiftType = "row" },
                new() { Name = "Overhead Press", Sets = "3", Reps = "8-12", Intensity = "70", RestSeconds = 90, LiftType = "ohp" },
                new() { Name = "Calf Raises", Sets = "2", Reps = "8-12", Intensity = "70", RestSeconds = 90, LiftType = "calf" }
            }
            };

            // Week 2 - Days 4, 5, 6
            program[(2, 1)] = new WorkoutDay
            {
                Week = 2,
                Day = 4,
                Exercises = new List<Exercise>
            {
                new() { Name = "Pause Squat", Sets = "4", Reps = "5", Intensity = "76", RestSeconds = 180, LiftType = "pauseSquat" },
                new() { Name = "Bench Press", Sets = "6", Reps = "6", Intensity = "68", RestSeconds = 180, LiftType = "bench" },
                new() { Name = "Row", Sets = "4", Reps = "10", Intensity = "70", RestSeconds = 90, LiftType = "row" },
                new() { Name = "Biceps Curls", Sets = "2", Reps = "8-12", Intensity = "70", RestSeconds = 90, LiftType = "curl" }
            }
            };

            program[(2, 2)] = new WorkoutDay
            {
                Week = 2,
                Day = 5,
                Exercises = new List<Exercise>
            {
                new() { Name = "Pause Deadlift", Sets = "4", Reps = "5", Intensity = "76", RestSeconds = 180, LiftType = "pauseDeadlift" },
                new() { Name = "Bench Press", Sets = "4", Reps = "8", Intensity = "68", RestSeconds = 180, LiftType = "bench" },
                new() { Name = "Row", Sets = "4", Reps = "10", Intensity = "70", RestSeconds = 90, LiftType = "row" },
                new() { Name = "Triceps Pushdown", Sets = "2", Reps = "8-12", Intensity = "70", RestSeconds = 90, LiftType = "triceps" }
            }
            };

            program[(2, 3)] = new WorkoutDay
            {
                Week = 2,
                Day = 6,
                Exercises = new List<Exercise>
            {
                new() { Name = "Deadlift", Sets = "3", Reps = "6", Intensity = "65", RestSeconds = 180, LiftType = "deadlift" },
                new() { Name = "Overhead Press", Sets = "4", Reps = "8", Intensity = "68", RestSeconds = 90, LiftType = "ohp" },
                new() { Name = "Row", Sets = "6", Reps = "10", Intensity = "70", RestSeconds = 90, LiftType = "row" },
                new() { Name = "Overhead Press", Sets = "2", Reps = "8-12", Intensity = "70", RestSeconds = 90, LiftType = "ohp" },
                new() { Name = "Calf Raises", Sets = "2", Reps = "8-12", Intensity = "70", RestSeconds = 90, LiftType = "calf" }
            }
            };

            // Add remaining weeks 3-12 following the same pattern...
            // For brevity, I'll add week 11 as an example of peak week

            // Week 11 - Days 1, 2, 3 (Peak phase)
            program[(11, 1)] = new WorkoutDay
            {
                Week = 11,
                Day = 1,
                Exercises = new List<Exercise>
            {
                new() { Name = "Squat", Sets = "1", Reps = "1", Intensity = "92", RestSeconds = 180, LiftType = "squat" },
                new() { Name = "Squat (Volume)", Sets = "4", Reps = "4", Intensity = "72", RestSeconds = 180, LiftType = "squat" },
                new() { Name = "Bench Press", Sets = "1", Reps = "1", Intensity = "96", RestSeconds = 180, LiftType = "bench" },
                new() { Name = "Bench Press (Volume)", Sets = "5", Reps = "4", Intensity = "72", RestSeconds = 180, LiftType = "bench" },
                new() { Name = "Biceps Curls", Sets = "2", Reps = "8-12", Intensity = "70", RestSeconds = 90, LiftType = "curl" }
            }
            };

            program[(11, 2)] = new WorkoutDay
            {
                Week = 11,
                Day = 2,
                Exercises = new List<Exercise>
            {
                new() { Name = "Deadlift", Sets = "1", Reps = "1", Intensity = "92", RestSeconds = 180, LiftType = "deadlift" },
                new() { Name = "Deadlift (Volume)", Sets = "4", Reps = "4", Intensity = "72", RestSeconds = 180, LiftType = "deadlift" },
                new() { Name = "Pause Bench Press", Sets = "1+2R", Reps = "4", Intensity = "81", RestSeconds = 180, LiftType = "pauseBench",
                    Note = "R = Repeat. Do 1 set at 81%, then repeat the weight for 2 more sets." },
                new() { Name = "Crunches", Sets = "2", Reps = "8-12", Intensity = "70", RestSeconds = 90, LiftType = "crunch" },
                new() { Name = "Triceps Pushdown", Sets = "2", Reps = "8-12", Intensity = "70", RestSeconds = 90, LiftType = "triceps" }
            }
            };

            program[(11, 3)] = new WorkoutDay
            {
                Week = 11,
                Day = 3,
                Exercises = new List<Exercise>
            {
                new() { Name = "Squat", Sets = "2", Reps = "4", Intensity = "71", RestSeconds = 180, LiftType = "squat" },
                new() { Name = "Romanian Deadlift", Sets = "4", Reps = "7", Intensity = "76", RestSeconds = 90, LiftType = "rdl" },
                new() { Name = "Row", Sets = "4", Reps = "8", Intensity = "75", RestSeconds = 90, LiftType = "row" },
                new() { Name = "Overhead Press", Sets = "1+2R", Reps = "6", Intensity = "79", RestSeconds = 90, LiftType = "ohp",
                    Note = "R = Repeat. Do 1 set at 79%, then repeat the weight for 2 more sets." },
                new() { Name = "Calf Raises", Sets = "2", Reps = "8-12", Intensity = "70", RestSeconds = 90, LiftType = "calf" }
            }
            };

            // TODO: Add weeks 3-10 and 12 following the same pattern
            // Refer to the original 12-week program document

            return program;
        }
    }
}
