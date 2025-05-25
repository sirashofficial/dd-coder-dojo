//
// File: home.js
// Purpose: JavaScript for the home page. Handles smooth scrolling, fade-in animations, and interactive effects for cards and sections. Now supports jQuery for enhanced DOM manipulation and effects.
// Last updated: 2025-05-25
//

console.log('Home page script loaded');

// Example: jQuery fade-in for all .card elements on page load
$(document).ready(function() {
  $('.card').hide().fadeIn(1000);
});

// Basic smooth scrolling
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Basic fade-in animation
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    });

    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(function(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });

    console.log('Home page initialized successfully');
});