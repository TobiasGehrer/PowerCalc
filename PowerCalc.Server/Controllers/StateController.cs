using Microsoft.AspNetCore.Mvc;
using PowerCalc.Models;
using PowerCalc.Services.Abstractions;

namespace PowerCalc.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StateController : ControllerBase
    {
        private readonly IStateService _stateService;

        public StateController(IStateService stateService)
        {
            this._stateService = stateService;
        }

        [HttpGet]
        public ActionResult<AppState> Get()
        {
            return Ok(_stateService.GetState());
        }

        [HttpPut]
        public ActionResult Update([FromBody] AppState state)
        {
            _stateService.UpdateState(state);
            return NoContent();
        }

        [HttpPost("advance")]
        public ActionResult Advance()
        {
            try
            {
                _stateService.AdvanceDay();
                return NoContent();
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
