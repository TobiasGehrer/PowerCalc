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

            // Add CORS for development
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowAll", 
                    policy => policy
                    .AllowAnyOrigin()
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
            app.UseCors("AllowAll");
            app.UseDefaultFiles();
            app.UseStaticFiles();
            app.UseRouting();
            app.UseAuthorization();
            app.MapControllers();            

            app.Run();
        }
    }
}