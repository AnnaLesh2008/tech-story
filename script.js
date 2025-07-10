document.addEventListener('DOMContentLoaded', function() {
    // Инициализация корзины
    let card_list = [
        { "id": "1", "quantity": 0, "price": 799, "name": "Смартфон X", "image": "img/card_phone.jpg" },
        { "id": "2", "quantity": 0, "price": 1299, "name": "Ноутбук Pro", "image": "img/laptop-card.jpg" },
        { "id": "3", "quantity": 0, "price": 249, "name": "Наушники Pro", "image": "img/head[hones-card.jpg" },
        { "id": "4", "quantity": 0, "price": 199, "name": "Умные часы", "image": "img/clocks_card.jpg" }
    ];

    // Загружаем данные из localStorage или инициализируем новые
    const savedCart = localStorage.getItem("card_list");
    if (!savedCart) {
        localStorage.setItem("card_list", JSON.stringify(card_list));
    }

    // Обновляем счетчик корзины в навигации
    updateCartCount();

    // Обработчики для кнопок "+" и "-"
    document.querySelectorAll('.plus').forEach(button => {
        button.addEventListener('click', function() {
            const input = this.parentElement.querySelector('.count_plus-minas');
            input.value = Number(input.value) + 1;
        });
    });

    document.querySelectorAll('.minas').forEach(button => {
        button.addEventListener('click', function() {
            const input = this.parentElement.querySelector('.count_plus-minas');
            if (Number(input.value) > 1) {
                input.value = Number(input.value) - 1;
            }
        });
    });

    // Обработчики для кнопок "Добавить в корзину"
    document.querySelectorAll('.add-to-card').forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            const input = modal.querySelector('.count_plus-minas');
            const inputValue = Number(input.value);
            const productId = this.classList.contains('phone') ? '1' : 
                             this.classList.contains('laptop') ? '2' : 
                             this.classList.contains('headphones') ? '3' : '4';

            if (inputValue > 0) {
                addToCart(productId, inputValue);
                updateCartCount();
                input.value = 1; // Сбрасываем счетчик
                
                // Показываем уведомление
                showAlert('Товар добавлен в корзину!', 'success');
            }
        });
    });

    // Функция добавления товара в корзину
    function addToCart(productId, quantity) {
        const cartData = JSON.parse(localStorage.getItem("card_list"));
        const productIndex = cartData.findIndex(item => item.id === productId);
        
        if (productIndex !== -1) {
            cartData[productIndex].quantity += quantity;
            localStorage.setItem("card_list", JSON.stringify(cartData));
        }
    }

    // Функция обновления счетчика корзины
    function updateCartCount() {
        const cartData = JSON.parse(localStorage.getItem("card_list"));
        let totalItems = 0;
        
        if (cartData) {
            totalItems = cartData.reduce((sum, item) => sum + item.quantity, 0);
        }
        
        document.querySelectorAll('.card-count, .badge').forEach(element => {
            if (element.classList.contains('card-count')) {
                element.textContent = totalItems;
            } else if (element.parentElement.href && element.parentElement.href.includes('card.html')) {
                element.textContent = totalItems;
            }
        });
    }

    // Функция показа уведомления
    function showAlert(message, type) {
        const alert = document.createElement('div');
        alert.className = `alert alert-${type} position-fixed top-0 end-0 m-3`;
        alert.style.zIndex = '1100';
        alert.textContent = message;
        
        document.body.appendChild(alert);
        
        setTimeout(() => {
            alert.remove();
        }, 3000);
    }

    // Переключение темы
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;

    // Проверяем сохранённую тему
    const savedTheme = localStorage.getItem('theme') || 'light';
    html.setAttribute('data-bs-theme', savedTheme);

    // Обновляем иконку кнопки
    updateButtonIcon(savedTheme);

    // Клик по кнопке
    themeToggle.addEventListener('click', function() {
        const currentTheme = html.getAttribute('data-bs-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        // Меняем тему
        html.setAttribute('data-bs-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Меняем иконку
        updateButtonIcon(newTheme);
    });

    function updateButtonIcon(theme) {
        const icon = themeToggle.querySelector('i');
        if (theme === 'dark') {
            icon.classList.replace('fa-moon', 'fa-sun');
        } else {
            icon.classList.replace('fa-sun', 'fa-moon');
        }
    }
});

