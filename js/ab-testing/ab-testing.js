/**
 * Code with Ubuntu - A/B Testing Framework
 * Phase 7: Data Management & Analytics Implementation
 * 
 * Advanced A/B testing system for feature experimentation, content optimization,
 * and data-driven decision making with statistical significance analysis.
 */

class ABTestingFramework {
    constructor() {
        this.config = {
            enabled: true,
            defaultSampleSize: 0.5, // 50% of users
            confidenceLevel: 0.95,
            minimumSampleSize: 30,
            testDuration: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
            autoAnalysis: true,
            statisticalSignificance: true
        };

        this.activeTests = new Map();
        this.completedTests = new Map();
        this.userAssignments = new Map();
        this.testResults = new Map();
        
        this.testTemplates = {
            content: {
                name: 'Content Test',
                metrics: ['engagement', 'time_on_page', 'conversion'],
                variants: ['control', 'variant_a']
            },
            ui: {
                name: 'UI/UX Test',
                metrics: ['click_rate', 'bounce_rate', 'completion_rate'],
                variants: ['control', 'variant_a']
            },
            copy: {
                name: 'Copy Test',
                metrics: ['click_through_rate', 'conversion_rate'],
                variants: ['control', 'variant_a']
            },
            feature: {
                name: 'Feature Test',
                metrics: ['adoption_rate', 'engagement', 'satisfaction'],
                variants: ['control', 'variant_a']
            }
        };

        this.predefinedTests = {
            'header_cta_test': {
                name: 'Header Call-to-Action Test',
                type: 'copy',
                hypothesis: 'Changing the CTA button text will increase click-through rate',
                target: '.cta-button',
                variants: {
                    control: { text: 'Get Started', color: '#007bff' },
                    variant_a: { text: 'Join Now', color: '#28a745' }
                },
                metrics: ['click_rate', 'conversion_rate'],
                duration: 7 * 24 * 60 * 60 * 1000
            },
            'hero_section_test': {
                name: 'Hero Section Layout Test',
                type: 'ui',
                hypothesis: 'A video background will increase engagement',
                target: '.hero-section',
                variants: {
                    control: { background: 'image', layout: 'centered' },
                    variant_a: { background: 'video', layout: 'left-aligned' }
                },
                metrics: ['time_on_page', 'scroll_depth', 'bounce_rate'],
                duration: 14 * 24 * 60 * 60 * 1000
            },
            'registration_form_test': {
                name: 'Registration Form Optimization',
                type: 'feature',
                hypothesis: 'Reducing form fields will increase completion rate',
                target: '#registration-form',
                variants: {
                    control: { fields: 'all', steps: 1 },
                    variant_a: { fields: 'minimal', steps: 2 }
                },
                metrics: ['completion_rate', 'abandonment_rate', 'conversion_rate'],
                duration: 10 * 24 * 60 * 60 * 1000
            }
        };

        this.init();
    }

    init() {
        if (!this.config.enabled) return;

        console.log('🧪 Initializing A/B Testing Framework...');
        
        this.loadStoredData();
        this.setupUserSegmentation();
        this.initializeActiveTests();
        this.setupEventTracking();
        this.startAnalysisEngine();
        
        console.log('✅ A/B Testing Framework initialized successfully');
    }

    loadStoredData() {
        // Load active tests
        const storedTests = localStorage.getItem('dd_ab_tests');
        if (storedTests) {
            const tests = JSON.parse(storedTests);
            Object.entries(tests).forEach(([id, test]) => {
                this.activeTests.set(id, test);
            });
        }

        // Load user assignments
        const storedAssignments = localStorage.getItem('dd_ab_assignments');
        if (storedAssignments) {
            const assignments = JSON.parse(storedAssignments);
            Object.entries(assignments).forEach(([userId, assignment]) => {
                this.userAssignments.set(userId, assignment);
            });
        }

        // Load test results
        const storedResults = localStorage.getItem('dd_ab_results');
        if (storedResults) {
            const results = JSON.parse(storedResults);
            Object.entries(results).forEach(([testId, result]) => {
                this.testResults.set(testId, result);
            });
        }
    }

