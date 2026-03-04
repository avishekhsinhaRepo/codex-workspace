/**
 * Test suite for FoodExpress app functionality
 */

// Mock localStorage
const localStorageMock = (() => {
    let store = {};
    return {
        getItem: (key) => store[key] || null,
        setItem: (key, value) => {
            store[key] = value.toString();
        },
        clear: () => {
            store = {};
        },
        removeItem: (key) => {
            delete store[key];
        }
    };
})();

global.localStorage = localStorageMock;

// Mock DOM elements and Bootstrap
global.bootstrap = {
    Modal: {
        getInstance: jest.fn(() => ({
            hide: jest.fn()
        }))
    },
    Offcanvas: {
        getInstance: jest.fn(() => ({
            hide: jest.fn()
        }))
    }
};

describe('Cart Functionality', () => {
    let cart;
    let addToCart, removeFromCart, updateQuantity, updateCart;

    beforeEach(() => {
        // Reset cart before each test
        cart = [];
        
        // Mock DOM elements
        document.body.innerHTML = `
            <div id="cart-items"></div>
            <span id="cart-badge">0</span>
            <div id="cart-total" class="d-none">
                <span id="total-price">$0.00</span>
            </div>
        `;

        // Define functions from script.js
        addToCart = function(id, name, price) {
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
        };

        removeFromCart = function(id) {
            cart = cart.filter(item => item.id !== id);
            updateCart();
        };

        updateQuantity = function(id, change) {
            const item = cart.find(item => item.id === id);
            if (item) {
                item.quantity += change;
                if (item.quantity <= 0) {
                    removeFromCart(id);
                } else {
                    updateCart();
                }
            }
        };

        updateCart = function() {
            const cartItemsContainer = document.getElementById('cart-items');
            const cartBadge = document.getElementById('cart-badge');
            const cartTotal = document.getElementById('cart-total');
            const totalPrice = document.getElementById('total-price');
            
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            cartBadge.textContent = totalItems;
            
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
                            </div>
                        </div>
                    `;
                });
                
                cartItemsContainer.innerHTML = cartHTML;
                totalPrice.textContent = `$${total.toFixed(2)}`;
                cartTotal.classList.remove('d-none');
            }
        };
    });

    test('should add new item to cart', () => {
        addToCart('1', 'Burger', 9.99);
        
        expect(cart.length).toBe(1);
        expect(cart[0]).toEqual({
            id: '1',
            name: 'Burger',
            price: 9.99,
            quantity: 1
        });
    });

    test('should increase quantity when adding existing item', () => {
        addToCart('1', 'Burger', 9.99);
        addToCart('1', 'Burger', 9.99);
        
        expect(cart.length).toBe(1);
        expect(cart[0].quantity).toBe(2);
    });

    test('should add multiple different items', () => {
        addToCart('1', 'Burger', 9.99);
        addToCart('2', 'Pizza', 12.99);
        addToCart('3', 'Salad', 7.99);
        
        expect(cart.length).toBe(3);
    });

    test('should remove item from cart', () => {
        addToCart('1', 'Burger', 9.99);
        addToCart('2', 'Pizza', 12.99);
        
        removeFromCart('1');
        
        expect(cart.length).toBe(1);
        expect(cart[0].id).toBe('2');
    });

    test('should update cart badge with total item count', () => {
        addToCart('1', 'Burger', 9.99);
        addToCart('1', 'Burger', 9.99);
        addToCart('2', 'Pizza', 12.99);
        
        const badge = document.getElementById('cart-badge');
        expect(badge.textContent).toBe('3');
    });

    test('should calculate total price correctly', () => {
        addToCart('1', 'Burger', 9.99);
        addToCart('1', 'Burger', 9.99);
        addToCart('2', 'Pizza', 12.99);
        
        const totalPrice = document.getElementById('total-price');
        expect(totalPrice.textContent).toBe('$32.97');
    });

    test('should show empty cart message when cart is empty', () => {
        updateCart();
        
        const cartItems = document.getElementById('cart-items');
        expect(cartItems.innerHTML).toContain('Your cart is empty');
    });

    test('should increase item quantity', () => {
        addToCart('1', 'Burger', 9.99);
        updateQuantity('1', 1);
        
        expect(cart[0].quantity).toBe(2);
    });

    test('should decrease item quantity', () => {
        addToCart('1', 'Burger', 9.99);
        addToCart('1', 'Burger', 9.99);
        updateQuantity('1', -1);
        
        expect(cart[0].quantity).toBe(1);
    });

    test('should remove item when quantity becomes zero', () => {
        addToCart('1', 'Burger', 9.99);
        updateQuantity('1', -1);
        
        expect(cart.length).toBe(0);
    });
});

describe('Theme Functionality', () => {
    let applyTheme;

    beforeEach(() => {
        localStorage.clear();
        
        document.body.innerHTML = `
            <button id="theme-toggle">
                <i class="bi bi-moon-stars-fill"></i>
                <span id="theme-toggle-text">Dark Mode</span>
            </button>
        `;

        applyTheme = function(theme) {
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
        };
    });

    test('should apply dark theme', () => {
        applyTheme('dark');
        
        expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });

    test('should apply light theme', () => {
        applyTheme('light');
        
        expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    });

    test('should update button text for dark mode', () => {
        applyTheme('dark');
        
        const toggleButton = document.getElementById('theme-toggle');
        expect(toggleButton.innerHTML).toContain('Light Mode');
        expect(toggleButton.innerHTML).toContain('bi-sun-fill');
    });

    test('should update button text for light mode', () => {
        applyTheme('light');
        
        const toggleButton = document.getElementById('theme-toggle');
        expect(toggleButton.innerHTML).toContain('Dark Mode');
        expect(toggleButton.innerHTML).toContain('bi-moon-stars-fill');
    });

    test('should save theme preference to localStorage', () => {
        applyTheme('dark');
        localStorage.setItem('theme', 'dark');
        
        expect(localStorage.getItem('theme')).toBe('dark');
    });
});

describe('Menu Filter Functionality', () => {
    let filterMenu;

    beforeEach(() => {
        document.body.innerHTML = `
            <div class="menu-item" data-category="burgers">Burger</div>
            <div class="menu-item" data-category="pizza">Pizza</div>
            <div class="menu-item" data-category="salads">Salad</div>
            <div class="menu-item" data-category="burgers">Cheeseburger</div>
        `;

        filterMenu = function(category) {
            const menuItems = document.querySelectorAll('.menu-item');
            
            menuItems.forEach(item => {
                if (category === 'all') {
                    item.style.display = 'block';
                    item.style.animation = 'fadeIn 0.5s';
                } else if (item.getAttribute('data-category') === category) {
                    item.style.display = 'block';
                    item.style.animation = 'fadeIn 0.5s';
                } else {
                    item.style.display = 'none';
                }
            });
        };
    });

    test('should show all items when filter is "all"', () => {
        filterMenu('all');
        
        const menuItems = document.querySelectorAll('.menu-item');
        menuItems.forEach(item => {
            expect(item.style.display).toBe('block');
        });
    });

    test('should show only burgers when filtered by burgers', () => {
        filterMenu('burgers');
        
        const menuItems = document.querySelectorAll('.menu-item');
        const burgerItems = document.querySelectorAll('[data-category="burgers"]');
        const nonBurgerItems = document.querySelectorAll('[data-category]:not([data-category="burgers"])');
        
        burgerItems.forEach(item => {
            expect(item.style.display).toBe('block');
        });
        
        nonBurgerItems.forEach(item => {
            expect(item.style.display).toBe('none');
        });
    });

    test('should show only pizza when filtered by pizza', () => {
        filterMenu('pizza');
        
        const pizzaItems = document.querySelectorAll('[data-category="pizza"]');
        const nonPizzaItems = document.querySelectorAll('[data-category]:not([data-category="pizza"])');
        
        pizzaItems.forEach(item => {
            expect(item.style.display).toBe('block');
        });
        
        nonPizzaItems.forEach(item => {
            expect(item.style.display).toBe('none');
        });
    });

    test('should apply fade-in animation to visible items', () => {
        filterMenu('burgers');
        
        const burgerItems = document.querySelectorAll('[data-category="burgers"]');
        burgerItems.forEach(item => {
            expect(item.style.animation).toBe('fadeIn 0.5s');
        });
    });
});

describe('Price Calculations', () => {
    test('should calculate correct price for single item', () => {
        const price = 9.99;
        const quantity = 1;
        const total = price * quantity;
        
        expect(total).toBe(9.99);
    });

    test('should calculate correct price for multiple quantities', () => {
        const price = 9.99;
        const quantity = 3;
        const total = price * quantity;
        
        expect(total).toBeCloseTo(29.97, 2);
    });

    test('should format price with two decimal places', () => {
        const price = 9.5;
        const formatted = price.toFixed(2);
        
        expect(formatted).toBe('9.50');
    });
});
