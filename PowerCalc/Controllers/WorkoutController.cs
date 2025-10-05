using Microsoft.AspNetCore.Mvc;
using PowerCalc.Models;
using PowerCalc.Services.Abstractions;

namespace PowerCalc.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WorkoutController : ControllerBase
    {
        private readonly IProgramService _programService;

        public WorkoutController(IProgramService programService)
        {
            _programService = programService;
        }

        [HttpGet("{week}/{day}")]
        public ActionResult<WorkoutDay> GetWorkout(int week, int day)
        {
            try
            {
                var workout = _programService.GetWorkout(week, day);
                return Ok(workout);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
        }

        [HttpGet("{week}/{day}/lifter/{lifterName}")]
        public ActionResult<CalculatedWorkout> GetCalculatedWorkout(int week, int day, string lifterName)
        {
            try
            {
                var workout = _programService.GetCalculatedWorkout(week, day, lifterName);
                return Ok(workout);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
        }
    }
}
