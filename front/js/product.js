let url = new URL(window.location.href);
let productId = url.searchParams.get("id");
if (productId != null) {
    let price = 0;
}


fetch("http://localhost:3000/api/products/" + productId)
    .then(function(res) {
        return res.json();
    })
    .then(function(item) {
        addItem(item);
    });

    function addItem(element) {
        const colors = element.colors;
        const imageUrl = element.imageUrl;
        const name = element.name;
        price = element.price;
        const productDescription = element.description;
        const alt = element.altTxt;
        
        const image = document.createElement("img");
        image.setAttribute("src", imageUrl);
        image.setAttribute("alt", alt);
        const container = document.getElementsByClassName("item__img");
        const targetContainer = container[0];
        targetContainer.appendChild(image);
    
        document.getElementById("title").textContent = name;

        document.getElementById("price").textContent = price;
    
        document.getElementById("description").textContent = productDescription;

        for (let color of colors) {
            let colorChoice = document.createElement("option");
            colorChoice.setAttribute("value", color);
            colorChoice.textContent = color;
            document.getElementById("colors").appendChild(colorChoice);  
        }
    }

document.getElementById("addToCart").addEventListener("click", function() {
    const product = {
        id : productId,
        quantity : parseInt(document.getElementById("quantity").value),
        price : price,
        color : document.getElementById("colors").options[document.getElementById('colors').selectedIndex].value
    }
    if (localStorage.getItem("product") == null) {
        localStorage.setItem("product", JSON.stringify([]));
    }

    if (product.color == "" || product.quantity == 0) {
       alert("Veuillez selectionner une quantité / une couleur !"); 
    }
    else {
        let basket = JSON.parse(localStorage.getItem("product"));
        let foundProduct = basket.find(element => product.id == element.id && product.color == element.color);
        if (foundProduct) {
            foundProduct.quantity = parseInt(foundProduct.quantity);
            foundProduct.quantity += product.quantity;
            localStorage.setItem("product",JSON.stringify(basket));
            alert("la quantité du produit " + document.getElementById("title").textContent + " a été ajusté");
            window.location.href = "cart.html";
        } else {
            basket.push(product);
            localStorage.setItem("product",JSON.stringify(basket));
            alert("le produit " + document.getElementById("title").textContent + " a été ajouté au panier");
            window.location.href = "cart.html";
        }
    } 
});

    