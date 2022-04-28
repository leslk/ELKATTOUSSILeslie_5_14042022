let url = new URL(window.location.href);
let orderId = url.searchParams.get("orderId");

document.getElementById("orderId").textContent = orderId;