    setupUserSegmentation() {
        // Get or create user ID
        this.userId = this.getUserId();
        
        // Assign user to tests if not already assigned
        if (!this.userAssignments.has(this.userId)) {
            this.assignUserToTests();
        }
    }

    getUserId() {
        let userId = localStorage.getItem('dd_ab_user_id');
        if (!userId) {
            userId = 'user_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
            localStorage.setItem('dd_ab_user_id', userId);
        }
        return userId;
    }

    assignUserToTests() {
        const assignments = {};
        
        this.activeTests.forEach((test, testId) => {
            const assignment = this.assignUserToTest(testId, test);
            assignments[testId] = assignment;
        });

        this.userAssignments.set(this.userId, assignments);
        this.saveUserAssignments();
    }

    assignUserToTest(testId, test) {
        // Use consistent hashing for deterministic assignment
        const hash = this.hashUserId(this.userId + testId);
        const variants = Object.keys(test.variants);
        const variantIndex = hash % variants.length;
        const assignedVariant = variants[variantIndex];

        // Check if user should be included in test
        const inclusion = hash / 0xffffffff;
        const shouldInclude = inclusion < (test.sampleSize || this.config.defaultSampleSize);

        return {
            variant: shouldInclude ? assignedVariant : null,
            included: shouldInclude,
            assignedAt: Date.now()
        };
    }

    hashUserId(input) {
        let hash = 0;
        for (let i = 0; i < input.length; i++) {
            const char = input.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash);
    }

    initializeActiveTests() {
        // Start predefined tests if not already active
        Object.entries(this.predefinedTests).forEach(([testId, testConfig]) => {
            if (!this.activeTests.has(testId)) {
                this.startTest(testId, testConfig);
            }
        });

        // Apply test variants to current user
        this.applyTestVariants();
    }

    startTest(testId, config) {
        const test = {
            ...config,
            id: testId,
            status: 'active',
            startDate: Date.now(),
            endDate: Date.now() + config.duration,
            participants: {
                control: { count: 0, conversions: 0 },
                variant_a: { count: 0, conversions: 0 }
            },
            metrics: {},
            sampleSize: config.sampleSize || this.config.defaultSampleSize
        };

        this.activeTests.set(testId, test);
        this.saveActiveTests();

        console.log(`🧪 Started A/B test: ${testId} - ${config.name}`);
        return test;
    }

    applyTestVariants() {
        const userAssignments = this.userAssignments.get(this.userId);
        if (!userAssignments) return;

        Object.entries(userAssignments).forEach(([testId, assignment]) => {
            if (assignment.included && assignment.variant) {
                this.applyVariant(testId, assignment.variant);
                this.trackParticipation(testId, assignment.variant);
            }
        });
    }

    applyVariant(testId, variant) {
        const test = this.activeTests.get(testId);
        if (!test || test.status !== 'active') return;

        const variantConfig = test.variants[variant];
        const target = document.querySelector(test.target);

        if (!target || !variantConfig) return;

        console.log(`🧪 Applying variant ${variant} for test ${testId}`);

        // Apply variant changes based on test type
        switch (test.type) {
            case 'copy':
                this.applyCopyVariant(target, variantConfig);
                break;
            case 'ui':
                this.applyUIVariant(target, variantConfig);
                break;
            case 'feature':
                this.applyFeatureVariant(target, variantConfig);
                break;
            case 'content':
                this.applyContentVariant(target, variantConfig);
                break;
        }

        // Add test attribution
        target.setAttribute('data-ab-test', testId);
        target.setAttribute('data-ab-variant', variant);
    }

    applyCopyVariant(target, config) {
        if (config.text) {
            target.textContent = config.text;
        }
        if (config.color) {
            target.style.backgroundColor = config.color;
        }
        if (config.style) {
            Object.assign(target.style, config.style);
        }
    }

