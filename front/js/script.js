fetch("http://localhost:3000/api/products")
    .then(function(res) {
      if(res.ok){
       return res.json();
      }
    })
    .then(function(data) {
        console.log(data);
        for(let i in data) {
            addProduct(data[i]);
        }
    });
      
function addProduct(element) {
    const id = element._id;
    const imageUrl = element.imageUrl;
    const name = element.name;
    const productDescription = element.description;
    const alt = element.altTxt;

    let anchor = document.createElement("a");
    anchor.setAttribute("href","./product.html?id=" + id);
    document.getElementById("items").appendChild(anchor);

    let article = document.createElement("article");
    anchor.appendChild(article);
    
    let image = document.createElement("img");
    image.setAttribute("src", imageUrl);
    image.setAttribute("alt", alt);
    article.appendChild(image);

    let title = document.createElement("h3");
    title.setAttribute("class", "productName");
    title.textContent = name;
    article.appendChild(title);

    let description = document.createElement("p");
    description.setAttribute("class", "productDescription");
    description.textContent = productDescription;
    article.appendChild(description);
}

