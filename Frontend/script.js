console.log('Frontend loaded!');

document.querySelectorAll('.services a').forEach(link => {
    link.addEventListener('click', function(event) {
        console.log(`Navigating to: ${event.target.href}`);
    });
});

function handleError(serviceName) {
    console.error(`Error fetching data from ${serviceName}`);
}

async function fetchServiceData(serviceUrl) {
    try {
        const response = await fetch(serviceUrl);
        if (!response.ok) {
            throw new Error(`Failed to fetch from ${serviceUrl}`);
        }
        const data = await response.json();
        console.log(`Data fetched from ${serviceUrl}:`, data);
        return data;
    } catch (error) {
        console.error(`Error: ${error.message}`);
    }
}

// If you want to load and display dynamic data later, you can call the fetch function
// For example, you could fetch product data like this:
// fetchServiceData('http://localhost:5002/api/product');
