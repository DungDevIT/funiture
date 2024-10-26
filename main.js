// Menu toggle button
const menuBtn = document.getElementById("menu-btn");
const navbar = document.querySelector(".navbar");

menuBtn.addEventListener("click", () => {
  menuBtn.classList.toggle("bx-x");
  navbar.classList.toggle("active");
});

// Scroll sections active link
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".navbar a");

window.onscroll = () => {
  let scrollY = window.scrollY;

  sections.forEach((sec) => {
    const offsetTop = sec.offsetTop - 150;
    const offsetBottom = offsetTop + sec.offsetHeight;
    const id = sec.getAttribute("id");

    if (scrollY >= offsetTop && scrollY < offsetBottom) {
      navLinks.forEach((link) => link.classList.remove("active"));
      document.querySelector(`.navbar a[href*=${id}]`).classList.add("active");
    }
  });

  // Sticky navbar
  const header = document.querySelector(".header");
  header.classList.toggle("sticky", scrollY > 100);

  menuBtn.classList.remove("bx-x");
  navbar.classList.remove("active");
};

// Add to cart functionality
const listProductHTML = document.querySelector(".listProduct");
const listCartHTML = document.querySelector(".listCart");
const iconCart = document.querySelector(".icons-cart i");
const iconCartSpan = document.querySelector(".icons-cart span");
const body = document.body;
const closeCart = document.getElementById("closeCart");
const closeBtn = document.getElementById("close-btn");

let products = [];
let cart = [];

// close btn
closeBtn.addEventListener("click", () => {
  body.classList.remove("showCart");
});

// Toggle cart visibility
iconCart.addEventListener("click", () => body.classList.toggle("showCart"));
// closeCart.addEventListener("click", () => body.classList.toggle("showCart"));

// Add products to HTML
const addDataToHTML = () => {
  listProductHTML.innerHTML = ""; // Clear existing products

  products.forEach((product) => {
    const newProduct = document.createElement("div");
    newProduct.classList.add("item");
    newProduct.dataset.id = product.id;
    newProduct.innerHTML = `
      <img src="${product.image}" alt="">
      <h2>${product.name}</h2>
      <div class="price">$${product.price}</div>
      <button class="btn btn-addCart">Add To Cart</button>
    `;
    listProductHTML.appendChild(newProduct);
  });
};

// Add to cart logic
listProductHTML.addEventListener("click", (event) => {
  let positionClick = event.target;
  if (positionClick.classList.contains("btn-addCart")) {
    let id_product = positionClick.parentElement.dataset.id;
    addToCart(id_product);
  }
});
const addToCart = (product_id) => {
  let positionThisProductInCart = cart.findIndex(
    (value) => value.product_id == product_id
  );
  if (cart.length <= 0) {
    cart = [
      {
        product_id: product_id,
        quantity: 1,
      },
    ];
  } else if (positionThisProductInCart < 0) {
    cart.push({
      product_id: product_id,
      quantity: 1,
    });
  } else {
    cart[positionThisProductInCart].quantity =
      cart[positionThisProductInCart].quantity + 1;
  }
  addCartToHTML();
  addCartToMemory();
};
const addCartToMemory = () => {
  localStorage.setItem("cart", JSON.stringify(cart));
};
const addCartToHTML = () => {
  listCartHTML.innerHTML = "";
  let totalQuantity = 0;
  if (cart.length > 0) {
    cart.forEach((item) => {
      totalQuantity = totalQuantity + item.quantity;
      let newItem = document.createElement("div");
      newItem.classList.add("item");
      newItem.dataset.id = item.product_id;

      let positionProduct = products.findIndex(
        (value) => value.id == item.product_id
      );
      let info = products[positionProduct];
      listCartHTML.appendChild(newItem);
      newItem.innerHTML = `
                <div class="image">
                    <img src="${info.image}">
                </div>
                <h3 class="name">
                ${info.name}
                </h3>
                <p class="totalPrice">$${info.price * item.quantity}</p>
                <div class="quantity">
                    <span class="minus"><</span>
                    <span>${item.quantity}</span>
                    <span class="plus">></span>
                </div>
            `;
    });
  }
  iconCartSpan.innerText = totalQuantity;
};

listCartHTML.addEventListener("click", (event) => {
  let positionClick = event.target;
  if (
    positionClick.classList.contains("minus") ||
    positionClick.classList.contains("plus")
  ) {
    let product_id = positionClick.parentElement.parentElement.dataset.id;
    let type = "minus";
    if (positionClick.classList.contains("plus")) {
      type = "plus";
    }
    changeQuantityCart(product_id, type);
  }
});
const changeQuantityCart = (product_id, type) => {
  let positionItemInCart = cart.findIndex(
    (value) => value.product_id == product_id
  );
  if (positionItemInCart >= 0) {
    let info = cart[positionItemInCart];
    switch (type) {
      case "plus":
        cart[positionItemInCart].quantity =
          cart[positionItemInCart].quantity + 1;
        break;

      default:
        let changeQuantity = cart[positionItemInCart].quantity - 1;
        if (changeQuantity > 0) {
          cart[positionItemInCart].quantity = changeQuantity;
        } else {
          cart.splice(positionItemInCart, 1);
        }
        break;
    }
  }
  addCartToHTML();
  addCartToMemory();
};

const initApp = () => {
  // get data product
  fetch("products.json")
    .then((response) => response.json())
    .then((data) => {
      products = data;
      addDataToHTML();

      // get data cart from memory
      if (localStorage.getItem("cart")) {
        cart = JSON.parse(localStorage.getItem("cart"));
        addCartToHTML();
      }
    });
};
initApp();
