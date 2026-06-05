// Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyCxSrtYSCGI9EQWZyPUFqKU3baqOuWO5gY",
  authDomain: "magican-5bbcd.firebaseapp.com",
  projectId: "magican-5bbcd",
  storageBucket: "magican-5bbcd.firebasestorage.app",
  messagingSenderId: "865515431997",
  appId: "1:865515431997:web:833a104afa91c51c092254"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Cart
let cart = [];

// Load Products From Firestore
async function loadProducts() {
  const container = document.getElementById("productsContainer");
  container.innerHTML = "<p>جاري تحميل المنتجات...</p>";

  try {
    const querySnapshot = await getDocs(collection(db, "products"));
    container.innerHTML = "";

    querySnapshot.forEach((doc) => {
      const product = doc.data();
      const name = product.name || "اسم المنتج غير محدد";
      const price = product.price || "السعر غير متوفر";

      container.innerHTML += `
        <div class="card product-card">
          <img src="${product.image || 'images/default.png'}" alt="${name}">
          <h3>${name}</h3>
          <p class="product-price">${price}</p>
          <button onclick="addToCart('${name}')">إضافة إلى السلة</button>
        </div>
      `;
    });

  } catch (error) {
    container.innerHTML = "<p>حدث خطأ أثناء تحميل المنتجات</p>";
    console.error(error);
  }
}

// Search
window.searchProducts = function () {
  const input = document.getElementById("searchInput").value.toLowerCase();
  const cards = document.querySelectorAll(".product-card");

  cards.forEach(card => {
    const title = card.querySelector("h3").textContent.toLowerCase();
    card.style.display = title.includes(input) ? "block" : "none";
  });
};

// Add To Cart
window.addToCart = function (productName) {
  if(cart.includes(productName)){
    alert("المنتج موجود بالفعل في السلة");
    return;
  }
  cart.push(productName);
  updateCart();
};

// Update Cart
function updateCart() {
  const cartList = document.getElementById("cartList");
  const cartCount = document.getElementById("cartCount");
  cartList.innerHTML = "";

  cart.forEach((item, index) => {
    const li = document.createElement("li");
    li.innerHTML = `${item} <button class="remove-btn" onclick="removeFromCart(${index})">❌</button>`;
    cartList.appendChild(li);
  });

  cartCount.textContent = "عدد المنتجات: " + cart.length;
}

// Remove from Cart
window.removeFromCart = function(index){
  cart.splice(index,1);
  updateCart();
};

// WhatsApp Order
window.sendWhatsAppOrder = function(){
  if(cart.length === 0){
    alert("السلة فارغة");
    return;
  }

  let message = "مرحباً، أرغب بطلب المنتجات التالية:%0A%0A";
  cart.forEach(item => message += "• " + item + "%0A");

  window.open("https://wa.me/963943641243?text=" + message,"_blank");
};

// Start
loadProducts();
