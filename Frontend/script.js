document.addEventListener('DOMContentLoaded', function () {
    const productLink = document.getElementById('product-link');
    const productDetails = document.querySelectorAll('.product-details');

    // Hide all products initially
    productDetails.forEach(detail => detail.style.display = 'none');

    // Show products only when "Explore" is clicked
    productLink.addEventListener('click', function (event) {
        event.preventDefault();
        productDetails.forEach(detail => {
            detail.style.display = 'block';
        });
    });

    const cartLink = document.getElementById('cart-link');
    const cartItemsContainer = document.createElement('ul');
    cartItemsContainer.classList.add('cart-items');
    const cartDataKey = 'cartData';

    // Initialize cart data from localStorage or an empty object
    let cartData = JSON.parse(localStorage.getItem(cartDataKey)) || {};

    function saveCart() {
        localStorage.setItem(cartDataKey, JSON.stringify(cartData));
    }

    function renderCart() {
        cartItemsContainer.innerHTML = ''; // Clear existing cart items
        let total = 0;

        // Iterate over cart data and render each item
        for (const productName in cartData) {
            const item = cartData[productName];
            const listItem = document.createElement('li');
            listItem.style.display = 'flex';
            listItem.style.alignItems = 'center';
            listItem.style.margin = '10px 0';

            const img = document.createElement('img');
            img.src = item.image;
            img.alt = productName;
            img.style.width = '50px';
            img.style.height = '50px';
            img.style.marginRight = '10px';

            const productDetails = document.createElement('span');
            productDetails.textContent = `${productName} - $${item.price} x ${item.quantity}`;

            const removeButton = document.createElement('button');
            removeButton.textContent = 'Remove';
            removeButton.classList.add('remove-item');
            removeButton.dataset.product = productName;
            removeButton.style.marginLeft = 'auto';

            listItem.appendChild(img);
            listItem.appendChild(productDetails);
            listItem.appendChild(removeButton);
            cartItemsContainer.appendChild(listItem);

            total += item.price * item.quantity;
        }

        // Display total cost
        const totalItem = document.createElement('li');
        totalItem.innerHTML = `<strong>Total: $${total.toFixed(2)}</strong>`;
        cartItemsContainer.appendChild(totalItem);

        // Add checkout button
        const checkoutButton = document.createElement('button');
        checkoutButton.textContent = 'Proceed to Checkout';
        checkoutButton.id = 'checkout-button';
        cartItemsContainer.appendChild(checkoutButton);

        document.body.appendChild(cartItemsContainer);

        checkoutButton.addEventListener('click', function () {
            redirectToPayment();
        });

        // Event listener for remove button
        const removeButtons = document.querySelectorAll('.remove-item');
        removeButtons.forEach(button => {
            button.addEventListener('click', function () {
                const productName = this.dataset.product;
                delete cartData[productName];
                saveCart();
                renderCart(); // Re-render the cart after removal
            });
        });
    }

    function redirectToPayment() {
        // Collect the cart items and prepare them for the payment API request
        const cartItems = Object.keys(cartData).map(productName => ({
            productName,
            price: cartData[productName].price,
            quantity: cartData[productName].quantity,
        }));

        fetch('http://localhost:5004/api/payment/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: 1, // Hardcoded userId for demo; replace with dynamic value if needed
                cart: cartItems,
                paymentDetails: {
                    cardNumber: '4111111111111111',
                    expiryDate: '12/25',
                    cvv: '123'
                }
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.Status === 'Completed') {
                showPaymentSuccess(data);
            } else {
                showPaymentFailure();
            }
        })
        .catch(error => {
            console.error('Payment error:', error);
            showPaymentFailure();
        });
    }

    function showPaymentSuccess(data) {
        alert(`Payment successful! Payment ID: ${data.PaymentId}, Total: $${data.Amount.toFixed(2)}`);
        cartData = {}; // Clear the cart after successful payment
        saveCart();
        renderCart();
    }

    function showPaymentFailure() {
        alert('Payment failed! Please try again.');
    }

    // Event listeners for adding products to the cart
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function () {
            const productName = this.getAttribute('data-product');
            const price = parseFloat(this.getAttribute('data-price'));
            const image = this.getAttribute('data-image');
            if (!cartData[productName]) {
                cartData[productName] = {
                    price,
                    quantity: 1,
                    image
                };
            } else {
                cartData[productName].quantity += 1;
            }
            saveCart();
            renderCart();
        });
    });

    cartLink.addEventListener('click', function () {
        renderCart();
    });
});
