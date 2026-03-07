function initializeChatbot() {
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotPanel = document.getElementById('chatbot-panel');
    const chatbotClose = document.getElementById('chatbot-close');
    const chatbotForm = document.getElementById('chatbot-form');
    const chatbotInput = document.getElementById('chatbot-input');

    if (!chatbotToggle || !chatbotPanel || !chatbotClose || !chatbotForm || !chatbotInput) {
        return;
    }

    chatbotToggle.addEventListener('click', function() {
        const isHidden = chatbotPanel.classList.contains('d-none');
        chatbotPanel.classList.toggle('d-none');
        chatbotToggle.setAttribute('aria-expanded', String(isHidden));

        if (isHidden) {
            chatbotInput.focus();
        }
    });

    chatbotClose.addEventListener('click', function() {
        chatbotPanel.classList.add('d-none');
        chatbotToggle.setAttribute('aria-expanded', 'false');
    });

    chatbotForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const message = chatbotInput.value.trim();
        if (!message) {
            return;
        }

        addChatMessage(message, 'user');
        chatbotInput.value = '';

        const botResponse = getChatbotResponse(message);
        setTimeout(() => {
            addChatMessage(botResponse, 'bot');
        }, 350);
    });
}

function addChatMessage(text, sender) {
    const chatbotMessages = document.getElementById('chatbot-messages');
    if (!chatbotMessages) {
        return;
    }

    const message = document.createElement('div');
    message.className = `chatbot-message ${sender === 'user' ? 'chatbot-message-user' : 'chatbot-message-bot'}`;
    message.textContent = text;
    chatbotMessages.appendChild(message);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

function getChatbotResponse(input) {
    const normalizedInput = input.toLowerCase();

    if (normalizedInput.includes('delivery') || normalizedInput.includes('time')) {
        return 'Our average delivery time is about 30 minutes depending on your location and order volume.';
    }

    if (normalizedInput.includes('payment') || normalizedInput.includes('pay')) {
        return 'We accept Cash on Delivery, Credit Card, and PayPal at checkout.';
    }

    if (normalizedInput.includes('recommend') || normalizedInput.includes('popular')) {
        return 'Our customer favorites are Margherita Pizza, Classic Beef Burger, and Chocolate Brownie.';
    }

    if (normalizedInput.includes('hello') || normalizedInput.includes('hi')) {
        return 'Hello! Need help choosing something tasty today?';
    }

    if (normalizedInput.includes('cart') || normalizedInput.includes('order')) {
        return 'You can add items from the menu and review everything from the Cart button in the top-right corner.';
    }

    return 'I can help with menu picks, payment methods, and delivery details. Ask me anything food-related!';
}

// Cart functionality
let cart = [];

// Add to cart functionality

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);

    const toggleButton = document.getElementById('theme-toggle');
    const toggleText = document.getElementById('theme-toggle-text');

    if (!toggleButton || !toggleText) {
        return;
    }

    if (theme === 'dark') {
        toggleButton.innerHTML = '<i class="bi bi-sun-fill"></i> <span id="theme-toggle-text">Light Mode</span>';
    } else {
        toggleButton.innerHTML = '<i class="bi bi-moon-stars-fill"></i> <span id="theme-toggle-text">Dark Mode</span>';
    }
}

