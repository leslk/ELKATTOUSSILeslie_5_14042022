//---Recupération du localStorage---//
const products = JSON.parse(localStorage.getItem("product"));
createAllProducts(products);
let totalPrice = 0;
let totalQuantity = 0;


/*---Fonction qui définit les variables des elements contenus dans l'API et qui créer
les nouveaux éléments dans les DOM---*/
function displayProduct(product, apiData) {
    const imageUrl = apiData.imageUrl;
    const name = apiData.name;
    const price = apiData.price;
    const alt =apiData.altTxt;

    let article = document.createElement("article");
    article.setAttribute("class", "cart__item");
    article.setAttribute("data-id", product.productId);
    article.setAttribute("data-color", product.productColor);
    document.getElementById("cart__items").appendChild(article);

    const imageDiv = document.createElement("div");
    imageDiv.setAttribute("class", "cart__item__img")
    article.appendChild(imageDiv);

    const image = document.createElement("img");
    image.setAttribute("src", imageUrl);
    image.setAttribute("alt", alt);
    imageDiv.appendChild(image);

    const divItemContent = document.createElement("div");
    divItemContent.setAttribute("class", "cart__item__content");
    article.appendChild(divItemContent);

    const divItemContentDescription = document.createElement("div");
    divItemContentDescription.setAttribute("class", "cart__item__content__description");
    divItemContent.appendChild(divItemContentDescription);

    const itemName = document.createElement("h2");
    itemName.textContent = name;
    divItemContentDescription.appendChild(itemName);

    const itemColor = document.createElement("p");
    itemColor.textContent = product.productColor;
    divItemContentDescription.appendChild(itemColor);

    const itemPrice = document.createElement("p");
    itemPrice.textContent = price + " €";
    divItemContentDescription.appendChild(itemPrice);

    const itemSettings = document.createElement("div");
    itemSettings.setAttribute("class", "cart__item__content__settings");
    article.appendChild(itemSettings);

    const itemContentSettingsQuantity = document.createElement("div");
    itemContentSettingsQuantity.setAttribute("class","cart__item__content__settings__quantity");
    itemSettings.appendChild(itemContentSettingsQuantity);

    let itemQuantity = document.createElement("p");
    itemQuantity.textContent = "Qté : " + product.productQuantity;
    itemContentSettingsQuantity.appendChild(itemQuantity);

    const itemInputQuantity = document.createElement("input");
    itemInputQuantity.setAttribute("type", "number");
    itemInputQuantity.setAttribute("class", "itemQuantity");
    itemInputQuantity.setAttribute("name", "itemQuantity");
    itemInputQuantity.setAttribute("min", "1");
    itemInputQuantity.setAttribute("max", "100");
    itemInputQuantity.setAttribute("value", product.productQuantity);
    itemContentSettingsQuantity.appendChild(itemInputQuantity);

    itemInputQuantity.addEventListener("change", function() {
        itemQuantity.textContent = itemInputQuantity.value;
        let basket = JSON.parse(localStorage.getItem("product"));
        let itemToChange = basket.find(element => element.productId == product.productId && element.productColor == product.productColor);
        itemToChange.productQuantity = itemInputQuantity.value;
        localStorage.setItem("product", JSON.stringify(basket));
        let totalPrice = 0;
        let totalQuantity = 0;
        for (let product of basket) {
            totalQuantity += parseInt(product.productQuantity);
            totalPrice += price * parseInt(product.productQuantity);
        }
        displayTotal(totalQuantity, totalPrice);
    });

    const itemContentSettingsDelete = document.createElement("div");
    itemContentSettingsDelete.setAttribute("class", "cart__item__content__settings__delete");
    article.appendChild(itemContentSettingsDelete);

    const deleteItem = document.createElement("p");
    deleteItem.setAttribute("class","deleteItem");
    deleteItem.textContent = "supprimer";
    itemContentSettingsDelete.appendChild(deleteItem);

    deleteItem.addEventListener("click", function() {
        let basket = JSON.parse(localStorage.getItem("product"));
        let indexToDelete = basket.indexOf(basket.find(element => element.productId == product.productId && element.productColor == product.productColor));
        basket.splice(indexToDelete, 1);
        localStorage.setItem("product", JSON.stringify(basket));
        article.remove();
        let totalPrice = 0;
        let totalQuantity = 0;
        for (let product of basket) {
            totalQuantity += parseInt(product.productQuantity);
            totalPrice += price * parseInt(product.productQuantity);
        }
        displayTotal(totalQuantity, totalPrice);
    });
}

function displayTotal(quantity, price) {
    document.getElementById("totalQuantity").textContent = quantity;
    document.getElementById("totalPrice").textContent = price;
}

async function createAllProducts(products) {
    let totalPrice = 0;
    let totalQuantity = 0;
    for (let product of products) {
        let res = await fetch("http://localhost:3000/api/products/" + product.productId);
        let apiData = await res.json();
        displayProduct(product, apiData);
        totalQuantity += parseInt(product.productQuantity);
        totalPrice += apiData.price * parseInt(product.productQuantity);
    } 
    displayTotal(totalQuantity, totalPrice);   
}

