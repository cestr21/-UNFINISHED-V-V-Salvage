// JavaScript for Mobile Menu Toggle
const menuToggle = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('.full-page-menu');
const closeMenu = document.querySelector('.full-page-menu .close-menu');
const navLinks = document.querySelector('.nav-links');

function toggleMenu() {
  const isActive = mobileMenu.classList.toggle('active');
  navLinks.classList.toggle('active', !isActive); // Ensures nav-links are hidden when mobile-menu is active
  document.body.style.overflow = isActive ? 'hidden' : 'auto'; // Prevents scrolling when menu is open
}

menuToggle.addEventListener('click', toggleMenu);
closeMenu.addEventListener('click', () => {
  mobileMenu.classList.remove('active');
  navLinks.classList.remove('active');
  menuToggle.classList.remove('open');
  document.body.style.overflow = 'auto';
});

// Optional: Close menu when clicking outside of it
document.addEventListener('click', (e) => {
  if (!menuToggle.contains(e.target) && !mobileMenu.contains(e.target)) {
    mobileMenu.classList.remove('active');
    navLinks.classList.remove('active');
    menuToggle.classList.remove('open');
    document.body.style.overflow = 'auto';
  }
});
