/**
 * DD Coder Dojo - Critical Performance Optimizations
 * Production-ready performance enhancements for optimal user experience
 */

// ===== CRITICAL PERFORMANCE OPTIMIZATIONS =====

class PerformanceOptimizer {
    constructor() {
        this.observer = null;
        this.performanceEntries = [];
        this.isLowEndDevice = this.detectLowEndDevice();
        this.init();
    }

    init() {
        this.setupCriticalResourcePreloading();
        this.setupIntersectionObserver();
        this.setupLazyLoading();
        this.setupImageOptimization();
        this.setupScrollOptimization();
        this.setupFormOptimization();
        this.monitorCoreWebVitals();
        this.setupErrorBoundary();
    }

    // ===== DEVICE CAPABILITIES DETECTION =====
    detectLowEndDevice() {
        // Check for low-end device indicators
        const memory = navigator.deviceMemory || 4; // Default to 4GB
        const cores = navigator.hardwareConcurrency || 4; // Default to 4 cores
        const connection = navigator.connection || {};
        const effectiveType = connection.effectiveType || '4g';
        
        const isLowEnd = memory <= 2 || cores <= 2 || effectiveType === 'slow-2g' || effectiveType === '2g';
        
        if (isLowEnd) {
            document.documentElement.classList.add('low-end-device');
            console.log('Low-end device detected, optimizing performance...');
        }
        
        return isLowEnd;
    }

