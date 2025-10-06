using Microsoft.AspNetCore.Mvc;
using PowerCalc.Models;
using PowerCalc.Services.Abstractions;

namespace PowerCalc.Controllers
{
    [ApiController]
    [Route("api/programs")]
    public class ProgramController : ControllerBase
    {
        private readonly IProgramService _programService;

        public ProgramController(IProgramService programService)
        {
            _programService = programService;
        }

        [HttpGet]
        public ActionResult<List<TrainingProgram>> GetAll()
        {
            return Ok(_programService.GetAllPrograms());
        }

        [HttpGet("{name}")]
        public ActionResult<TrainingProgram> Get(string name)
        {
            var program = _programService.GetProgram(name);

            if (program == null)
            {
                return NotFound();
            }

            return Ok(program);
        }
    }
}