    applyUIVariant(target, config) {
        if (config.background === 'video') {
            target.innerHTML = `
                <video autoplay muted loop style="position: absolute; width: 100%; height: 100%; object-fit: cover; z-index: -1;">
                    <source src="images/hero-video.mp4" type="video/mp4">
                </video>
                ${target.innerHTML}
            `;
        }
        if (config.layout === 'left-aligned') {
            target.style.textAlign = 'left';
            target.style.paddingLeft = '50px';
        }
    }

    applyFeatureVariant(target, config) {
        if (config.fields === 'minimal') {
            const form = target.querySelector('form') || target;
            const fields = form.querySelectorAll('.form-group');
            fields.forEach((field, index) => {
                if (index > 2) { // Show only first 3 fields
                    field.style.display = 'none';
                }
            });
        }
        if (config.steps === 2) {
            this.convertToMultiStep(target);
        }
    }

    applyContentVariant(target, config) {
        if (config.headline) {
            const headline = target.querySelector('h1, h2, .headline');
            if (headline) headline.textContent = config.headline;
        }
        if (config.description) {
            const description = target.querySelector('p, .description');
            if (description) description.textContent = config.description;
        }
    }

    convertToMultiStep(form) {
        // Implementation for multi-step form conversion
        const fields = Array.from(form.querySelectorAll('.form-group'));
        const midpoint = Math.ceil(fields.length / 2);
        
        const step1 = document.createElement('div');
        step1.className = 'form-step active';
        const step2 = document.createElement('div');
        step2.className = 'form-step';
        
        fields.forEach((field, index) => {
            if (index < midpoint) {
                step1.appendChild(field);
            } else {
                step2.appendChild(field);
            }
        });

        form.innerHTML = '';
        form.appendChild(step1);
        form.appendChild(step2);

        // Add navigation buttons
        const nextBtn = document.createElement('button');
        nextBtn.textContent = 'Next';
        nextBtn.type = 'button';
        nextBtn.className = 'btn btn-primary';
        nextBtn.addEventListener('click', () => {
            step1.classList.remove('active');
            step2.classList.add('active');
            nextBtn.style.display = 'none';
        });

        step1.appendChild(nextBtn);
    }

    setupEventTracking() {
        // Track clicks for click-rate metrics
        document.addEventListener('click', (event) => {
            this.trackEvent('click', event.target);
        });

        // Track form submissions for conversion metrics
        document.addEventListener('submit', (event) => {
            this.trackEvent('conversion', event.target);
        });

        // Track scroll depth
        let maxScrollDepth = 0;
        const trackScroll = () => {
            const scrollDepth = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
            if (scrollDepth > maxScrollDepth) {
                maxScrollDepth = scrollDepth;
                if (scrollDepth >= 25 && scrollDepth < 50) {
                    this.trackEvent('scroll_25');
                } else if (scrollDepth >= 50 && scrollDepth < 75) {
                    this.trackEvent('scroll_50');
                } else if (scrollDepth >= 75) {
                    this.trackEvent('scroll_75');
                }
            }
        };

        window.addEventListener('scroll', this.debounce(trackScroll, 500));

        // Track time on page
        this.pageStartTime = Date.now();
        window.addEventListener('beforeunload', () => {
            const timeOnPage = Date.now() - this.pageStartTime;
            this.trackEvent('time_on_page', null, { duration: timeOnPage });
        });
    }

    trackEvent(eventType, target, data = {}) {
        const userAssignments = this.userAssignments.get(this.userId);
        if (!userAssignments) return;

        Object.entries(userAssignments).forEach(([testId, assignment]) => {
            if (!assignment.included || !assignment.variant) return;

            const test = this.activeTests.get(testId);
            if (!test || test.status !== 'active') return;

            // Check if event is relevant to this test
            if (this.isEventRelevant(eventType, target, test)) {
                this.recordMetric(testId, assignment.variant, eventType, data);
            }
        });
    }

