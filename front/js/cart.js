let totalPrice = 0;
let totalQuantity = 0;
let products = null;
getProducts().then(function () {
    createAllProducts(products);
});

async function getProducts() {
    // Set local variable with localStorage products
    products = JSON.parse(localStorage.getItem("product"));
    if (products === null) {
        products = [];
    }
    // Get API data that are missing for each product of the local variable
    try {
        for (let product of products) {
            let res = await fetch("http://localhost:3000/api/products/" + product.id);
            if(!res.ok) {
                errorStatus = res.status;
                console.log(errorStatus);
                throw errorStatus;
            }
            let apiData = await res.json();
            //Set additional product attributes from API
            product.imageUrl = apiData.imageUrl;
            product.price = apiData.price;
            product.name = apiData.name;
            product.alt = apiData.altTxt;
        }
     // Display error message in html page depending of the error number
    } catch (errorStatus) {
        let parent = document.getElementById("limitedWidthBlock");
        let oldChild = document.getElementById("cartAndFormContainer");
        let newChild = document.createElement("p");
        switch (errorStatus) {
            case 404 : 
                newChild.textContent = "erreur " + errorStatus + " le produit n'a pas été trouvé";
                break;

            case 500 : 
                newChild.textContent = "erreur " + errorStatus + " une erreur dans la base de donnée est survenue";
                break;

            default : 
                newChild.textContent = "une erreur est survenue";
       }
       parent.replaceChild(newChild, oldChild);
    }
    
}

function createAllProducts(products) {
    resetTotal();
    // Check if the cart is empty to display a message that precise it to the user
    if (products.length === 0) {
        document.getElementById("cart__items").innerHTML = "<p>Votre panier est vide</p>";
        // Display global variables that contain the total price and quantity
        displayTotal(totalQuantity, totalPrice);
    } else {
        // Display each product of the local variable and display total sum
        for (let product of products) {
            displayProduct(product);
            setTotalSum(product.price, product.quantity);
        }
        displayTotal(totalQuantity, totalPrice);  
    } 
}


function displayProduct(product) {
    // Create new DOM elements that represents the cart
    const article = appendNewChild(document.getElementById("cart__items"),"article",
        [
            ["class", "cart__item"],
            ["data-id", product.id],
            ["data-color", product.color]
        ]
    );

    const imageDiv = appendNewChild(article, "div", [["class", "cart__item__img"]]);

    const image = appendNewChild(imageDiv, "img", [["src", product.imageUrl],["alt", product.alt]]);

    const divItemContent = appendNewChild(article, "div", [["class", "cart__item__content"]]);

    const divItemContentDescription = appendNewChild(divItemContent, "div", [["class", "cart__item__content__description"]]);
    
    const itemName = appendNewChild(divItemContentDescription, "h2");   
    itemName.textContent = product.name;
   
    const itemColor = appendNewChild(divItemContentDescription, "p");
    itemColor.textContent = product.color;
  
    const itemPrice = appendNewChild(divItemContentDescription, "p");
    itemPrice.textContent = product.price + " €";
    
    const itemSettings = appendNewChild(article, "div", [["class", "cart__item__content__settings"]]);

    const itemContentSettingsQuantity = appendNewChild(itemSettings, "div", [["class","cart__item__content__settings__quantity"]]);

    let itemQuantity = appendNewChild(itemContentSettingsQuantity, "p");
    itemQuantity.textContent = "Qté : " + product.quantity;
   
    const itemInputQuantity = appendNewChild(itemContentSettingsQuantity, "input",
        [
            ["type", "number"],
            ["class", "itemQuantity"],
            ["name", "itemQuantity"],
            ["min", "1"],
            ["max", "100"],
            ["value", product.quantity]
        ]
    );
    itemInputQuantity.addEventListener("change", function(event) {
        changeItemQuantity(event.target.value, itemQuantity, product.id, product.color, itemInputQuantity);
    });
    
    const itemContentSettingsDelete = appendNewChild(article, "div", [["class", "cart__item__content__settings__delete"]]);

    const deleteItem = appendNewChild(itemContentSettingsDelete, "p", [["class","deleteItem"]]);
    deleteItem.textContent = "supprimer";
    deleteItem.addEventListener("click", function(){
        deleteItemFromCart(product.id, product.color, article);
    }); 
}

