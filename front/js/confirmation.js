// Create a new URL object to catch the order id
let url = new URL(window.location.href);
let orderId = url.searchParams.get("orderId");

// Display the order id to the matching HTML element
document.getElementById("orderId").textContent = orderId;