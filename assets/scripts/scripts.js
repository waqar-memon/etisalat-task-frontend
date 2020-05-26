function includeHTML() {
    var z, i, elmnt, file, xhttp;
    /* Loop through a collection of all HTML elements: */
    z = document.getElementsByTagName("*");
    for (i = 0; i < z.length; i++) {
      elmnt = z[i];
      /*search for elements with a certain atrribute:*/
      file = elmnt.getAttribute("w3-include-html");
      if (file) {
        /* Make an HTTP request using the attribute value as the file name: */
        xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
          if (this.readyState == 4) {
            if (this.status == 200) {elmnt.innerHTML = this.responseText;}
            if (this.status == 404) {elmnt.innerHTML = "Page not found.";}
            /* Remove the attribute, and call this function once more: */
            elmnt.removeAttribute("w3-include-html");
            includeHTML();
          }
        }
        xhttp.open("GET", file, true);
        xhttp.send();
        /* Exit the function: */
        return;
      }
    }
  }

  function addToCart(productId) {
    let data = document.getElementById(productId).value;
    let jsonData = JSON.parse(data);
    var addedToCart = JSON.parse(localStorage.getItem('addedToCart'));
    if (addedToCart === null) {
        addedToCart = [{ ...jsonData, quantity: 1 }];
    } else {
        let flag = false;
        for (let i = 0; i < addedToCart.length; i++) {
            if (addedToCart[i].productId.toString().localeCompare(productId) === 0) {
                addedToCart[i].quantity += 1;
                flag = true;
                break;
            }
        }
        if (!flag) {
            addedToCart.push({ ...jsonData, quantity: 1 });
        }
    }
    localStorage.removeItem('addedToCart');
    localStorage.setItem('addedToCart', JSON.stringify(addedToCart));
    updateCartDropdown();
    $('.toast').toast('show');
}

function countCartItems() {
    let addedToCart = JSON.parse(localStorage.getItem('addedToCart'));
    let count = 0;
    if (addedToCart !== null) {
        for (let i = 0; i < addedToCart.length; i++) {
            count += addedToCart[i].quantity;
        }
    }
    return count;
}

function updateCartDropdown() {
    let totalItems = countCartItems();
    let p = document.createElement("p");
    p.style.fontSize = "12px";
    p.style.backgroundColor = "black";
    p.style.color = "white";
    p.style.padding = "5px";
    let p_node = document.createTextNode(`There are ${totalItems} items in the cart`);
    p.appendChild(p_node);

    let div = document.createElement("div");
    div.className = "cart-item";

    let addedToCart = JSON.parse(localStorage.getItem('addedToCart'));
    if (addedToCart !== null) {
        for (let i = 0; i < addedToCart.length; i++) {
            let p1 = document.createElement("p");
            p1.style.fontSize = "12px";
            let p1_node = document.createTextNode(`${addedToCart[i].quantity} X ${addedToCart[i].productName}`);
            p1.appendChild(p1_node);
            div.appendChild(p1);
        }
    }
    let newOuterDiv = document.createElement('div');
    newOuterDiv.className = 'cart-container';
    newOuterDiv.id = 'cart-container';
    newOuterDiv.appendChild(p);
    newOuterDiv.appendChild(div);
    let outerDiv = document.getElementById('cart-container');
    outerDiv.replaceWith(newOuterDiv);
}  
function removeItem(productId){
    var addedToCart = JSON.parse(localStorage.getItem('addedToCart'));
    var newArray = [];
    for(let i=0; i< addedToCart.length; i++){
        if(addedToCart[i].productId.toString().localeCompare(productId) !== 0){
            newArray.push(addedToCart[i]);
        }
    }

    localStorage.removeItem('addedToCart');
    localStorage.setItem('addedToCart', JSON.stringify(newArray));
    location.reload();
}