function resetTotal(){
    // Reset global variables to 0
    totalPrice = 0;
    totalQuantity = 0;;
}

function displayTotal(quantity, price) {
    // Update HTML total elements with given quantity and price
    document.getElementById("totalQuantity").textContent = quantity;
    document.getElementById("totalPrice").textContent = price;
}

function setTotalSum(price, quantity) {
    // Add total price and quantity to global variables
    totalPrice += parseInt(price) * parseInt(quantity);
    totalQuantity += parseInt(quantity);
}

function changeItemQuantity(quantity, itemQuantityContent, id, color, inputElement) {
    if (quantity > 100) {
        itemQuantityContent.textContent = "Qté : " + 100;
        quantity = 100; 
        inputElement.value = "100";
        alert("Vous pouvez ajouter seulement 100 pièces par produit");
    }
    // Update text quantity on HTML 
    itemQuantityContent.textContent = "Qté : " + quantity;
    // Find product stored in local variable and update quantity
    let itemToChange = products.find(element => element.id == id && element.color == color);
    itemToChange.quantity = quantity;
    // Find product by index in localStorage and update quantity
    let storedProducts = JSON.parse(localStorage.getItem("product"));
    let index = storedProducts.indexOf(storedProducts.find(element => element.id == id && element.color == color));
    storedProducts[index].quantity = itemToChange.quantity;
    // Set localStorage back to it updated value
    localStorage.setItem("product", JSON.stringify(storedProducts));
    // Reset total quantity and price and display it
    resetTotal();
    for (let product of products) {
        setTotalSum(product.price, product.quantity);
    }
    displayTotal(totalQuantity, totalPrice);
}

