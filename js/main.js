/**
 * DD Coder Dojo - Enhanced Main JavaScript
 * Comprehensive functionality with improved error handling, performance, and maintainability
 */

// ===== CONFIGURATION & CONSTANTS =====
const CONFIG = {
    THEME_STORAGE_KEY: 'ddCoderDojoTheme',
    ANIMATION_DURATION: 600,
    DEBOUNCE_DELAY: 10,
    NAVBAR_SCROLL_THRESHOLD: 50,
    INTERSECTION_THRESHOLD: 0.1,
    SCROLL_OFFSET: 20
};

// ===== MAIN APPLICATION CLASS =====
class DDCoderDojoApp {
    constructor() {
        this.state = {
            isLightMode: false,
            menuOpen: false,
            isInitialized: false
        };
        
        this.init();
    }

    async init() {
        try {
            console.log('🚀 DD Coder Dojo initializing...');
            
            // Initialize core systems
            await this.initializeTheme();
            this.initializeNavigation();
            this.initializeAccessibility();
            this.initializeAnimations();
            this.initializeUtilities();
            this.setupErrorHandling();
            
            this.state.isInitialized = true;
            console.log('✅ DD Coder Dojo initialized successfully!');
            
            // Dispatch custom event for other scripts
            document.dispatchEvent(new CustomEvent('ddAppReady'));
            
        } catch (error) {
            console.error('❌ Initialization failed:', error);
            this.handleInitializationError(error);
        }
    }

    // ===== THEME MANAGEMENT =====
    async initializeTheme() {
        const savedTheme = localStorage.getItem(CONFIG.THEME_STORAGE_KEY);
        this.state.isLightMode = savedTheme === 'light';
        
        this.updateThemeClass();
        this.setupThemeToggle();
        this.updateThemeIcons();
    }

    updateThemeClass() {
        document.body.classList.toggle('light-mode', this.state.isLightMode);
    }

    setupThemeToggle() {
        const themeToggle = document.getElementById('darkModeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
            themeToggle.setAttribute('aria-label', 
                `Switch to ${this.state.isLightMode ? 'dark' : 'light'} mode`);
        }
    }

    toggleTheme() {
        this.state.isLightMode = !this.state.isLightMode;
        this.updateThemeClass();
        this.updateThemeIcons();
        
        localStorage.setItem(CONFIG.THEME_STORAGE_KEY, 
            this.state.isLightMode ? 'light' : 'dark');
        
        // Update toggle aria-label
        const themeToggle = document.getElementById('darkModeToggle');
        if (themeToggle) {
            themeToggle.setAttribute('aria-label', 
                `Switch to ${this.state.isLightMode ? 'dark' : 'light'} mode`);
        }
    }

    updateThemeIcons() {
        const sunIcon = document.querySelector('.sun-icon');
        const moonIcon = document.querySelector('.moon-icon');
        
        if (sunIcon && moonIcon) {
            if (this.state.isLightMode) {
                sunIcon.style.display = 'none';
                moonIcon.style.display = 'block';
            } else {
                sunIcon.style.display = 'block';
                moonIcon.style.display = 'none';
            }
        }
    }

    // ===== NAVIGATION =====
    initializeNavigation() {
        this.setupMobileMenu();
        this.setupScrollEffects();
        this.setupSmoothScrolling();
        this.setupActiveNavigation();
    }

