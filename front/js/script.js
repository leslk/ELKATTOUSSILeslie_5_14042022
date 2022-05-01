fetch("http://localhost:3000/api/products")
    .then(function(res) {
      if(res.ok){
       return res.json();
      }
      return res.text().then(text => {
        const htmlTag = document.querySelector("html");
        htmlTag.replaceWith(text.innerHTML);
      });
    })
    .then(function(productsList) {
        for(let product of productsList) {
            addProduct(product);
        }
    })
    .catch(function(error) {
        console.log(error);
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


