// js/navigation.js - Modern Navigation Interactivity

document.addEventListener('DOMContentLoaded', () => {
    const navToggle = document.querySelector('.nav-toggle');
    const primaryNav = document.querySelector('.primary-navigation');
    const siteHeader = document.querySelector('.site-header');
    const navLinks = document.querySelectorAll('.nav-link');
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';

    // Toggle mobile navigation
    if (navToggle && primaryNav) {
        navToggle.addEventListener('click', () => {
            const isVisible = primaryNav.getAttribute('data-visible') === 'true';
            primaryNav.setAttribute('data-visible', !isVisible);
            navToggle.setAttribute('aria-expanded', !isVisible);
            // Optional: Toggle body scroll to prevent scrolling when nav is open
            // document.body.classList.toggle('no-scroll', !isVisible);
        });

        // Close mobile nav when a link is clicked
        primaryNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (primaryNav.getAttribute('data-visible') === 'true') {
                    primaryNav.setAttribute('data-visible', 'false');
                    navToggle.setAttribute('aria-expanded', 'false');
                    // document.body.classList.remove('no-scroll');
                }
            });
        });
    }

    // Add shadow to header on scroll
    if (siteHeader) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) { // Add shadow after scrolling 50px
                siteHeader.classList.add('header-shadow');
            } else {
                siteHeader.classList.remove('header-shadow');
            }
        });
    }

    // Set active link
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href').split('/').pop();
        if (linkPath === currentPath || (currentPath === 'index.html' && linkPath === '')) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        }
    });

    // Dark mode toggle (example, assuming a button with id #darkModeToggle exists)
    // This should be integrated with your existing dark mode logic if available.
    const darkModeToggle = document.getElementById('dark-mode-toggle'); // Ensure this ID matches your HTML
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            // Optionally, save preference to localStorage
            if (document.body.classList.contains('dark-mode')) {
                localStorage.setItem('theme', 'dark');
            } else {
                localStorage.setItem('theme', 'light');
            }
        });

        // Apply saved theme on load
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-mode');
        } else {
            // Default to light or respect system preference if implemented
            document.body.classList.remove('dark-mode'); 
        }
    }

    // Accessibility: Trap focus within mobile navigation when open
    if (navToggle && primaryNav) {
        const focusableElementsString = 'a[href], button:not([disabled]), textarea, input, select';
        let focusableElements;
        let firstFocusableElement;
        let lastFocusableElement;

        const updateFocusableElements = () => {
            focusableElements = Array.from(primaryNav.querySelectorAll(focusableElementsString));
            if (navToggle.getAttribute('aria-expanded') === 'true') {
                 // Also include the toggle button itself if it should be part of the trap
                focusableElements.unshift(navToggle);
            }
            firstFocusableElement = focusableElements[0];
            lastFocusableElement = focusableElements[focusableElements.length - 1];
        };
        
        // Call it once to initialize
        updateFocusableElements(); 

        primaryNav.addEventListener('keydown', (e) => {
            if (primaryNav.getAttribute('data-visible') !== 'true') return;
            updateFocusableElements(); // Ensure list is current

            if (e.key === 'Tab' || e.keyCode === 9) {
                if (e.shiftKey) { // Shift + Tab
                    if (document.activeElement === firstFocusableElement) {
                        lastFocusableElement.focus();
                        e.preventDefault();
                    }
                } else { // Tab
                    if (document.activeElement === lastFocusableElement) {
                        firstFocusableElement.focus();
                        e.preventDefault();
                    }
                }
            }
        });

        // Update focusable elements when nav visibility changes
        const observer = new MutationObserver((mutationsList) => {
            for(let mutation of mutationsList) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'data-visible') {
                    updateFocusableElements();
                    if (primaryNav.getAttribute('data-visible') === 'true' && firstFocusableElement) {
                        // Optional: focus the first item when nav opens, or the nav container itself
                        // primaryNav.focus(); // Or firstFocusableElement.focus();
                    }
                }
            }
        });
        observer.observe(primaryNav, { attributes: true });
    }
});

// Optional: Add a class to body to prevent scroll when mobile nav is open
// This would require CSS: body.no-scroll { overflow: hidden; }
