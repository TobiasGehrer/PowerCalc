using Microsoft.AspNetCore.Mvc;
using PowerCalc.Models;
using PowerCalc.Services.Abstractions;

namespace PowerCalc.Controllers
{
    [ApiController]
    [Route("api/lifters")]
    public class LifterController : ControllerBase
    {
        private readonly ILifterService _lifterService;

        public LifterController(ILifterService lifterService)
        {
            _lifterService = lifterService;
        }

        [HttpGet]
        public ActionResult<List<Lifter>> GetAll()
        {
            return Ok(_lifterService.GetAllLifters());
        }

        [HttpGet("{name}")]
        public ActionResult<Lifter> Get(string name)
        {
            var lifter = _lifterService.GetLifter(name);

            if (lifter == null)
            {
                return NotFound();
            }

            return Ok(lifter);
        }

        [HttpPost]
        public ActionResult<Lifter> Create([FromBody] Lifter lifter)
        {
            try
            {
                _lifterService.AddLifter(lifter);
                return CreatedAtAction(nameof(Get), new { name = lifter.Name }, lifter);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("name")]
        public ActionResult Update(string name, [FromBody] Lifter lifter)
        {
            try
            {
                _lifterService.UpdateLifter(name, lifter);
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
        }

        [HttpDelete("{name}")]
        public ActionResult Delete(string name)
        {
            try
            {
                _lifterService.DeleteLifter(name);
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
        }
    }
}