    setupMobileMenu() {
        const menuToggle = document.getElementById('menuToggle');
        const navLinks = document.querySelector('.nav-links');
        
        if (!menuToggle || !navLinks) return;

        // Toggle menu
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleMobileMenu();
        });

        // Close menu on nav link clicks
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => this.closeMobileMenu());
        });

        // Close menu on outside clicks
        document.addEventListener('click', (e) => {
            if (this.state.menuOpen && 
                !menuToggle.contains(e.target) && 
                !navLinks.contains(e.target)) {
                this.closeMobileMenu();
            }
        });

        // Handle keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.state.menuOpen) {
                this.closeMobileMenu();
            }
        });
    }

    toggleMobileMenu() {
        this.state.menuOpen = !this.state.menuOpen;
        this.updateMobileMenuUI();
    }

    closeMobileMenu() {
        this.state.menuOpen = false;
        this.updateMobileMenuUI();
    }

    updateMobileMenuUI() {
        const menuToggle = document.getElementById('menuToggle');
        const navLinks = document.querySelector('.nav-links');
        
        if (!menuToggle || !navLinks) return;

        menuToggle.classList.toggle('active', this.state.menuOpen);
        navLinks.classList.toggle('active', this.state.menuOpen);
        menuToggle.setAttribute('aria-expanded', this.state.menuOpen.toString());
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = this.state.menuOpen ? 'hidden' : '';
    }

    setupScrollEffects() {
        const navbar = document.querySelector('.navbar');
        if (!navbar) return;

        const debouncedScroll = this.debounce(() => {
            const scrolled = window.scrollY > CONFIG.NAVBAR_SCROLL_THRESHOLD;
            navbar.classList.toggle('scrolled', scrolled);
        }, CONFIG.DEBOUNCE_DELAY);

        window.addEventListener('scroll', debouncedScroll, { passive: true });
    }

    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                
                if (target) {
                    this.smoothScrollToElement(target);
                    this.closeMobileMenu();
                }
            });
        });
    }

    setupActiveNavigation() {
        // Update active nav based on current page
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-links a');
        
        navLinks.forEach(link => {
            const linkPage = link.getAttribute('href');
            const listItem = link.closest('li');
            
            if (linkPage === currentPage || 
                (currentPage === '' && linkPage === 'index.html')) {
                listItem?.classList.add('active');
            } else {
                listItem?.classList.remove('active');
            }
        });
    }

    smoothScrollToElement(element) {
        const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 80;
        const targetPosition = element.offsetTop - navbarHeight - CONFIG.SCROLL_OFFSET;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }

    // ===== ACCESSIBILITY =====
    initializeAccessibility() {
        this.setupSkipLinks();
        this.setupKeyboardNavigation();
        this.setupFocusManagement();
        this.setupAriaLabels();
    }

    setupSkipLinks() {
        const skipLink = document.querySelector('.skip-link');
        if (skipLink) {
            skipLink.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(skipLink.getAttribute('href'));
                if (target) {
                    target.focus();
                    this.smoothScrollToElement(target);
                }
            });
        }
    }

    setupKeyboardNavigation() {
        // Handle tab navigation for better UX
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
    }

    setupFocusManagement() {
        // Improve focus indicators
        const style = document.createElement('style');
        style.textContent = `
            .keyboard-navigation *:focus {
                outline: 2px solid var(--secondary-color) !important;
                outline-offset: 2px !important;
            }
        `;
        document.head.appendChild(style);
    }

    setupAriaLabels() {
        // Ensure all interactive elements have proper labels
        document.querySelectorAll('button, a').forEach(element => {
            if (!element.getAttribute('aria-label') && 
                !element.textContent.trim() && 
                !element.querySelector('span, img[alt]')) {
                console.warn('Interactive element missing accessible label:', element);
            }
        });
    }

    // ===== ANIMATIONS =====
    initializeAnimations() {
        this.setupScrollAnimations();
        this.setupIntersectionObserver();
        this.setupLoadingStates();
    }

    setupScrollAnimations() {
        if (!('IntersectionObserver' in window)) {
            console.warn('IntersectionObserver not supported');
            return;
        }

        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                    animationObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: CONFIG.INTERSECTION_THRESHOLD,
            rootMargin: '0px 0px -50px 0px'
        });

        // Elements to animate
        const animateElements = document.querySelectorAll(`
            .program-card, .hero-content, .about-text, .mission-vision-box,
            .team-member, .timeline-item, .category-card, .resource-partner,
            .project-card, .contact-item, .step, .info-item, .stat-card
        `);

        animateElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = `all ${CONFIG.ANIMATION_DURATION}ms ease`;
            animationObserver.observe(el);
        });
    }

    setupIntersectionObserver() {
        // Generic intersection observer for various effects
        this.createIntersectionObserver('.fade-in', (element) => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        });

        this.createIntersectionObserver('.slide-in-left', (element) => {
            element.style.transform = 'translateX(0)';
            element.style.opacity = '1';
        });

        this.createIntersectionObserver('.slide-in-right', (element) => {
            element.style.transform = 'translateX(0)';
            element.style.opacity = '1';
        });
    }

    createIntersectionObserver(selector, callback, options = {}) {
        const elements = document.querySelectorAll(selector);
        if (elements.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    callback(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            ...options
        });

        elements.forEach(el => observer.observe(el));
    }

    animateElement(element) {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
        element.classList.add('animate-in');
    }

    setupLoadingStates() {
        window.addEventListener('load', () => {
            document.body.classList.add('loaded');
            
            // Remove loading states
            document.querySelectorAll('.loading').forEach(el => {
                el.classList.remove('loading');
            });
        });
    }

    // ===== UTILITIES =====
    initializeUtilities() {
        this.setupExternalLinks();
        this.setupImageLazyLoading();
        this.setupFormUtilities();
        this.setupPerformanceOptimizations();
    }

    setupExternalLinks() {
        document.querySelectorAll('a').forEach(link => {
            if (link.href.includes('http') && 
                !link.href.includes(window.location.hostname)) {
                link.rel = 'noopener noreferrer';
                if (!link.target) {
                    link.target = '_blank';
                }
                // Add external link icon if not present
                if (!link.querySelector('.external-icon')) {
                    const icon = document.createElement('span');
                    icon.className = 'external-icon';
                    icon.innerHTML = ' ↗';
                    icon.setAttribute('aria-hidden', 'true');
                    link.appendChild(icon);
                }
            }
        });
    }

    setupImageLazyLoading() {
        if ('loading' in HTMLImageElement.prototype) {
            // Native lazy loading support
            document.querySelectorAll('img[data-src]').forEach(img => {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                img.loading = 'lazy';
            });
        } else if ('IntersectionObserver' in window) {
            // Fallback for older browsers
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                            img.classList.remove('lazy');
                            imageObserver.unobserve(img);
                        }
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                img.classList.add('lazy');
                imageObserver.observe(img);
            });
        }
    }

    setupFormUtilities() {
        // Add form validation helpers
        document.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', (e) => {
                if (!this.validateForm(form)) {
                    e.preventDefault();
                }
            });
        });
    }

    setupPerformanceOptimizations() {
        // Preload critical resources
        this.preloadCriticalResources();
        
        // Set up resource hints
        this.setupResourceHints();
    }

    preloadCriticalResources() {
        const criticalImages = [
            '/images/hero-bg.jpg',
            '/images/logo.png'
        ];

        criticalImages.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = src;
            document.head.appendChild(link);
        });
    }

    setupResourceHints() {
        const domains = [
            'https://fonts.googleapis.com',
            'https://cdnjs.cloudflare.com'
        ];

        domains.forEach(domain => {
            const link = document.createElement('link');
            link.rel = 'dns-prefetch';
            link.href = domain;
            document.head.appendChild(link);
        });
    }

    // ===== ERROR HANDLING =====
    setupErrorHandling() {
        window.addEventListener('error', (e) => {
            this.logError('JavaScript Error', e.error);
        });

        window.addEventListener('unhandledrejection', (e) => {
            this.logError('Unhandled Promise Rejection', e.reason);
        });
    }

    handleInitializationError(error) {
        // Fallback functionality for critical failures
        console.error('Critical initialization error:', error);
        
        // Show user-friendly error message
        this.showErrorMessage('Sorry, there was a problem loading the website. Please refresh the page.');
    }

    logError(type, error) {
        console.error(`${type}:`, error);
        
        // In production, you might want to send this to an error tracking service
        // this.sendErrorToService(type, error);
    }

    showErrorMessage(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-notification';
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ef4444;
            color: white;
            padding: 1rem;
            border-radius: 8px;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        `;
        
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }

    // ===== UTILITY METHODS =====
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    validatePhoneNumber(phone) {
        // South African phone number validation
        const phoneRegex = /^(\+27|0)[0-9]{9}$/;
        return phoneRegex.test(phone.replace(/\s/g, ''));
    }

    validateForm(form) {
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                this.showFieldError(field, 'This field is required');
                isValid = false;
            } else if (field.type === 'email' && !this.validateEmail(field.value)) {
                this.showFieldError(field, 'Please enter a valid email address');
                isValid = false;
            } else {
                this.clearFieldError(field);
            }
        });
        
        return isValid;
    }

    showFieldError(field, message) {
        this.clearFieldError(field);
        
        field.style.borderColor = '#ef4444';
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            color: #ef4444;
            font-size: 0.85rem;
            margin-top: 0.25rem;
        `;
        
        field.parentNode.appendChild(errorDiv);
    }

    clearFieldError(field) {
        field.style.borderColor = '';
        const errorDiv = field.parentNode.querySelector('.field-error');
        if (errorDiv) {
            errorDiv.remove();
        }
    }

    // ===== PUBLIC API =====
    getState() {
        return { ...this.state };
    }

    isReady() {
        return this.state.isInitialized;
    }
}

