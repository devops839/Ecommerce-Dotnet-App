// Handle the "Explore" button click to show product details
document.getElementById('product-link').addEventListener('click', function (event) {
    event.preventDefault(); // Prevent the default link behavior

    // Toggle the visibility of product details
    const iphoneDetails = document.getElementById('iphone-details');
    const macbookDetails = document.getElementById('macbook-details');
    const watchDetails = document.getElementById('watch-details');
    const airpodsDetails = document.getElementById('airpods-details');

    // If the product details are hidden, show them
    iphoneDetails.style.display = iphoneDetails.style.display === 'none' ? 'block' : 'none';
    macbookDetails.style.display = macbookDetails.style.display === 'none' ? 'block' : 'none';
    watchDetails.style.display = watchDetails.style.display === 'none' ? 'block' : 'none';
    airpodsDetails.style.display = airpodsDetails.style.display === 'none' ? 'block' : 'none';
});

// Handle adding products to the cart
const addToCartButtons = document.querySelectorAll('.add-to-cart');
addToCartButtons.forEach(button => {
    button.addEventListener('click', function () {
        const product = this.getAttribute('data-product');
        const price = parseFloat(this.getAttribute('data-price'));
        const image = this.getAttribute('data-image');

        // Add product to cart
        addToCart(product, price, image);
    });
});

// Initialize cart and order history from localStorage if present
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let orderHistory = JSON.parse(localStorage.getItem('orderHistory')) || [];

// Add item to cart and update cart UI
function addToCart(product, price, image) {
    const existingItem = cart.find(item => item.product === product);

    if (existingItem) {
        existingItem.quantity += 1; // Increase the quantity of the existing product
    } else {
        cart.push({ product, price, image, quantity: 1 }); // Add new product with quantity 1
    }

    // Save the cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    updateCartDisplay(); // Update cart UI after adding item
}

