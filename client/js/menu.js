// ==========================================
// 1. THE DATABASE
// ==========================================
const menuItems = [
    { id: 1, name: "Truffle Arancini", category: "From the Earth", price: 22, description: "Crispy arborio rice spheres filled with wild woodland mushroom duxelles, served over a rich black winter truffle aioli.", ingredients: "Arborio rice, wild mushrooms, black truffle, parmigiano-reggiano, panko, garlic aioli.", image: "https://images.unsplash.com/photo-1541529086526-db283c563270?q=80&w=1000&auto=format&fit=crop", tags: ["Vegetarian"] },
    { id: 2, name: "Heirloom Carrots", category: "From the Earth", price: 19, description: "Fire-roasted baby heirloom carrots set atop whipped lemon ricotta, finished with hot honey and toasted pistachios.", ingredients: "Organic heirloom carrots, fresh ricotta, local honey, chili flakes, roasted pistachios, micro-basil.", image: "https://images.unsplash.com/photo-1598514982205-f36b96d1e8d4?q=80&w=1000&auto=format&fit=crop", tags: ["Vegetarian", "Gluten-Free"] },
    { id: 3, name: "Wild Mushroom Risotto", category: "From the Earth", price: 28, description: "Creamy arborio rice simmered in a deep porcini broth, finished with aged parmigiano-reggiano and white truffle oil.", ingredients: "Arborio rice, porcini broth, cremini mushrooms, white wine, parmigiano-reggiano, white truffle oil.", image: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?q=80&w=1000&auto=format&fit=crop", tags: ["Vegetarian", "Gluten-Free"] },
    { id: 4, name: "Pan-Seared Scallops", category: "From the Sea", price: 48, description: "Jumbo diver scallops seared to perfection, resting on a sweet corn velouté with crispy pancetta and charred leeks.", ingredients: "Diver scallops, sweet corn, cream, Italian pancetta, leeks, micro cilantro.", image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?q=80&w=1000&auto=format&fit=crop", tags: ["Gluten-Free", "Chef's Pick"] },
    { id: 5, name: "Yellowfin Tuna Tartare", category: "From the Sea", price: 26, description: "Sashimi-grade yellowfin tuna tossed in a sesame-soy glaze, served over avocado mousse with crispy lotus root chips.", ingredients: "Yellowfin tuna, sesame oil, soy sauce, avocado, lime, lotus root.", image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1000&auto=format&fit=crop", tags: ["Dairy-Free"] },
    { id: 6, name: "Wood-Fired Ribeye", category: "From the Pasture", price: 54, description: "A 12oz prime cut ribeye steak, seared over an open oak fire. Served with a juniper berry crust and smoked potato purée.", ingredients: "Prime beef ribeye, juniper berries, sea salt, russet potatoes, smoked butter, blackberry gastrique.", image: "https://images.unsplash.com/photo-1544025162-83155160824b?q=80&w=1000&auto=format&fit=crop", tags: ["Gluten-Free", "Chef's Pick"] },
    { id: 7, name: "Herb-Crusted Lamb", category: "From the Pasture", price: 42, description: "Tender rack of lamb encrusted with fresh spring herbs, served with a vibrant spring pea purée and a rich red wine reduction.", ingredients: "Rack of lamb, mint, rosemary, spring peas, shallots, red wine, veal stock.", image: "https://images.unsplash.com/photo-1600891964092-4316c288032e?q=80&w=1000&auto=format&fit=crop", tags: ["Gluten-Free"] },
    { id: 8, name: "Dark Chocolate Nemesis", category: "The Final Act", price: 18, description: "A decadent, flourless chocolate cake made from 70% Valrhona dark chocolate. Served with tart raspberry coulis and vanilla bean gelato.", ingredients: "Valrhona chocolate, butter, eggs, sugar, fresh raspberries, Madagascar vanilla bean.", image: "https://images.unsplash.com/photo-1574085733277-851d9d856a3a?q=80&w=1000&auto=format&fit=crop", tags: ["Vegetarian", "Gluten-Free"] },
    { id: 9, name: "Bourbon Peach Crisp", category: "The Final Act", price: 16, description: "Warm, caramelized peaches spiked with Kentucky bourbon, topped with a brown sugar oat crumble and whipped mascarpone.", ingredients: "Local peaches, bourbon, brown sugar, rolled oats, cinnamon, mascarpone cheese.", image: "https://images.unsplash.com/photo-1624371414361-e670ead23513?q=80&w=1000&auto=format&fit=crop", tags: ["Vegetarian"] },
    { id: 10, name: "Smoked Old Fashioned", category: "The Cellar", price: 24, description: "Our signature house cocktail. Premium Kentucky bourbon, orange bitters, and a touch of maple, smoked tableside with cherry wood.", ingredients: "Woodford Reserve Bourbon, Angostura bitters, maple syrup, orange peel, cherry wood smoke.", image: "https://images.unsplash.com/photo-1536935338788-846bb9981813?q=80&w=1000&auto=format&fit=crop", tags: ["Signature"] }
];

// ==========================================
// 2. STATE & SETUP
// ==========================================
let currentCategory = 'All';
const categoryOrder = ["From the Earth", "From the Sea", "From the Pasture", "The Final Act", "The Cellar"];
let cart = []; 
let activeReservation = JSON.parse(sessionStorage.getItem('amberOakReservation'));
let currentModalItem = null; 

// DOM Elements: Menu & Search
const gridContainer = document.getElementById('menu-grid');
const tabsContainer = document.getElementById('category-tabs');
const searchInput = document.getElementById('menu-search');
const navbar = document.getElementById('navbar');

// DOM Elements: Global State Buttons (NEW)
const linkReservationNavBtn = document.getElementById('link-reservation-nav-btn');
const cancelReservationModeBtn = document.getElementById('cancel-reservation-mode-btn');

// DOM Elements: Checkout
const proceedCheckoutBtn = document.getElementById('checkout-btn'); // Renamed to match HTML id
const checkoutModal = document.getElementById('checkout-modal');
const closeCheckoutBtn = document.getElementById('close-checkout-btn');
const checkoutForm = document.getElementById('checkout-form');
const checkoutFinalTotal = document.getElementById('checkout-final-total');
const checkoutSuccessState = document.getElementById('checkout-success-state');
const paymentSpinner = document.getElementById('payment-spinner');
const paymentCheck = document.getElementById('payment-check');
const paymentStatusText = document.getElementById('payment-status-text');
const paymentReceiptText = document.getElementById('payment-receipt-text');

// DOM Elements: Modal
const modal = document.getElementById('dish-modal');
const closeModalBtn = document.getElementById('close-modal');
const modalImage = document.getElementById('modal-image');
const modalTitle = document.getElementById('modal-title');
const modalPrice = document.getElementById('modal-price');
const modalDesc = document.getElementById('modal-desc');
const modalIngredients = document.getElementById('modal-ingredients');
const modalTags = document.getElementById('modal-tags');
const dynamicModalBtn = document.getElementById('dynamic-modal-btn'); // NEW SINGLE BUTTON

// DOM Elements: Cart Drawer
const cartToggleBtn = document.getElementById('cart-toggle-btn');
const closeCartBtn = document.getElementById('close-cart-btn');
const cartDrawer = document.getElementById('cart-drawer');
const cartDrawerOverlay = document.getElementById('cart-drawer-overlay');
const cartBadge = document.getElementById('cart-badge');
const cartItemsContainer = document.getElementById('cart-items-container');
const cartSubtotal = document.getElementById('cart-total');
// ==========================================
// 🌟 3. GLOBAL STATE MANAGER 
// ==========================================
function updatePageMode() {
    // Refresh state from memory
    activeReservation = JSON.parse(sessionStorage.getItem('amberOakReservation'));

    if (activeReservation) {
        // 🍷 RESERVATION MODE (Black Styling + Icons)
        if (linkReservationNavBtn) linkReservationNavBtn.innerHTML = `<i class="fa-solid fa-link mr-2"></i>Table: ${activeReservation.short_token}`;
        
        if (dynamicModalBtn) {
            // Added the Concierge Bell icon!
            dynamicModalBtn.innerHTML = '<i class="fa-solid fa-bell-concierge mr-2"></i> Add to Table';
            dynamicModalBtn.classList.remove('bg-amber-800', 'hover:bg-amber-900');
            dynamicModalBtn.classList.add('bg-stone-900', 'hover:bg-black');
        }
        
        if (proceedCheckoutBtn) {
            // Clean text with Concierge Bell icon (No ugly date!)
            proceedCheckoutBtn.innerHTML = '<i class="fa-solid fa-bell-concierge mr-2"></i> Confirm Pre-Order';
            proceedCheckoutBtn.classList.remove('bg-amber-800', 'hover:bg-amber-900');
            proceedCheckoutBtn.classList.add('bg-stone-900', 'hover:bg-black');
        }
        
        if (cancelReservationModeBtn) cancelReservationModeBtn.classList.remove('hidden');

        // Create or update Banner
        let banner = document.getElementById('reservation-banner');
        if (!banner) {
            banner = document.createElement('div');
            banner.className = "bg-stone-900 text-amber-50 text-center py-2 text-[10px] uppercase tracking-[0.2em] font-medium z-[60] fixed top-0 w-full transition-all duration-300";
            banner.id = "reservation-banner";
            document.body.insertBefore(banner, document.body.firstChild);
        }
        banner.innerHTML = `Curating order for: ${activeReservation.fullName} • Table for ${activeReservation.guests}`;
        
        if (navbar) {
            navbar.classList.remove('top-0');
            navbar.classList.add('top-8');
        }

    } else {
        // 🍔 NORMAL ONLINE ORDER MODE (Amber Styling + Icons)
        if (linkReservationNavBtn) linkReservationNavBtn.textContent = 'Link Reservation';
        
        if (dynamicModalBtn) {
            // Added Cart icon
            dynamicModalBtn.innerHTML = '<i class="fa-solid fa-cart-plus mr-2"></i> Add to Cart';
            dynamicModalBtn.classList.remove('bg-stone-900', 'hover:bg-black');
            dynamicModalBtn.classList.add('bg-amber-800', 'hover:bg-amber-900');
        }
        
        if (proceedCheckoutBtn) {
            // Added Credit Card icon
            proceedCheckoutBtn.innerHTML = '<i class="fa-solid fa-credit-card mr-2"></i> Proceed to Checkout';
            proceedCheckoutBtn.classList.remove('bg-stone-900', 'hover:bg-black');
            proceedCheckoutBtn.classList.add('bg-amber-800', 'hover:bg-amber-900');
        }
        
        if (cancelReservationModeBtn) cancelReservationModeBtn.classList.add('hidden');

        // Remove banner if it exists
        const banner = document.getElementById('reservation-banner');
        if (banner) banner.remove();
        
        if (navbar) {
            navbar.classList.add('top-0');
            navbar.classList.remove('top-8');
        }
    }
}


// ==========================================
// 4. INITIALIZE PAGE
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Render UI & Modes
    if (tabsContainer) renderTabs();
    if (gridContainer) renderCards(menuItems);
    updatePageMode(); // Set the initial button states instantly!

    // 2. Animations
    if (typeof AOS !== 'undefined') {
        AOS.init({ duration: 700, once: false, offset: 20 });
        setTimeout(() => AOS.refresh(), 100);
    }
    
    // 3. Navbar Search Listener
    if (searchInput) searchInput.addEventListener('input', handleSearch);

    // 4. Glassmorphism Navbar Scroll Effect
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.remove('bg-gradient-to-b', 'from-black/80', 'to-transparent', 'p-6');
                navbar.classList.add('bg-stone-900/95', 'backdrop-blur-md', 'shadow-lg', 'py-4', 'px-6');
            } else {
                navbar.classList.remove('bg-stone-900/95', 'backdrop-blur-md', 'shadow-lg', 'py-4', 'px-6');
                navbar.classList.add('bg-gradient-to-b', 'from-black/80', 'to-transparent', 'p-6');
            }
        });
    }

    // 5. Cart Drawer Listeners
    if (cartToggleBtn) cartToggleBtn.addEventListener('click', openCart);
    if (closeCartBtn) closeCartBtn.addEventListener('click', closeCart);
    if (cartDrawerOverlay) cartDrawerOverlay.addEventListener('click', closeCart);

    // 6. Modal Listeners
    if (closeModalBtn) closeModalBtn.onclick = closeModalAction;
    if (modal) modal.onclick = (e) => { if (e.target === modal) closeModalAction(); };
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal && !modal.classList.contains('opacity-0')) closeModalAction(); });

    // 7. Checkout Listeners
    if (proceedCheckoutBtn) proceedCheckoutBtn.addEventListener('click', openCheckout);
    if (closeCheckoutBtn) closeCheckoutBtn.addEventListener('click', closeCheckout);

    // 🌟 8. SMART BUTTON LISTENERS (NEW)
    
    // The Universal Add Button in Modal
    if (dynamicModalBtn) {
        dynamicModalBtn.onclick = () => {
            addToCart(currentModalItem);
            closeModalAction();
            setTimeout(openCart, 300); 
        };
    }

    // Link Reservation from Navbar
    if (linkReservationNavBtn) {
        linkReservationNavBtn.addEventListener('click', async () => {
            if (activeReservation) {
                alert("Your table is already linked!");
                return;
            }

            const token = prompt("Enter your 6-digit Reservation Token:");
            if (!token) return;

            try {
                // Ensure this points to your running Express port!
                const response = await fetch(`https://amber-and-oak.onrender.com/api/reservations/${token}`);
                if (!response.ok) throw new Error('Reservation not found');
                
                const reservation = await response.json();
                sessionStorage.setItem('amberOakReservation', JSON.stringify(reservation));
                alert(`Success! Menu is now linked to ${reservation.fullName}'s table.`);
                
                updatePageMode(); // Refresh UI instantly
                
            } catch (error) {
                alert("We couldn't find a reservation with that token. Please try again.");
            }
        });
    }

    // The Escape Hatch: Cancel Reservation Mode
    if (cancelReservationModeBtn) {
        cancelReservationModeBtn.addEventListener('click', () => {
            if(confirm("Are you sure you want to cancel your table pre-order and return to normal online ordering? This will empty your cart.")) {
                sessionStorage.removeItem('amberOakReservation');
                cart = []; // Empty the cart
                updateCartUI();
                updatePageMode(); // Refresh UI instantly
                closeCart();
            }
        });
    }
    // ==========================================
    // 📱 MOBILE MENU LOGIC
    // ==========================================
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const closeMobileMenuBtn = document.getElementById('close-mobile-menu');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    
    // Search Elements
    const mobileSearchInput = document.getElementById('mobile-search-input');
    const mobileSearchBtn = document.getElementById('mobile-search-btn');
    const desktopSearchInput = document.getElementById('menu-search');

    if (mobileMenuBtn && closeMobileMenuBtn && mobileMenu) {
        // Open Menu
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.remove('translate-x-full');
            if (mobileMenuOverlay) mobileMenuOverlay.classList.remove('opacity-0', 'pointer-events-none');
            document.body.style.overflow = 'hidden'; 
        });

        // Close Menu
        const closeMenu = () => {
            mobileMenu.classList.add('translate-x-full');
            if (mobileMenuOverlay) mobileMenuOverlay.classList.add('opacity-0', 'pointer-events-none');
            document.body.style.overflow = 'auto'; 
        };

        // Close Triggers
        closeMobileMenuBtn.addEventListener('click', closeMenu);
        if (mobileMenuOverlay) mobileMenuOverlay.addEventListener('click', closeMenu);
        mobileLinks.forEach(link => link.addEventListener('click', closeMenu));

        // 🌟 Smart Mobile Search Function
        const executeMobileSearch = () => {
            if (mobileSearchInput && desktopSearchInput) {
                // 1. Sync the text to the hidden desktop search
                desktopSearchInput.value = mobileSearchInput.value;
                // 2. Fire the search algorithm
                desktopSearchInput.dispatchEvent(new Event('input'));
                // 3. Close the sidebar
                closeMenu();
                // 4. Smoothly scroll down to the food grid!
                document.getElementById('interactive-menu').scrollIntoView({ behavior: 'smooth' });
            }
        };

        // Live filtering while they type (so they can see the background changing)
        if (mobileSearchInput && desktopSearchInput) {
            mobileSearchInput.addEventListener('input', () => {
                desktopSearchInput.value = mobileSearchInput.value;
                desktopSearchInput.dispatchEvent(new Event('input'));
            });
            
            // Execute full scroll/close if they hit "Enter" on their phone keyboard
            mobileSearchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') executeMobileSearch();
            });
        }

        // Execute full scroll/close if they click the magnifying glass
        if (mobileSearchBtn) {
            mobileSearchBtn.addEventListener('click', executeMobileSearch);
        }
    }
});

