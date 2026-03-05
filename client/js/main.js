import '../css/style.css';
document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.getElementById('navbar');
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  // Sticky Nav Logic
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.remove('bg-transparent', 'py-4');
      navbar.classList.add('bg-brand-brown', 'py-2', 'shadow-md');
    } else {
      navbar.classList.remove('bg-brand-brown', 'py-2', 'shadow-md');
      navbar.classList.add('bg-transparent', 'py-4');
    }
  });

  // Mobile Menu Toggle
  mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
  });

  // Close mobile menu on link click
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
    });
  });
});