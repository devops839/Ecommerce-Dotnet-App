using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class PaymentController : ControllerBase
{
    [HttpGet]
    public IActionResult GetPayments()
    {
        return Ok(new[] { new { PaymentId = 201, UserId = 1, Amount = 250.50, Status = "Completed" } });
    }

    [HttpPost]
    public IActionResult ProcessPayment([FromBody] object paymentDetails)
    {
        return Ok(new { Message = "Payment Processed Successfully", Details = paymentDetails });
    }
}