// ==========================================
// 5. SEARCH LOGIC
// ==========================================
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    
    if (searchTerm === '') {
        const filteredData = currentCategory === 'All' ? menuItems : menuItems.filter(item => item.category === currentCategory);
        renderCards(filteredData);
    } else {
        const searchResults = menuItems.filter(item => 
            item.name.toLowerCase().includes(searchTerm) || 
            item.description.toLowerCase().includes(searchTerm)
        );
        renderCards(searchResults);
    }
    setTimeout(() => { if (typeof AOS !== 'undefined') AOS.refresh(); }, 50);
}

// ==========================================
// 6. RENDER MENU CARDS & TABS
// ==========================================
function renderTabs() {
    if (!tabsContainer) return;
    tabsContainer.innerHTML = ''; 
    const allCategories = ['All', ...categoryOrder];
    
    allCategories.forEach(category => {
        const btn = document.createElement('button');
        if (category === currentCategory) {
            btn.className = "px-6 py-2 rounded-full bg-stone-900 text-white font-medium tracking-widest text-[10px] md:text-xs uppercase shadow-md transition";
        } else {
            btn.className = "px-6 py-2 rounded-full border border-stone-300 text-stone-600 hover:border-stone-900 hover:text-stone-900 font-medium tracking-widest text-[10px] md:text-xs uppercase transition";
        }
        btn.textContent = category;
        btn.onclick = () => {
            currentCategory = category;
            if (searchInput) searchInput.value = ''; 
            renderTabs(); 
            const filteredData = category === 'All' ? menuItems : menuItems.filter(item => item.category === category);
            renderCards(filteredData);
            setTimeout(() => { if (typeof AOS !== 'undefined') AOS.refresh(); }, 50);
        };
        tabsContainer.appendChild(btn);
    });
}
 