    isEventRelevant(eventType, target, test) {
        // Check if the event is one of the test metrics
        if (!test.metrics.includes(eventType) && !this.isMetricRelated(eventType, test.metrics)) {
            return false;
        }

        // Check if the target element is related to the test
        if (target && test.target) {
            const testElement = document.querySelector(test.target);
            return testElement && (testElement.contains(target) || testElement === target);
        }

        return true;
    }

    isMetricRelated(eventType, metrics) {
        const metricMap = {
            'click': ['click_rate', 'click_through_rate'],
            'conversion': ['conversion_rate', 'completion_rate'],
            'scroll_25': ['scroll_depth', 'engagement'],
            'scroll_50': ['scroll_depth', 'engagement'],
            'scroll_75': ['scroll_depth', 'engagement'],
            'time_on_page': ['time_on_page', 'engagement']
        };

        const relatedMetrics = metricMap[eventType] || [];
        return relatedMetrics.some(metric => metrics.includes(metric));
    }

    recordMetric(testId, variant, eventType, data) {
        const test = this.activeTests.get(testId);
        if (!test.metrics[variant]) {
            test.metrics[variant] = {};
        }

        if (!test.metrics[variant][eventType]) {
            test.metrics[variant][eventType] = [];
        }

        test.metrics[variant][eventType].push({
            timestamp: Date.now(),
            userId: this.userId,
            data: data
        });

        // Update participant counts
        if (eventType === 'conversion') {
            test.participants[variant].conversions++;
        }

        this.saveActiveTests();
        console.log(`🧪 Recorded ${eventType} for test ${testId}, variant ${variant}`);
    }

    trackParticipation(testId, variant) {
        const test = this.activeTests.get(testId);
        if (test) {
            test.participants[variant].count++;
            this.saveActiveTests();
        }
    }

    startAnalysisEngine() {
        // Run analysis every hour
        setInterval(() => {
            this.analyzeActiveTests();
        }, 60 * 60 * 1000);

        // Initial analysis
        setTimeout(() => {
            this.analyzeActiveTests();
        }, 5000);
    }

    analyzeActiveTests() {
        console.log('🧪 Analyzing active A/B tests...');

        this.activeTests.forEach((test, testId) => {
            if (test.status === 'active') {
                const analysis = this.analyzeTest(testId, test);
                this.testResults.set(testId, analysis);

                // Check if test should be concluded
                if (this.shouldConcludeTest(test, analysis)) {
                    this.concludeTest(testId, analysis);
                }
            }
        });

        this.saveTestResults();
    }

    analyzeTest(testId, test) {
        const variants = Object.keys(test.variants);
        const analysis = {
            testId: testId,
            status: test.status,
            duration: Date.now() - test.startDate,
            participants: { ...test.participants },
            metrics: {},
            statistical: {},
            recommendation: 'continue',
            confidence: 0,
            winner: null,
            analysisTime: Date.now()
        };

        // Calculate metrics for each variant
        variants.forEach(variant => {
            analysis.metrics[variant] = this.calculateVariantMetrics(test, variant);
        });

        // Perform statistical analysis
        if (variants.length === 2) {
            analysis.statistical = this.performStatisticalAnalysis(
                analysis.metrics[variants[0]],
                analysis.metrics[variants[1]],
                test.participants[variants[0]],
                test.participants[variants[1]]
            );
        }

        // Determine recommendation
        analysis.recommendation = this.generateRecommendation(analysis);

        return analysis;
    }

    calculateVariantMetrics(test, variant) {
        const metrics = test.metrics[variant] || {};
        const participants = test.participants[variant];

        const calculated = {
            participants: participants.count,
            conversions: participants.conversions,
            conversion_rate: participants.count > 0 ? (participants.conversions / participants.count) * 100 : 0
        };

        // Calculate click rate
        const clicks = metrics.click ? metrics.click.length : 0;
        calculated.click_rate = participants.count > 0 ? (clicks / participants.count) * 100 : 0;

        // Calculate average time on page
        const timeEvents = metrics.time_on_page || [];
        if (timeEvents.length > 0) {
            const totalTime = timeEvents.reduce((sum, event) => sum + (event.data.duration || 0), 0);
            calculated.avg_time_on_page = totalTime / timeEvents.length;
        } else {
            calculated.avg_time_on_page = 0;
        }

        // Calculate engagement score (scroll depth)
        const scrollEvents = [...(metrics.scroll_25 || []), ...(metrics.scroll_50 || []), ...(metrics.scroll_75 || [])];
        calculated.engagement_score = scrollEvents.length > 0 ? (scrollEvents.length / participants.count) * 100 : 0;

        return calculated;
    }

