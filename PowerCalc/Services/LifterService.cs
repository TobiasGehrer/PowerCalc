using PowerCalc.Models;
using PowerCalc.Services.Abstractions;
using System.Text.Json;

namespace PowerCalc.Services
{
    public class LifterService : ILifterService
    {
        private readonly IConfiguration _configuration;
        private readonly string _configPath;
        private List<Lifter> _lifters;
        private readonly object _lock = new();

        public LifterService(IConfiguration configuration, IWebHostEnvironment env)
        {
            _configuration = configuration;
            _configPath = Path.Combine(env.ContentRootPath, "appsettings.json");
            LoadLifters();
        }

        private void LoadLifters()
        {
            var liftersConfig = _configuration.GetSection("Lifters").Get<LiftersConfiguration>();
            _lifters = liftersConfig?.Lifters ?? new List<Lifter>();
        }

        public List<Lifter> GetAllLifters()
        {
            lock (_lock)
            {
                return new List<Lifter>(_lifters);
            }
        }

        public Lifter? GetLifter(string name)
        {
            lock (_lock)
            {
                return _lifters.FirstOrDefault(l => l.Name.Equals(name, StringComparison.OrdinalIgnoreCase));
            }
        }

        public void UpdateLifter(Lifter lifter)
        {
            lock (_lock)
            {
                var existing = _lifters.FirstOrDefault(l => l.Name.Equals(lifter.Name, StringComparison.OrdinalIgnoreCase));
                
                if (existing != null)
                {
                    existing.OneRepMaxes = lifter.OneRepMaxes;
                }
                else
                {
                    _lifters.Add(lifter);
                }

                SaveLifters();
            }
        }

        private void SaveLifters()
        {
            try
            {
                var json = File.ReadAllText(_configPath);
                using var jsonDoc = JsonDocument.Parse(json);
                var root = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(json);

                if (root != null)
                {
                    var liftersData = new { Lifters = _lifters };
                    root["Lifters"] = JsonSerializer.SerializeToElement(liftersData);

                    var options = new JsonSerializerOptions { WriteIndented = true };
                    File.WriteAllText(_configPath, JsonSerializer.Serialize(root, options));
                }
            }
            catch (Exception ex)
            {               
                Console.WriteLine($"Error saving lifters: {ex.Message}");
            }
        }
    }
}