function renderCards(itemsToRender) {
    if (!gridContainer) return;
    gridContainer.innerHTML = ''; 

    if (itemsToRender.length === 0) {
        gridContainer.innerHTML = `
            <div class="col-span-full py-24 flex flex-col items-center justify-center text-center" data-aos="fade-up">
                <i class="fa-solid fa-wine-glass-empty text-4xl text-stone-300 mb-6 drop-shadow-sm"></i>
                <h3 class="font-serif text-3xl text-amber-950 mb-3 tracking-tight">No offerings found</h3>
                <p class="text-sm text-stone-500 italic max-w-md mx-auto leading-relaxed">We couldn't find anything matching your search. Please try a different ingredient or explore our curated categories.</p>
            </div>
        `;
        return; 
    }

    const groupedItems = {};
    
    itemsToRender.forEach(item => {
        if (!groupedItems[item.category]) groupedItems[item.category] = [];
        groupedItems[item.category].push(item);
    });

    categoryOrder.forEach(category => {
        if (groupedItems[category] && groupedItems[category].length > 0) {
            
            let delayCounter = 0; 
            
            const sectionHeader = document.createElement('div');
            sectionHeader.className = "col-span-full mt-16 mb-2 border-b border-stone-200 pb-4 first:mt-0 flex items-end justify-between";
            sectionHeader.innerHTML = `<h2 class="text-3xl md:text-4xl font-serif font-bold text-amber-950 tracking-tight" data-aos="fade-right">${category}</h2>`;
            gridContainer.appendChild(sectionHeader);

            groupedItems[category].forEach(item => {
                const card = document.createElement('div');
                card.setAttribute('data-aos', 'fade-up');
                card.setAttribute('data-aos-delay', delayCounter.toString());
                card.className = "bg-white border border-stone-300 shadow-md hover:shadow-2xl transition-all duration-300 rounded-md overflow-hidden group flex flex-col h-full transform hover:-translate-y-1 relative cursor-pointer";

                let tagsHtml = '';
                item.tags.forEach(tag => {
                    let color = tag === 'Vegetarian' ? 'text-green-700 bg-green-50 border-green-200' : 
                                tag === "Chef's Pick" ? 'text-amber-800 bg-amber-50 border-amber-200' : 'text-stone-600 bg-stone-100 border-stone-200';
                    tagsHtml += `<span class="px-2 py-1 text-[9px] uppercase tracking-wider font-bold rounded-sm shadow-sm border ${color}">${tag}</span>`;
                });

                // Updated Mobile-Responsive Card HTML
                card.innerHTML = `
                    <div class="h-32 md:h-56 overflow-hidden relative">
                        <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700">
                        <div class="absolute top-2 left-2 flex flex-wrap gap-1 z-10">${tagsHtml}</div>
                        
                        <div class="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none"></div>

                        <div class="absolute bottom-2 right-2 md:bottom-3 md:right-4 z-20 overflow-hidden hidden md:block">
                            <span class="quick-add-btn block font-serif italic text-sm text-white font-medium hover:text-amber-400 transform -translate-x-8 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500 ease-out drop-shadow-md">
                                Add to cart &rarr;
                            </span>
                        </div>
                    </div>
                    
                    <div class="p-3 md:p-6 flex flex-col flex-grow">
                        <div class="flex justify-between items-start mb-1 md:mb-2 gap-2">
                            <h3 class="text-sm md:text-xl font-serif font-bold text-stone-900 leading-tight group-hover:text-amber-700 transition-colors">${item.name}</h3>
                            <span class="text-xs md:text-lg text-amber-700 font-medium">$${item.price}</span>
                        </div>
                        <p class="text-[10px] md:text-sm text-stone-500 line-clamp-2 leading-relaxed italic mb-2 md:mb-4">${item.description}</p>
                        
                        <div class="mt-auto pt-2 md:pt-4 border-t border-stone-200">
                            <span class="text-[9px] md:text-xs font-semibold tracking-widest uppercase text-stone-400 group-hover:text-amber-700 transition-colors">Details &rarr;</span>
                        </div>
                    </div>
                `;                
                card.addEventListener('click', (e) => {
                    if (e.target.closest('.quick-add-btn')) {
                        addToCart(item); 
                        openCart();      
                    } else {
                        openModal(item); 
                    }
                });

                gridContainer.appendChild(card);
                delayCounter += 150; 
            });
        }
    });
}

