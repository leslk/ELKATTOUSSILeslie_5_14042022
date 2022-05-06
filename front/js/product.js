// Create a new URL object to catch the id of the selected product
let productId  = new URL(window.location.href).searchParams.get("id");

// Check the status response and send the status of error if needed
function checkFetch(response) {
    if(!response.ok) {
        throw response.status;
    }
}

fetch("http://localhost:3000/api/products/" + productId)
    .then(function(res) {
        checkFetch(res);
        return res.json();
    })
    .then(function(item) {
        addItem(item);
    })
    // Display error message in html page depending of the error number
    .catch(function(errorStatus) {
        let parent = document.getElementsByClassName("limitedWidthBlock");
            let oldChild = document.querySelector(".item");
            let newChild = document.createElement("p");
            switch (errorStatus) {
                case 404 : 
                    newChild.textContent = "Erreur " + errorStatus + " :  le produit n'a pas été trouvé";
                    break;
    
                case 500 : 
                    newChild.textContent = "Erreur " + errorStatus + " :  une erreur dans la base de donnée est survenue";
                    break;
    
                default : 
                    newChild.textContent = "Une erreur est survenue";
           }
           parent[2].replaceChild(newChild, oldChild);
    });
      

function addItem(element) {
    // Set API data in constants
    const colors = element.colors;
    const imageUrl = element.imageUrl;
    const name = element.name;
    const price = element.price;
    const productDescription = element.description;
    const alt = element.altTxt;
    
    // Create new DOM elements
    appendNewChild(document.querySelector(".item__img"), "img", [["src", imageUrl],["alt", alt]]);

    document.getElementById("title").textContent = name;

    document.getElementById("price").textContent = price;

    document.getElementById("description").textContent = productDescription;

    // Loop to create new DOM list element that contains color choices
    for (let color of colors) {
        let colorChoice = appendNewChild(document.getElementById("colors"), "option", [["value", color]]);
        colorChoice.textContent = color; 
    }
    document.getElementById("addToCart").addEventListener("click", addToCart);
}

function addToCart() {
    // Create an object that contains required data to set the localStorage
    const product = {
        id : productId,
        quantity : parseInt(document.getElementById("quantity").value),
        color : document.getElementById("colors").options[document.getElementById('colors').selectedIndex].value
    }
    // Set the localStorage with an empty array
    if (localStorage.getItem("product") == null) {
        localStorage.setItem("product", JSON.stringify([]));
    }
    // Check if product color has been selected and display an alert to inform the user
    if (product.color == "") {
        alert("Veuillez selectionner une couleur !"); 
    }
    // Check if product quantity has been selected and display an alert to inform the user
    else if (product.quantity == 0) {
        alert("Veuillez selectionner une quantité !"); 
    }
    // Get the localStorage and check if a product with same id and color has already been added
    else {
        let basket = JSON.parse(localStorage.getItem("product"));
        let foundProduct = basket.find(element => product.id == element.id && product.color == element.color);
        // If a product with same id and color has been found, adjust the quantity
        if (foundProduct) {
            let startQuantity = foundProduct.quantity;
            foundProduct.quantity = foundProduct.quantity + product.quantity;
            // If the adjusted product quantity is lower or equal to 100, udpate the localStorage quantity
            // and redirect to te cart page
            if (foundProduct.quantity <= 100){
                localStorage.setItem("product",JSON.stringify(basket));
                // alert("la quantité du produit " + document.getElementById("title").textContent + " a été ajusté");
                window.location.href = "cart.html";
            // If the adjusted product quantity is greater than or equal to 100, display an alert message to the user
            } else {
                alert("Vous avez dépassé la quantité autorisée de 100 pièces par produit, vous pouvez encore ajouté " + (100 - startQuantity) + " unités a votre panier");
            } 
        // if the product hasn't been found in the localStorage, add to the localStorage
        //and redirect to the cart page  
        } else {
            basket.push(product);
            localStorage.setItem("product",JSON.stringify(basket));
            // alert("le produit " + document.getElementById("title").textContent + " a été ajouté au panier");
            window.location.href = "cart.html";
        }
    } 

}


function appendNewChild(parent, childName, attributes = []) {
    // Create new DOM element
    let child = document.createElement(childName);
    // Set attribute for new DOM element
    for (let attribute of attributes) { 
      child.setAttribute(attribute[0], attribute[1]);
    }
    // Append new DOM element to targeted parent
    parent.appendChild(child); 
    // return the new DOM element
    return child; 
}

    