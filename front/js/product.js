let url = new URL(window.location.href);
let productId = url.searchParams.get("id");


fetch("http://localhost:3000/api/products/" + productId)
    .then(function(res) {
        console.log(res.json());
    })