document.addEventListener('DOMContentLoaded', function() {
  const cartContainer = document.getElementById('cart-container');
  const clearCartBtn = document.getElementById('clearCartBtn');
  const cardData = localStorage.getItem("card_list");

  // Функция обновления счетчика корзины
  function updateCartCount() {
      const cartData = JSON.parse(localStorage.getItem("card_list"));
      let totalItems = 0;
      
      if (cartData) {
          totalItems = cartData.reduce((sum, item) => sum + item.quantity, 0);
      }
      
      // Обновляем счетчик в иконке корзины
      const cartBadge = document.querySelector('.badge');
      if (cartBadge) {
          cartBadge.textContent = totalItems;
      }
  }

  // Функция очистки корзины
  function clearCart() {
      const cartData = JSON.parse(localStorage.getItem("card_list"));
      if (cartData) {
          cartData.forEach(item => {
              item.quantity = 0;
          });
          localStorage.setItem("card_list", JSON.stringify(cartData));
          renderCart();
          updateCartCount();
      }
  }

  // Функция отображения корзины
  function renderCart() {
      if (cardData) {
          const parsedCards = JSON.parse(cardData);
          const itemsInCart = parsedCards.filter(item => item.quantity > 0);
          
          if (itemsInCart.length > 0) {
              cartContainer.innerHTML = itemsInCart.map(item => `
                  <div class="card mb-3" style="max-width: 1000px; margin: 0 auto">
                      <div class="row g-0">
                          <div class="col-md-4">
                              <img src="${item.image}" class="img-fluid rounded-start" alt="${item.name}">
                          </div>
                          <div class="col-md-8">
                              <div class="card-body">
                                  <h5 class="card-title">${item.name}</h5>
                                  <p class="card-price">${item.price}$</p>
                                  <p class="card-qual">Количество: ${item.quantity}</p>
                                  <p class="card-total">Итого: ${item.price * item.quantity}$</p>
                              </div>
                          </div>
                      </div>
                  </div>
              `).join('');
          } else {
              cartContainer.innerHTML = '<p class="text-center">Ваша корзина пуста</p>';
          }
      } else {
          cartContainer.innerHTML = '<p class="text-center">Ваша корзина пуста</p>';
      }
  }

  // Обработчик кнопки очистки корзины
  if (clearCartBtn) {
      clearCartBtn.addEventListener('click', clearCart);
  }

  // Инициализация
  renderCart();
  updateCartCount();
});