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

    // ==========================================
    // 4. AWWWARDS MOBILE MENU & CURTAIN LOGIC
    // ==========================================

    
    if (mobileMenuBtn && mobileMenu) {
        // Grab the three lines of the hamburger button
        const l1 = mobileMenuBtn.querySelector('.line-1');
        const l2 = mobileMenuBtn.querySelector('.line-2');
        const l3 = mobileMenuBtn.querySelector('.line-3');
        
        let isMenuOpen = false;

        const toggleMenu = () => {
            isMenuOpen = !isMenuOpen;
            
            if (isMenuOpen) {
                // OPENING: Drop the curtain
                mobileMenu.classList.remove('-translate-y-full');
                mobileMenu.classList.add('translate-y-0');
                document.body.style.overflow = 'hidden'; // Lock scrolling
                
                // MORPH to 'X':
                l1.classList.add('translate-y-[10px]', 'rotate-45');
                l2.classList.add('opacity-0', 'translate-x-4'); // slide middle line out
                l3.classList.add('-translate-y-[10px]', '-rotate-45');
            } else {
                // CLOSING: Lift the curtain
                mobileMenu.classList.remove('translate-y-0');
                mobileMenu.classList.add('-translate-y-full');
                document.body.style.overflow = 'auto'; // Unlock scrolling
                
                // MORPH back to Hamburger:
                l1.classList.remove('translate-y-[10px]', 'rotate-45');
                l2.classList.remove('opacity-0', 'translate-x-4');
                l3.classList.remove('-translate-y-[10px]', '-rotate-45');
            }
        };

        // Click the Hamburger
        mobileMenuBtn.addEventListener('click', toggleMenu);

      
        // 🚀 The "Scroll & Delay Navigation" Trick
        mobileLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const targetId = link.getAttribute('data-target');
                const targetElement = targetId ? document.getElementById(targetId) : null;

                // 1. If it's a section on the SAME page (Home, About, Contact)
                if (targetElement) {
                    e.preventDefault(); 
                    targetElement.scrollIntoView({ behavior: 'auto', block: 'start' });
                    
                    setTimeout(() => {
                        toggleMenu(); 
                    }, 200); 
                } 
                // 2. If it's a link to a DIFFERENT page (like menu.html)
                else if (link.getAttribute('href')) {
                    e.preventDefault(); // Stop the instant jump
                    
                    toggleMenu(); // Lift the curtain first!
                    
                    // Wait 700ms for the curtain animation to finish, then load the new page
                    setTimeout(() => {
                        window.location.href = link.getAttribute('href');
                    }, 700);
                }
            });
        });
    }
});