    performStatisticalAnalysis(metricsA, metricsB, participantsA, participantsB) {
        const analysis = {};

        // Z-test for conversion rate
        if (participantsA.count >= this.config.minimumSampleSize && participantsB.count >= this.config.minimumSampleSize) {
            const pA = participantsA.conversions / participantsA.count;
            const pB = participantsB.conversions / participantsB.count;
            const pPooled = (participantsA.conversions + participantsB.conversions) / (participantsA.count + participantsB.count);
            
            const se = Math.sqrt(pPooled * (1 - pPooled) * (1/participantsA.count + 1/participantsB.count));
            const zScore = (pB - pA) / se;
            const pValue = 2 * (1 - this.normalCDF(Math.abs(zScore)));

            analysis.conversion_rate = {
                z_score: zScore,
                p_value: pValue,
                significant: pValue < (1 - this.config.confidenceLevel),
                confidence_interval: this.calculateConfidenceInterval(pB - pA, se),
                lift: ((pB - pA) / pA) * 100
            };
        }

        return analysis;
    }

    normalCDF(x) {
        // Approximation of normal cumulative distribution function
        return 0.5 * (1 + this.erf(x / Math.sqrt(2)));
    }

    erf(x) {
        // Approximation of error function
        const a1 = 0.254829592;
        const a2 = -0.284496736;
        const a3 = 1.421413741;
        const a4 = -1.453152027;
        const a5 = 1.061405429;
        const p = 0.3275911;

        const sign = x < 0 ? -1 : 1;
        x = Math.abs(x);

        const t = 1.0 / (1.0 + p * x);
        const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

        return sign * y;
    }

    calculateConfidenceInterval(diff, se) {
        const zCritical = 1.96; // 95% confidence
        const margin = zCritical * se;
        return {
            lower: diff - margin,
            upper: diff + margin
        };
    }

    generateRecommendation(analysis) {
        if (!analysis.statistical.conversion_rate) {
            return 'continue'; // Need more data
        }

        const stats = analysis.statistical.conversion_rate;
        
        if (stats.significant && stats.lift > 5) {
            return 'implement_variant';
        } else if (stats.significant && stats.lift < -5) {
            return 'keep_control';
        } else if (!stats.significant && analysis.duration > this.config.testDuration) {
            return 'no_difference';
        } else {
            return 'continue';
        }
    }

    shouldConcludeTest(test, analysis) {
        // Conclude if statistically significant result or max duration reached
        const hasSignificantResult = analysis.statistical.conversion_rate?.significant;
        const maxDurationReached = analysis.duration >= test.duration;
        const sufficientSample = Object.values(test.participants).every(p => p.count >= this.config.minimumSampleSize);

        return (hasSignificantResult && sufficientSample) || maxDurationReached;
    }

    concludeTest(testId, analysis) {
        const test = this.activeTests.get(testId);
        test.status = 'completed';
        test.endDate = Date.now();
        test.finalAnalysis = analysis;

        this.completedTests.set(testId, test);
        this.activeTests.delete(testId);

        this.saveActiveTests();
        this.saveCompletedTests();

        console.log(`🧪 Test concluded: ${testId} - Recommendation: ${analysis.recommendation}`);
        
        // Show results notification
        this.showTestResults(testId, analysis);
    }

