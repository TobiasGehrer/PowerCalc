using PowerCalc.Models;
using PowerCalc.Services.Abstractions;
using System.Text.Json;

namespace PowerCalc.Services
{
    public class LifterService : ILifterService
    {
        private readonly string _configPath;
        private readonly object _lock = new();

        public LifterService(IConfiguration configuration, IWebHostEnvironment env)
        {
            var relativePath = configuration["ConfigurationPaths:Lifters"] ?? "Configuration/lifters.json";
            _configPath = Path.Combine(env.ContentRootPath, relativePath);
        }

        public List<Lifter> GetAllLifters()
        {
            lock (_lock)
            {
                var data = LoadConfig();
                return data.Lifters;
            }
        }

        public Lifter? GetLifter(string name)
        {
            lock (_lock)
            {
                var lifters = GetAllLifters();
                return lifters.FirstOrDefault(l => l.Name.Equals(name, StringComparison.OrdinalIgnoreCase));
            }
        }

        public void AddLifter(Lifter lifter)
        {
            lock (_lock)
            {
                var data = LoadConfig();

                if (data.Lifters.Any(l => l.Name.Equals(lifter.Name, StringComparison.OrdinalIgnoreCase)))
                {
                    throw new InvalidOperationException($"Lifter '{lifter.Name}' already exists");
                }

                data.Lifters.Add(lifter);
                SaveConfig(data);
            }
        }

        public void UpdateLifter(string name, Lifter lifter)
        {
            lock (_lock)
            {
                var data = LoadConfig();
                var existing = data.Lifters.FirstOrDefault(l => l.Name.Equals(name, StringComparison.OrdinalIgnoreCase));

                if (existing == null)
                {
                    throw new KeyNotFoundException($"Lifter '{name}' not found");
                }

                existing.Name = lifter.Name;
                existing.OneRepMaxes = lifter.OneRepMaxes;
                SaveConfig(data);
            }
        }

        public void DeleteLifter(string name)
        {
            lock (_lock)
            {
                var data = LoadConfig();
                var lifter = data.Lifters.FirstOrDefault(l => l.Name.Equals(name, StringComparison.OrdinalIgnoreCase));

                if (lifter == null)
                {
                    throw new KeyNotFoundException($"Lifter '{name}' not found");
                }

                data.Lifters.Remove(lifter);
                SaveConfig(data);
            }
        }

        private LifterConfig LoadConfig()
        {
            if (!File.Exists(_configPath))
            {
                return new LifterConfig();
            }

            var json = File.ReadAllText(_configPath);
            return JsonSerializer.Deserialize<LifterConfig>(json, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true,
            }) ?? new LifterConfig();
        }

        private void SaveConfig(LifterConfig config)
        {
            var json = JsonSerializer.Serialize(config, new JsonSerializerOptions
            {
                WriteIndented = true
            });

            File.WriteAllText(_configPath, json);
        }

        private class LifterConfig
        {
            public List<Lifter> Lifters { get; set; } = new();
        }
    }
}
