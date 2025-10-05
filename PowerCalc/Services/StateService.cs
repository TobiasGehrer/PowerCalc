using PowerCalc.Models;
using PowerCalc.Services.Abstractions;
using System.Text.Json;

namespace PowerCalc.Services
{
    public class StateService : IStateService
    {
        private readonly string _configPath;
        private readonly IProgramService _programService;
        private readonly object _lock = new();

        public StateService(IConfiguration configuration, IWebHostEnvironment env, IProgramService programService)
        {
            var relativePath = configuration["ConfigurationPaths:State"] ?? "Configuration/state.json";
            _configPath = Path.Combine(env.ContentRootPath, relativePath);
            _programService = programService;
        }

        public AppState GetState()
        {
            lock (_lock)
            {
                if (!File.Exists(_configPath))
                {
                    return new AppState();
                }
                
                var json = File.ReadAllText(_configPath);

                return JsonSerializer.Deserialize<AppState>(json, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true,               
                }) ?? new AppState();                
            }
        }

        public void UpdateState(AppState state)
        {
            lock (_lock)
            {
                var json = JsonSerializer.Serialize(state, new JsonSerializerOptions
                {
                    WriteIndented = true
                });

                File.WriteAllText(_configPath, json);
            }
        }

        public void AdvanceDay()
        {
            lock (_lock)
            {
                var state = GetState();
                var program = _programService.GetProgram(state.CurrentProgram);

                if (program == null)
                {
                    throw new InvalidOperationException("Current program not found");
                }

                // Advance day
                if (state.CurrentDay < program.Days)
                {
                    state.CurrentDay++;
                }
                else
                {
                    state.CurrentDay = 1;
                    state.CurrentWeek++;

                    // Loop back to week 1 if finished
                    if (state.CurrentWeek > program.Weeks)
                    {
                        state.CurrentWeek = 1;
                    }
                }

                UpdateState(state);
            }
        }
    }
}