function deleteItemFromCart(id, color, domElement) {
    // Find index in product stored in local variable and delete it
    let index = products.indexOf(products.find(element => element.id == id && element.color == color));
    products.splice(index, 1);
    // Find product by index in localStorage and delete it
    let storedProducts = JSON.parse(localStorage.getItem("product"));
    index = storedProducts.indexOf(storedProducts.find(element => element.id == id && element.color == color));
    storedProducts.splice(index, 1);
    // Set localStorage back to updated products list
    localStorage.setItem("product", JSON.stringify(storedProducts));
    // Remove deleted product from HTML page
    domElement.remove();
    // Reset total quantity and price and display it
    resetTotal();
    if(products.length > 0) {
        for (let product of products) {
            setTotalSum(product.price, product.quantity);
        }
    } 
    displayTotal(totalQuantity, totalPrice);
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

//prevents user from writting wrong email
const emailRegex = /^([a-zA-Z0-9\.-_]+)@([a-zA-Z0-9-_]+)\.([a-z]{2,8})(\.[a-z]{2,8})?$/;
//prevents user from writting wrong firstname, lastname and city
const characterRegex = /^[a-zA-Zàâäéèêëïîôöùûüç'-]+$/;
// prevents user from writting wrong address
const addressRegex = /^([a-zA-Z0-9,-\. ]{1,60})$/;

// Get form inputs
const firstNameInput = document.getElementById("firstName");
const lastNameInput = document.getElementById("lastName");
const addressInput = document.getElementById("address");
const cityInput = document.getElementById("city");
const emailInput = document.getElementById("email");

//set boolean variables to check inputs
let emailOk = false;
let firstNameOk = false;
let lastNameOk = false;
let addressOk = false;
let cityOk = false;

function checkUserInput(input, regex, errorMessage) {
    // Get HTML element that contains error message
    const errorContainer = input.nextElementSibling;
    // Set HTML element text content to empty default value
    errorContainer.textContent = "";
    // Set HTML element text content to error message if regex is false
    if (!regex.test(input.value) || input.value == "") {
        errorContainer.textContent = errorMessage;
        return false;
    }
    return true; 
}

function setEventListeners() {
    // Check email
    emailInput.addEventListener("change", function() {
        emailOk = checkUserInput(emailInput, emailRegex, "Veuillez renseigner une adresse mail valide");
    });
    // check firstname
    firstNameInput.addEventListener("change", function() {
        firstNameOk = checkUserInput(firstNameInput, characterRegex, "Veuillez renseigner un prénom valide");
    });
    // Check lastname
    lastNameInput.addEventListener("change", function() {
        lastNameOk = checkUserInput(lastNameInput, characterRegex, "Veuillez renseigner un nom valide");
    });
    // Check address
    addressInput.addEventListener("change", function() {
        addressOk = checkUserInput(addressInput, addressRegex ,"Veuillez renseigner une adresse valide");
    });
    // Check city
    cityInput.addEventListener("change", function() {
        cityOk = checkUserInput(cityInput, characterRegex, "Veuillez renseigner une ville valide");
    });   
}
setEventListeners();

// Get HTML element matching to order button and add event listener 
// to submit order when user click on it
const orderButton = document.querySelector("#order");
orderButton.addEventListener("click", submitForm);

// Check the status response and send the status of error if needed
function checkPost(response) {
    if(!response.ok) {
        throw response.status;
    }
}

function submitForm(event) {
    event.preventDefault(); 
    // Check if inputs are valid
    if (!emailOk || !firstNameOk || !lastNameOk || !addressOk || !cityOk) {
        alert("Veuillez vérifier les champs renseignés");
    }
    // Display alert if the cart is empty
    else if(products.length === 0){
        alert("Veuillez selectionner un produit pour pouvoir continuer");
    // Send data to the API
    } else {
        let orderData = getOrderData();
        fetch("http://localhost:3000/api/products/order", {
            method : "post",
            headers: { 
                'Accept': 'application/json', 
                'Content-Type': 'application/json',
            },    
            body : JSON.stringify(orderData),
        }).then(function(res){
            checkPost(res);
            return res.json();
        }).then(function(data) {
            // redirect and add the order id to the confirmation page URL to display it
            localStorage.clear();
            window.location.href = "confirmation.html?orderId=" + data.orderId;
            // Display error message in html page depending of the error number
        }).catch(function(errorStatus){
            let parent = document.getElementById("limitedWidthBlock");
            let oldChild = document.getElementById("cartAndFormContainer");
            let newChild = document.createElement("p");
            switch (errorStatus) {
                case 400 : 
                    newChild.textContent = "Erreur " + errorStatus + " :  mauvaise requête";
                    break;

                case 404 : 
                    newChild.textContent = "Erreur " + errorStatus + " :  le produit n'a pas été trouvé";
                    break;
    
                case 500 : 
                    newChild.textContent = "Erreur " + errorStatus + " :  une erreur dans la base de donnée est survenue";
                    break;
    
                default : 
                    newChild.textContent = "Une erreur est survenue";
           }
           parent.replaceChild(newChild, oldChild);
        });
    }
}

function getOrderData() {
    // Set variable with empty array
    let productsList = [];
    // Create loop to push id of each product stored in local variable to the empty array
    for(let product of products) {
        productsList.push(product.id);
    }
    // Create and return an object with required data by the API
    const dataContactAndOrder = {
        contact : {
        firstName: firstNameInput.value,
        lastName: lastNameInput.value,
        address: addressInput.value,
        city: cityInput.value,
        email: emailInput.value,
        },
        products : productsList,
    }
    return dataContactAndOrder;  
}




