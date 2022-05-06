// Create a new URL object to catch the order id
const orderId = new URL(window.location.href).searchParams.get("orderId");

// Display the order id to the matching HTML element
document.getElementById("orderId").textContent = orderId;