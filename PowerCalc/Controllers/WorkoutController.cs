using Microsoft.AspNetCore.Mvc;
using PowerCalc.Models;
using PowerCalc.Services.Abstractions;

namespace PowerCalc.Controllers
{
    [ApiController]
    [Route("api/workouts")]
    public class WorkoutController : ControllerBase
    {
        private readonly IProgramService _programService;
        private readonly ILifterService _lifterService;

        public WorkoutController(IProgramService programService, ILifterService lifterService)
        {
            _programService = programService;
            _lifterService = lifterService;
        }

        [HttpPost("session")]
        public ActionResult<WorkoutSession> CreateSession([FromBody] SessionRequest request)
        {
            try
            {
                var session = new WorkoutSession
                {
                    Week = request.Week,
                    Day = request.Day,
                    ProgramName = request.ProgramName,
                    PresentLifters = request.LifterNames,
                    Workouts = new List<CalculatedWorkout>()
                };

                foreach (var lifterName in request.LifterNames)
                {
                    var lifter = _lifterService.GetLifter(lifterName);

                    if (lifter == null)
                    {
                        return NotFound($"Lifter '{lifterName}' not found.");
                    }

                    var workout = _programService.CalculatedWorkout(request.ProgramName, request.Week, request.Day, lifter);
                    session.Workouts.Add(workout);
                }

                return Ok(session);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
        }
    }
}
