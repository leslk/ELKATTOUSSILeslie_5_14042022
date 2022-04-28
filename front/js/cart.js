let totalPrice = 0;
let totalQuantity = 0;
let products = null;
getProducts().then(function () {
    createAllProducts(products);
});

async function getProducts() {
    products = JSON.parse(localStorage.getItem("product"));
    if (products === null) {
        products = [];
    }
    for (let product of products) {
        let res = await fetch("http://localhost:3000/api/products/" + product.id);
        let apiData = await res.json();
        //Set additional product attributes from API
        product.imageUrl = apiData.imageUrl;
        product.price = apiData.price;
        product.name = apiData.name;
        product.alt = apiData.altTxt;
    } 
}

function createAllProducts(products) {
    resetTotal();
    if (products.length === 0) {
        document.getElementById("cart__items").innerHTML = "<p>Votre panier est vide</p>";
        displayTotal(totalQuantity, totalPrice);
    } else {
        for (let product of products) {
            displayProduct(product);
            setTotalSum(product.price, product.quantity);
        }
        displayTotal(totalQuantity, totalPrice);  
    } 
}


function displayProduct(product) {
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
    changeItemQuantity(itemInputQuantity, itemQuantity, product.id, product.color);

    const itemContentSettingsDelete = appendNewChild(article, "div", [["class", "cart__item__content__settings__delete"]]);

    const deleteItem = appendNewChild(itemContentSettingsDelete, "p", [["class","deleteItem"]]);
    deleteItem.textContent = "supprimer";
    deleteItemFromCart(deleteItem, product.id, product.color, article);
}

function resetTotal(){
    totalPrice = 0;
    totalQuantity = 0;;
}

function displayTotal(quantity, price) {
    document.getElementById("totalQuantity").textContent = quantity;
    document.getElementById("totalPrice").textContent = price;
}

function setTotalSum(price, quantity) {
    totalPrice += parseInt(price) * parseInt(quantity);
    totalQuantity += parseInt(quantity);
}

function changeItemQuantity(ContentToWatch, itemQuantityContent, id, color) {
    ContentToWatch.addEventListener("change", function(event) {
        itemQuantityContent.textContent = event.target.value;
        let itemToChange = products.find(element => element.id == id && element.color == color);
        itemToChange.quantity = event.target.value;
        let storedProducts = JSON.parse(localStorage.getItem("product"));
        let index = storedProducts.indexOf(storedProducts.find(element => element.id == id && element.color == color));
        storedProducts[index].quantity = itemToChange.quantity;
        localStorage.setItem("product", JSON.stringify(storedProducts));
        resetTotal();
        for (let product of products) {
            setTotalSum(product.price, product.quantity);
        }
        displayTotal(totalQuantity, totalPrice);
    });
}

function deleteItemFromCart(itemToDelete, id, color, domElement) {
    itemToDelete.addEventListener("click", function() {
        let index = products.indexOf(products.find(element => element.id == id && element.color == color));
        products.splice(index, 1);
        let storedProducts = JSON.parse(localStorage.getItem("product"));
        index = storedProducts.indexOf(storedProducts.find(element => element.id == id && element.color == color));
        storedProducts.splice(index, 1);
        localStorage.setItem("product", JSON.stringify(storedProducts));
        domElement.remove();
        resetTotal();
        if(products.length > 0) {
            for (let product of products) {
                setTotalSum(product.price, product.quantity);
            }
        } 
        displayTotal(totalQuantity, totalPrice);
    });
}

function appendNewChild(parent, childName, attributes = []) {
    let child = document.createElement(childName);
    for (let attribute of attributes) { 
      child.setAttribute(attribute[0], attribute[1]);
    }
    parent.appendChild(child); 
    return child; 
}

let emailRegex = RegExp("^([a-zA-Z0-9\.-_]+)@([a-zA-Z0-9-_]+)\.([a-z]{2,8})(\.[a-z]{2,8})$");
let characterRegex = RegExp("^[a-zA-Zàâäéèêëïîôöùûüç'-]+$");
let addressRegex = RegExp("^([a-zA-Z0-9,-\. ]{1,60})$");

let firstNameInput = document.getElementById("firstName");
let lastNameInput = document.getElementById("lastName");
let addressInput = document.getElementById("address");
let cityInput = document.getElementById("city");
let emailInput = document.getElementById("email");

function checkForm() {
    
    emailInput.addEventListener("change", function() {
        validEmail(emailInput);
    });

    firstNameInput.addEventListener("change", function() {
        validFirstName(firstNameInput);
    });

    lastNameInput.addEventListener("change", function() {
        validLastName(lastNameInput);
    });

    addressInput.addEventListener("change", function() {
        validAddress(addressInput);
    });

    cityInput.addEventListener("change", function() {
        validCity(cityInput);
    });
    
    function validEmail(input) {
        let errorMsg = input.nextElementSibling;
    
        if(emailRegex.test(input.value)) {
            errorMsg.innerHTML = '';
        } else {
            errorMsg.innerHTML = "veuillez renseigner une adresse mail valide";
        }
    }

    function validLastName(input) {
        let errorMsg = input.nextElementSibling;
    
        if(characterRegex.test(input.value)) {
            errorMsg.innerHTML = '';
        } else {
            errorMsg.innerHTML = "veuillez renseigner un nom valide";
        }
    }

    function validFirstName(input) {
        let errorMsg = input.nextElementSibling;
    
        if(characterRegex.test(input.value)) {
            errorMsg.innerHTML = '';
        } else {
            errorMsg.innerHTML = "veuillez renseigner un prénom valide";
        }
    }

    function validAddress(input) {
        let errorMsg = input.nextElementSibling;
    
        if(addressRegex.test(input.value)) {
            errorMsg.innerHTML = '';
        } else {
            errorMsg.innerHTML = "veuillez renseigner une adresse valide";
        }
    }

    function validCity(input) {
        let errorMsg = input.nextElementSibling;
    
        if(characterRegex.test(input.value)) {
            errorMsg.innerHTML = '';
        } else {
            errorMsg.innerHTML = "veuillez renseigner une ville valide";
        }
    }
}
checkForm();

const submitButton = document.querySelector("#order");

submitButton.addEventListener("click", function(event) {
    submitForm(event);
})

function submitForm(event) {
    
    if(products.length === 0){
        alert("Veuillez selectionner un produit pour pouvoir continuer");
        event.preventDefault(); 
    } else {
        let orderData = getOrderData();
        fetch("http://localhost:3000/api/products/order", {
            method : "post",
            headers: { 
                'Accept': 'application/json', 
                'Content-Type': 'application/json' 
            },    
            body : JSON.stringify(orderData),
        }).then(function(res){
            return res.json();
        }).then(function(data) {
            console.log(data);
            window.location.href = "confirmation.html?orderId=" + data.orderId;
        }).catch(function(err){
            console.log(err);
        })
    }
}

function getOrderData() {
    let productsList = [];
    for(let product of products) {
        productsList.push(product.id);
    }
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




