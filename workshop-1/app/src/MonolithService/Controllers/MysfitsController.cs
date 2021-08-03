using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace MonolithService.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class MysfitsController : ControllerBase
    {
        private readonly IMysfitsTableClient _client;
        
        public MysfitsController(IMysfitsTableClient client)
        {
            _client = client;
        }

        [HttpGet]
        [EnableCors]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(List<Mysfit>))]
        public async Task<IActionResult> GetMysfits([FromQuery(Name = "filter")] string filter, [FromQuery(Name = "value")] string value)
        {
            if (filter != null)
            {
                var mysfits = await _client.QueryMysfits(new Dictionary<string, string>
                {
                    { "filter", filter },
                    { "value", value }
                });
                return Ok(mysfits);
            }
            else
            {
                var mysfits = await _client.GetAllMyfits();
                return Ok(mysfits);
            }
        }
        
        [HttpGet("{mysfitId}")]
        [EnableCors]
        [ProducesResponseType(StatusCodes.Status200OK, Type=typeof(Mysfit))]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<Mysfit>> GetMysfit(string mysfitId)
        {
            var mysfit = await _client.GetMysfit(mysfitId);
            if (mysfit != null)
            {
                return Ok(mysfit);
            }
            return NotFound();
        }
        
        [HttpPost("{mysfitId}/like")]
        [EnableCors]
        public async Task<IActionResult> LikeMysfit(string mysfitId)
        {
            _client.LikeMysfit(mysfitId);
            return Ok();
        }

        [HttpPost("{mysfitId}/adopt")]
        [EnableCors]
        public async Task<IActionResult> AdoptMysfit(string mysfitId)
        {
            _client.AdoptMysfit(mysfitId);
            return Ok();
        }
    }
}
