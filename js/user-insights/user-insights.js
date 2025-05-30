/**
 * Code with Ubuntu - User Insights & Personalization Engine
 * Phase 7: Data Management & Analytics Implementation
 * 
 * Advanced user behavior analysis, personalization, and recommendation system
 * with machine learning-inspired pattern recognition and adaptive content delivery.
 */

class UserInsights {
    constructor() {
        this.config = {
            trackingEnabled: true,
            personalizationEnabled: true,
            recommendationEngine: true,
            behaviorAnalysis: true,
            segmentationEnabled: true,
            adaptiveContent: true,
            learningRate: 0.1,
            confidenceThreshold: 0.7,
            maxRecommendations: 5
        };

        this.userProfile = {
            id: null,
            segment: 'new',
            interests: [],
            skillLevel: 'beginner',
            preferences: {},
            behaviorPatterns: {},
            engagementScore: 0,
            learningPath: [],
            achievements: [],
            lastActivity: null
        };

        this.behaviorPatterns = {
            pageSequences: new Map(),
            timePatterns: new Map(),
            interactionStyles: new Map(),
            contentPreferences: new Map(),
            learningPatterns: new Map()
        };

        this.contentLibrary = {
            programs: [],
            events: [],
            resources: [],
            projects: []
        };

        this.recommendations = {
            content: [],
            events: [],
            learningPaths: [],
            nextActions: []
        };

        this.userSegments = {
            new: { criteria: {}, content: [], actions: [] },
            beginner: { criteria: {}, content: [], actions: [] },
            intermediate: { criteria: {}, content: [], actions: [] },
            advanced: { criteria: {}, content: [], actions: [] },
            mentor: { criteria: {}, content: [], actions: [] },
            parent: { criteria: {}, content: [], actions: [] }
        };

        this.init();
    }

    init() {
        console.log('🧠 Initializing User Insights Engine...');
        
        this.setupUserProfile();
        this.loadContentLibrary();
        this.initializeBehaviorTracking();
        this.setupPersonalization();
        this.startInsightsEngine();
        
        console.log('✅ User Insights Engine initialized successfully');
    }

    setupUserProfile() {
        // Load or create user profile
        const savedProfile = localStorage.getItem('dd_user_profile');
        if (savedProfile) {
            this.userProfile = { ...this.userProfile, ...JSON.parse(savedProfile) };
        } else {
            this.userProfile.id = this.generateUserId();
            this.userProfile.lastActivity = Date.now();
            this.saveUserProfile();
        }

        console.log('👤 User profile initialized:', this.userProfile.id);
    }

    async loadContentLibrary() {
        try {
            // Load content from data manager if available
            if (window.DDDataManager) {
                const data = await window.DDDataManager.getAllData();
                this.contentLibrary.programs = data.programs || [];
                this.contentLibrary.events = data.events || [];
                this.contentLibrary.resources = data.resources_enhanced || [];
                this.contentLibrary.projects = data.projects || [];
            }

            console.log('📚 Content library loaded successfully');
        } catch (error) {
            console.error('❌ Failed to load content library:', error);
        }
    }

    initializeBehaviorTracking() {
        // Track page views and navigation patterns
        this.trackPageView();
        this.setupNavigationTracking();
        this.setupInteractionTracking();
        this.setupTimeTracking();
        this.setupScrollTracking();
    }

    trackPageView() {
        const currentPage = window.location.pathname;
        const timestamp = Date.now();
        
        // Update page sequence patterns
        const lastPage = sessionStorage.getItem('dd_last_page');
        if (lastPage) {
            const sequence = `${lastPage} -> ${currentPage}`;
            const count = this.behaviorPatterns.pageSequences.get(sequence) || 0;
            this.behaviorPatterns.pageSequences.set(sequence, count + 1);
        }
        
        sessionStorage.setItem('dd_last_page', currentPage);
        
        // Analyze page preferences
        this.updateContentPreferences(currentPage);
        
        // Update user profile
        this.userProfile.lastActivity = timestamp;
        this.saveUserProfile();
    }

    setupNavigationTracking() {
        // Track link clicks and navigation behavior
        document.addEventListener('click', (event) => {
            const link = event.target.closest('a');
            if (link && link.href) {
                this.trackNavigation(link.href, link.textContent);
            }
        });
    }

