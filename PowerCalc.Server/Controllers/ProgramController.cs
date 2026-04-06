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

        [HttpPost]
        public ActionResult Create([FromBody] TrainingProgram program)
        {
            try
            {
                _programService.CreateProgram(program);
                return CreatedAtAction(nameof(Get), new { name = program.Name }, program);
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(ex.Message);
            }
        }

        [HttpPut("{name}")]
        public ActionResult Update(string name, [FromBody] TrainingProgram program)
        {
            try
            {
                _programService.UpdateProgram(name, program);
                return Ok(program);
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
        }

        [HttpDelete("{name}")]
        public ActionResult Delete(string name)
        {
            try
            {
                _programService.DeleteProgram(name);
                return NoContent();
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
        }
    }
}