// ==========================================
// 7. MODAL LOGIC
// ==========================================
function openModal(item) {
    if (!modal) return;
    currentModalItem = item; 
    
    if (modalImage) modalImage.src = item.image;
    if (modalTitle) modalTitle.textContent = item.name;
    if (modalPrice) modalPrice.textContent = `$${item.price}`;
    if (modalDesc) modalDesc.textContent = item.description;
    if (modalIngredients) modalIngredients.textContent = item.ingredients;
    
    if (modalTags) {
        modalTags.innerHTML = '';
        item.tags.forEach(tag => {
            let color = tag === 'Vegetarian' ? 'text-green-700 border-green-200 bg-green-50' : 
                        tag === "Chef's Pick" ? 'text-amber-700 border-amber-200 bg-amber-50' : 'text-stone-600 border-stone-200 bg-stone-50';
            modalTags.innerHTML += `<span class="px-3 py-1 border rounded-full text-[10px] uppercase tracking-wider font-bold ${color}">${tag}</span>`;
        });
    }

    modal.classList.remove('opacity-0', 'pointer-events-none');
    document.body.style.overflow = 'hidden';
}

function closeModalAction() {
    if (!modal) return;
    modal.classList.add('opacity-0', 'pointer-events-none');
    document.body.style.overflow = 'auto';
}

