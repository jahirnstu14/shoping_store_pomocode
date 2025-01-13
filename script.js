let products = [];
let cart = [];

// Fetch products from products.json
async function fetchProducts() {
  try {
    const response = await axios.get("products.json");
    products = response.data;
    displayProducts();
  } catch (error) {
    console.error("Error fetching products:", error);
  }
}

// Display products
function displayProducts() {
  const productList = document.getElementById("product-list");
  productList.innerHTML = "";
  products.forEach(product => {
    productList.innerHTML += `
      <div class="col-md-4">
        <div class="card product-card">
          <img src="${product.image}" class="card-img-top" alt="${product.name}">
          <div class="card-body">
            <h5 class="card-title">${product.name}</h5>
            <p class="card-text">${product.description}</p>
            <p class="card-text text-primary">$${product.price}</p>
            <button class="btn btn-success btn-large" onclick="addToCart(${product.id})">Add to Cart</button>
          </div>
        </div>
      </div>
    `;
  });
}

// Add product to cart
function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  const existingItem = cart.find(item => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  updateCartCount();
  displayCart();
}

// Update cart count
function updateCartCount() {
  const cartCount = document.getElementById("cart-count");
  cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
}

// Display cart items
function displayCart() {
  const cartItems = document.getElementById("cart-items");
  cartItems.innerHTML = "";

  cart.forEach(item => {
    cartItems.innerHTML += `
      <tr>
        <td>${item.name}</td>
        <td>$${item.price}</td>
        <td>
          <input type="number" value="${item.quantity}" min="1" onchange="updateQuantity(${item.id}, this.value)">
        </td>
        <td>$${(item.price * item.quantity).toFixed(2)}</td>
        <td><button class="btn btn-danger btn-sm" onclick="removeFromCart(${item.id})">Remove</button></td>
      </tr>
    `;
  });

  calculateTotal();
}

// Update item quantity
function updateQuantity(productId, quantity) {
  const item = cart.find(i => i.id === productId);
  const parsedQuantity = parseInt(quantity, 10);

  if (isNaN(parsedQuantity) || parsedQuantity < 1) {
    alert("Please enter a valid quantity.");
    return;
  }

  item.quantity = parsedQuantity;
  displayCart();
}

// Remove item from cart
function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  updateCartCount();
  displayCart();
}

// Calculate total price with discount
function calculateTotal() {
  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const discount = (subtotal * discountAmount).toFixed(2);
  const finalTotal = (subtotal - discount).toFixed(2);

  document.getElementById("subtotal-price").textContent = subtotal.toFixed(2);
  document.getElementById("discount-price").textContent = discount;
  document.getElementById("final-price").textContent = finalTotal;
}

// Clear cart
document.getElementById("clear-cart").addEventListener("click", () => {
  cart = [];
  updateCartCount();
  displayCart();
});

// Toggle cart visibility
document.getElementById("view-cart").addEventListener("click", () => {
  const cartSection = document.getElementById("cart");
  cartSection.classList.toggle("hidden");
  displayCart();
});

// Promo code functionality
let promoApplied = false;
let discountAmount = 0;
const promoCodes = {
  ostad10: 0.10,
  ostad5: 0.05
};

document.getElementById("apply-promo").addEventListener("click", () => {
  const promoInput = document.getElementById("promo-code").value.trim().toLowerCase();
  const promoMessage = document.getElementById("promo-message");

  if (promoApplied) {
    promoMessage.textContent = "Promo code already applied!";
    promoMessage.style.color = "red";
    return;
  }

  if (promoCodes[promoInput]) {
    promoApplied = true;
    discountAmount = promoCodes[promoInput];
    promoMessage.textContent = `Promo code "${promoInput}" applied successfully!`;
    promoMessage.style.color = "green";
    calculateTotal();
  } else {
    promoMessage.textContent = "Invalid promo code. Please try again.";
    promoMessage.style.color = "red";
    document.getElementById("promo-code").value = ""; // Clear the input field
  }
});

// Initialize products
fetchProducts();
