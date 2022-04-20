let url = new URL(window.location.href);
let productId = url.searchParams.get("id");


fetch("http://localhost:3000/api/products/" + productId)
    .then(function(res) {
        return res.json();
    })
    .then(function(item) {
        console.log(item);
        addItem(item);
    });

    function addItem(element) {
        const colors = element.colors;
        const imageUrl = element.imageUrl;
        const name = element.name;
        const price = element.price;
        const productDescription = element.description;
        const alt = element.altTxt;
        
        let image = document.createElement("img");
        image.setAttribute("src", imageUrl);
        image.setAttribute("alt", alt);
        let container = document.getElementsByClassName("item__img")
        let targetContainer = container[0];
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
    let product = {
        productId : productId,
        productQuantity : document.getElementById("quantity").value,
        productColor : document.getElementById("colors").options[document.getElementById('colors').selectedIndex].text,
    };
    localStorage.setItem("product",JSON.stringify(product));
    window.location.href = "cart.html";
});

    