    // ===== CRITICAL RESOURCE PRELOADING =====
    setupCriticalResourcePreloading() {
        const criticalResources = [
            { href: 'css/main.css', as: 'style' },
            { href: 'css/pages/home.css', as: 'style' },
            { href: 'js/main.js', as: 'script' }
        ];

        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource.href;
            link.as = resource.as;
            if (resource.as === 'style') {
                link.onload = () => {
                    link.rel = 'stylesheet';
                    link.onload = null;
                };
            }
            document.head.appendChild(link);
        });
    }

    // ===== INTERSECTION OBSERVER FOR LAZY LOADING =====
    setupIntersectionObserver() {
        if (!('IntersectionObserver' in window)) {
            // Fallback for older browsers
            this.fallbackLazyLoading();
            return;
        }

        const observerOptions = {
            root: null,
            rootMargin: '50px 0px',
            threshold: 0.1
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadElement(entry.target);
                    this.observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe all lazy-loadable elements
        document.querySelectorAll('[data-lazy], .lazy-load, [loading="lazy"]').forEach(el => {
            this.observer.observe(el);
        });
    }

    // ===== ENHANCED LAZY LOADING =====
    setupLazyLoading() {
        // Lazy load images
        this.setupImageLazyLoading();
        
        // Lazy load sections
        this.setupSectionLazyLoading();
        
        // Lazy load scripts
        this.setupScriptLazyLoading();
    }

    setupImageLazyLoading() {
        const images = document.querySelectorAll('img[data-src], img[loading="lazy"]');
        
        images.forEach(img => {
            if (img.dataset.src) {
                img.addEventListener('load', () => {
                    img.classList.add('loaded');
                    img.style.filter = 'none';
                });
                img.addEventListener('error', () => {
                    img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNmMGYwZjAiLz48dGV4dCB4PSIxNTAiIHk9IjEwMCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+SW1hZ2UgTm90IEZvdW5kPC90ZXh0Pjwvc3ZnPg==';
                });
            }
        });
    }

    setupSectionLazyLoading() {
        const sections = document.querySelectorAll('.lazy-section, [data-lazy-section]');
        
        sections.forEach(section => {
            if (this.observer) {
                this.observer.observe(section);
            }
        });
    }

    setupScriptLazyLoading() {
        const lazyScripts = document.querySelectorAll('script[data-lazy]');
        
        lazyScripts.forEach(script => {
            const newScript = document.createElement('script');
            newScript.src = script.dataset.src || script.src;
            newScript.async = true;
            newScript.defer = true;
            
            if (this.observer) {
                this.observer.observe(script);
            } else {
                document.head.appendChild(newScript);
            }
        });
    }

    // ===== IMAGE OPTIMIZATION =====
    setupImageOptimization() {
        // Set up responsive images
        this.setupResponsiveImages();
        
        // Set up image format detection
        this.setupImageFormatDetection();
        
        // Set up progressive image loading
        this.setupProgressiveImageLoading();
    }

    setupResponsiveImages() {
        const images = document.querySelectorAll('img:not([srcset])');
        
        images.forEach(img => {
            if (img.dataset.srcset) {
                img.srcset = img.dataset.srcset;
                img.sizes = img.dataset.sizes || '(max-width: 768px) 100vw, 50vw';
            }
        });
    }

    setupImageFormatDetection() {
        // Check WebP support
        const webpSupported = document.createElement('canvas').toDataURL('image/webp').indexOf('webp') > -1;
        
        if (webpSupported) {
            document.documentElement.classList.add('webp-supported');
        } else {
            document.documentElement.classList.add('webp-not-supported');
        }
    }

    setupProgressiveImageLoading() {
        const images = document.querySelectorAll('img[data-placeholder]');
        
        images.forEach(img => {
            // Show placeholder first
            if (img.dataset.placeholder) {
                img.src = img.dataset.placeholder;
                img.style.filter = 'blur(5px)';
                img.style.transition = 'filter 0.3s ease';
            }
        });
    }

    // ===== SCROLL OPTIMIZATION =====
    setupScrollOptimization() {
        let scrollTimeout;
        let lastScrollTop = 0;
        
        const optimizedScrollHandler = () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Throttle scroll events
            if (scrollTimeout) {
                cancelAnimationFrame(scrollTimeout);
            }
            
            scrollTimeout = requestAnimationFrame(() => {
                // Only process if scroll has changed significantly
                if (Math.abs(scrollTop - lastScrollTop) > 5) {
                    this.handleScroll(scrollTop);
                    lastScrollTop = scrollTop;
                }
            });
        };

        // Use passive listeners for better performance
        window.addEventListener('scroll', optimizedScrollHandler, { passive: true });
        
        // Debounced resize handler
        let resizeTimeout;
        window.addEventListener('resize', () => {
            if (resizeTimeout) clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.handleResize();
            }, 150);
        }, { passive: true });
    }

    handleScroll(scrollTop) {
        // Handle scroll-based optimizations
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            navbar.style.transform = scrollTop > 100 ? 'translateY(0)' : 'translateY(-100%)';
        }
        
        // Trigger lazy loading for elements coming into view
        this.checkVisibleElements(scrollTop);
    }

    handleResize() {
        // Recalculate layout-dependent optimizations
        this.updateViewportClasses();
        this.recalculateImageSizes();
    }

    // ===== FORM OPTIMIZATION =====
    setupFormOptimization() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            // Optimize input handling
            const inputs = form.querySelectorAll('input, textarea, select');
            
            inputs.forEach(input => {
                // Debounce input events
                let inputTimeout;
                input.addEventListener('input', (e) => {
                    if (inputTimeout) clearTimeout(inputTimeout);
                    inputTimeout = setTimeout(() => {
                        this.handleInputChange(e.target);
                    }, 300);
                }, { passive: true });
                
                // Optimize focus/blur handling
                input.addEventListener('focus', () => {
                    input.closest('.form-group, .input-group')?.classList.add('focused');
                }, { passive: true });
                
                input.addEventListener('blur', () => {
                    input.closest('.form-group, .input-group')?.classList.remove('focused');
                }, { passive: true });
            });
        });
    }

    handleInputChange(input) {
        // Validate input asynchronously
        if (input.dataset.validate) {
            this.validateFieldAsync(input);
        }
    }

    validateFieldAsync(field) {
        // Async validation to prevent blocking
        requestIdleCallback(() => {
            // Perform validation logic here
            const isValid = this.validateField(field);
            field.classList.toggle('valid', isValid);
            field.classList.toggle('invalid', !isValid);
        });
    }

    validateField(field) {
        // Basic validation logic
        if (field.required && !field.value.trim()) {
            return false;
        }
        
        if (field.type === 'email') {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value);
        }
        
        return true;
    }

    // ===== CORE WEB VITALS MONITORING =====
    monitorCoreWebVitals() {
        // Monitor Largest Contentful Paint (LCP)
        this.monitorLCP();
        
        // Monitor First Input Delay (FID)
        this.monitorFID();
        
        // Monitor Cumulative Layout Shift (CLS)
        this.monitorCLS();
        
        // Monitor First Contentful Paint (FCP)
        this.monitorFCP();
    }

    monitorLCP() {
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                
                console.log('LCP:', lastEntry.startTime);
                
                // Report to analytics if needed
                this.reportMetric('LCP', lastEntry.startTime);
            });
            
            observer.observe({ entryTypes: ['largest-contentful-paint'] });
        }
    }

    monitorFID() {
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    console.log('FID:', entry.processingStart - entry.startTime);
                    this.reportMetric('FID', entry.processingStart - entry.startTime);
                });
            });
            
            observer.observe({ entryTypes: ['first-input'] });
        }
    }

    monitorCLS() {
        if ('PerformanceObserver' in window) {
            let clsValue = 0;
            let clsEntries = [];
            
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                        clsEntries.push(entry);
                        
                        console.log('CLS:', clsValue);
                        this.reportMetric('CLS', clsValue);
                    }
                });
            });
            
            observer.observe({ entryTypes: ['layout-shift'] });
        }
    }

    monitorFCP() {
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    if (entry.name === 'first-contentful-paint') {
                        console.log('FCP:', entry.startTime);
                        this.reportMetric('FCP', entry.startTime);
                    }
                });
            });
            
            observer.observe({ entryTypes: ['paint'] });
        }
    }

    reportMetric(metric, value) {
        // Report to analytics service
        if (window.gtag) {
            gtag('event', metric, {
                event_category: 'Performance',
                value: Math.round(value),
                non_interaction: true
            });
        }
        
        // Store for internal tracking
        this.performanceEntries.push({
            metric,
            value,
            timestamp: Date.now()
        });
    }

    // ===== ERROR BOUNDARY =====
    setupErrorBoundary() {
        window.addEventListener('error', (event) => {
            console.error('Global error:', event.error);
            this.handleError(event.error);
        });

        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled promise rejection:', event.reason);
            this.handleError(event.reason);
        });
    }

    handleError(error) {
        // Log error for debugging
        console.error('Performance Optimizer Error:', error);
        
        // Report to error tracking service
        if (window.Sentry) {
            Sentry.captureException(error);
        }
        
        // Graceful degradation
        this.enableFallbackMode();
    }

    enableFallbackMode() {
        // Disable heavy animations and effects
        document.documentElement.classList.add('fallback-mode');
        
        // Remove complex features
        const complexElements = document.querySelectorAll('.complex-animation, .heavy-effect');
        complexElements.forEach(el => {
            el.style.display = 'none';
        });
    }

    // ===== UTILITY METHODS =====
    loadElement(element) {
        if (element.dataset.src) {
            element.src = element.dataset.src;
            element.removeAttribute('data-src');
        }
        
        if (element.dataset.bg) {
            element.style.backgroundImage = `url(${element.dataset.bg})`;
            element.removeAttribute('data-bg');
        }
        
        element.classList.add('loaded');
    }

    fallbackLazyLoading() {
        // Simple fallback for browsers without IntersectionObserver
        const lazyElements = document.querySelectorAll('[data-lazy]');
        lazyElements.forEach(el => this.loadElement(el));
    }

    checkVisibleElements(scrollTop) {
        const viewportHeight = window.innerHeight;
        const lazyElements = document.querySelectorAll('.lazy-load:not(.loaded)');
        
        lazyElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < viewportHeight && rect.bottom > 0) {
                this.loadElement(el);
            }
        });
    }

    updateViewportClasses() {
        const width = window.innerWidth;
        const html = document.documentElement;
        
        html.classList.remove('mobile', 'tablet', 'desktop');
        
        if (width < 768) {
            html.classList.add('mobile');
        } else if (width < 1024) {
            html.classList.add('tablet');
        } else {
            html.classList.add('desktop');
        }
    }

    recalculateImageSizes() {
        const images = document.querySelectorAll('img[data-responsive]');
        images.forEach(img => {
            const container = img.parentElement;
            const containerWidth = container.offsetWidth;
            
            // Update image sizes based on container
            if (containerWidth < 400) {
                img.sizes = '100vw';
            } else if (containerWidth < 800) {
                img.sizes = '50vw';
            } else {
                img.sizes = '33vw';
            }
        });
    }

    // ===== PUBLIC API =====
    getPerformanceReport() {
        return {
            isLowEndDevice: this.isLowEndDevice,
            performanceEntries: this.performanceEntries,
            memoryInfo: performance.memory ? {
                usedJSMemory: performance.memory.usedJSMemory,
                totalJSMemory: performance.memory.totalJSMemory,
                jsMemoryLimit: performance.memory.jsMemoryLimit
            } : null
        };
    }

    optimizeForDevice(deviceType) {
        const html = document.documentElement;
        
        switch (deviceType) {
            case 'mobile':
                html.classList.add('mobile-optimized');
                this.enableMobileOptimizations();
                break;
            case 'tablet':
                html.classList.add('tablet-optimized');
                this.enableTabletOptimizations();
                break;
            case 'desktop':
                html.classList.add('desktop-optimized');
                this.enableDesktopOptimizations();
                break;
        }
    }

    enableMobileOptimizations() {
        // Reduce animation complexity
        document.querySelectorAll('.complex-animation').forEach(el => {
            el.style.animation = 'none';
        });
        
        // Optimize touch interactions
        document.addEventListener('touchstart', () => {}, { passive: true });
    }

    enableTabletOptimizations() {
        // Medium complexity optimizations
        this.updateViewportClasses();
    }

    enableDesktopOptimizations() {
        // Enable full feature set
        document.documentElement.classList.add('full-features');
    }
}

// ===== INITIALIZATION =====

// Initialize performance optimizer when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.performanceOptimizer = new PerformanceOptimizer();
    });
} else {
    window.performanceOptimizer = new PerformanceOptimizer();
}

// ===== GLOBAL PERFORMANCE UTILITIES =====

// Debounce utility for performance
window.debounce = function(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func.apply(this, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(this, args);
    };
};

// Throttle utility for performance
window.throttle = function(func, limit) {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

// RequestIdleCallback polyfill
window.requestIdleCallback = window.requestIdleCallback || function(cb) {
    const start = Date.now();
    return setTimeout(() => {
        cb({
            didTimeout: false,
            timeRemaining() {
                return Math.max(0, 50 - (Date.now() - start));
            }
        });
    }, 1);
};

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PerformanceOptimizer;
}