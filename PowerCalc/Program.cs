using PowerCalc.Services;
using PowerCalc.Services.Abstractions;

namespace PowerCalc
{
    public class Program
    {
        private static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
            
            builder.Services.AddControllers();
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            // Register services
            builder.Services.AddSingleton<ILifterService, LifterService>();
            builder.Services.AddSingleton<IProgramService, ProgramService>();
            builder.Services.AddSingleton<IStateService, StateService>();

            // Add CORS for development (Vite dev server)
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowReactDev",
                    policy => policy
                    .WithOrigins("http://localhost:5173")
                    .AllowAnyMethod()
                    .AllowAnyHeader());
            });

            var app = builder.Build();
            
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();                
            }

            app.UseHttpsRedirection();

            if (app.Environment.IsDevelopment())
            {
                app.UseCors("AllowReactDev");
            }

            app.UseDefaultFiles();
            app.UseStaticFiles();
            app.UseRouting();
            app.UseAuthorization();
            app.MapControllers();

            // Fallback to index.html for SPA routing
            app.MapFallbackToFile("index.html");            

            app.Run();
        }
    }
}