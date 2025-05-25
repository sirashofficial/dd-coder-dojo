/**
 * Enhanced Animations and Interactions Controller
 * Handles modern animations, scroll effects, and micro-interactions
 * Last updated: 2025-01-20
 */

class EnhancedAnimations {
    constructor() {
        this.observers = new Map();
        this.animationQueues = new Map();
        this.scrollElements = new Set();
        
        this.config = {
            intersectionThreshold: 0.1,
            animationDelay: 100,
            staggerDelay: 150,
            scrollThreshold: 10
        };

        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.setupScrollAnimations();
        this.setupHoverEffects();
        this.setupFormEnhancements();
        this.setupLoadingStates();
        this.setupMicroInteractions();
        this.setupParallaxEffects();
        this.setupCounterAnimations();
        this.setupModalEnhancements();
        this.setupTooltips();
        this.setupScrollProgressIndicator();
        this.setupScrollToTop();
        this.setupEnhancedFormValidation();
        this.setupAdvancedHoverEffects();
        this.setupEnhancedSmoothScrolling();
        this.setupEnhancedTooltips();
        this.setupModalSystem();
        this.setupLazyLoading();
        this.initResourceSearch();
        this.initGallerySearch();
        this.initKeyboardNavigation();
        this.initPerformanceOptimizations();
        this.initErrorHandling();
        this.initAccessibilityPreferences();
        
        console.log('✨ Enhanced animations initialized');
    }

    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                        this.triggerCustomAnimation(entry.target);
                    }, index * this.config.staggerDelay);
                }
            });
        }, {
            threshold: this.config.intersectionThreshold,
            rootMargin: '50px'
        });

        // Observe elements with animation classes
        const animationClasses = [
            '.fade-in', '.slide-in-left', '.slide-in-right', 
            '.scale-in', '.card-modern', '.stat-card'
        ];

        animationClasses.forEach(className => {
            document.querySelectorAll(className).forEach(el => {
                observer.observe(el);
            });
        });

        this.observers.set('intersection', observer);
    }

    setupScrollAnimations() {
        let ticking = false;

        const updateScrollAnimations = () => {
            const scrollY = window.pageYOffset;
            const windowHeight = window.innerHeight;

            // Parallax elements
            document.querySelectorAll('[data-parallax]').forEach(el => {
                const speed = parseFloat(el.dataset.parallax) || 0.5;
                const yPos = -(scrollY * speed);
                el.style.transform = `translateY(${yPos}px)`;
            });

            // Scroll progress bar
            const scrollProgress = document.querySelector('.scroll-progress');
            if (scrollProgress) {
                const docHeight = document.documentElement.scrollHeight - windowHeight;
                const progress = (scrollY / docHeight) * 100;
                scrollProgress.style.width = `${Math.min(progress, 100)}%`;
            }

            // Navbar background opacity
            const navbar = document.querySelector('.navbar');
            if (navbar) {
                const opacity = Math.min(scrollY / 100, 1);
                navbar.style.setProperty('--bg-opacity', opacity);
            }

            ticking = false;
        };

        const requestScrollUpdate = () => {
            if (!ticking) {
                requestAnimationFrame(updateScrollAnimations);
                ticking = true;
            }
        };

        window.addEventListener('scroll', requestScrollUpdate, { passive: true });
    }

    setupScrollProgressIndicator() {
        // Create scroll progress bar if it doesn't exist
        if (!document.querySelector('.scroll-progress-container')) {
            const progressContainer = document.createElement('div');
            progressContainer.className = 'scroll-progress-container';
            
            const progressBar = document.createElement('div');
            progressBar.className = 'scroll-progress';
            
            progressContainer.appendChild(progressBar);
            document.body.appendChild(progressContainer);
        }
    }

    setupScrollToTop() {
        // Create scroll to top button if it doesn't exist
        if (!document.querySelector('.scroll-to-top')) {
            const scrollBtn = document.createElement('button');
            scrollBtn.className = 'scroll-to-top';
            scrollBtn.innerHTML = '↑';
            scrollBtn.setAttribute('aria-label', 'Scroll to top');
            
            scrollBtn.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
            
            document.body.appendChild(scrollBtn);
        }

        // Show/hide scroll to top button
        const scrollBtn = document.querySelector('.scroll-to-top');
        if (scrollBtn) {
            window.addEventListener('scroll', () => {
                if (window.pageYOffset > 300) {
                    scrollBtn.classList.add('visible');
                } else {
                    scrollBtn.classList.remove('visible');
                }
            });
        }
    }    setupHoverEffects() {
        // Simple card hover effects - no complex animations
        document.querySelectorAll('.card-modern').forEach(card => {
            const handleMouseEnter = (e) => {
                // Just simple glow effect
                card.style.setProperty('--glow-opacity', '0.5');
            };

            const handleMouseLeave = () => {
                card.style.setProperty('--glow-opacity', '0');
            };

            card.addEventListener('mouseenter', handleMouseEnter);
            card.addEventListener('mouseleave', handleMouseLeave);
        });

        // Simple button hover effects
        document.querySelectorAll('.btn-enhanced').forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                btn.style.setProperty('--btn-scale', '1.02');
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.setProperty('--btn-scale', '1');
            });
        });
    }

    setupFormEnhancements() {
        // Enhanced form validation and interactions
        document.querySelectorAll('.form-input-enhanced').forEach(input => {
            const formGroup = input.closest('.form-group-enhanced');
            
            // Real-time validation
            input.addEventListener('input', (e) => {
                this.validateField(input, formGroup);
            });

            input.addEventListener('blur', (e) => {
                this.validateField(input, formGroup, true);
            });

            // Focus effects
            input.addEventListener('focus', () => {
                formGroup.classList.add('focused');
            });

            input.addEventListener('blur', () => {
                formGroup.classList.remove('focused');
            });
        });

        // Form submission enhancements
        document.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', (e) => {
                this.handleFormSubmission(form, e);
            });
        });
    }

    setupLoadingStates() {
        // Create loading skeletons for content areas
        const contentAreas = document.querySelectorAll('[data-loading]');
        contentAreas.forEach(area => {
            const skeleton = this.createSkeleton(area);
            area.appendChild(skeleton);
            
            // Remove skeleton when content loads
            setTimeout(() => {
                skeleton.remove();
                area.classList.add('loaded');
            }, 1000);
        });
    }

    setupMicroInteractions() {
        // Pulse on hover effects
        document.querySelectorAll('.pulse-on-hover').forEach(el => {
            el.addEventListener('mouseenter', () => {
                el.style.animation = 'pulse 0.6s ease-in-out';
            });

            el.addEventListener('animationend', () => {
                el.style.animation = '';
            });
        });

        // Bounce on click effects
        document.querySelectorAll('.bounce-on-hover').forEach(el => {
            el.addEventListener('click', () => {
                el.style.animation = 'bounce 0.6s ease-in-out';
            });

            el.addEventListener('animationend', () => {
                el.style.animation = '';
            });
        });

        // Rotate on hover effects
        document.querySelectorAll('.rotate-on-hover').forEach(el => {
            el.addEventListener('mouseenter', () => {
                el.style.animation = 'rotate 0.6s ease-in-out';
            });

            el.addEventListener('animationend', () => {
                el.style.animation = '';
            });
        });
    }

    setupParallaxEffects() {
        // Advanced parallax for hero elements
        const heroElements = document.querySelectorAll('.hero [data-speed]');
        
        if (heroElements.length > 0) {
            let ticking = false;

            const updateParallax = () => {
                const scrollTop = window.pageYOffset;
                
                heroElements.forEach(el => {
                    const speed = parseFloat(el.dataset.speed) || 1;
                    const yPos = scrollTop * speed;
                    el.style.transform = `translateY(${yPos}px)`;
                });

                ticking = false;
            };

            const requestParallaxUpdate = () => {
                if (!ticking) {
                    requestAnimationFrame(updateParallax);
                    ticking = true;
                }
            };

            window.addEventListener('scroll', requestParallaxUpdate, { passive: true });
        }
    }

    setupCounterAnimations() {
        // Animate numbers when they come into view
        const counters = document.querySelectorAll('[data-count]');
        
        const animateCounter = (counter) => {
            const target = parseInt(counter.dataset.count);
            const duration = parseInt(counter.dataset.duration) || 2000;
            const start = parseInt(counter.textContent) || 0;
            const startTime = Date.now();

            const updateCounter = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Easing function
                const easeOut = 1 - Math.pow(1 - progress, 3);
                const current = Math.round(start + (target - start) * easeOut);
                
                counter.textContent = current.toLocaleString();
                
                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.classList.add('counting-complete');
                }
            };

            counter.classList.add('counting');
            updateCounter();
        };

        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                    entry.target.classList.add('counted');
                    animateCounter(entry.target);
                }
            });
        });

        counters.forEach(counter => counterObserver.observe(counter));
    }

    setupModalEnhancements() {
        // Enhanced modal interactions
        document.querySelectorAll('[data-modal]').forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                const modalId = trigger.dataset.modal;
                const modal = document.getElementById(modalId);
                
                if (modal) {
                    this.openModal(modal);
                }
            });
        });

        // Close modal on outside click
        document.querySelectorAll('.modal-enhanced').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal);
                }
            });

            // Close on escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && modal.classList.contains('active')) {
                    this.closeModal(modal);
                }
            });
        });
    }

    setupTooltips() {
        // Enhanced tooltip system
        document.querySelectorAll('[data-tooltip]').forEach(el => {
            if (!el.classList.contains('tooltip-enhanced')) {
                el.classList.add('tooltip-enhanced');
            }

            let tooltipTimeout;

            el.addEventListener('mouseenter', () => {
                clearTimeout(tooltipTimeout);
                tooltipTimeout = setTimeout(() => {
                    this.showTooltip(el);
                }, 500);
            });

            el.addEventListener('mouseleave', () => {
                clearTimeout(tooltipTimeout);
                this.hideTooltip(el);
            });
        });
    }

    setupEnhancedTooltips() {
        // Create tooltip container if it doesn't exist
        if (!document.querySelector('.tooltip-container')) {
            const tooltipContainer = document.createElement('div');
            tooltipContainer.className = 'tooltip-container';
            document.body.appendChild(tooltipContainer);
        }

        document.querySelectorAll('[data-tooltip]').forEach(element => {
            let tooltip = null;
            let showTimeout = null;
            let hideTimeout = null;

            const showTooltip = (e) => {
                clearTimeout(hideTimeout);
                clearTimeout(showTimeout);

                showTimeout = setTimeout(() => {
                    if (tooltip) {
                        tooltip.remove();
                    }

                    tooltip = document.createElement('div');
                    tooltip.className = 'enhanced-tooltip';
                    tooltip.textContent = element.dataset.tooltip;

                    const container = document.querySelector('.tooltip-container');
                    container.appendChild(tooltip);

                    // Position tooltip
                    const rect = element.getBoundingClientRect();
                    const tooltipRect = tooltip.getBoundingClientRect();
                    
                    let top = rect.top - tooltipRect.height - 10;
                    let left = rect.left + (rect.width - tooltipRect.width) / 2;

                    // Ensure tooltip stays within viewport
                    if (top < 10) {
                        top = rect.bottom + 10;
                        tooltip.classList.add('bottom');
                    }
                    
                    if (left < 10) {
                        left = 10;
                    } else if (left + tooltipRect.width > window.innerWidth - 10) {
                        left = window.innerWidth - tooltipRect.width - 10;
                    }

                    tooltip.style.top = `${top}px`;
                    tooltip.style.left = `${left}px`;
                    
                    // Show with animation
                    requestAnimationFrame(() => {
                        tooltip.classList.add('visible');
                    });
                }, 300);
            };

            const hideTooltip = () => {
                clearTimeout(showTimeout);
                
                if (tooltip) {
                    hideTimeout = setTimeout(() => {
                        tooltip.classList.remove('visible');
                        setTimeout(() => {
                            if (tooltip && tooltip.parentNode) {
                                tooltip.parentNode.removeChild(tooltip);
                            }
                            tooltip = null;
                        }, 200);
                    }, 100);
                }
            };

            element.addEventListener('mouseenter', showTooltip);
            element.addEventListener('mouseleave', hideTooltip);
            element.addEventListener('focus', showTooltip);
            element.addEventListener('blur', hideTooltip);
        });
    }

    setupModalSystem() {
        // Enhanced modal system for project galleries and info dialogs
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-modal-trigger]')) {
                e.preventDefault();
                const modalId = e.target.dataset.modalTrigger;
                this.openModal(modalId, e.target);
            }

            if (e.target.matches('.modal-close, .modal-overlay')) {
                this.closeAllModals();
            }
        });

        // Close modal on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });
    }

    openModal(modalId, triggerElement = null) {
        const modal = document.getElementById(modalId);
        if (!modal) return;

        // Add modal overlay if it doesn't exist
        if (!document.querySelector('.modal-overlay')) {
            const overlay = document.createElement('div');
            overlay.className = 'modal-overlay';
            document.body.appendChild(overlay);
        }

        modal.classList.add('active');
        document.querySelector('.modal-overlay').classList.add('active');
        document.body.classList.add('modal-open');

        // Focus management
        const focusableElements = modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElements.length > 0) {
            focusableElements[0].focus();
        }

        // Store trigger element for focus return
        modal.dataset.triggerElement = triggerElement ? 
            Array.from(document.querySelectorAll('*')).indexOf(triggerElement) : '';
    }

    closeAllModals() {
        const activeModals = document.querySelectorAll('.modal.active');
        const overlay = document.querySelector('.modal-overlay');

        activeModals.forEach(modal => {
            modal.classList.remove('active');
            
            // Return focus to trigger element
            const triggerIndex = modal.dataset.triggerElement;
            if (triggerIndex) {
                const triggerElement = document.querySelectorAll('*')[parseInt(triggerIndex)];
                if (triggerElement) {
                    triggerElement.focus();
                }
            }
        });

        if (overlay) {
            overlay.classList.remove('active');
        }
        
        document.body.classList.remove('modal-open');
    }

    setupLazyLoading() {
        // Enhanced lazy loading for images and content
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.dataset.src;
                    
                    if (src) {
                        img.src = src;
                        img.classList.add('loaded');
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                }
            });
        }, {
            rootMargin: '50px'
        });

        // Observe all images with data-src
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });

        // Content lazy loading
        const contentObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    const contentSrc = element.dataset.contentSrc;
                    
                    if (contentSrc) {
                        this.loadDynamicContent(element, contentSrc);
                        contentObserver.unobserve(element);
                    }
                }
            });
        });

        document.querySelectorAll('[data-content-src]').forEach(el => {
            contentObserver.observe(el);
        });
    }

    async loadDynamicContent(element, src) {
        try {
            element.classList.add('loading');
            
            // Simulate loading delay for demonstration
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // In a real implementation, you would fetch from src
            // const response = await fetch(src);
            // const content = await response.text();
            
            element.classList.remove('loading');
            element.classList.add('loaded');
            
        } catch (error) {
            console.error('Failed to load content:', error);
            element.classList.add('error');
        }
    }

    // Helper methods
    createRipple(element, event) {
        const rect = element.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const ripple = document.createElement('div');
        ripple.className = 'ripple-effect';
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.2);
            transform: translate(-50%, -50%);
            pointer-events: none;
            animation: ripple 0.6s ease-out;
            left: ${x}px;
            top: ${y}px;
            width: 0;
            height: 0;
        `;

        element.style.position = 'relative';
        element.appendChild(ripple);

        // Create ripple animation if it doesn't exist
        if (!document.querySelector('#ripple-animation')) {
            const style = document.createElement('style');
            style.id = 'ripple-animation';
            style.textContent = `
                @keyframes ripple {
                    0% {
                        width: 0;
                        height: 0;
                        opacity: 1;
                    }
                    100% {
                        width: 200px;
                        height: 200px;
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        setTimeout(() => ripple.remove(), 600);
    }

    // Utility function for creating ripple effects
    createRippleEffect(element, event) {
        const rect = element.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const ripple = document.createElement('div');
        ripple.className = 'ripple-effect';
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: translate(-50%, -50%);
            pointer-events: none;
            animation: ripple 0.6s ease-out;
            left: ${x}px;
            top: ${y}px;
            width: 0;
            height: 0;
            z-index: 1;
        `;

        element.style.position = 'relative';
        element.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    }

    validateField(input, formGroup, showError = false) {
        const value = input.value.trim();
        const type = input.type;
        const required = input.hasAttribute('required');
        
        let isValid = true;
        let errorMessage = '';

        // Basic validation
        if (required && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        } else if (type === 'email' && value && !this.isValidEmail(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        } else if (type === 'tel' && value && !this.isValidPhone(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number';
        }

        // Update UI
        formGroup.classList.toggle('error', !isValid && showError);
        formGroup.classList.toggle('valid', isValid && value);

        // Show/hide error message
        let errorEl = formGroup.querySelector('.error-message');
        if (!isValid && showError && errorMessage) {
            if (!errorEl) {
                errorEl = document.createElement('div');
                errorEl.className = 'error-message';
                formGroup.appendChild(errorEl);
            }
            errorEl.textContent = errorMessage;
        } else if (errorEl) {
            errorEl.remove();
        }

        return isValid;
    }

    setupEnhancedFormValidation() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            const inputs = form.querySelectorAll('input, textarea, select');
            
            inputs.forEach(input => {
                // Real-time validation
                input.addEventListener('input', () => {
                    this.validateField(input);
                });
                
                input.addEventListener('blur', () => {
                    this.validateField(input);
                });
            });
            
            // Form submission enhancement
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmission(form);
            });
        });
    }

    showFieldFeedback(field, message, isValid) {
        let feedback = field.parentNode.querySelector('.form-feedback');
        
        if (!feedback) {
            feedback = document.createElement('div');
            feedback.className = 'form-feedback';
            field.parentNode.appendChild(feedback);
        }
        
        feedback.textContent = message;
        feedback.classList.remove('valid', 'invalid', 'show');
        
        if (message) {
            feedback.classList.add(isValid ? 'valid' : 'invalid', 'show');
        }
    }

    handleFormSubmission(form) {
        const inputs = form.querySelectorAll('input, textarea, select');
        let allValid = true;
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                allValid = false;
            }
        });
        
        if (allValid) {
            this.showNotification('Form submitted successfully!', 'success');
            // Add loading state
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span class="loading-spinner"></span> Submitting...';
                
                // Simulate form processing
                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = 'Submit';
                    form.reset();
                }, 2000);
            }
        } else {
            this.showNotification('Please correct the errors in the form', 'error');
        }
    }    setupAdvancedHoverEffects() {
        // Subtle, strictly 2D hover effect for cards (no 3D movement)
        document.querySelectorAll('.card-modern').forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-2px)';
                card.style.transition = 'transform 0.15s cubic-bezier(0.4,0,0.2,1)';
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
                card.style.transition = 'transform 0.15s cubic-bezier(0.4,0,0.2,1)';
            });
        });
    }

    setupEnhancedSmoothScrolling() {
        // Enhanced smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                
                if (target) {
                    const headerOffset = 80;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // Enhanced search and filter functionality for resources page
    initResourceSearch() {
        const searchInput = document.getElementById('resourceSearch');
        const clearButton = document.getElementById('clearSearch');
        const filterButtons = document.querySelectorAll('.filter-btn');
        const categories = document.querySelectorAll('.category-card');
        
        if (!searchInput) return; // Not on resources page
        
        let currentFilter = 'all';
        
        // Search functionality
        const performSearch = () => {
            const query = searchInput.value.toLowerCase().trim();
            const isEmpty = query === '';
            
            // Show/hide clear button
            clearButton.style.display = isEmpty ? 'none' : 'flex';
            
            categories.forEach(card => {
                const keywords = card.dataset.keywords || '';
                const title = card.querySelector('h3').textContent.toLowerCase();
                const content = card.querySelector('.category-content').textContent.toLowerCase();
                
                const matchesSearch = isEmpty || 
                    keywords.includes(query) || 
                    title.includes(query) || 
                    content.includes(query);
                
                const matchesFilter = currentFilter === 'all' || 
                    card.dataset.category === currentFilter;
                
                const shouldShow = matchesSearch && matchesFilter;
                
                // Animate card visibility
                if (shouldShow) {
                    card.style.display = 'block';
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    
                    setTimeout(() => {
                        card.style.transition = 'all 0.3s ease';
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    card.style.transition = 'all 0.3s ease';
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(-20px)';
                    
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
            
            // Show no results message
            this.showNoResultsMessage(query, currentFilter);
        };
        
        // Search input events
        searchInput.addEventListener('input', this.debounce(performSearch, 300));
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                performSearch();
            }
        });
        
        // Clear search
        clearButton.addEventListener('click', () => {
            searchInput.value = '';
            clearButton.style.display = 'none';
            performSearch();
            searchInput.focus();
        });
        
        // Filter functionality
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active filter
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentFilter = btn.dataset.filter;
                
                // Add ripple effect
                this.createRippleEffect(btn, event);
                
                // Perform search with new filter
                performSearch();
                
                // Show notification
                this.showNotification(`Filtered to ${btn.textContent.trim()} resources`, 'info', 2000);
            });
        });
    }
    
    // Show no results message
    showNoResultsMessage(query, filter) {
        const container = document.getElementById('resourceCategories');
        if (!container) return;
        
        let noResultsEl = container.querySelector('.no-results-message');
        const hasVisibleCards = Array.from(container.querySelectorAll('.category-card'))
            .some(card => card.style.display !== 'none');
        
        if (!hasVisibleCards && (query || filter !== 'all')) {
            if (!noResultsEl) {
                noResultsEl = document.createElement('div');
                noResultsEl.className = 'no-results-message text-center fade-in';
                noResultsEl.innerHTML = `
                    <div class="no-results-icon">
                        <i class="fas fa-search" aria-hidden="true"></i>
                    </div>
                    <h3>No resources found</h3>
                    <p>Try adjusting your search terms or filter selection</p>
                    <button class="btn btn-secondary" onclick="document.getElementById('resourceSearch').value=''; document.querySelector('.filter-btn[data-filter=all]').click();">
                        <i class="fas fa-refresh" aria-hidden="true"></i>
                        Show All Resources
                    </button>
                `;
                container.appendChild(noResultsEl);
            }
            noResultsEl.style.display = 'block';
        } else if (noResultsEl) {
            noResultsEl.style.display = 'none';
        }
    }
    
    // Enhanced gallery search functionality
    initGallerySearch() {
        const searchInput = document.querySelector('.gallery-search input');
        const filterButtons = document.querySelectorAll('.filter-btn');
        const galleryItems = document.querySelectorAll('.gallery-item');
        
        if (!searchInput) return; // Not on gallery page
        
        let currentFilter = 'all';
        
        const performGallerySearch = () => {
            const query = searchInput.value.toLowerCase().trim();
            
            galleryItems.forEach(item => {
                const title = item.querySelector('h3')?.textContent.toLowerCase() || '';
                const description = item.querySelector('p')?.textContent.toLowerCase() || '';
                const category = item.dataset.category || '';
                
                const matchesSearch = !query || 
                    title.includes(query) || 
                    description.includes(query);
                
                const matchesFilter = currentFilter === 'all' || 
                    category === currentFilter;
                
                const shouldShow = matchesSearch && matchesFilter;
                
                // Animate item visibility
                if (shouldShow) {
                    item.style.display = 'block';
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    
                    setTimeout(() => {
                        item.style.transition = 'all 0.3s ease';
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, Math.random() * 100);
                } else {
                    item.style.transition = 'all 0.3s ease';
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        };
        
        // Search input events
        searchInput.addEventListener('input', this.debounce(performGallerySearch, 300));
        
        // Filter events
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentFilter = btn.dataset.filter;
                performGallerySearch();
            });
        });
    }

    // Enhanced keyboard navigation and accessibility
    initKeyboardNavigation() {
        // Enhanced tab navigation for interactive elements
        document.addEventListener('keydown', (e) => {
            const activeElement = document.activeElement;
            
            // Enhanced filter navigation
            if (activeElement.classList.contains('filter-btn')) {
                const filterBtns = Array.from(document.querySelectorAll('.filter-btn'));
                const currentIndex = filterBtns.indexOf(activeElement);
                
                if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                    e.preventDefault();
                    const prevIndex = currentIndex > 0 ? currentIndex - 1 : filterBtns.length - 1;
                    filterBtns[prevIndex].focus();
                } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                    e.preventDefault();
                    const nextIndex = currentIndex < filterBtns.length - 1 ? currentIndex + 1 : 0;
                    filterBtns[nextIndex].focus();
                } else if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    activeElement.click();
                }
            }
            
            // Gallery navigation
            if (activeElement.classList.contains('gallery-item')) {
                const galleryItems = Array.from(document.querySelectorAll('.gallery-item:not([style*="display: none"])'));
                const currentIndex = galleryItems.indexOf(activeElement);
                
                if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    const prevIndex = currentIndex > 0 ? currentIndex - 1 : galleryItems.length - 1;
                    galleryItems[prevIndex].focus();
                } else if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    const nextIndex = currentIndex < galleryItems.length - 1 ? currentIndex + 1 : 0;
                    galleryItems[nextIndex].focus();
                }
            }
        });
        
        // Focus indicators for better accessibility
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });
        
        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
    }
    
    // Performance optimizations
    initPerformanceOptimizations() {
        // Throttle scroll events
        let scrollTimeout;
        const originalScrollHandler = window.onscroll;
        
        window.onscroll = () => {
            if (scrollTimeout) {
                clearTimeout(scrollTimeout);
            }
            
            scrollTimeout = setTimeout(() => {
                if (originalScrollHandler) {
                    originalScrollHandler();
                }
            }, 16); // ~60fps
        };
        
        // Preload critical images
        const preloadImages = () => {
            const criticalImages = document.querySelectorAll('img[data-preload]');
            criticalImages.forEach(img => {
                const link = document.createElement('link');
                link.rel = 'preload';
                link.as = 'image';
                link.href = img.src || img.dataset.src;
                document.head.appendChild(link);
            });
        };
        
        // Run optimizations
        requestIdleCallback(preloadImages);
    }
    
    // Enhanced error handling and user feedback
    initErrorHandling() {
        // Global error handler for JavaScript errors
        window.addEventListener('error', (e) => {
            console.error('JavaScript Error:', e.error);
            
            // Show user-friendly error message
            this.showNotification(
                'Something went wrong. Please refresh the page and try again.', 
                'error',
                5000
            );
        });
        
        // Handle unhandled promise rejections
        window.addEventListener('unhandledrejection', (e) => {
            console.error('Unhandled Promise Rejection:', e.reason);
            
            this.showNotification(
                'A background process failed. The page should continue to work normally.',
                'warning',
                3000
            );
        });
        
        // Network error detection
        window.addEventListener('online', () => {
            this.showNotification('Internet connection restored', 'success', 3000);
        });
        
        window.addEventListener('offline', () => {
            this.showNotification('Internet connection lost', 'warning', 5000);
        });
    }
    
    // Enhanced notification system with different types
    showNotification(message, type = 'info', duration = 4000) {
        // Remove existing notifications of the same type
        const existingNotifications = document.querySelectorAll(`.notification.${type}`);
        existingNotifications.forEach(notification => {
            notification.remove();
        });
        
        const notification = document.createElement('div');
        notification.className = `notification ${type} notification-enter`;
        
        // Add icon based on type
        const icons = {
            success: '✓',
            error: '✕',
            warning: '⚠',
            info: 'ℹ'
        };
        
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${icons[type] || icons.info}</span>
                <span class="notification-message">${message}</span>
                <button class="notification-close" aria-label="Close notification">×</button>
            </div>
        `;
        
        // Position notification
        const notificationContainer = this.getOrCreateNotificationContainer();
        notificationContainer.appendChild(notification);
        
        // Add close functionality
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            this.removeNotification(notification);
        });
        
        // Show notification with animation
        requestAnimationFrame(() => {
            notification.classList.remove('notification-enter');
            notification.classList.add('notification-show');
        });
        
        // Auto-remove after duration
        setTimeout(() => {
            this.removeNotification(notification);
        }, duration);
        
        return notification;
    }
    
    getOrCreateNotificationContainer() {
        let container = document.querySelector('.notification-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'notification-container';
            document.body.appendChild(container);
        }
        return container;
    }
    
    removeNotification(notification) {
        notification.classList.remove('notification-show');
        notification.classList.add('notification-exit');
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }

    // Public API methods
    animateElement(element, animation) {
        element.style.animation = `${animation} 0.6s ease-out`;
        return new Promise(resolve => {
            element.addEventListener('animationend', resolve, { once: true });
        });
    }

    addScrollAnimation(element, animation) {
        element.classList.add(animation);
        this.observers.get('intersection').observe(element);
    }

    removeAllAnimations(element) {
        element.style.animation = '';
        element.className = element.className.replace(/\b(fade-in|slide-in-\w+|scale-in|visible)\b/g, '');
    }

    // Notification methods
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 5000);
    }

    // Validation helper methods
    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    isValidPhone(phone) {
        return /^[\+]?[1-9][\d]{0,15}$/.test(phone.replace(/\s/g, ''));
    }

    // Modal methods
    openModal(modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Focus trap
        const focusableElements = modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length > 0) {
            focusableElements[0].focus();
        }
    }

    closeModal(modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Tooltip methods
    showTooltip(element) {
        element.setAttribute('data-tooltip-visible', 'true');
    }

    hideTooltip(element) {
        element.removeAttribute('data-tooltip-visible');
    }

    // Animation trigger
    triggerCustomAnimation(element) {
        // Custom animations based on element attributes
        const animationType = element.dataset.animation;
        
        if (animationType) {
            element.style.animation = `${animationType} 0.6s ease-out`;
        }
    }

    // Debounce function
    debounce(func, delay) {
        let timeout;
        return function(...args) {
            const context = this;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), delay);
        };
    }

    // Add method to disable 3D effects completely
    disable3DEffects() {
        document.body.classList.add('no-3d-effects');
        localStorage.setItem('disable3DEffects', 'true');
        this.showNotification('3D effects disabled', 'info', 2000);
    }
    
    // Add method to enable 3D effects
    enable3DEffects() {
        document.body.classList.remove('no-3d-effects');
        localStorage.setItem('disable3DEffects', 'false');
        this.showNotification('3D effects enabled', 'info', 2000);
    }
    
    // Check user preference on load
    initAccessibilityPreferences() {
        // Check if user previously disabled 3D effects
        if (localStorage.getItem('disable3DEffects') === 'true') {
            document.body.classList.add('no-3d-effects');
        }
        
        // Check if user prefers reduced motion
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.body.classList.add('no-3d-effects');
        }
        
        // Add accessibility toggle button if it doesn't exist
        this.createAccessibilityToggle();
    }
    
    createAccessibilityToggle() {
        // Only add if not already present
        if (document.querySelector('.accessibility-toggle')) return;
        
        const toggle = document.createElement('button');
        toggle.className = 'accessibility-toggle';
        toggle.innerHTML = `
            <i class="fas fa-universal-access" aria-hidden="true"></i>
            <span>Toggle 3D Effects</span>
        `;
        toggle.setAttribute('aria-label', 'Toggle 3D animation effects');
        toggle.style.cssText = `
            position: fixed;
            bottom: 80px;
            right: 20px;
            background: var(--primary-color);
            color: white;
            border: none;
            border-radius: 50px;
            padding: 12px 16px;
            cursor: pointer;
            z-index: 1000;
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 14px;
            box-shadow: 0 4px 15px rgba(108, 92, 231, 0.3);
            transition: all 0.3s ease;
            opacity: 0.8;
        `;
        
        toggle.addEventListener('click', () => {
            if (document.body.classList.contains('no-3d-effects')) {
                this.enable3DEffects();
            } else {
                this.disable3DEffects();
            }
        });
        
        toggle.addEventListener('mouseenter', () => {
            toggle.style.opacity = '1';
            toggle.style.transform = 'scale(1.05)';
        });
        
        toggle.addEventListener('mouseleave', () => {
            toggle.style.opacity = '0.8';
            toggle.style.transform = 'scale(1)';
        });
        
        document.body.appendChild(toggle);
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.enhancedAnimations = new EnhancedAnimations();
    });
} else {
    window.enhancedAnimations = new EnhancedAnimations();
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EnhancedAnimations;
}