// Функции для работы с корзиной (card.html)
function loadCartItems() {
    const cartContainer = document.getElementById('cart-container');
    const cardData = localStorage.getItem("card_list");

    if (cardData) {
        const parsedCards = JSON.parse(cardData);
        const itemsInCart = parsedCards.filter(item => item.quantity > 0);
        
        if (itemsInCart.length > 0) {
            cartContainer.innerHTML = '';
            let totalPrice = 0;
            
            itemsInCart.forEach(item => {
                const itemTotal = item.price * item.quantity;
                totalPrice += itemTotal;
                
                const cardHTML = `
                <div class="card mb-3" style="max-width: 1000px; margin: 0 auto">
                    <div class="row g-0">
                        <div class="col-md-4">
                            <img src="${item.image}" class="img-fluid rounded-start" alt="${item.name}">
                        </div>
                        <div class="col-md-8">
                            <div class="card-body">
                                <h5 class="card-title">${item.name}</h5>
                                <p class="card-price">Цена: ${item.price}$</p>
                                <p class="card-qual">Количество: ${item.quantity}</p>
                                <p class="card-total">Итого: ${itemTotal}$</p>
                                <button class="btn btn-danger remove-item" data-id="${item.id}">Удалить</button>
                                <button class="btn btn-outline-secondary decrease-item" data-id="${item.id}">-</button>
                                <button class="btn btn-outline-secondary increase-item" data-id="${item.id}">+</button>
                            </div>
                        </div>
                    </div>
                </div>
                `;
                cartContainer.innerHTML += cardHTML;
            });
            
            // Добавляем итоговую сумму и кнопку очистки
            cartContainer.innerHTML += `
                <div class="card mt-3" style="max-width: 1000px; margin: 0 auto">
                    <div class="card-body">
                        <h5 class="card-title">Итоговая сумма: ${totalPrice}$</h5>
                        <button class="btn btn-danger clear-cart">Очистить корзину</button>
                    </div>
                </div>
            `;
            
            // Добавляем обработчики для новых кнопок
            addCartEventListeners();
        } else {
            cartContainer.innerHTML = '<div class="alert alert-info">Ваша корзина пуста</div>';
        }
    } else {
        cartContainer.innerHTML = '<div class="alert alert-info">Ваша корзина пуста</div>';
    }
}

function addCartEventListeners() {
    // Удаление товара
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            updateCartItem(productId, 0);
            loadCartItems();
            updateCartCountInNav();
        });
    });
    
    // Уменьшение количества
    document.querySelectorAll('.decrease-item').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            const cartData = JSON.parse(localStorage.getItem("card_list"));
            const product = cartData.find(item => item.id === productId);
            
            if (product && product.quantity > 1) {
                updateCartItem(productId, product.quantity - 1);
                loadCartItems();
                updateCartCountInNav();
            }
        });
    });
    
    // Увеличение количества
    document.querySelectorAll('.increase-item').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            const cartData = JSON.parse(localStorage.getItem("card_list"));
            const product = cartData.find(item => item.id === productId);
            
            if (product) {
                updateCartItem(productId, product.quantity + 1);
                loadCartItems();
                updateCartCountInNav();
            }
        });
    });
    
    // Очистка корзины
    const clearCartBtn = document.querySelector('.clear-cart');
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', function() {
            const cartData = JSON.parse(localStorage.getItem("card_list"));
            cartData.forEach(item => item.quantity = 0);
            localStorage.setItem("card_list", JSON.stringify(cartData));
            loadCartItems();
            updateCartCountInNav();
        });
    }
}

function updateCartItem(productId, newQuantity) {
    const cartData = JSON.parse(localStorage.getItem("card_list"));
    const productIndex = cartData.findIndex(item => item.id === productId);
    
    if (productIndex !== -1) {
        cartData[productIndex].quantity = newQuantity;
        localStorage.setItem("card_list", JSON.stringify(cartData));
    }
}

function updateCartCountInNav() {
    const cartData = JSON.parse(localStorage.getItem("card_list"));
    let totalItems = 0;
    
    if (cartData) {
        totalItems = cartData.reduce((sum, item) => sum + item.quantity, 0);
    }
    
    document.querySelectorAll('.card-count, .badge').forEach(element => {
        if (element.classList.contains('card-count')) {
            element.textContent = totalItems;
        } else if (element.parentElement.href && element.parentElement.href.includes('card.html')) {
            element.textContent = totalItems;
        }
    });
}

// Если мы на странице корзины, загружаем товары
if (document.getElementById('cart-container')) {
    loadCartItems();
}