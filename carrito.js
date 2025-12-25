
<script>
function getCart() {
  return JSON.parse(localStorage.getItem('cart')) || [];
}

function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
}

function addToCart(name, price) {
  const cart = getCart();
  cart.push({ name, price });
  saveCart(cart);
  alert("Agregado al carrito");
}

function updateCartCount() {
  const count = document.getElementById("cart-count");
  if (count) count.textContent = getCart().length;
}

document.addEventListener("DOMContentLoaded", updateCartCount);
</script>