    showTestResults(testId, analysis) {
        const test = this.completedTests.get(testId);
        
        const notification = document.createElement('div');
        notification.className = 'ab-test-results-notification';
        notification.innerHTML = `
            <div class="notification-header">
                <h4>🧪 A/B Test Results</h4>
                <button class="close-btn">&times;</button>
            </div>
            <div class="notification-body">
                <h5>${test.name}</h5>
                <p><strong>Duration:</strong> ${Math.round(analysis.duration / (24 * 60 * 60 * 1000))} days</p>
                <p><strong>Participants:</strong> ${Object.values(analysis.participants).reduce((sum, p) => sum + p.count, 0)}</p>
                <p><strong>Recommendation:</strong> ${this.formatRecommendation(analysis.recommendation)}</p>
                ${analysis.statistical.conversion_rate ? `
                    <p><strong>Statistical Significance:</strong> ${analysis.statistical.conversion_rate.significant ? 'Yes' : 'No'}</p>
                    <p><strong>Conversion Lift:</strong> ${analysis.statistical.conversion_rate.lift.toFixed(2)}%</p>
                ` : ''}
            </div>
        `;

        this.styleNotification(notification);
        document.body.appendChild(notification);

        // Auto-remove after 10 seconds
        setTimeout(() => {
            notification.remove();
        }, 10000);

        // Close button
        notification.querySelector('.close-btn').addEventListener('click', () => {
            notification.remove();
        });
    }

    styleNotification(notification) {
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            border: 1px solid #ddd;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000;
            max-width: 350px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        `;

        const header = notification.querySelector('.notification-header');
        header.style.cssText = `
            background: #f8f9fa;
            padding: 15px;
            border-bottom: 1px solid #ddd;
            border-radius: 8px 8px 0 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
        `;

        const body = notification.querySelector('.notification-body');
        body.style.cssText = `
            padding: 15px;
        `;

        const closeBtn = notification.querySelector('.close-btn');
        closeBtn.style.cssText = `
            background: none;
            border: none;
            font-size: 18px;
            cursor: pointer;
            color: #666;
        `;
    }

    formatRecommendation(rec) {
        const recommendations = {
            'continue': 'Continue testing - need more data',
            'implement_variant': 'Implement variant - significant improvement',
            'keep_control': 'Keep control - variant performed worse',
            'no_difference': 'No significant difference found'
        };
        return recommendations[rec] || rec;
    }

    // Storage methods
    saveActiveTests() {
        const testsObj = Object.fromEntries(this.activeTests);
        localStorage.setItem('dd_ab_tests', JSON.stringify(testsObj));
    }

    saveCompletedTests() {
        const testsObj = Object.fromEntries(this.completedTests);
        localStorage.setItem('dd_ab_completed_tests', JSON.stringify(testsObj));
    }

    saveUserAssignments() {
        const assignmentsObj = Object.fromEntries(this.userAssignments);
        localStorage.setItem('dd_ab_assignments', JSON.stringify(assignmentsObj));
    }

    saveTestResults() {
        const resultsObj = Object.fromEntries(this.testResults);
        localStorage.setItem('dd_ab_results', JSON.stringify(resultsObj));
    }

    // Utility methods
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

    // Public API
    createTest(testConfig) {
        const testId = 'custom_' + Date.now();
        return this.startTest(testId, testConfig);
    }

    getActiveTests() {
        return Object.fromEntries(this.activeTests);
    }

    getTestResults(testId) {
        return this.testResults.get(testId);
    }

    getAllResults() {
        return Object.fromEntries(this.testResults);
    }

    forceAnalysis() {
        this.analyzeActiveTests();
    }

    exportResults() {
        return {
            activeTests: this.getActiveTests(),
            completedTests: Object.fromEntries(this.completedTests),
            results: this.getAllResults(),
            userAssignments: Object.fromEntries(this.userAssignments),
            config: this.config,
            exportTime: Date.now()
        };
    }

    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        console.log('🧪 A/B Testing configuration updated');
    }
}

// Initialize A/B Testing Framework
const abTestingFramework = new ABTestingFramework();

// Export for global access
window.DDABTesting = abTestingFramework;

console.log('🧪 Code with Ubuntu A/B Testing Framework loaded successfully!');