// ==========================================
// 8. E-COMMERCE CART ENGINE
// ==========================================
function addToCart(item) {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
        existingItem.quantity += 1; 
    } else {
        cart.push({ ...item, quantity: 1 });
    }
    updateCartUI(); 
}

window.updateQty = function(id, delta) {
    const item = cart.find(cartItem => cartItem.id === id);
    if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) {
            removeFromCart(id); 
        } else {
            updateCartUI();
        }
    }
}

window.removeFromCart = function(id) {
    cart = cart.filter(cartItem => cartItem.id !== id);
    updateCartUI();
}

function updateCartUI() {
    if (!cartBadge || !cartSubtotal || !cartItemsContainer) return;

    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartBadge.textContent = totalItems;
    if (totalItems > 0) {
        cartBadge.classList.remove('opacity-0');
    } else {
        cartBadge.classList.add('opacity-0');
    }

    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;

    cartItemsContainer.innerHTML = ''; 

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="h-full flex flex-col items-center justify-center text-stone-400 opacity-70">
                <i class="fa-solid fa-basket-shopping text-4xl mb-4"></i>
                <p class="font-serif italic text-lg">Your curated selection is empty.</p>
            </div>
        `;
        return;
    }

    cart.forEach(item => {
        const itemRow = document.createElement('div');
        itemRow.className = "flex items-center gap-4 py-4 border-b border-stone-100 animate-fade-in";
        
        itemRow.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded-sm shadow-sm">
            <div class="flex-grow">
                <h4 class="text-sm font-serif font-bold text-stone-900 leading-tight">${item.name}</h4>
                <div class="text-amber-700 text-xs font-bold mt-1">$${(item.price * item.quantity).toFixed(2)}</div>
                
                <div class="flex items-center gap-4 mt-2">
                    <button class="text-stone-400 hover:text-stone-900 transition" onclick="updateQty(${item.id}, -1)">
                        <i class="fa-solid fa-minus text-[10px]"></i>
                    </button>
                    <span class="text-xs font-bold text-stone-700">${item.quantity}</span>
                    <button class="text-stone-400 hover:text-stone-900 transition" onclick="updateQty(${item.id}, 1)">
                        <i class="fa-solid fa-plus text-[10px]"></i>
                    </button>
                </div>
            </div>
            <button class="text-stone-300 hover:text-red-500 transition-colors p-2" onclick="removeFromCart(${item.id})">
                <i class="fa-solid fa-trash text-sm"></i>
            </button>
        `;
        cartItemsContainer.appendChild(itemRow);
    });
}

