/**
 * DD Coder Dojo - Production Performance Monitor
 * Monitors Core Web Vitals and provides performance optimization
 * Last updated: May 27, 2025
 */

class PerformanceMonitor {
    constructor() {
        this.metrics = {
            LCP: null,
            FID: null,
            CLS: null,
            TTFB: null,
            FCP: null
        };
        
        this.observers = [];
        this.isProduction = window.location.hostname !== 'localhost';
        this.init();
    }

    init() {
        if (!this.isSupported()) {
            console.warn('Performance monitoring not supported in this browser');
            return;
        }

        this.setupCoreWebVitals();
        this.setupNavigationTiming();
        this.setupResourceTiming();
        this.setupMemoryMonitoring();
        this.setupErrorTracking();
        
        // Report metrics when page visibility changes or unloads
        this.setupReporting();
    }

    isSupported() {
        return 'performance' in window && 
               'PerformanceObserver' in window &&
               'IntersectionObserver' in window;
    }

    setupCoreWebVitals() {
        // Largest Contentful Paint (LCP)
        this.observePerformanceEntry('largest-contentful-paint', (entries) => {
            const lastEntry = entries[entries.length - 1];
            this.metrics.LCP = Math.round(lastEntry.startTime);
            this.logMetric('LCP', this.metrics.LCP, 'ms');
            this.evaluateLCP(this.metrics.LCP);
        });

        // First Input Delay (FID)
        this.observePerformanceEntry('first-input', (entries) => {
            const firstEntry = entries[0];
            this.metrics.FID = Math.round(firstEntry.processingStart - firstEntry.startTime);
            this.logMetric('FID', this.metrics.FID, 'ms');
            this.evaluateFID(this.metrics.FID);
        });

        // Cumulative Layout Shift (CLS)
        let clsValue = 0;
        this.observePerformanceEntry('layout-shift', (entries) => {
            for (const entry of entries) {
                if (!entry.hadRecentInput) {
                    clsValue += entry.value;
                }
            }
            this.metrics.CLS = Math.round(clsValue * 10000) / 10000;
            this.logMetric('CLS', this.metrics.CLS, '');
            this.evaluateCLS(this.metrics.CLS);
        });

        // First Contentful Paint (FCP)
        this.observePerformanceEntry('paint', (entries) => {
            const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint');
            if (fcpEntry) {
                this.metrics.FCP = Math.round(fcpEntry.startTime);
                this.logMetric('FCP', this.metrics.FCP, 'ms');
                this.evaluateFCP(this.metrics.FCP);
            }
        });
    }

