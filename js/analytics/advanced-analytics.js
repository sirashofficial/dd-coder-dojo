/**
 * Code with Ubuntu - Advanced Analytics System
 * Phase 7: Data Management & Analytics Implementation
 * 
 * Enhanced user behavior tracking, form analytics, and performance monitoring
 * with real-time data processing and business intelligence capabilities.
 */

class AdvancedAnalytics {
    constructor() {
        this.config = {
            trackingEnabled: true,
            realTimeUpdates: true,
            sessionStorage: true,
            debugMode: false,
            sampleRate: 1.0, // 100% sampling
            batchSize: 50,
            flushInterval: 30000, // 30 seconds
            maxRetries: 3
        };

        this.sessionData = {
            sessionId: this.generateSessionId(),
            startTime: Date.now(),
            userId: this.generateUserId(),
            userAgent: navigator.userAgent,
            screenResolution: `${screen.width}x${screen.height}`,
            viewport: `${window.innerWidth}x${window.innerHeight}`,
            language: navigator.language,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            referrer: document.referrer,
            landingPage: window.location.href
        };

        this.eventQueue = [];
        this.userJourney = [];
        this.performanceMetrics = {};
        this.formAnalytics = new Map();
        this.engagementMetrics = {
            timeOnPage: {},
            scrollDepth: {},
            clicks: {},
            formInteractions: {},
            searches: {},
            downloads: {}
        };

        this.init();
    }

    init() {
        if (!this.config.trackingEnabled) return;

        try {
            console.log('📊 Initializing Advanced Analytics System...');
            
            this.setupEventListeners();
            this.initializePerformanceTracking();
            this.startEngagementTracking();
            this.setupFormAnalytics();
            this.initializeUserJourney();
            this.setupRealTimeTracking();
            
            // Load previous session data
            this.loadStoredData();
            
            console.log('✅ Advanced Analytics System initialized successfully');
            
        } catch (error) {
            console.error('❌ Failed to initialize Advanced Analytics:', error);
        }
    }

    // === CORE TRACKING METHODS ===

    track(eventType, eventData = {}) {
        if (!this.config.trackingEnabled) return;

        const event = {
            id: this.generateEventId(),
            timestamp: Date.now(),
            sessionId: this.sessionData.sessionId,
            userId: this.sessionData.userId,
            type: eventType,
            page: window.location.pathname,
            url: window.location.href,
            data: eventData,
            userAgent: navigator.userAgent,
            viewport: `${window.innerWidth}x${window.innerHeight}`
        };

        this.eventQueue.push(event);
        this.userJourney.push({
            timestamp: event.timestamp,
            action: eventType,
            page: event.page,
            data: eventData
        });

        if (this.config.debugMode) {
            console.log('📊 Analytics Event:', event);
        }

        // Auto-flush if queue is full
        if (this.eventQueue.length >= this.config.batchSize) {
            this.flushEvents();
        }

        return event.id;
    }

    // === PERFORMANCE TRACKING ===

    initializePerformanceTracking() {
        // Core Web Vitals tracking
        this.trackWebVitals();
        
        // Page load performance
        window.addEventListener('load', () => {
            setTimeout(() => {
                this.trackPageLoadMetrics();
            }, 0);
        });

        // Navigation timing
        this.trackNavigationTiming();
        
        // Resource loading
        this.trackResourceTiming();

        // Error tracking
        this.setupErrorTracking();
    }

    trackWebVitals() {
        // Largest Contentful Paint (LCP)
        this.observePerformanceEntry('largest-contentful-paint', (entry) => {
            this.performanceMetrics.lcp = entry.startTime;
            this.track('web_vital_lcp', {
                value: entry.startTime,
                rating: entry.startTime <= 2500 ? 'good' : entry.startTime <= 4000 ? 'needs-improvement' : 'poor'
            });
        });

        // First Input Delay (FID)
        this.observePerformanceEntry('first-input', (entry) => {
            this.performanceMetrics.fid = entry.processingStart - entry.startTime;
            this.track('web_vital_fid', {
                value: this.performanceMetrics.fid,
                rating: this.performanceMetrics.fid <= 100 ? 'good' : this.performanceMetrics.fid <= 300 ? 'needs-improvement' : 'poor'
            });
        });

        // Cumulative Layout Shift (CLS)
        let clsValue = 0;
        this.observePerformanceEntry('layout-shift', (entry) => {
            if (!entry.hadRecentInput) {
                clsValue += entry.value;
                this.performanceMetrics.cls = clsValue;
                this.track('web_vital_cls', {
                    value: clsValue,
                    rating: clsValue <= 0.1 ? 'good' : clsValue <= 0.25 ? 'needs-improvement' : 'poor'
                });
            }
        });
    }