    setupInteractionTracking() {
        // Track user interactions with content
        document.addEventListener('click', (event) => {
            this.analyzeInteractionStyle(event);
        });

        // Track form interactions
        document.addEventListener('focus', (event) => {
            if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
                this.trackFormInteraction(event.target);
            }
        }, true);

        // Track button interactions
        document.addEventListener('click', (event) => {
            if (event.target.tagName === 'BUTTON' || event.target.type === 'submit') {
                this.trackButtonInteraction(event.target);
            }
        });
    }

    setupTimeTracking() {
        // Track time spent on different sections
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.startTimeTracking(entry.target);
                } else {
                    this.endTimeTracking(entry.target);
                }
            });
        }, { threshold: 0.5 });

        // Observe main content sections
        document.querySelectorAll('section, .content-section, .program-card').forEach(el => {
            observer.observe(el);
        });
    }

    setupScrollTracking() {
        let scrollDepth = 0;
        const updateScrollDepth = () => {
            const currentDepth = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
            if (currentDepth > scrollDepth) {
                scrollDepth = currentDepth;
                this.updateEngagementScore('scroll', currentDepth);
            }
        };

        window.addEventListener('scroll', this.debounce(updateScrollDepth, 500));
    }

    analyzeInteractionStyle(event) {
        const interactionData = {
            elementType: event.target.tagName.toLowerCase(),
            className: event.target.className,
            timestamp: Date.now(),
            pageY: event.pageY,
            clientY: event.clientY
        };

        // Analyze interaction patterns
        const styleKey = `${interactionData.elementType}_${interactionData.className}`;
        const interactions = this.behaviorPatterns.interactionStyles.get(styleKey) || [];
        interactions.push(interactionData);
        this.behaviorPatterns.interactionStyles.set(styleKey, interactions);

        // Update engagement score
        this.updateEngagementScore('interaction', 1);
    }

    trackNavigation(href, linkText) {
        const navigationData = {
            from: window.location.pathname,
            to: href,
            linkText: linkText,
            timestamp: Date.now()
        };

        // Analyze content interests based on navigation
        this.analyzeContentInterest(href, linkText);
        
        console.log('🔗 Navigation tracked:', navigationData);
    }

    trackFormInteraction(element) {
        const formData = {
            formId: element.form?.id || 'unknown',
            fieldName: element.name || element.id,
            fieldType: element.type,
            timestamp: Date.now()
        };

        // Update user behavior patterns
        this.updateBehaviorPattern('form_interaction', formData);
        this.updateEngagementScore('form_focus', 2);
    }

    trackButtonInteraction(button) {
        const buttonData = {
            buttonText: button.textContent,
            buttonClass: button.className,
            formId: button.form?.id,
            timestamp: Date.now()
        };

        // Analyze user intent based on button interactions
        this.analyzeUserIntent(buttonData);
        this.updateEngagementScore('button_click', 1);
    }

    startTimeTracking(element) {
        const elementId = element.id || element.className || 'unknown';
        element.dataset.startTime = Date.now().toString();
        console.log(`⏱️ Started tracking time for: ${elementId}`);
    }

    endTimeTracking(element) {
        const startTime = parseInt(element.dataset.startTime);
        if (startTime) {
            const timeSpent = Date.now() - startTime;
            const elementId = element.id || element.className || 'unknown';
            
            this.updateTimePattern(elementId, timeSpent);
            this.updateEngagementScore('time_spent', Math.min(timeSpent / 1000, 10));
            
            console.log(`⏱️ Time spent on ${elementId}: ${timeSpent}ms`);
        }
    }

    updateContentPreferences(page) {
        // Extract content type from page
        let contentType = 'general';
        if (page.includes('program')) contentType = 'programs';
        else if (page.includes('event')) contentType = 'events';
        else if (page.includes('resource')) contentType = 'resources';
        else if (page.includes('about')) contentType = 'about';
        else if (page.includes('contact')) contentType = 'contact';

        const preferences = this.behaviorPatterns.contentPreferences.get(contentType) || 0;
        this.behaviorPatterns.contentPreferences.set(contentType, preferences + 1);

        // Update user interests
        if (!this.userProfile.interests.includes(contentType)) {
            this.userProfile.interests.push(contentType);
        }
    }

    analyzeContentInterest(href, linkText) {
        // Extract keywords from link text
        const keywords = linkText.toLowerCase().split(/\s+/).filter(word => word.length > 3);
        
        keywords.forEach(keyword => {
            // Check if keyword relates to programming languages or technologies
            const techKeywords = ['python', 'javascript', 'java', 'css', 'html', 'react', 'node', 'git'];
            if (techKeywords.includes(keyword)) {
                this.updateSkillInterest(keyword);
            }
        });
    }

    updateSkillInterest(skill) {
        const interests = this.userProfile.interests;
        if (!interests.includes(skill)) {
            interests.push(skill);
            this.saveUserProfile();
            console.log(`🎯 New skill interest detected: ${skill}`);
        }
    }

    analyzeUserIntent(buttonData) {
        const intent = this.extractIntent(buttonData.buttonText);
        if (intent) {
            this.updateBehaviorPattern('user_intent', intent);
            console.log(`🎯 User intent detected: ${intent}`);
        }
    }

    extractIntent(buttonText) {
        const text = buttonText.toLowerCase();
        if (text.includes('register') || text.includes('sign up')) return 'registration';
        if (text.includes('learn') || text.includes('start')) return 'learning';
        if (text.includes('contact') || text.includes('message')) return 'contact';
        if (text.includes('download')) return 'resource_access';
        if (text.includes('share')) return 'sharing';
        return null;
    }

    updateBehaviorPattern(patternType, data) {
        const patterns = this.behaviorPatterns[patternType] || new Map();
        const key = JSON.stringify(data);
        const count = patterns.get(key) || 0;
        patterns.set(key, count + 1);
        this.behaviorPatterns[patternType] = patterns;
    }

    updateTimePattern(elementId, timeSpent) {
        const current = this.behaviorPatterns.timePatterns.get(elementId) || { total: 0, sessions: 0 };
        current.total += timeSpent;
        current.sessions += 1;
        current.average = current.total / current.sessions;
        this.behaviorPatterns.timePatterns.set(elementId, current);
    }

    updateEngagementScore(action, value) {
        const weights = {
            scroll: 0.1,
            interaction: 0.5,
            form_focus: 1.0,
            button_click: 0.7,
            time_spent: 0.3
        };

        const weight = weights[action] || 0.1;
        const scoreIncrease = value * weight;
        
        this.userProfile.engagementScore += scoreIncrease;
        this.userProfile.engagementScore = Math.min(this.userProfile.engagementScore, 100);
    }

    setupPersonalization() {
        if (!this.config.personalizationEnabled) return;

        // Personalize content based on user profile
        this.personalizeNavigation();
        this.personalizeContent();
        this.personalizeRecommendations();
    }

    personalizeNavigation() {
        // Highlight preferred content types in navigation
        const preferences = Array.from(this.behaviorPatterns.contentPreferences.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3);

        preferences.forEach(([contentType, count]) => {
            this.highlightNavItem(contentType);
        });
    }

    personalizeContent() {
        // Customize content order based on user interests
        const contentSections = document.querySelectorAll('.content-section');
        contentSections.forEach(section => {
            this.customizeSection(section);
        });
    }

    personalizeRecommendations() {
        // Generate personalized recommendations
        this.generateContentRecommendations();
        this.generateEventRecommendations();
        this.generateLearningPathRecommendations();
        this.displayRecommendations();
    }

    generateContentRecommendations() {
        const userInterests = this.userProfile.interests;
        const contentRecommendations = [];

        // Analyze available content
        this.contentLibrary.programs.forEach(program => {
            const relevanceScore = this.calculateRelevanceScore(program, userInterests);
            if (relevanceScore > this.config.confidenceThreshold) {
                contentRecommendations.push({
                    type: 'program',
                    item: program,
                    score: relevanceScore,
                    reason: this.generateRecommendationReason(program, userInterests)
                });
            }
        });

        this.recommendations.content = contentRecommendations
            .sort((a, b) => b.score - a.score)
            .slice(0, this.config.maxRecommendations);
    }

    generateEventRecommendations() {
        const upcomingEvents = this.contentLibrary.events.filter(event => 
            new Date(event.date) > new Date()
        );

        const eventRecommendations = upcomingEvents.map(event => ({
            type: 'event',
            item: event,
            score: this.calculateEventRelevanceScore(event),
            reason: `Based on your interest in ${this.userProfile.interests.join(', ')}`
        }));

        this.recommendations.events = eventRecommendations
            .sort((a, b) => b.score - a.score)
            .slice(0, this.config.maxRecommendations);
    }

    generateLearningPathRecommendations() {
        const skillLevel = this.userProfile.skillLevel;
        const interests = this.userProfile.interests;

        const learningPaths = this.createLearningPaths(skillLevel, interests);
        this.recommendations.learningPaths = learningPaths;
    }

    createLearningPaths(skillLevel, interests) {
        const paths = {
            beginner: [
                { title: 'Web Development Basics', steps: ['HTML Fundamentals', 'CSS Styling', 'JavaScript Basics'] },
                { title: 'Python Programming', steps: ['Python Syntax', 'Data Types', 'Functions', 'Projects'] }
            ],
            intermediate: [
                { title: 'Full Stack Development', steps: ['Frontend Frameworks', 'Backend APIs', 'Databases'] },
                { title: 'Mobile App Development', steps: ['React Native', 'App Store Deployment'] }
            ],
            advanced: [
                { title: 'System Architecture', steps: ['Microservices', 'Cloud Computing', 'DevOps'] },
                { title: 'AI & Machine Learning', steps: ['Neural Networks', 'Deep Learning', 'MLOps'] }
            ]
        };

        return paths[skillLevel] || paths.beginner;
    }

    calculateRelevanceScore(item, userInterests) {
        if (!item.tags && !item.category && !item.title) return 0;

        const itemKeywords = [
            ...(item.tags || []),
            item.category || '',
            ...(item.title || '').toLowerCase().split(/\s+/)
        ].filter(keyword => keyword.length > 2);

        let relevanceScore = 0;
        userInterests.forEach(interest => {
            itemKeywords.forEach(keyword => {
                if (keyword.toLowerCase().includes(interest.toLowerCase()) || 
                    interest.toLowerCase().includes(keyword.toLowerCase())) {
                    relevanceScore += 0.2;
                }
            });
        });

        return Math.min(relevanceScore, 1.0);
    }

    calculateEventRelevanceScore(event) {
        const baseScore = 0.5;
        const interestBonus = this.calculateRelevanceScore(event, this.userProfile.interests);
        const timeBonus = this.calculateTimeBonus(event.date);
        
        return Math.min(baseScore + interestBonus + timeBonus, 1.0);
    }

    calculateTimeBonus(eventDate) {
        const daysUntilEvent = (new Date(eventDate) - new Date()) / (1000 * 60 * 60 * 24);
        if (daysUntilEvent < 0) return 0;
        if (daysUntilEvent <= 7) return 0.3;
        if (daysUntilEvent <= 30) return 0.2;
        return 0.1;
    }

    generateRecommendationReason(item, interests) {
        const matchingInterests = interests.filter(interest => 
            JSON.stringify(item).toLowerCase().includes(interest.toLowerCase())
        );

        if (matchingInterests.length > 0) {
            return `Recommended based on your interest in ${matchingInterests.join(', ')}`;
        }
        return 'Recommended based on your activity patterns';
    }

    displayRecommendations() {
        this.createRecommendationsWidget();
    }

    createRecommendationsWidget() {
        // Remove existing widget
        document.getElementById('user-recommendations')?.remove();

        const widget = document.createElement('div');
        widget.id = 'user-recommendations';
        widget.className = 'recommendations-widget';
        widget.innerHTML = `
            <div class="recommendations-header">
                <h3>🎯 Recommended for You</h3>
                <button id="close-recommendations" class="close-btn">&times;</button>
            </div>
            <div class="recommendations-content">
                ${this.renderRecommendations()}
            </div>
        `;

        // Add styles
        this.addRecommendationStyles();

        // Add to page
        document.body.appendChild(widget);

        // Setup event listeners
        document.getElementById('close-recommendations')?.addEventListener('click', () => {
            widget.style.display = 'none';
        });

        // Auto-hide after 10 seconds if no interaction
        setTimeout(() => {
            if (widget.style.display !== 'none') {
                widget.style.opacity = '0.7';
            }
        }, 10000);
    }

    renderRecommendations() {
        const allRecommendations = [
            ...this.recommendations.content,
            ...this.recommendations.events
        ].sort((a, b) => b.score - a.score).slice(0, 3);

        if (allRecommendations.length === 0) {
            return '<p>Keep exploring to get personalized recommendations!</p>';
        }

        return allRecommendations.map(rec => `
            <div class="recommendation-item">
                <div class="rec-type">${rec.type.toUpperCase()}</div>
                <div class="rec-title">${rec.item.title || rec.item.name}</div>
                <div class="rec-reason">${rec.reason}</div>
                <div class="rec-score">Match: ${Math.round(rec.score * 100)}%</div>
            </div>
        `).join('');
    }

    addRecommendationStyles() {
        if (document.getElementById('recommendations-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'recommendations-styles';
        styles.textContent = `
            .recommendations-widget {
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 300px;
                background: white;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 1000;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                border: 1px solid #e0e0e0;
            }

            .recommendations-header {
                background: #f8f9fa;
                padding: 15px;
                border-bottom: 1px solid #e0e0e0;
                border-radius: 8px 8px 0 0;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .recommendations-header h3 {
                margin: 0;
                font-size: 16px;
                color: #333;
            }

            .close-btn {
                background: none;
                border: none;
                font-size: 18px;
                cursor: pointer;
                color: #666;
                padding: 0;
                width: 20px;
                height: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .recommendations-content {
                padding: 15px;
                max-height: 300px;
                overflow-y: auto;
            }

            .recommendation-item {
                margin-bottom: 15px;
                padding: 12px;
                background: #f8f9fa;
                border-radius: 6px;
                border-left: 3px solid #007bff;
            }

            .rec-type {
                font-size: 10px;
                color: #007bff;
                font-weight: bold;
                margin-bottom: 4px;
            }

            .rec-title {
                font-weight: 600;
                color: #333;
                margin-bottom: 4px;
                font-size: 14px;
            }

            .rec-reason {
                font-size: 12px;
                color: #666;
                margin-bottom: 6px;
            }

            .rec-score {
                font-size: 11px;
                color: #28a745;
                font-weight: 500;
            }

            @media (max-width: 768px) {
                .recommendations-widget {
                    bottom: 10px;
                    right: 10px;
                    left: 10px;
                    width: auto;
                }
            }
        `;

        document.head.appendChild(styles);
    }

    highlightNavItem(contentType) {
        const navLinks = document.querySelectorAll('nav a, .nav a');
        navLinks.forEach(link => {
            if (link.href.includes(contentType) || link.textContent.toLowerCase().includes(contentType)) {
                link.style.background = 'linear-gradient(45deg, #007bff, #0056b3)';
                link.style.color = 'white';
                link.style.borderRadius = '4px';
                link.style.padding = '2px 6px';
            }
        });
    }

    customizeSection(section) {
        // Add personalization indicator
        if (this.isRelevantToUser(section)) {
            section.style.border = '2px solid #007bff';
            section.style.borderRadius = '8px';
            
            const indicator = document.createElement('div');
            indicator.className = 'personalization-indicator';
            indicator.innerHTML = '🎯 Recommended for you';
            indicator.style.cssText = `
                background: #007bff;
                color: white;
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 12px;
                position: absolute;
                top: -10px;
                right: 10px;
                z-index: 10;
            `;
            
            section.style.position = 'relative';
            section.appendChild(indicator);
        }
    }

    isRelevantToUser(section) {
        const sectionText = section.textContent.toLowerCase();
        return this.userProfile.interests.some(interest => 
            sectionText.includes(interest.toLowerCase())
        );
    }

    startInsightsEngine() {
        // Periodic analysis and profile updates
        setInterval(() => {
            this.analyzeUserBehavior();
            this.updateUserSegment();
            this.saveUserProfile();
        }, 60000); // Every minute

        // Session analysis on page unload
        window.addEventListener('beforeunload', () => {
            this.analyzeSession();
            this.saveUserProfile();
        });
    }

    analyzeUserBehavior() {
        // Analyze collected behavior patterns
        const patterns = this.behaviorPatterns;
        
        // Update skill level based on engagement
        if (this.userProfile.engagementScore > 70) {
            this.promoteSkillLevel();
        }

        // Identify preferred content types
        const topContentTypes = Array.from(patterns.contentPreferences.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([type]) => type);

        this.userProfile.preferences.contentTypes = topContentTypes;

        console.log('🧠 User behavior analyzed:', {
            engagementScore: this.userProfile.engagementScore,
            preferredContent: topContentTypes,
            skillLevel: this.userProfile.skillLevel
        });
    }

    promoteSkillLevel() {
        const levels = ['beginner', 'intermediate', 'advanced', 'expert'];
        const currentIndex = levels.indexOf(this.userProfile.skillLevel);
        
        if (currentIndex < levels.length - 1) {
            this.userProfile.skillLevel = levels[currentIndex + 1];
            console.log(`🚀 User promoted to ${this.userProfile.skillLevel} level!`);
            
            // Show promotion notification
            this.showPromotionNotification();
        }
    }

    showPromotionNotification() {
        const notification = document.createElement('div');
        notification.className = 'promotion-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <h4>🎉 Congratulations!</h4>
                <p>You've been promoted to <strong>${this.userProfile.skillLevel}</strong> level!</p>
                <p>New content and challenges are now available for you.</p>
            </div>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #28a745;
            color: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 1001;
            max-width: 300px;
            animation: slideIn 0.5s ease-out;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 5000);
    }

    updateUserSegment() {
        // Determine user segment based on behavior and profile
        let newSegment = 'new';

        if (this.userProfile.engagementScore > 80) {
            newSegment = 'mentor';
        } else if (this.userProfile.skillLevel === 'advanced') {
            newSegment = 'advanced';
        } else if (this.userProfile.skillLevel === 'intermediate') {
            newSegment = 'intermediate';
        } else if (this.userProfile.interests.length > 3) {
            newSegment = 'beginner';
        }

        if (newSegment !== this.userProfile.segment) {
            this.userProfile.segment = newSegment;
            console.log(`👥 User segment updated to: ${newSegment}`);
        }
    }

    analyzeSession() {
        const sessionDuration = Date.now() - this.userProfile.lastActivity;
        const pageCount = this.behaviorPatterns.pageSequences.size;
        
        const sessionData = {
            duration: sessionDuration,
            pages: pageCount,
            engagementGain: this.userProfile.engagementScore,
            timestamp: Date.now()
        };

        // Store session analysis
        const sessions = JSON.parse(localStorage.getItem('dd_user_sessions') || '[]');
        sessions.push(sessionData);
        sessions.splice(-10); // Keep last 10 sessions
        localStorage.setItem('dd_user_sessions', JSON.stringify(sessions));
    }

    saveUserProfile() {
        localStorage.setItem('dd_user_profile', JSON.stringify(this.userProfile));
    }

    generateUserId() {
        return 'user_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
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

    // Public API
    getUserProfile() {
        return { ...this.userProfile };
    }

    getBehaviorPatterns() {
        return {
            pageSequences: Object.fromEntries(this.behaviorPatterns.pageSequences),
            timePatterns: Object.fromEntries(this.behaviorPatterns.timePatterns),
            contentPreferences: Object.fromEntries(this.behaviorPatterns.contentPreferences)
        };
    }

    getRecommendations() {
        return { ...this.recommendations };
    }

    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        console.log('🧠 User Insights configuration updated');
    }

    exportInsights() {
        return {
            userProfile: this.getUserProfile(),
            behaviorPatterns: this.getBehaviorPatterns(),
            recommendations: this.getRecommendations(),
            sessions: JSON.parse(localStorage.getItem('dd_user_sessions') || '[]'),
            exportTime: Date.now()
        };
    }

    clearUserData() {
        localStorage.removeItem('dd_user_profile');
        localStorage.removeItem('dd_user_sessions');
        
        this.userProfile = {
            id: this.generateUserId(),
            segment: 'new',
            interests: [],
            skillLevel: 'beginner',
            preferences: {},
            behaviorPatterns: {},
            engagementScore: 0,
            learningPath: [],
            achievements: [],
            lastActivity: Date.now()
        };

        console.log('🧠 User data cleared and reset');
    }
}

// Initialize User Insights
const userInsights = new UserInsights();

// Export for global access
window.DDUserInsights = userInsights;

console.log('🧠 Code with Ubuntu User Insights Engine loaded successfully!');
