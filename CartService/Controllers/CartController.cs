using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class CartController : ControllerBase
{
    [HttpGet]
    public IActionResult GetCartItems()
    {
        return Ok(new[]
        {
            new { CartItemId = 301, ProductId = 101, Quantity = 2 },
            new { CartItemId = 302, ProductId = 102, Quantity = 1 }
        });
    }

    [HttpPost]
    public IActionResult AddToCart([FromBody] object cartItem)
    {
        return Created("", new { Message = "Item added to cart successfully", Details = cartItem });
    }
}