    setupNavigationTiming() {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const navTiming = performance.getEntriesByType('navigation')[0];
                if (navTiming) {
                    this.metrics.TTFB = Math.round(navTiming.responseStart - navTiming.requestStart);
                    this.logMetric('TTFB', this.metrics.TTFB, 'ms');
                    this.evaluateTTFB(this.metrics.TTFB);

                    // Additional timing metrics
                    const loadTime = Math.round(navTiming.loadEventEnd - navTiming.loadEventStart);
                    const domContentLoaded = Math.round(navTiming.domContentLoadedEventEnd - navTiming.domContentLoadedEventStart);
                    
                    this.logMetric('Page Load Time', loadTime, 'ms');
                    this.logMetric('DOM Content Loaded', domContentLoaded, 'ms');
                }
            }, 0);
        });
    }

    setupResourceTiming() {
        // Monitor slow resources
        const resourceObserver = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (entry.duration > 1000) { // Resources taking longer than 1s
                    console.warn(`Slow resource detected: ${entry.name} (${Math.round(entry.duration)}ms)`);
                }
            }
        });
        
        resourceObserver.observe({ entryTypes: ['resource'] });
        this.observers.push(resourceObserver);
    }

    setupMemoryMonitoring() {
        if ('memory' in performance) {
            setInterval(() => {
                const memory = performance.memory;
                const used = Math.round(memory.usedJSHeapSize / 1048576); // MB
                const total = Math.round(memory.totalJSHeapSize / 1048576); // MB
                
                if (used / total > 0.9) {
                    console.warn(`High memory usage: ${used}/${total} MB`);
                }
            }, 30000); // Check every 30 seconds
        }
    }

    setupErrorTracking() {
        window.addEventListener('error', (event) => {
            this.logError('JavaScript Error', {
                message: event.message,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno
            });
        });

        window.addEventListener('unhandledrejection', (event) => {
            this.logError('Unhandled Promise Rejection', {
                reason: event.reason
            });
        });
    }

    setupReporting() {
        // Report metrics when user leaves the page
        const reportMetrics = () => {
            if (this.isProduction) {
                this.sendMetricsToAnalytics();
            }
            this.displayMetricsSummary();
        };

        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden') {
                reportMetrics();
            }
        });

        window.addEventListener('beforeunload', reportMetrics);
    }

    observePerformanceEntry(type, callback) {
        try {
            const observer = new PerformanceObserver((list) => {
                callback(list.getEntries());
            });
            observer.observe({ entryTypes: [type] });
            this.observers.push(observer);
        } catch (error) {
            console.warn(`Failed to observe ${type}:`, error);
        }
    }

    // Core Web Vitals evaluation functions
    evaluateLCP(value) {
        const rating = value <= 2500 ? 'good' : value <= 4000 ? 'needs-improvement' : 'poor';
        this.setMetricRating('LCP', rating);
    }

    evaluateFID(value) {
        const rating = value <= 100 ? 'good' : value <= 300 ? 'needs-improvement' : 'poor';
        this.setMetricRating('FID', rating);
    }

    evaluateCLS(value) {
        const rating = value <= 0.1 ? 'good' : value <= 0.25 ? 'needs-improvement' : 'poor';
        this.setMetricRating('CLS', rating);
    }

    evaluateFCP(value) {
        const rating = value <= 1800 ? 'good' : value <= 3000 ? 'needs-improvement' : 'poor';
        this.setMetricRating('FCP', rating);
    }

    evaluateTTFB(value) {
        const rating = value <= 800 ? 'good' : value <= 1800 ? 'needs-improvement' : 'poor';
        this.setMetricRating('TTFB', rating);
    }

    setMetricRating(metric, rating) {
        const colors = {
            good: '#10b981',
            'needs-improvement': '#f59e0b',
            poor: '#ef4444'
        };

        console.log(`%c${metric}: ${rating.toUpperCase()}`, 
            `color: ${colors[rating]}; font-weight: bold;`);
    }

    logMetric(name, value, unit) {
        console.log(`📊 ${name}: ${value}${unit}`);
    }

    logError(type, details) {
        console.error(`🚨 ${type}:`, details);
        
        if (this.isProduction) {
            // Send error to monitoring service
            this.sendErrorToAnalytics(type, details);
        }
    }

    displayMetricsSummary() {
        console.group('🎯 Performance Summary');
        console.log('Core Web Vitals:');
        console.log(`  LCP: ${this.metrics.LCP}ms`);
        console.log(`  FID: ${this.metrics.FID}ms`);
        console.log(`  CLS: ${this.metrics.CLS}`);
        console.log('Other Metrics:');
        console.log(`  FCP: ${this.metrics.FCP}ms`);
        console.log(`  TTFB: ${this.metrics.TTFB}ms`);
        console.groupEnd();
    }

    sendMetricsToAnalytics() {
        // Placeholder for analytics integration
        const data = {
            url: window.location.href,
            userAgent: navigator.userAgent,
            timestamp: Date.now(),
            metrics: this.metrics
        };

        // Example: Google Analytics 4 or custom analytics endpoint
        // gtag('event', 'web_vitals', data);
        console.log('📈 Metrics ready for analytics:', data);
    }

    sendErrorToAnalytics(type, details) {
        // Placeholder for error reporting
        const errorData = {
            type,
            details,
            url: window.location.href,
            userAgent: navigator.userAgent,
            timestamp: Date.now()
        };

        console.log('🚨 Error ready for analytics:', errorData);
    }

    // Optimization suggestions
    provideSuggestions() {
        const suggestions = [];

        if (this.metrics.LCP > 2500) {
            suggestions.push('🔧 LCP: Consider optimizing images, removing unused CSS, or using a CDN');
        }

        if (this.metrics.FID > 100) {
            suggestions.push('🔧 FID: Reduce JavaScript execution time or use web workers');
        }

        if (this.metrics.CLS > 0.1) {
            suggestions.push('🔧 CLS: Set size attributes on images and avoid dynamic content insertion');
        }

        if (this.metrics.TTFB > 800) {
            suggestions.push('🔧 TTFB: Optimize server response time or use a CDN');
        }

        if (suggestions.length > 0) {
            console.group('💡 Performance Suggestions');
            suggestions.forEach(suggestion => console.log(suggestion));
            console.groupEnd();
        }
    }

    cleanup() {
        this.observers.forEach(observer => observer.disconnect());
        this.observers = [];
    }
}

// Auto-initialize performance monitoring
document.addEventListener('DOMContentLoaded', () => {
    window.perfMonitor = new PerformanceMonitor();
    
    // Provide suggestions after page load
    window.addEventListener('load', () => {
        setTimeout(() => {
            window.perfMonitor.provideSuggestions();
        }, 5000);
    });
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PerformanceMonitor;
}