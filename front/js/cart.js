let totalPrice = 0;
let totalQuantity = 0;
getProducts().then(function (products) {
    createAllProducts(products);
});

async function getProducts() {
    let products = JSON.parse(localStorage.getItem("product"));
    for (let product of products) {
        let res = await fetch("http://localhost:3000/api/products/" + product.id);
        let apiData = await res.json();
        //Set additional product attributes from API
        product.imageUrl = apiData.imageUrl;
        product.name = apiData.name;
        product.alt = apiData.altTxt;
    }
    return products;
}

function createAllProducts(products) {
    resetTotal();
    for (let product of products) {
        displayProduct(product);
        setTotalSum(product.price, product.quantity);
    }
    displayTotal(totalQuantity, totalPrice);   
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
        let basket = JSON.parse(localStorage.getItem("product"));
        let itemToChange = basket.find(element => element.id == id && element.color == color);
        itemToChange.quantity = event.target.value;
        localStorage.setItem("product", JSON.stringify(basket));
        resetTotal();
        for (let product of basket) {
            setTotalSum(product.price, product.quantity);
            console.log(product.price);
        }
        displayTotal(totalQuantity, totalPrice);
    });
}

function deleteItemFromCart(itemToDelete, id, color, domElement) {
    itemToDelete.addEventListener("click", function() {
        let basket = JSON.parse(localStorage.getItem("product"));
        let indexToDelete = basket.indexOf(basket.find(element => element.id == id && element.color == color));
        basket.splice(indexToDelete, 1);
        localStorage.setItem("product", JSON.stringify(basket));
        domElement.remove();
        resetTotal();
        if(basket.length > 0) {
            for (let product of basket) {
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