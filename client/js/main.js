import '../css/style.css';

document.addEventListener('DOMContentLoaded', () => {
    // 1. DOM Elements
    const navbar = document.getElementById('navbar');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    const closeMobileMenuBtn = document.getElementById('close-mobile-menu');
   
    // 2. Initialize AOS Scroll Animations
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1200, // Slow, luxurious fade
            once: false,    // Re-animates when scrolling up and down
            offset: 100     // Waits until element is slightly visible
        });
    }

    // 3. Premium Glassmorphism Navbar Scroll Effect
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                // Scrolled down: Add frosted brand-brown glass effect, shrink padding
                navbar.classList.remove('bg-gradient-to-b', 'from-black/80', 'to-transparent', 'py-6');
                navbar.classList.add('bg-brand-brown/95', 'backdrop-blur-md', 'shadow-lg', 'py-4');
            } else {
                // Top of page: Transparent gradient, larger padding
                navbar.classList.remove('bg-brand-brown/95', 'backdrop-blur-md', 'shadow-lg', 'py-4');
                navbar.classList.add('bg-gradient-to-b', 'from-black/80', 'to-transparent', 'py-6');
            }
        });
    }

    // 4. Mobile Menu Toggle Logic
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });

        // Close mobile menu on link click
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
            });
        });
    }
 // ==========================================
// 📱 MOBILE MENU & SMOOTH SCROLL LOGIC
// ==========================================
 
if (mobileMenuBtn && mobileMenu) {
    
    // Function to Close Menu
    const closeMenu = () => {
        mobileMenu.classList.add('translate-x-full');
        if (mobileMenuOverlay) mobileMenuOverlay.classList.add('opacity-0', 'pointer-events-none');
        document.body.style.overflow = 'auto'; // Re-enable scrolling
    };

    // Open Menu
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.remove('translate-x-full');
        if (mobileMenuOverlay) mobileMenuOverlay.classList.remove('opacity-0', 'pointer-events-none');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling while menu is open
    });

    // Close on X click or Overlay click
    closeMobileMenuBtn.addEventListener('click', closeMenu);
    if (mobileMenuOverlay) mobileMenuOverlay.addEventListener('click', closeMenu);

    // 🚀 Smooth Scroll & Auto-Close
    mobileLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('data-target');
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                e.preventDefault(); // Stop default jump-glitch
                
                // 1. Close the sidebar first
                closeMenu();

                // 2. Wait a split second for the menu to clear, then scroll
                setTimeout(() => {
                    targetElement.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                    });
                }, 300);
            }
        });
    });
}
});