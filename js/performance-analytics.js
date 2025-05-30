/**
 * Performance Monitoring & Analytics
 * Code with Ubuntu Website Performance Tracking
 * Last updated: 2025-05-27
 */

class PerformanceMonitor {
    constructor() {
        this.metrics = {
            pageLoad: null,
            firstContentfulPaint: null,
            largestContentfulPaint: null,
            firstInputDelay: null,
            cumulativeLayoutShift: null,
            timeToInteractive: null
        };
        
        this.isMonitoring = false;
        this.observers = [];
        
        this.init();
    }
    
    init() {
        if (typeof window === 'undefined') return;
        
        // Start monitoring immediately
        this.startMonitoring();
        
        // Monitor when page is fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.onDOMContentLoaded());
        } else {
            this.onDOMContentLoaded();
        }
        
        // Monitor when all resources are loaded
        if (document.readyState !== 'complete') {
            window.addEventListener('load', () => this.onPageLoad());
        } else {
            this.onPageLoad();
        }
    }
    
    startMonitoring() {
        if (this.isMonitoring) return;
        this.isMonitoring = true;
        
        this.measureCoreWebVitals();
        this.measureCustomMetrics();
        this.setupUserExperienceTracking();
        this.setupErrorTracking();
    }
    
    measureCoreWebVitals() {
        // Largest Contentful Paint (LCP)
        this.measureLCP();
        
        // First Input Delay (FID)
        this.measureFID();
        
        // Cumulative Layout Shift (CLS)
        this.measureCLS();
        
        // First Contentful Paint (FCP)
        this.measureFCP();
    }
    
    measureLCP() {
        if (!('PerformanceObserver' in window)) return;
        
        try {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                
                this.metrics.largestContentfulPaint = lastEntry.startTime;
                
                // LCP should be under 2.5s for good performance
                const rating = lastEntry.startTime <= 2500 ? 'good' : 
                              lastEntry.startTime <= 4000 ? 'needs-improvement' : 'poor';
                
                this.reportMetric('LCP', lastEntry.startTime, rating);
                
                observer.disconnect();
            });
            
            observer.observe({ entryTypes: ['largest-contentful-paint'] });
            this.observers.push(observer);
        } catch (error) {
            console.warn('LCP measurement failed:', error);
        }
    }
    
    measureFID() {
        if (!('PerformanceObserver' in window)) return;
        
        try {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach((entry) => {
                    this.metrics.firstInputDelay = entry.processingStart - entry.startTime;
                    
                    // FID should be under 100ms for good performance
                    const rating = this.metrics.firstInputDelay <= 100 ? 'good' : 
                                  this.metrics.firstInputDelay <= 300 ? 'needs-improvement' : 'poor';
                    
                    this.reportMetric('FID', this.metrics.firstInputDelay, rating);
                });
                
                observer.disconnect();
            });
            
            observer.observe({ entryTypes: ['first-input'] });
            this.observers.push(observer);
        } catch (error) {
            console.warn('FID measurement failed:', error);
        }
    }
    
    measureCLS() {
        if (!('PerformanceObserver' in window)) return;
        
        try {
            let clsValue = 0;
            
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                
                entries.forEach((entry) => {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                    }
                });
                
                this.metrics.cumulativeLayoutShift = clsValue;
                
                // CLS should be under 0.1 for good performance
                const rating = clsValue <= 0.1 ? 'good' : 
                              clsValue <= 0.25 ? 'needs-improvement' : 'poor';
                
                this.reportMetric('CLS', clsValue, rating);
            });
            
            observer.observe({ entryTypes: ['layout-shift'] });
            this.observers.push(observer);
        } catch (error) {
            console.warn('CLS measurement failed:', error);
        }
    }
    
    measureFCP() {
        if (!('PerformanceObserver' in window)) return;
        
        try {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach((entry) => {
                    if (entry.name === 'first-contentful-paint') {
                        this.metrics.firstContentfulPaint = entry.startTime;
                        
                        // FCP should be under 1.8s for good performance
                        const rating = entry.startTime <= 1800 ? 'good' : 
                                      entry.startTime <= 3000 ? 'needs-improvement' : 'poor';
                        
                        this.reportMetric('FCP', entry.startTime, rating);
                    }
                });
                
                observer.disconnect();
            });
            
            observer.observe({ entryTypes: ['paint'] });
            this.observers.push(observer);
        } catch (error) {
            console.warn('FCP measurement failed:', error);
        }
    }
    
    measureCustomMetrics() {
        // Time to Interactive (TTI)
        this.measureTTI();
        
        // Navigation timing
        this.measureNavigationTiming();
        
        // Resource timing
        this.measureResourceTiming();
        
        // Memory usage (if available)
        this.measureMemoryUsage();
    }
    
    measureTTI() {
        // Simplified TTI calculation
        setTimeout(() => {
            if (window.performance && window.performance.timing) {
                const timing = window.performance.timing;
                const tti = timing.domInteractive - timing.navigationStart;
                
                this.metrics.timeToInteractive = tti;
                this.reportMetric('TTI', tti, tti <= 5000 ? 'good' : 'needs-improvement');
            }
        }, 100);
    }
    
    measureNavigationTiming() {
        if (!window.performance || !window.performance.timing) return;
        
        const timing = window.performance.timing;
        const navigation = {
            dns: timing.domainLookupEnd - timing.domainLookupStart,
            connection: timing.connectEnd - timing.connectStart,
            request: timing.responseStart - timing.requestStart,
            response: timing.responseEnd - timing.responseStart,
            domProcessing: timing.domComplete - timing.domLoading,
            total: timing.loadEventEnd - timing.navigationStart
        };
        
        // Report key navigation metrics
        Object.entries(navigation).forEach(([key, value]) => {
            if (value > 0) {
                this.reportCustomMetric(`navigation_${key}`, value);
            }
        });
    }
    
    measureResourceTiming() {
        if (!window.performance || !window.performance.getEntriesByType) return;
        
        const resources = window.performance.getEntriesByType('resource');
        const resourceMetrics = {
            totalResources: resources.length,
            slowResources: 0,
            largestResource: 0,
            totalTransferSize: 0
        };
        
        resources.forEach(resource => {
            const duration = resource.duration;
            if (duration > 1000) resourceMetrics.slowResources++;
            if (duration > resourceMetrics.largestResource) {
                resourceMetrics.largestResource = duration;
            }
            
            if (resource.transferSize) {
                resourceMetrics.totalTransferSize += resource.transferSize;
            }
        });
        
        // Report resource metrics
        Object.entries(resourceMetrics).forEach(([key, value]) => {
            this.reportCustomMetric(`resource_${key}`, value);
        });
    }
    
    measureMemoryUsage() {
        if (window.performance && window.performance.memory) {
            const memory = window.performance.memory;
            this.reportCustomMetric('memory_used', memory.usedJSHeapSize);
            this.reportCustomMetric('memory_limit', memory.jsHeapSizeLimit);
        }
    }
    
    setupUserExperienceTracking() {
        // Track user interactions
        this.trackUserInteractions();
        
        // Track scroll performance
        this.trackScrollPerformance();
        
        // Track form interactions
        this.trackFormPerformance();
        
        // Track clicks and taps
        this.trackClickPerformance();
    }
    
    trackUserInteractions() {
        let interactionCount = 0;
        const startTime = Date.now();
        
        ['click', 'keydown', 'scroll', 'touchstart'].forEach(eventType => {
            document.addEventListener(eventType, () => {
                interactionCount++;
            }, { passive: true });
        });
        
        // Report interaction rate every 30 seconds
        setInterval(() => {
            const duration = (Date.now() - startTime) / 1000;
            const interactionRate = interactionCount / duration;
            this.reportCustomMetric('interaction_rate', interactionRate);
        }, 30000);
    }
    
    trackScrollPerformance() {
        let scrollStart = null;
        let isScrolling = false;
        
        const scrollHandler = () => {
            if (!isScrolling) {
                scrollStart = performance.now();
                isScrolling = true;
            }
            
            clearTimeout(this.scrollTimeout);
            this.scrollTimeout = setTimeout(() => {
                if (scrollStart) {
                    const scrollDuration = performance.now() - scrollStart;
                    this.reportCustomMetric('scroll_duration', scrollDuration);
                }
                isScrolling = false;
            }, 150);
        };
        
        window.addEventListener('scroll', scrollHandler, { passive: true });
    }
    
    trackFormPerformance() {
        document.addEventListener('submit', (event) => {
            const form = event.target;
            if (form.tagName === 'FORM') {
                const startTime = form.dataset.formStartTime;
                if (startTime) {
                    const completionTime = Date.now() - parseInt(startTime);
                    this.reportCustomMetric('form_completion_time', completionTime);
                }
            }
        });
        
        // Track form start time
        document.addEventListener('focusin', (event) => {
            const form = event.target.closest('form');
            if (form && !form.dataset.formStartTime) {
                form.dataset.formStartTime = Date.now();
            }
        });
    }
    
    trackClickPerformance() {
        document.addEventListener('click', (event) => {
            const clickStart = performance.now();
            
            requestAnimationFrame(() => {
                const clickEnd = performance.now();
                const clickDuration = clickEnd - clickStart;
                
                if (clickDuration > 16) { // More than one frame
                    this.reportCustomMetric('slow_click', clickDuration);
                }
            });
        });
    }
    
    setupErrorTracking() {
        // JavaScript errors
        window.addEventListener('error', (event) => {
            this.reportError('js_error', {
                message: event.message,
                filename: event.filename,
                line: event.lineno,
                column: event.colno
            });
        });
        
        // Unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            this.reportError('promise_rejection', {
                reason: event.reason
            });
        });
        
        // Resource loading errors
        document.addEventListener('error', (event) => {
            if (event.target !== window) {
                this.reportError('resource_error', {
                    tagName: event.target.tagName,
                    source: event.target.src || event.target.href
                });
            }
        }, true);
    }
    
    onDOMContentLoaded() {
        const domContentLoadedTime = performance.now();
        this.reportCustomMetric('dom_content_loaded', domContentLoadedTime);
    }
    
    onPageLoad() {
        if (window.performance && window.performance.timing) {
            const timing = window.performance.timing;
            this.metrics.pageLoad = timing.loadEventEnd - timing.navigationStart;
            
            const rating = this.metrics.pageLoad <= 3000 ? 'good' : 
                          this.metrics.pageLoad <= 5000 ? 'needs-improvement' : 'poor';
            
            this.reportMetric('page_load', this.metrics.pageLoad, rating);
        }
        
        // Generate performance report
        setTimeout(() => this.generatePerformanceReport(), 1000);
    }
    
    reportMetric(name, value, rating = 'unknown') {
        // Console logging for development
        if (window.location.hostname === 'localhost' || window.location.hostname.includes('127.0.0.1')) {
            console.log(`📊 Performance Metric: ${name}`, {
                value: Math.round(value * 100) / 100,
                rating,
                timestamp: new Date().toISOString()
            });
        }
        
        // In production, this would send to analytics service
        this.sendToAnalytics('core_web_vital', {
            metric: name,
            value,
            rating,
            url: window.location.pathname,
            userAgent: navigator.userAgent,
            timestamp: Date.now()
        });
    }
    
    reportCustomMetric(name, value) {
        // Console logging for development
        if (window.location.hostname === 'localhost' || window.location.hostname.includes('127.0.0.1')) {
            console.log(`📈 Custom Metric: ${name}`, {
                value: Math.round(value * 100) / 100,
                timestamp: new Date().toISOString()
            });
        }
        
        this.sendToAnalytics('custom_metric', {
            metric: name,
            value,
            url: window.location.pathname,
            timestamp: Date.now()
        });
    }
    
    reportError(type, details) {
        console.error(`🚨 Error tracked: ${type}`, details);
        
        this.sendToAnalytics('error', {
            type,
            details,
            url: window.location.pathname,
            userAgent: navigator.userAgent,
            timestamp: Date.now()
        });
    }
    
    sendToAnalytics(eventType, data) {
        // In a real implementation, this would send to your analytics service
        // For now, we'll store in localStorage for development purposes
        try {
            const analyticsData = JSON.parse(localStorage.getItem('dd_analytics') || '[]');
            analyticsData.push({ eventType, ...data });
            
            // Keep only last 100 entries
            if (analyticsData.length > 100) {
                analyticsData.splice(0, analyticsData.length - 100);
            }
            
            localStorage.setItem('dd_analytics', JSON.stringify(analyticsData));
        } catch (error) {
            console.warn('Failed to store analytics data:', error);
        }
    }
    
    generatePerformanceReport() {
        const report = {
            coreWebVitals: {
                lcp: this.metrics.largestContentfulPaint,
                fid: this.metrics.firstInputDelay,
                cls: this.metrics.cumulativeLayoutShift,
                fcp: this.metrics.firstContentfulPaint
            },
            customMetrics: {
                pageLoad: this.metrics.pageLoad,
                tti: this.metrics.timeToInteractive
            },
            recommendations: this.generateRecommendations(),
            timestamp: new Date().toISOString(),
            url: window.location.pathname
        };
        
        console.log('📋 Performance Report:', report);
        
        // Store report
        localStorage.setItem('dd_performance_report', JSON.stringify(report));
        
        return report;
    }
    
    generateRecommendations() {
        const recommendations = [];
        
        if (this.metrics.largestContentfulPaint > 2500) {
            recommendations.push('Optimize LCP by reducing server response times and optimizing critical resources');
        }
        
        if (this.metrics.firstInputDelay > 100) {
            recommendations.push('Reduce FID by optimizing JavaScript execution and reducing main thread blocking');
        }
        
        if (this.metrics.cumulativeLayoutShift > 0.1) {
            recommendations.push('Minimize CLS by setting dimensions for images and avoiding dynamic content insertion');
        }
        
        if (this.metrics.pageLoad > 3000) {
            recommendations.push('Reduce page load time by optimizing images, minifying assets, and enabling compression');
        }
        
        return recommendations;
    }
    
    getAnalyticsData() {
        try {
            return JSON.parse(localStorage.getItem('dd_analytics') || '[]');
        } catch (error) {
            return [];
        }
    }
    
    getPerformanceReport() {
        try {
            return JSON.parse(localStorage.getItem('dd_performance_report') || '{}');
        } catch (error) {
            return {};
        }
    }
    
    clearAnalyticsData() {
        localStorage.removeItem('dd_analytics');
        localStorage.removeItem('dd_performance_report');
        console.log('Analytics data cleared');
    }
    
    destroy() {
        this.observers.forEach(observer => observer.disconnect());
        this.observers = [];
        this.isMonitoring = false;
        
        if (this.scrollTimeout) {
            clearTimeout(this.scrollTimeout);
        }
    }
}

// Initialize performance monitoring
let performanceMonitor;

if (typeof window !== 'undefined') {
    performanceMonitor = new PerformanceMonitor();
    
    // Expose to global scope for debugging
    window.DDPerformanceMonitor = performanceMonitor;
    
    // Clean up on page unload
    window.addEventListener('beforeunload', () => {
        if (performanceMonitor) {
            performanceMonitor.destroy();
        }
    });
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PerformanceMonitor;
}
