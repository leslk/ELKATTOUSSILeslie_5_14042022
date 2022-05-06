// Check the status response and send the status of error if needed
function checkFetch(response) {
    if(!response.ok) {
        throw response.status;
    }
}

fetch("http://localhost:3000/api/products")
    .then(function(res) {
        checkFetch(res);
       return res.json();
    })
    .then(function(productsList) {
        for(let product of productsList) {
            addProduct(product);
        }
    })
    // Display error message in html page depending of the error number
    .catch(function(errorStatus){
        let parent = document.getElementsByClassName("limitedWidthBlock");
        let oldChild = document.querySelector(".titles");
        let newChild = document.createElement("p");
        switch (errorStatus) {
            case 404 : 
                newChild.textContent = "Erreur " + errorStatus + " :  les produits n'ont pas été trouvés";
                break;

            case 500 : 
                newChild.textContent = "Erreur " + errorStatus + " :  une erreur dans la base de donnée est survenue";
                break;

            default : 
                newChild.textContent = "Une erreur est survenue";
       }
       parent[2].replaceChild(newChild, oldChild);
    });
      
function addProduct(element) {
    // Set API data in constants
    const id = element._id;
    const imageUrl = element.imageUrl;
    const name = element.name;
    const productDescription = element.description;
    const alt = element.altTxt;

    // Create new DOM elements
    const anchor = appendNewChild(document.getElementById("items"), "a", [["href","./product.html?id=" + id]]);

    const article = appendNewChild(anchor, "article");
    
    appendNewChild(article, "img", [["src", imageUrl],["alt", alt]]);

    const title = appendNewChild(article, "h3", [["class", "productName"]]);
    title.textContent = name;

    const description = appendNewChild(article, "p", [["class", "productDescription"]]);
    description.textContent = productDescription;
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


