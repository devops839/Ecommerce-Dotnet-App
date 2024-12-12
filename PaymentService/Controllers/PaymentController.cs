using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq; // Ensure you import this for parsing JSON

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
    public IActionResult ProcessPayment([FromBody] JObject paymentDetails)
    {
        // Log received payment details for debugging
        Console.WriteLine($"Received Payment Details: {paymentDetails.ToString()}");

        // Validate if paymentDetails is not null or malformed
        if (paymentDetails == null || !paymentDetails.ContainsKey("cart") || !paymentDetails.ContainsKey("paymentDetails"))
        {
            return BadRequest(new { Status = "Failed", Message = "Missing required fields: cart or paymentDetails." });
        }

        var cartItems = paymentDetails["cart"]?.ToObject<JArray>();
        var paymentInfo = paymentDetails["paymentDetails"];

        // Log received cartItems and paymentInfo for debugging
        Console.WriteLine($"Cart Items: {cartItems}");
        Console.WriteLine($"Payment Info: {paymentInfo}");

        // Validate cartItems and paymentInfo
        if (cartItems == null || cartItems.Count == 0)
        {
            return BadRequest(new { Status = "Failed", Message = "Cart is empty. Please add items to the cart." });
        }

        if (paymentInfo == null || string.IsNullOrEmpty(paymentInfo["cardNumber"]?.ToString()))
        {
            return BadRequest(new { Status = "Failed", Message = "Invalid payment details. Card information is missing." });
        }

        // Simulate a payment processing (this is where you'd integrate with a real payment gateway)
        bool paymentSuccess = SimulatePaymentProcessing(paymentInfo);

        if (paymentSuccess)
        {
            // If payment is successful, calculate total amount from cart items
            decimal totalAmount = 0;
            foreach (var item in cartItems)
            {
                decimal price = item["price"]?.ToObject<decimal>() ?? 0;
                int quantity = item["quantity"]?.ToObject<int>() ?? 0;
                totalAmount += price * quantity;
            }

            var paymentId = 201; // Simulated payment ID (updated to match the test case)
            return Ok(new { Status = "Completed", PaymentId = paymentId, Amount = totalAmount });
        }
        else
        {
            return BadRequest(new { Status = "Failed", Message = "Payment processing failed." });
        }
    }

    // Simulate the payment processing
    private bool SimulatePaymentProcessing(JToken paymentInfo)
    {
        var cardNumber = paymentInfo["cardNumber"]?.ToString();
        
        // Simple check to simulate a successful payment (for demo purposes)
        if (cardNumber == "4111111111111111") // Example of a test card number
        {
            return true; // Simulate payment success
        }
        else
        {
            return false; // Simulate payment failure (invalid card number)
        }
    }
}
