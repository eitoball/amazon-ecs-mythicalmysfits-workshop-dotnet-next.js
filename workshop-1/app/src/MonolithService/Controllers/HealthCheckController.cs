using Microsoft.AspNetCore.Mvc;

namespace MonolithService.Controllers
{
    public class HealthCheckResponse
    {
        public string Message { get; set; }
    }
    
    [ApiController]
    [Route("/")]
    public class HealthCheckController : ControllerBase
    {
        [HttpGet]
        public ActionResult Get()
        {
            return Ok(new HealthCheckResponse
                {
                    Message = "Nothing here, used for health check."

                }
            );
        }
    }
}