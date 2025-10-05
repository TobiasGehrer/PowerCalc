using Microsoft.AspNetCore.Mvc;
using PowerCalc.Models;
using PowerCalc.Services.Abstractions;

namespace PowerCalc.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
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

        [HttpPut("name")]
        public ActionResult Update(string name, [FromBody] Lifter lifter)
        {
            lifter.Name = name;
            _lifterService.UpdateLifter(lifter);
            return NoContent();
        }
    }
}
