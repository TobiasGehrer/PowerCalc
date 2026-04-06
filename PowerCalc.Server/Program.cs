using PowerCalc.Services;
using PowerCalc.Services.Abstractions;

namespace PowerCalc.Server
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            builder.Services.AddControllers();

            // Register PowerCalc services
            builder.Services.AddSingleton<ILifterService, LifterService>();
            builder.Services.AddSingleton<IProgramService, ProgramService>();
            builder.Services.AddSingleton<IStateService, StateService>();

#if DEBUG
            ConfigureCors(builder);
#endif

            var app = builder.Build();

            app.UseDefaultFiles();
            app.UseStaticFiles();

#if DEBUG
            app.UseCors("AllowLocalhost");
#endif

            app.UseHttpsRedirection();

            app.UseAuthorization();


            app.MapControllers();

            app.MapFallbackToFile("/index.html");

            app.Run();
        }

        private static void ConfigureCors(WebApplicationBuilder builder)
        {
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowLocalhost",
                    policy =>
                    {
                        policy.WithOrigins("https://localhost:62535")
                              .AllowAnyHeader()
                              .AllowAnyMethod();
                    });
            });
        }
    }
}
