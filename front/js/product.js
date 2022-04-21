let url = new URL(window.location.href);
let productId = url.searchParams.get("id");


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
        const price = element.price;
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
        productId : productId,
        productQuantity : parseInt(document.getElementById("quantity").value),
        productColor : document.getElementById("colors").options[document.getElementById('colors').selectedIndex].value
    }
    if (localStorage.getItem("product") == null) {
        localStorage.setItem("product", JSON.stringify([]));
    }

    if (product.productColor == "" || product.productQuantity == 0) {
       alert("Veuillez selectionner une quantité / une couleur !"); 
    }
    else {
        let basket = JSON.parse(localStorage.getItem("product"));
        let foundProduct = basket.find(element => product.productId == element.productId && product.productColor == element.productColor);
        if (foundProduct) {
            console.log(foundProduct);
            foundProduct.productQuantity += product.productQuantity;
            localStorage.setItem("product",JSON.stringify(basket));
            alert("la quantité du produit " + document.getElementById("title").textContent + " a été ajusté");
            window.location.href = "cart.html";
        } else {
            basket.push(product);
            localStorage.setItem("product",JSON.stringify(basket));
            alert("le produit a été ajouté au panier");
            window.location.href = "cart.html";
        }
    } 
});

    