// ==========================================
// 9. DRAWER ANIMATION LOGIC
// ==========================================
function openCart() {
    if (cartDrawerOverlay && cartDrawer) {
        cartDrawerOverlay.classList.remove('opacity-0', 'pointer-events-none');
        cartDrawer.classList.remove('translate-x-full'); 
        document.body.style.overflow = 'hidden'; 
    }
}

function closeCart() {
    if (cartDrawerOverlay && cartDrawer) {
        cartDrawerOverlay.classList.add('opacity-0', 'pointer-events-none');
        cartDrawer.classList.add('translate-x-full'); 
        document.body.style.overflow = 'auto';
    }
}

// ==========================================
// 10. CHECKOUT LOGIC 
// ==========================================
function openCheckout() {
    if (cart.length === 0) return; 
    
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    if (checkoutFinalTotal) checkoutFinalTotal.textContent = `$${subtotal.toFixed(2)}`;

    closeCart();

    if (checkoutModal) {
        checkoutModal.classList.remove('opacity-0', 'pointer-events-none');
        document.body.style.overflow = 'hidden';
    }
}

function closeCheckout() {
    if (checkoutModal) {
        checkoutModal.classList.add('opacity-0', 'pointer-events-none');
        document.body.style.overflow = 'auto';
    }
    
    setTimeout(() => {
        if (checkoutForm) checkoutForm.reset();
        if (checkoutSuccessState) checkoutSuccessState.classList.add('opacity-0', 'pointer-events-none');
        if (paymentSpinner) paymentSpinner.classList.remove('hidden');
        if (paymentCheck) {
            paymentCheck.classList.add('hidden', 'scale-50');
            paymentCheck.classList.remove('scale-100');
        }
        if (paymentStatusText) paymentStatusText.textContent = 'Processing Payment...';
        if (paymentReceiptText) paymentReceiptText.classList.add('hidden');
    }, 500);
}

// 🌟 The Payment Simulation
if (checkoutForm) {
    checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault(); 

        checkoutSuccessState.classList.remove('opacity-0', 'pointer-events-none');

        setTimeout(() => {
            paymentSpinner.classList.add('hidden');
            paymentCheck.classList.remove('hidden');
            
            setTimeout(() => paymentCheck.classList.remove('scale-50'), 50);
            paymentCheck.classList.add('scale-100');
            paymentStatusText.textContent = 'Payment Successful!';
            paymentReceiptText.classList.remove('hidden');

            cart = [];
            updateCartUI();
            
            sessionStorage.removeItem('amberOakReservation');
            
            setTimeout(() => {
                closeCheckout();
                window.location.reload(); 
            }, 3000);

        }, 2000);
    });
}