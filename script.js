// Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getFirestore,
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


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


// Load Games From Firestore
async function loadGames() {

  const gamesContainer =
    document.getElementById("gamesContainer");

  gamesContainer.innerHTML =
    "<p>جاري تحميل الألعاب...</p>";

  try {

    const querySnapshot =
      await getDocs(collection(db, "games"));

    gamesContainer.innerHTML = "";

    querySnapshot.forEach((doc) => {

      const game = doc.data();

      gamesContainer.innerHTML += `
      <div class="card game-card">

        <img src="images/playstation.png"
             alt="${game.name}">

        <h3>${game.name}</h3>

        <p class="game-price">
          ${game.price || ""}
        </p>

        <button onclick="addToCart('${game.name}')">
          إضافة إلى السلة
        </button>

      </div>
      `;

    });

  } catch (error) {

    gamesContainer.innerHTML =
      "<p>حدث خطأ أثناء تحميل الألعاب</p>";

    console.error(error);

  }

}


// Search
window.searchGames = function () {

  const input =
    document.getElementById("searchInput")
      .value.toLowerCase();

  const cards =
    document.querySelectorAll(".game-card");

  cards.forEach(card => {

    const title =
      card.querySelector("h3")
      .textContent
      .toLowerCase();

    card.style.display =
      title.includes(input)
      ? "block"
      : "none";

  });

};


// Add To Cart
window.addToCart = function (gameName) {

  if (cart.includes(gameName)) {

    alert("اللعبة موجودة بالفعل");

    return;
  }

  cart.push(gameName);

  updateCart();
};


// Update Cart
function updateCart() {

  const cartList =
    document.getElementById("cartList");

  const cartCount =
    document.getElementById("cartCount");

  cartList.innerHTML = "";

  cart.forEach((game, index) => {

    const li =
      document.createElement("li");

    li.innerHTML = `
      ${game}
      <button
      class="remove-btn"
      onclick="removeFromCart(${index})">
      ❌
      </button>
    `;

    cartList.appendChild(li);

  });

  cartCount.textContent =
    "عدد الألعاب: " + cart.length;

}


// Remove Game
window.removeFromCart = function(index){

  cart.splice(index, 1);

  updateCart();

};


// WhatsApp Order
window.sendWhatsAppOrder = function(){

  if(cart.length === 0){

    alert("السلة فارغة");

    return;
  }

  let message =
    "مرحباً، أرغب بطلب الألعاب التالية:%0A%0A";

  cart.forEach(game => {

    message += "• " + game + "%0A";

  });

  window.open(
    "https://wa.me/963943641243?text=" +
    message,
    "_blank"
  );

};


// Start
loadGames();
