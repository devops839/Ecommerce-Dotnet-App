using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class OrderController : ControllerBase
{
    [HttpGet]
    public IActionResult GetOrders()
    {
        return Ok(new[] { new { OrderId = 101, UserId = 1, TotalAmount = 500.00 } });
    }
}