    trackPageLoadMetrics() {
        const navigation = performance.getEntriesByType('navigation')[0];
        if (navigation) {
            const metrics = {
                dns: navigation.domainLookupEnd - navigation.domainLookupStart,
                connection: navigation.connectEnd - navigation.connectStart,
                request: navigation.responseStart - navigation.requestStart,
                response: navigation.responseEnd - navigation.responseStart,
                domInteractive: navigation.domInteractive - navigation.navigationStart,
                domComplete: navigation.domComplete - navigation.navigationStart,
                loadComplete: navigation.loadEventEnd - navigation.navigationStart
            };

            this.performanceMetrics.pageLoad = metrics;
            this.track('page_load_metrics', metrics);
        }
    }

    // === USER ENGAGEMENT TRACKING ===

    startEngagementTracking() {
        this.trackTimeOnPage();
        this.trackScrollDepth();
        this.trackClickPatterns();
        this.trackVisibilityChanges();
        this.trackDeviceOrientation();
    }

    trackTimeOnPage() {
        const startTime = Date.now();
        const pagePath = window.location.pathname;

        this.engagementMetrics.timeOnPage[pagePath] = startTime;

        // Track time on page when leaving
        window.addEventListener('beforeunload', () => {
            const timeSpent = Date.now() - startTime;
            this.track('time_on_page', {
                page: pagePath,
                timeSpent: timeSpent,
                timeSpentReadable: this.formatDuration(timeSpent)
            });
        });

        // Track periodic time updates
        setInterval(() => {
            const timeSpent = Date.now() - startTime;
            if (timeSpent % 30000 === 0) { // Every 30 seconds
                this.track('time_checkpoint', {
                    page: pagePath,
                    timeSpent: timeSpent
                });
            }
        }, 1000);
    }

    trackScrollDepth() {
        let maxScrollDepth = 0;
        const trackScrollDepth = this.debounce(() => {
            const scrollTop = window.pageYOffset;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = Math.round((scrollTop / docHeight) * 100);

            if (scrollPercent > maxScrollDepth) {
                maxScrollDepth = scrollPercent;
                
                // Track milestone scroll depths
                const milestones = [25, 50, 75, 90, 100];
                const milestone = milestones.find(m => scrollPercent >= m && maxScrollDepth < m);
                
                if (milestone) {
                    this.track('scroll_depth', {
                        depth: milestone,
                        page: window.location.pathname,
                        scrollTop: scrollTop,
                        docHeight: docHeight + window.innerHeight
                    });
                }
            }
        }, 250);

        window.addEventListener('scroll', trackScrollDepth, { passive: true });
    }

    trackClickPatterns() {
        document.addEventListener('click', (event) => {
            const element = event.target;
            const elementData = {
                tag: element.tagName.toLowerCase(),
                id: element.id || null,
                className: element.className || null,
                text: element.textContent?.substring(0, 100) || null,
                href: element.href || null,
                x: event.clientX,
                y: event.clientY,
                timestamp: Date.now()
            };

            this.track('click', elementData);

            // Track specific element types
            if (element.tagName === 'A') {
                this.track('link_click', {
                    ...elementData,
                    external: element.hostname !== window.location.hostname
                });
            }

            if (element.tagName === 'BUTTON') {
                this.track('button_click', elementData);
            }
        });
    }

    // === FORM ANALYTICS ===

