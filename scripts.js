// Sample product data
const products = [
    {
        id: 1,
        name: "Wireless Headphones",
        price: 99.99,
        oldPrice: 129.99,
        image: "https://via.placeholder.com/300x300",
        category: "electronics",
        rating: 4,
        badge: "Sale"
    },
    {
        id: 2,
        name: "Smart Watch",
        price: 199.99,
        oldPrice: 249.99,
        image: "https://via.placeholder.com/300x300",
        category: "electronics",
        rating: 5,
        badge: "Popular"
    },
    {
        id: 3,
        name: "Cotton T-Shirt",
        price: 24.99,
        oldPrice: 29.99,
        image: "https://via.placeholder.com/300x300",
        category: "clothing",
        rating: 3,
        badge: "New"
    },
    {
        id: 4,
        name: "Denim Jeans",
        price: 59.99,
        oldPrice: 79.99,
        image: "https://via.placeholder.com/300x300",
        category: "clothing",
        rating: 4,
        badge: "Sale"
    },
    {
        id: 5,
        name: "Ceramic Coffee Mug",
        price: 14.99,
        oldPrice: 19.99,
        image: "https://via.placeholder.com/300x300",
        category: "home",
        rating: 5,
        badge: "Bestseller"
    },
    {
        id: 6,
        name: "Bluetooth Speaker",
        price: 79.99,
        oldPrice: 99.99,
        image: "https://via.placeholder.com/300x300",
        category: "electronics",
        rating: 4,
        badge: "Hot"
    },
    {
        id: 7,
        name: "Throw Pillow",
        price: 19.99,
        oldPrice: 24.99,
        image: "https://via.placeholder.com/300x300",
        category: "home",
        rating: 3,
        badge: "New"
    },
    {
        id: 8,
        name: "Running Shoes",
        price: 89.99,
        oldPrice: 109.99,
        image: "https://via.placeholder.com/300x300",
        category: "clothing",
        rating: 5,
        badge: "Sale"
    }
];

// DOM Elements
const productGrid = document.getElementById('product-grid');
const filterButtons = document.querySelectorAll('.filter-btn');
const cartIcon = document.querySelector('.cart-icon');
const cartSidebar = document.querySelector('.cart-sidebar');
const cartOverlay = document.querySelector('.cart-overlay');
const closeCart = document.querySelector('.close-cart');
const cartItemsContainer = document.querySelector('.cart-items');
const cartTotal = document.querySelector('.cart-total span');
const cartCount = document.querySelector('.cart-count');

// Shopping cart
let cart = [];

// Display products
function displayProducts(filter = 'all') {
    productGrid.innerHTML = '';
    
    const filteredProducts = filter === 'all' 
        ? products 
        : products.filter(product => product.category === filter);
    
    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');
        productCard.dataset.id = product.id;
        
        // Create rating stars
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            stars += `<i class="fas fa-star${i > product.rating ? '-half-alt' : ''}"></i>`;
        }
        
        productCard.innerHTML = `
            <div class="product-img">
                <img src="${product.image}" alt="${product.name}">
            </div>
            ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
            <div class="product-content">
                <h3 class="product-name">${product.name}</h3>
                <div class="rating">
                    ${stars}
                </div>
                <div class="product-price">$${product.price.toFixed(2)}
                    ${product.oldPrice ? `<span>$${product.oldPrice.toFixed(2)}</span>` : ''}
                </div>
                <button class="add-to-cart">Add to Cart</button>
            </div>
        `;
        
        productGrid.appendChild(productCard);
    });
    
    // Add event listeners to "Add to Cart" buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', addToCart);
    });
}

// Filter products
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        button.classList.add('active');
        // Filter products
        displayProducts(button.dataset.filter);
    });
});

// Add to cart
function addToCart(e) {
    const productId = parseInt(e.target.closest('.product-card').dataset.id);
    const product = products.find(p => p.id === productId);
    
    // Check if product already in cart
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCart();
    showCartNotification();
}

// Update cart
function updateCart() {
    // Update cart count
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Update cart items
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Your cart is empty</p>';
        cartTotal.textContent = '$0.00';
        return;
    }
    
    let totalPrice = 0;
    
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        
        const itemPrice = item.price * item.quantity;
        totalPrice += itemPrice;
        
        cartItem.innerHTML = `
            <div class="cart-item-img">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-details">
                <h4 class="cart-item-name">${item.name}</h4>
                <p class="cart-item-price">$${item.price.toFixed(2)}</p>
                <p class="cart-item-remove" data-id="${item.id}">Remove</p>
                <div class="cart-item-quantity">
                    <div class="quantity-btn minus" data-id="${item.id}">
                        <i class="fas fa-minus"></i>
                    </div>
                    <span class="quantity">${item.quantity}</span>
                    <div class="quantity-btn plus" data-id="${item.id}">
                        <i class="fas fa-plus"></i>
                    </div>
                </div>
            </div>
        `;
        
        cartItemsContainer.appendChild(cartItem);
    });
    
    // Update total price
    cartTotal.textContent = `$${totalPrice.toFixed(2)}`;
    
    // Add event listeners to remove buttons
    document.querySelectorAll('.cart-item-remove').forEach(button => {
        button.addEventListener('click', removeFromCart);
    });
    
    // Add event listeners to quantity buttons
    document.querySelectorAll('.quantity-btn').forEach(button => {
        button.addEventListener('click', updateQuantity);
    });
}

// Remove from cart
function removeFromCart(e) {
    const productId = parseInt(e.target.dataset.id);
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

// Update quantity
function updateQuantity(e) {
    const productId = parseInt(e.target.closest('.quantity-btn').dataset.id);
    const item = cart.find(item => item.id === productId);
    
    if (e.target.closest('.minus')) {
        if (item.quantity > 1) {
            item.quantity -= 1;
        } else {
            cart = cart.filter(item => item.id !== productId);
        }
    } else if (e.target.closest('.plus')) {
        item.quantity += 1;
    }
    
    updateCart();
}

// Show cart notification
function showCartNotification() {
    const notification = document.createElement('div');
    notification.classList.add('cart-notification');
    notification.textContent = 'Item added to cart!';
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 2000);
}

// Toggle cart sidebar
cartIcon.addEventListener('click', () => {
    cartSidebar.classList.add('active');
    cartOverlay.classList.add('active');
});

closeCart.addEventListener('click', () => {
    cartSidebar.classList.remove('active');
    cartOverlay.classList.remove('active');
});

cartOverlay.addEventListener('click', () => {
    cartSidebar.classList.remove('active');
    cartOverlay.classList.remove('active');
});

// Initialize
displayProducts();

// Add cart notification styles dynamically
const style = document.createElement('style');
style.textContent = `
    .cart-notification {
        position: fixed;
        bottom: 2rem;
        left: 50%;
        transform: translateX(-50%);
        background-color: var(--primary-color);
        color: white;
        padding: 1rem 2rem;
        border-radius: 0.5rem;
        box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
        opacity: 0;
        transition: all 300ms ease-in-out;
        z-index: 2000;
    }
    
    .cart-notification.show {
        opacity: 1;
        bottom: 3rem;
    }
`;
document.head.appendChild(style);