// Update the cart display
function updateCartDisplay() {
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = ''; // Clear the cart display

    cart.forEach(item => {
        const cartItem = document.createElement('li');
        cartItem.classList.add('cart-item');

        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.product}" />
            <span>${item.product} x ${item.quantity}</span>
            <div class="quantity-controls">
                <button class="decrease">-</button>
                <button class="increase">+</button>
            </div>
            <button class="remove-item">Remove</button>
        `;

        cartItems.appendChild(cartItem);

        // Handle item removal
        cartItem.querySelector('.remove-item').addEventListener('click', function () {
            cart = cart.filter(cartItem => cartItem.product !== item.product); // Remove the item from the cart
            localStorage.setItem('cart', JSON.stringify(cart)); // Save the updated cart
            updateCartDisplay(); // Update cart UI
            updateTotal(); // Update the total price
        });

        // Handle quantity increase
        cartItem.querySelector('.increase').addEventListener('click', function () {
            item.quantity += 1; // Increase quantity
            localStorage.setItem('cart', JSON.stringify(cart)); // Save the updated cart
            updateCartDisplay(); // Update cart UI
            updateTotal(); // Update the total price
        });

        // Handle quantity decrease
        cartItem.querySelector('.decrease').addEventListener('click', function () {
            if (item.quantity > 1) {
                item.quantity -= 1; // Decrease quantity
                localStorage.setItem('cart', JSON.stringify(cart)); // Save the updated cart
                updateCartDisplay(); // Update cart UI
                updateTotal(); // Update the total price
            }
        });
    });

    updateTotal(); // Update the total price after changing cart items
}

// Update the total price of items in the cart
function updateTotal() {
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    document.getElementById('payment-total').innerText = `Total: $${total.toFixed(2)}`;
}

// Show the cart section when an item is added
document.getElementById('cart-link').addEventListener('click', function (event) {
    event.preventDefault(); // Prevent the default link behavior
    document.getElementById('cart-section').style.display = 'block';
});

// Proceed to checkout
document.getElementById('proceed-to-checkout').addEventListener('click', function () {
    document.getElementById('payment-section').style.display = 'block';
    document.getElementById('cart-section').style.display = 'none';
    displayPaymentDetails(); // Display payment details
});

// Display the products and prices in the payment section
function displayPaymentDetails() {
    const paymentItems = document.getElementById('payment-items');
    paymentItems.innerHTML = ''; // Clear the payment details

    cart.forEach(item => {
        const paymentItem = document.createElement('div');
        paymentItem.classList.add('payment-item');

        paymentItem.innerHTML = `
            <img src="${item.image}" alt="${item.product}" />
            <span>${item.product} - $${item.price} x ${item.quantity}</span>
        `;

        paymentItems.appendChild(paymentItem);
    });

    updateTotal(); // Update the total price in payment details
}

// Handle the "Buy Now" button click to simulate a payment process
document.getElementById('buy-now').addEventListener('click', function () {
    const loadingIndicator = document.getElementById('loading-indicator');
    loadingIndicator.style.display = 'block'; // Show loading

    // Simulate a payment process (e.g., 3 seconds)
    setTimeout(function () {
        loadingIndicator.style.display = 'none'; // Hide loading
        alert('Payment successful! Thank you for your purchase.');
        saveOrderHistory(); // Save the current cart to order history
        clearCart(); // Clear the cart after payment
        document.getElementById('payment-section').style.display = 'none';
    }, 3000);
});

// Save the current cart as a new order in the order history
function saveOrderHistory() {
    if (cart.length === 0) return;

    const orderId = Math.floor(Math.random() * 100000); // Generate a random order ID
    const date = new Date().toLocaleDateString(); // Get the current date

    // Ensure that the "items" field is a properly formatted string
    const items = cart.map(item => `${item.product} x ${item.quantity}`).join(', '); // Join product names and quantities
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2); // Calculate total

    // Ensure proper order structure
    const newOrder = {
        orderId,
        date,
        items,  // A string of ordered items
        total: `$${total}`  // A formatted string for total
    };

    orderHistory.push(newOrder); // Add the new order to the order history
    localStorage.setItem('orderHistory', JSON.stringify(orderHistory)); // Save to localStorage
}

// Clear the cart after payment
function clearCart() {
    cart = []; // Reset the cart array
    localStorage.setItem('cart', JSON.stringify(cart)); // Save the empty cart
    updateCartDisplay(); // Update the cart UI
}

// Handle the "Track Orders" link click to show the order history
document.getElementById('order-link').addEventListener('click', function (event) {
    event.preventDefault(); // Prevent the default link behavior
    displayOrderHistory();
    document.getElementById('order-history').style.display = 'block';
});

// Display the order history in a table
function displayOrderHistory() {
    const orderHistoryList = document.getElementById('order-history-list');
    orderHistoryList.innerHTML = ''; // Clear existing order history

    // Ensure the order history is valid before processing
    if (orderHistory.length === 0) {
        orderHistoryList.innerHTML = '<tr><td colspan="5">No orders found.</td></tr>';
    } else {
        orderHistory.forEach(order => {
            const row = document.createElement('tr');

            // Check if any property is undefined or invalid, and avoid displaying it
            const orderId = order.orderId ? order.orderId : '';
            const date = order.date ? order.date : '';
            const items = order.items ? order.items : '';
            const total = order.total ? order.total : '';

            // Only create the row if all values are valid
            if (orderId && date && items && total) {
                row.innerHTML = `
                    <td>${orderId}</td>
                    <td>${date}</td>
                    <td>${items}</td>
                    <td>${total}</td>
                    <td><button onclick="viewInvoice('${orderId}')">View Invoice</button></td>
                `;
                orderHistoryList.appendChild(row);
            }
        });
    }
}

// View invoice for a specific order
function viewInvoice(orderId) {
    alert(`Viewing invoice for Order ID: ${orderId}`); // Simulate invoice viewing
}
