//
// File: home.js
// Purpose: JavaScript for the home page. Handles smooth scrolling, fade-in animations, and interactive effects for cards and sections. Now supports jQuery for enhanced DOM manipulation and effects.
// Last updated: 2025-05-25
//

console.log('Home page script loaded');

// Program Tabs Class for filtering program cards
class ProgramTabs {
    constructor() {
        this.tabs = document.querySelectorAll('.program-tab');
        this.programCards = document.querySelectorAll('.program-card');
        this.init();
    }

    init() {
        if (this.tabs.length === 0) {
            console.log('No program tabs found on this page, skipping tab initialization');
            return;
        }
        
        if (this.programCards.length === 0) {
            console.log('No program cards found, skipping tab initialization');
            return;
        }

        this.tabs.forEach(tab => {
            tab.addEventListener('click', (e) => this.handleTabClick(e));
            
            // Add keyboard support
            tab.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.handleTabClick(e);
                }
            });
        });

        // Show all programs by default
        this.showPrograms('all');
        console.log('Program tabs initialized successfully');
    }

    handleTabClick(e) {
        const clickedTab = e.currentTarget;
        const program = clickedTab.getAttribute('data-program');

        // Update tab states
        this.tabs.forEach(tab => {
            tab.classList.remove('active');
            tab.setAttribute('aria-selected', 'false');
        });

        clickedTab.classList.add('active');
        clickedTab.setAttribute('aria-selected', 'true');

        // Filter program cards
        this.showPrograms(program);

        // Add visual feedback
        clickedTab.style.transform = 'scale(0.95)';
        setTimeout(() => {
            clickedTab.style.transform = '';
        }, 100);
    }

    showPrograms(program) {
        this.programCards.forEach(card => {
            const cardProgram = card.getAttribute('data-program');
            
            if (program === 'all' || cardProgram === program) {
                card.style.display = 'block';
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                
                // Animate in
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 100);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(-20px)';
                
                // Hide after animation
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    }
}

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