// ===== INITIALIZATION =====
let ddApp;

document.addEventListener('DOMContentLoaded', () => {
    ddApp = new DDCoderDojoApp();
});

// ===== GLOBAL API =====
window.DDCoderDojo = {
    // Get app instance
    getApp: () => ddApp,
    
    // Quick access methods
    toggleTheme: () => ddApp?.toggleTheme(),
    closeMobileMenu: () => ddApp?.closeMobileMenu(),
    
    // Utility methods
    validateEmail: (email) => ddApp?.validateEmail(email),
    validatePhoneNumber: (phone) => ddApp?.validatePhoneNumber(phone),
    
    // Animation helpers
    animateElement: (element) => ddApp?.animateElement(element),
    
    // State
    isReady: () => ddApp?.isReady() || false
};

// Intersection Observer for scroll animations
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.setAttribute('data-animate', 'visible');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));

// ===== ANIMATED CODE EFFECT =====
function animateCodeLines() {
  const codeLines = document.querySelectorAll('.code-line');
  
  codeLines.forEach((line, index) => {
    // Add typing cursor animation
    const cursor = line.querySelector('.code-cursor');
    if (cursor) {
      cursor.style.animationDelay = `${index * 0.3}s`;
    }
    
    // Add hover effect
    line.addEventListener('mouseenter', () => {
      line.style.transform = 'translateX(10px)';
      line.style.background = 'rgba(0, 217, 255, 0.05)';
      line.style.transition = 'all 0.3s ease';
    });
    
    line.addEventListener('mouseleave', () => {
      line.style.transform = 'translateX(0)';
      line.style.background = 'transparent';
    });
  });
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', animateCodeLines);

// Enhanced form handler for contact and registration forms
import './formHandler.js';