function initializeThemeToggle() {
    let savedTheme = 'light';

    try {
        savedTheme = localStorage.getItem('theme') || 'light';
    } catch (error) {
        savedTheme = 'light';
    }

    applyTheme(savedTheme);

    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) {
        return;
    }

    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';

        applyTheme(nextTheme);

        try {
            localStorage.setItem('theme', nextTheme);
        } catch (error) {
            // Ignore storage errors so theme toggle still works without persistence.
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    initializeThemeToggle();
    initializeChatbot();

    // Add to cart buttons
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            const name = this.getAttribute('data-name');
            const price = parseFloat(this.getAttribute('data-price'));
            
            addToCart(id, name, price);
            
            // Add animation
            this.innerHTML = '<i class="bi bi-check-circle"></i> Added';
            setTimeout(() => {
                this.innerHTML = '<i class="bi bi-plus-circle"></i> Add';
            }, 1000);
        });
    });

    // Filter functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            const category = this.getAttribute('data-category');
            filterMenu(category);
        });
    });

    // Place order button
    document.getElementById('place-order').addEventListener('click', function() {
        const form = document.getElementById('checkout-form');
        if (form.checkValidity()) {
            // Show success message
            alert('Order placed successfully! Your food will arrive in 30 minutes.');
            
            // Clear cart
            cart = [];
            updateCart();
            
            // Close modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('checkoutModal'));
            modal.hide();
            
            // Close offcanvas
            const offcanvas = bootstrap.Offcanvas.getInstance(document.getElementById('cartOffcanvas'));
            if (offcanvas) {
                offcanvas.hide();
            }
            
            // Reset form
            form.reset();
        } else {
            form.reportValidity();
        }
    });

    // Contact form submit
    document.getElementById('submit-contact').addEventListener('click', function() {
        const form = document.getElementById('contact-form');
        if (form.checkValidity()) {
            alert('Thanks for contacting us! We will get back to you shortly.');

            form.reset();
            const modal = bootstrap.Modal.getInstance(document.getElementById('contactModal'));
            if (modal) {
                modal.hide();
            }
        } else {
            form.reportValidity();
        }
    });
});

function addToCart(id, name, price) {
    // Check if item already exists in cart
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            id: id,
            name: name,
            price: price,
            quantity: 1
        });
    }
    
    updateCart();
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCart();
}

function updateQuantity(id, change) {
    const item = cart.find(item => item.id === id);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(id);
        } else {
            updateCart();
        }
    }
}

function updateCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartBadge = document.getElementById('cart-badge');
    const cartTotal = document.getElementById('cart-total');
    const totalPrice = document.getElementById('total-price');
    
    // Update badge
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartBadge.textContent = totalItems;
    
    // Update cart items
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="text-muted text-center">Your cart is empty</p>';
        cartTotal.classList.add('d-none');
    } else {
        let cartHTML = '';
        let total = 0;
        
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            cartHTML += `
                <div class="card mb-2">
                    <div class="card-body">
                        <h6 class="card-title">${item.name}</h6>
                        <p class="card-text text-muted mb-2">$${item.price.toFixed(2)} each</p>
                        <div class="d-flex justify-content-between align-items-center">
                            <div class="btn-group" role="group">
                                <button class="btn btn-sm btn-outline-danger" onclick="updateQuantity('${item.id}', -1)">
                                    <i class="bi bi-dash"></i>
                                </button>
                                <button class="btn btn-sm btn-outline-secondary" disabled>${item.quantity}</button>
                                <button class="btn btn-sm btn-outline-danger" onclick="updateQuantity('${item.id}', 1)">
                                    <i class="bi bi-plus"></i>
                                </button>
                            </div>
                            <div>
                                <strong class="text-danger">$${itemTotal.toFixed(2)}</strong>
                                <button class="btn btn-sm btn-link text-danger" onclick="removeFromCart('${item.id}')">
                                    <i class="bi bi-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
        
        cartItemsContainer.innerHTML = cartHTML;
        totalPrice.textContent = `$${total.toFixed(2)}`;
        cartTotal.classList.remove('d-none');
    }
}

function filterMenu(category) {
    const menuItems = document.querySelectorAll('.menu-item');
    
    menuItems.forEach(item => {
        if (category === 'all') {
            item.style.display = 'block';
            // Add fade in animation
            item.style.animation = 'fadeIn 0.5s';
        } else if (item.getAttribute('data-category') === category) {
            item.style.display = 'block';
            item.style.animation = 'fadeIn 0.5s';
        } else {
            item.style.display = 'none';
        }
    });
}