    setupFormAnalytics() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach((form, index) => {
            const formId = form.id || `form_${index}`;
            
            this.formAnalytics.set(formId, {
                id: formId,
                startTime: null,
                fields: new Map(),
                interactions: [],
                abandonmentPoint: null,
                completed: false
            });

            this.setupFormFieldTracking(form, formId);
            this.setupFormSubmissionTracking(form, formId);
        });
    }

    setupFormFieldTracking(form, formId) {
        const formData = this.formAnalytics.get(formId);
        const fields = form.querySelectorAll('input, select, textarea');

        fields.forEach(field => {
            const fieldName = field.name || field.id || 'unnamed_field';
            
            formData.fields.set(fieldName, {
                focusTime: 0,
                focusCount: 0,
                changeCount: 0,
                firstFocus: null,
                lastChange: null,
                errors: 0
            });

            // Focus tracking
            field.addEventListener('focus', () => {
                const fieldData = formData.fields.get(fieldName);
                
                if (!formData.startTime) {
                    formData.startTime = Date.now();
                    this.track('form_start', { formId });
                }

                if (!fieldData.firstFocus) {
                    fieldData.firstFocus = Date.now();
                }
                
                fieldData.focusCount++;
                
                this.track('form_field_focus', {
                    formId,
                    fieldName,
                    fieldType: field.type
                });
            });

            // Change tracking
            field.addEventListener('input', () => {
                const fieldData = formData.fields.get(fieldName);
                fieldData.changeCount++;
                fieldData.lastChange = Date.now();
                
                this.track('form_field_change', {
                    formId,
                    fieldName,
                    changeCount: fieldData.changeCount
                });
            });

            // Error tracking
            field.addEventListener('invalid', () => {
                const fieldData = formData.fields.get(fieldName);
                fieldData.errors++;
                
                this.track('form_field_error', {
                    formId,
                    fieldName,
                    errorCount: fieldData.errors,
                    validationMessage: field.validationMessage
                });
            });
        });
    }

    setupFormSubmissionTracking(form, formId) {
        form.addEventListener('submit', (event) => {
            const formData = this.formAnalytics.get(formId);
            const completionTime = Date.now() - formData.startTime;
            
            formData.completed = true;
            
            this.track('form_submit', {
                formId,
                completionTime,
                completionTimeReadable: this.formatDuration(completionTime),
                fieldCount: formData.fields.size,
                totalInteractions: Array.from(formData.fields.values())
                    .reduce((sum, field) => sum + field.focusCount + field.changeCount, 0)
            });
        });
    }

    // === USER JOURNEY TRACKING ===

    initializeUserJourney() {
        // Track page views
        this.track('page_view', {
            page: window.location.pathname,
            title: document.title,
            referrer: document.referrer
        });

        // Track hash changes (SPA navigation)
        window.addEventListener('hashchange', () => {
            this.track('hash_change', {
                oldHash: event.oldURL.split('#')[1] || '',
                newHash: event.newURL.split('#')[1] || '',
                page: window.location.pathname
            });
        });

        // Track back/forward navigation
        window.addEventListener('popstate', () => {
            this.track('navigation', {
                type: 'popstate',
                page: window.location.pathname,
                state: event.state
            });
        });
    }

    // === REAL-TIME TRACKING ===

    setupRealTimeTracking() {
        if (!this.config.realTimeUpdates) return;

        // Periodic data flush
        setInterval(() => {
            this.flushEvents();
        }, this.config.flushInterval);

        // Visibility change handling
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.flushEvents();
                this.track('page_hidden');
            } else {
                this.track('page_visible');
            }
        });

        // Before unload handling
        window.addEventListener('beforeunload', () => {
            this.flushEvents();
        });
    }

    // === DATA PROCESSING METHODS ===

    flushEvents() {
        if (this.eventQueue.length === 0) return;

        const events = [...this.eventQueue];
        this.eventQueue = [];

        // Store events locally
        this.storeEventsLocally(events);

        // Send to analytics endpoint (in real implementation)
        this.sendToAnalyticsEndpoint(events);

        if (this.config.debugMode) {
            console.log('📊 Flushed analytics events:', events.length);
        }
    }

    storeEventsLocally(events) {
        try {
            const stored = JSON.parse(localStorage.getItem('dd_analytics_events') || '[]');
            stored.push(...events);
            
            // Keep only last 1000 events
            if (stored.length > 1000) {
                stored.splice(0, stored.length - 1000);
            }
            
            localStorage.setItem('dd_analytics_events', JSON.stringify(stored));
        } catch (error) {
            console.warn('Failed to store analytics events locally:', error);
        }
    }

    sendToAnalyticsEndpoint(events) {
        // In a real implementation, this would send to your analytics server
        // For now, we'll simulate the process
        
        if (this.config.debugMode) {
            console.log('📊 Analytics Events to Send:', events);
        }

        // Simulate API call
        const analyticsData = {
            sessionId: this.sessionData.sessionId,
            userId: this.sessionData.userId,
            events: events,
            metadata: {
                timestamp: Date.now(),
                userAgent: navigator.userAgent,
                page: window.location.href
            }
        };

        // Store in session for demonstration
        sessionStorage.setItem('dd_analytics_batch', JSON.stringify(analyticsData));
    }

    // === UTILITY METHODS ===

    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    generateUserId() {
        const stored = localStorage.getItem('dd_user_id');
        if (stored) return stored;
        
        const userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('dd_user_id', userId);
        return userId;
    }

    generateEventId() {
        return 'event_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    formatDuration(ms) {
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);

        if (hours > 0) {
            return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
        } else if (minutes > 0) {
            return `${minutes}m ${seconds % 60}s`;
        } else {
            return `${seconds}s`;
        }
    }

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

    observePerformanceEntry(type, callback) {
        if ('PerformanceObserver' in window) {
            try {
                const observer = new PerformanceObserver((list) => {
                    list.getEntries().forEach(callback);
                });
                observer.observe({ type, buffered: true });
            } catch (error) {
                console.warn(`Failed to observe ${type}:`, error);
            }
        }
    }

    setupErrorTracking() {
        window.addEventListener('error', (event) => {
            this.track('javascript_error', {
                message: event.message,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
                stack: event.error?.stack
            });
        });

        window.addEventListener('unhandledrejection', (event) => {
            this.track('promise_rejection', {
                reason: event.reason?.toString(),
                stack: event.reason?.stack
            });
        });
    }

    trackVisibilityChanges() {
        document.addEventListener('visibilitychange', () => {
            this.track('visibility_change', {
                hidden: document.hidden,
                visibilityState: document.visibilityState
            });
        });
    }

    trackDeviceOrientation() {
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.track('orientation_change', {
                    orientation: screen.orientation?.angle || window.orientation,
                    viewport: `${window.innerWidth}x${window.innerHeight}`
                });
            }, 100);
        });
    }

    loadStoredData() {
        try {
            const stored = localStorage.getItem('dd_analytics_session');
            if (stored) {
                const data = JSON.parse(stored);
                // Merge with current session data
                Object.assign(this.sessionData, data);
            }
        } catch (error) {
            console.warn('Failed to load stored analytics data:', error);
        }
    }

    // === PUBLIC API METHODS ===

    getSessionData() {
        return { ...this.sessionData };
    }

    getUserJourney() {
        return [...this.userJourney];
    }

    getPerformanceMetrics() {
        return { ...this.performanceMetrics };
    }

    getEngagementMetrics() {
        return JSON.parse(JSON.stringify(this.engagementMetrics));
    }

    getFormAnalytics() {
        const result = {};
        this.formAnalytics.forEach((value, key) => {
            result[key] = {
                ...value,
                fields: Object.fromEntries(value.fields)
            };
        });
        return result;
    }

    exportAnalyticsData() {
        return {
            session: this.getSessionData(),
            journey: this.getUserJourney(),
            performance: this.getPerformanceMetrics(),
            engagement: this.getEngagementMetrics(),
            forms: this.getFormAnalytics(),
            events: JSON.parse(localStorage.getItem('dd_analytics_events') || '[]'),
            exportTime: Date.now()
        };
    }

    clearAnalyticsData() {
        this.eventQueue = [];
        this.userJourney = [];
        this.performanceMetrics = {};
        this.formAnalytics.clear();
        
        localStorage.removeItem('dd_analytics_events');
        localStorage.removeItem('dd_analytics_session');
        sessionStorage.removeItem('dd_analytics_batch');
        
        console.log('📊 Analytics data cleared');
    }

    enableDebugMode() {
        this.config.debugMode = true;
        console.log('📊 Analytics debug mode enabled');
    }

    disableDebugMode() {
        this.config.debugMode = false;
        console.log('📊 Analytics debug mode disabled');
    }
}

// Initialize Advanced Analytics
const advancedAnalytics = new AdvancedAnalytics();

// Export for global access
window.DDAdvancedAnalytics = advancedAnalytics;

// Custom event for external tracking
window.addEventListener('DDTrackEvent', (event) => {
    advancedAnalytics.track(event.detail.type, event.detail.data);
});

console.log('📊 Code with Ubuntu Advanced Analytics System loaded successfully!');