function showCart(){
    var addedToCart = JSON.parse(localStorage.getItem('addedToCart'));
    let finalResponse = "";
    let total = 0;
    if(addedToCart !== null && addedToCart.length > 0){
        let totalItems = countCartItems();
        let cartItemsHeading = document.getElementById("cart-items-heading");
        cartItemsHeading.textContent = `There are current ${totalItems} items in your cart.`
        let tbody = document.getElementById('content');
        let hasChildNodes = tbody.hasChildNodes();
        for(let i=0; i<addedToCart.length; i++){
            let tr = document.createElement("tr");

            let td = document.createElement("td");
            let img = document.createElement("IMG");
            img.setAttribute("src", addedToCart[i].image);
            img.className = 'mx-auto d-block img-fluid';
            img.setAttribute("width", "60");
            img.setAttribute("height", "60");
            td.appendChild(img);
            tr.appendChild(td);

            td = document.createElement("td");
            td.textContent = addedToCart[i].productName;
            tr.appendChild(td);    

            td = document.createElement("td");
            td.textContent = addedToCart[i].productPrice;
            tr.appendChild(td);

            td = document.createElement("td");
            td.textContent = addedToCart[i].quantity;
            tr.appendChild(td);

            td = document.createElement("td");
            td.textContent = addedToCart[i].quantity * addedToCart[i].productPrice;
            tr.appendChild(td);                        

            td = document.createElement("td");
            let a = document.createElement("a");
            a.role = "button";
            a.className = "btn btn-warning";
            a.textContent = "X";
            a.style.color = "white";
            a.onclick = () => removeItem(addedToCart[i].productId);
            td.appendChild(a);
            tr.appendChild(td);

            tbody.appendChild(tr);

            total += addedToCart[i].quantity * addedToCart[i].productPrice;

        }
        let tr = document.createElement("tr");

        let td = document.createElement("td");
        tr.appendChild(td);

        td = document.createElement("td");
        tr.appendChild(td);

        td = document.createElement("td");
        tr.appendChild(td);                    

        td = document.createElement("td");
        td.textContent = `Total: `;
        td.colSpan = 1;
        tr.appendChild(td);

        td = document.createElement("td");
        td.textContent = total;
        td.colSpan = 1;
        tr.appendChild(td);

        tbody.appendChild(tr);

        let place_order_btn = document.getElementById("place_order");
        place_order_btn.disabled = false;
    }else{
        let table = document.getElementById("table");

        let p = document.createElement("p");
        p.textContent = "There are currently no products in the cart.";

        table.replaceWith(p);
    }
}
function login(){
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let data = {email: email, password: password};
    $.ajax({
        url: "http://localhost:8082/customers/authenticate",
        type: "POST",
        method: "POST",
        data: JSON.stringify(data),
        dataType: "json",
        contentType: "application/json"
    }).done(function(response) {
        if(response.message?.status === "401"){
            $('.toast').toast('show');
        }else{
            localStorage.setItem('profile', JSON.stringify(response.data));
            window.location.href = "place_order.html";
        }
    }).fail(function(err){
    });
}

function renderData(){
    let profile = JSON.parse(localStorage.getItem('profile'));
    if(profile !== null){
        let name = document.getElementById('name');
        name.setAttribute('value', profile.name);
        let mobile = document.getElementById('mobile');
        mobile.setAttribute('value', profile.mobile);
        let landline = document.getElementById('landline');
        landline.setAttribute('value', profile.landline);
        let country = document.getElementById('country');
        country.setAttribute('value', profile.country);
        let city = document.getElementById('city');
        city.setAttribute('value', profile.city);
        let address = document.getElementById('address');
        address.setAttribute('value', profile.address);
    }
}
function placeOrder(){
    let profile = JSON.parse(localStorage.getItem('profile'));
    let id = profile.id;
    let mobile = document.getElementById('mobile').value;
    let landline = document.getElementById('landline').value;
    let country = document.getElementById('country').value;
    let city = document.getElementById('city').value;
    let address = document.getElementById('address').value;
    let customer = {id: id, mobile: mobile, landline: landline, country: country, city: city, address: address};

    let cartItems = JSON.parse(localStorage.getItem('addedToCart'));
    let products = [];
    for(let i=0; i< cartItems.length; i++){
        let obj = {
            id: cartItems[i].productId,
            quantity: cartItems[i].quantity
        }
        products.push(obj);
    }
    $.ajax({
        url: "http://localhost:8083/orders/add",
        type: "POST",
        method: "POST",
        data: JSON.stringify({customer: customer, products: products}),
        dataType: "json",
        contentType: "application/json"
    }).done(function(response) {
        // alert(response.data.orderId);
        localStorage.setItem('orderId', response.data.orderId);
        localStorage.removeItem('profile');
        localStorage.removeItem('addedToCart');
        window.location.href = "order_placed.html";
    }).fail(function(err){
    });
}

function renderOrderId(){
    let orderId = localStorage.getItem('orderId');
    let p = document.getElementById("order-id");
    p.textContent = orderId;
}