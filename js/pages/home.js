/**
 * DD Coder Dojo - Enhanced Home Page Functionality
 * Modular, maintainable code with improved performance and accessibility
 */

// ===== HERO ANIMATIONS CLASS =====
class HeroAnimations {
    constructor() {
        this.form.insertBefore(message, this.form.firstChild);
        
        setTimeout(() => {
            message.remove();
        }, 5000);
    }

    showErrorMessage(errorText) {
        const message = document.createElement('div');
        message.className = 'form-error-message';
        message.style.cssText = `
            background: rgba(239, 68, 68, 0.1);
            border: 2px solid #ef4444;
            color: #ef4444;
            padding: 1rem;
            border-radius: 10px;
            margin-bottom: 1rem;
            text-align: center;
        `;
        message.innerHTML = `
            <i class="fas fa-exclamation-triangle"></i>
            ${errorText}
        `;
        
        this.form.insertBefore(message, this.form.firstChild);
        
        setTimeout(() => {
            message.remove();
        }, 5000);
    }

    showFieldError(field, message) {
        this.clearFieldError(field);
        
        field.style.borderColor = '#ef4444';
        field.setAttribute('aria-invalid', 'true');
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.style.cssText = `
            color: #ef4444;
            font-size: 0.85rem;
            margin-top: 0.25rem;
        `;
        errorDiv.textContent = message;
        errorDiv.id = `${field.id || field.name}-error`;
        
        field.setAttribute('aria-describedby', errorDiv.id);
        field.parentNode.appendChild(errorDiv);
    }

    clearFieldError(field) {
        field.style.borderColor = '';
        field.removeAttribute('aria-invalid');
        field.removeAttribute('aria-describedby');
        
        const errorDiv = field.parentNode.querySelector('.field-error');
        if (errorDiv) {
            errorDiv.remove();
        }
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

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// ===== PAGE INITIALIZATION =====
class HomePage {
    constructor() {
        this.components = [];
        this.init();
    }

    async init() {
        try {
            console.log('🏠 Initializing home page...');
            
            // Wait for main app to be ready
            await this.waitForMainApp();
            
            // Initialize components
            this.components.push(new HeroAnimations());
            this.components.push(new ProgramCards());
            this.components.push(new StudentShowcase());
            this.components.push(new LiveStatistics());
            this.components.push(new ContactForm());
            
            // Setup page-specific features
            this.setupPageSpecificFeatures();
            
            console.log('✅ Home page initialized successfully!');
            
        } catch (error) {
            console.error('❌ Home page initialization failed:', error);
        }
    }

    async waitForMainApp() {
        return new Promise((resolve) => {
            if (window.DDCoderDojo && window.DDCoderDojo.isReady()) {
                resolve();
            } else {
                document.addEventListener('ddAppReady', resolve, { once: true });
            }
        });
    }

    setupPageSpecificFeatures() {
        // Add any home page specific features here
        this.setupIntersectionAnimations();
        this.setupParallaxEffects();
        this.setupDynamicBackgrounds();
    }

    setupIntersectionAnimations() {
        // Additional intersection-based animations for home page
        const sections = document.querySelectorAll('section');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('section-in-view');
                }
            });
        }, {
            threshold: 0.2,
            rootMargin: '-50px'
        });

        sections.forEach(section => {
            observer.observe(section);
        });
    }

    setupParallaxEffects() {
        // Subtle parallax effect for hero background
        const heroBackground = document.querySelector('.hero-background');
        if (!heroBackground) return;

        const parallaxHandler = () => {
            const scrolled = window.pageYOffset;
            const heroHeight = window.innerHeight;
            
            if (scrolled < heroHeight) {
                const parallaxValue = scrolled * 0.5;
                heroBackground.style.transform = `translateY(${parallaxValue}px)`;
            }
        };

        window.addEventListener('scroll', window.DDCoderDojo?.getApp()?.throttle(parallaxHandler, 16) || parallaxHandler, { passive: true });
    }

    setupDynamicBackgrounds() {
        // Add dynamic particle effects to different sections
        const sections = [
            { selector: '.programs', particleCount: 8, color: 'var(--primary-color)' },
            { selector: '.about', particleCount: 6, color: 'var(--secondary-color)' },
            { selector: '.contact', particleCount: 5, color: 'var(--accent-color)' }
        ];

        sections.forEach(({ selector, particleCount, color }) => {
            const section = document.querySelector(selector);
            if (section) {
                this.addFloatingParticles(section, particleCount, color);
            }
        });
    }

    addFloatingParticles(container, count, color) {
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            const size = Math.random() * 3 + 1;
            const duration = Math.random() * 30 + 20;
            
            particle.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background: ${color};
                border-radius: 50%;
                opacity: ${Math.random() * 0.3 + 0.1};
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                pointer-events: none;
                animation: gentle-float ${duration}s linear infinite;
                animation-delay: ${Math.random() * 10}s;
            `;
            
            container.style.position = 'relative';
            container.style.overflow = 'hidden';
            container.appendChild(particle);
        }

        // Add CSS animation if not already present
        if (!document.querySelector('#gentle-float-styles')) {
            const style = document.createElement('style');
            style.id = 'gentle-float-styles';
            style.textContent = `
                @keyframes gentle-float {
                    0%, 100% { 
                        transform: translate(0, 0) rotate(0deg); 
                        opacity: 0.1; 
                    }
                    25% { 
                        transform: translate(10px, -15px) rotate(90deg); 
                        opacity: 0.3; 
                    }
                    50% { 
                        transform: translate(-5px, -25px) rotate(180deg); 
                        opacity: 0.2; 
                    }
                    75% { 
                        transform: translate(-15px, -10px) rotate(270deg); 
                        opacity: 0.3; 
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    destroy() {
        // Clean up all components
        this.components.forEach(component => {
            if (component.destroy) {
                component.destroy();
            }
        });
        this.components = [];
    }
}

// ===== INITIALIZE HOME PAGE =====
document.addEventListener('DOMContentLoaded', () => {
    try {
        new HomePage();
    } catch (error) {
        console.error('❌ Home page startup error:', error);
    }
});

// ===== CLEANUP ON PAGE UNLOAD =====
window.addEventListener('beforeunload', () => {
    // Clean up any running intervals or animations
    if (window.homePage && window.homePage.destroy) {
        window.homePage.destroy();
    }
});

// Add CSS for enhanced animations
const enhancedStyles = document.createElement('style');
enhancedStyles.textContent = `
    /* Enhanced animation styles */
    .carousel-track {
        transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .project-slide {
        transition: all 0.5s ease;
        opacity: 0.7;
        transform: scale(0.95);
    }

    .project-slide.active {
        opacity: 1;
        transform: scale(1);
    }

    .stat-card.counting .stat-number {
        color: var(--secondary-color);
        transform: scale(1.1);
    }

    .stat-card.highlight {
        background: rgba(0, 217, 255, 0.1);
        border-color: var(--secondary-color);
        transform: translateY(-5px);
    }

    .stat-card.animated {
        animation: success-pulse 0.6s ease-out;
    }

    @keyframes success-pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }

    .program-card {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .program-card:focus {
        outline: 2px solid var(--secondary-color);
        outline-offset: 4px;
    }

    .section-in-view {
        animation: section-fade-in 0.8s ease-out;
    }

    @keyframes section-fade-in {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .hero-stats .stat-item {
        transition: all 0.3s ease;
    }

    .hero-stats .stat-item:hover {
        transform: translateY(-5px);
        background: rgba(255, 255, 255, 0.1);
        border-radius: 10px;
        padding: 0.5rem;
    }

    /* Accessibility improvements */
    @media (prefers-reduced-motion: reduce) {
        *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
        }
    }

    /* Focus indicators for better accessibility */
    .keyboard-navigation .nav-btn:focus,
    .keyboard-navigation .indicator:focus,
    .keyboard-navigation .program-card:focus {
        outline: 3px solid var(--secondary-color);
        outline-offset: 2px;
    }

    /* Mobile optimizations */
    @media (max-width: 768px) {
        .project-slide {
            font-size: 0.9rem;
        }
        
        .stat-card {
            margin-bottom: 1rem;
        }
        
        .hero-stats {
            gap: 1rem;
        }
    }
`;

document.head.appendChild(enhancedStyles);animations = new Map();
        this.init();
    }

    async init() {
        try {
            await this.initTypingAnimation();
            this.initRotatingWords();
            this.initMatrixRain();
            this.initFloatingParticles();
            this.initCounterAnimations();
            this.initCodeAnimation();
        } catch (error) {
            console.error('Hero animations initialization failed:', error);
        }
    }

    async initTypingAnimation() {
        const typingElement = document.querySelector('.typing-text');
        if (!typingElement) return;

        const text = typingElement.dataset.text || typingElement.textContent;
        const speed = parseInt(typingElement.dataset.speed) || 150;
        
        typingElement.textContent = '';
        typingElement.style.borderRight = '2px solid var(--secondary-color)';
        
        for (let i = 0; i < text.length; i++) {
            await this.delay(speed);
            typingElement.textContent += text.charAt(i);
        }
        
        // Add blinking cursor
        setTimeout(() => {
            typingElement.style.animation = 'blink 1s infinite';
        }, 1000);
    }

    initRotatingWords() {
        const container = document.querySelector('.rotating-words');
        if (!container) return;

        const words = container.querySelectorAll('.word');
        if (words.length === 0) return;

        let currentIndex = 0;
        const interval = 3000;

        const rotateWords = () => {
            words[currentIndex].classList.remove('active');
            currentIndex = (currentIndex + 1) % words.length;
            words[currentIndex].classList.add('active');
        };

        this.animations.set('rotatingWords', setInterval(rotateWords, interval));
    }

    initMatrixRain() {
        const container = document.querySelector('.matrix-rain');
        if (!container) return;

        const characters = '01';
        const columns = Math.floor(container.offsetWidth / 20);
        
        for (let i = 0; i < columns; i++) {
            this.createMatrixColumn(container, i, characters);
        }
    }

    createMatrixColumn(container, index, characters) {
        const column = document.createElement('div');
        column.style.cssText = `
            position: absolute;
            left: ${index * 20}px;
            top: 0;
            color: var(--secondary-color);
            font-family: monospace;
            font-size: 14px;
            opacity: 0.7;
            animation: matrix-fall ${5 + Math.random() * 5}s linear infinite;
            animation-delay: ${Math.random() * 5}s;
        `;

        const updateColumn = () => {
            const height = Math.floor(Math.random() * 20) + 10;
            let content = '';
            for (let i = 0; i < height; i++) {
                content += characters.charAt(Math.floor(Math.random() * characters.length)) + '<br>';
            }
            column.innerHTML = content;
        };

        updateColumn();
        container.appendChild(column);

        // Update content periodically
        setInterval(updateColumn, 2000 + Math.random() * 3000);
    }

    initFloatingParticles() {
        const container = document.querySelector('.floating-particles');
        if (!container) return;

        const particleCount = 15;
        
        for (let i = 0; i < particleCount; i++) {
            this.createParticle(container);
        }
    }

    createParticle(container) {
        const particle = document.createElement('div');
        const size = Math.random() * 4 + 2;
        const animationDuration = Math.random() * 20 + 10;
        
        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: var(--secondary-color);
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            opacity: ${Math.random() * 0.5 + 0.2};
            animation: particle-float ${animationDuration}s linear infinite;
            animation-delay: ${Math.random() * 10}s;
        `;
        
        container.appendChild(particle);
    }

    initCounterAnimations() {
        const counters = document.querySelectorAll('.hero-stats .stat-number[data-target]');
        if (counters.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => observer.observe(counter));
    }

    async animateCounter(element) {
        const target = parseInt(element.dataset.target);
        const duration = parseInt(element.dataset.duration) || 2000;
        const increment = target / (duration / 16);
        
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                element.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        };
        
        requestAnimationFrame(updateCounter);
    }

    initCodeAnimation() {
        const codeLines = document.querySelectorAll('.code-content code span');
        if (codeLines.length === 0) return;

        let delay = 0;
        codeLines.forEach(line => {
            setTimeout(() => {
                line.style.opacity = '1';
                line.style.transform = 'translateX(0)';
            }, delay);
            delay += 200;
        });
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    destroy() {
        this.animations.forEach((animation, key) => {
            clearInterval(animation);
        });
        this.animations.clear();
    }
}

// ===== ENHANCED STUDENT SHOWCASE =====
class StudentShowcase {
    constructor() {
        this.currentSlide = 0;
        this.slides = [];
        this.indicators = [];
        this.autoSlideInterval = null;
        this.touchStartX = 0;
        this.touchEndX = 0;
        this.isAnimating = false;
        
        this.config = {
            autoSlideDelay: 6000,
            pauseDelay: 3000,
            animationDuration: 500
        };

        this.init();
    }

    async init() {
        try {
            await this.generateProjects();
            this.createCarousel();
            this.setupEventListeners();
            this.startAutoSlide();
            this.initStatsAnimation();
        } catch (error) {
            console.error('Student showcase initialization failed:', error);
        }
    }

    async generateProjects() {
        // Sample projects data - in a real app, this would come from an API
        this.projects = [
            {
                id: 1,
                title: "Space Adventure Game",
                student: "Amara K.",
                age: 12,
                program: "Code Explorers",
                description: "An exciting space exploration game built with Scratch featuring multiple levels and power-ups.",
                tech: ["Scratch", "Game Design"],
                image: "/images/projects/space-game.jpg",
                difficulty: "Intermediate",
                likes: 23,
                date: "2025-01-15"
            },
            {
                id: 2,
                title: "Weather Dashboard",
                student: "Sipho M.",
                age: 15,
                program: "Tech Innovators",
                description: "A responsive web dashboard showing real-time weather data with beautiful charts and animations.",
                tech: ["HTML", "CSS", "JavaScript", "API"],
                image: "/images/projects/weather-dashboard.jpg",
                difficulty: "Advanced",
                likes: 31,
                date: "2025-01-12"
            },
            {
                id: 3,
                title: "Digital Pet Care",
                student: "Zanele N.",
                age: 9,
                program: "Junior Ninjas",
                description: "A fun virtual pet game where you feed, play with, and take care of your digital companion.",
                tech: ["Scratch", "Animation"],
                image: "/images/projects/pet-care.jpg",
                difficulty: "Beginner",
                likes: 18,
                date: "2025-01-10"
            },
            {
                id: 4,
                title: "Smart Home Prototype",
                student: "Thabo L.",
                age: 16,
                program: "Tech Innovators",
                description: "A micro:bit-powered smart home system with sensors for temperature, light, and security.",
                tech: ["micro:bit", "Python", "IoT"],
                image: "/images/projects/smart-home.jpg",
                difficulty: "Advanced",
                likes: 27,
                date: "2025-01-08"
            },
            {
                id: 5,
                title: "Math Quiz Master",
                student: "Lerato P.",
                age: 11,
                program: "Code Explorers",
                description: "An interactive math quiz game with different difficulty levels and score tracking.",
                tech: ["Scratch", "Logic", "Math"],
                image: "/images/projects/math-quiz.jpg",
                difficulty: "Intermediate",
                likes: 15,
                date: "2025-01-05"
            }
        ];
    }

    createCarousel() {
        const container = document.querySelector('.carousel-container');
        if (!container) return;

        // Create carousel structure if it doesn't exist
        let track = container.querySelector('.carousel-track');
        if (!track) {
            track = document.createElement('div');
            track.className = 'carousel-track';
            track.id = 'carouselTrack';
            container.appendChild(track);
        }

        // Generate slides
        track.innerHTML = '';
        this.projects.forEach((project, index) => {
            const slide = this.createProjectSlide(project, index);
            track.appendChild(slide);
        });

        this.slides = track.querySelectorAll('.project-slide');
        this.createIndicators(container);
        this.createNavigation(container);
        this.updateSlidePosition();
    }

    createProjectSlide(project, index) {
        const slide = document.createElement('div');
        slide.className = 'project-slide';
        slide.innerHTML = `
            <div class="project-image">
                <img src="${project.image}" alt="${project.title}" loading="lazy">
                <div class="project-overlay">
                    <span class="difficulty-badge ${project.difficulty.toLowerCase()}">${project.difficulty}</span>
                </div>
            </div>
            <div class="project-content">
                <div class="student-info">
                    <h4>${project.title}</h4>
                    <p class="student-name">by ${project.student} (${project.age}) • ${project.program}</p>
                </div>
                <p class="project-description">${project.description}</p>
                <div class="project-tech">
                    ${project.tech.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                </div>
                <div class="project-stats">
                    <span class="project-likes">
                        <i class="fas fa-heart"></i> ${project.likes}
                    </span>
                    <span class="project-date">${this.formatDate(project.date)}</span>
                </div>
            </div>
        `;
        return slide;
    }

    createIndicators(container) {
        let indicatorsContainer = container.querySelector('.carousel-indicators');
        if (!indicatorsContainer) {
            indicatorsContainer = document.createElement('div');
            indicatorsContainer.className = 'carousel-indicators';
            container.appendChild(indicatorsContainer);
        }

        indicatorsContainer.innerHTML = '';
        this.projects.forEach((_, index) => {
            const indicator = document.createElement('button');
            indicator.className = 'indicator';
            indicator.setAttribute('aria-label', `Go to slide ${index + 1}`);
            indicator.addEventListener('click', () => this.goToSlide(index));
            indicatorsContainer.appendChild(indicator);
        });

        this.indicators = indicatorsContainer.querySelectorAll('.indicator');
    }

    createNavigation(container) {
        let navContainer = container.querySelector('.carousel-nav');
        if (!navContainer) {
            navContainer = document.createElement('div');
            navContainer.className = 'carousel-nav';
            container.appendChild(navContainer);
        }

        navContainer.innerHTML = `
            <button class="nav-btn prev-btn" id="prevBtn" aria-label="Previous project">
                <i class="fas fa-chevron-left"></i>
            </button>
            <button class="nav-btn next-btn" id="nextBtn" aria-label="Next project">
                <i class="fas fa-chevron-right"></i>
            </button>
        `;
    }

    setupEventListeners() {
        const container = document.querySelector('.carousel-container');
        if (!container) return;

        // Navigation buttons
        const nextBtn = container.querySelector('#nextBtn');
        const prevBtn = container.querySelector('#prevBtn');

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                this.nextSlide();
                this.pauseAutoSlide();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                this.prevSlide();
                this.pauseAutoSlide();
            });
        }

        // Touch/swipe support
        const track = container.querySelector('.carousel-track');
        if (track) {
            track.addEventListener('touchstart', (e) => {
                this.touchStartX = e.changedTouches[0].screenX;
            }, { passive: true });

            track.addEventListener('touchend', (e) => {
                this.touchEndX = e.changedTouches[0].screenX;
                this.handleSwipe();
            }, { passive: true });
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!this.isCarouselInView()) return;

            if (e.key === 'ArrowRight') {
                this.nextSlide();
                this.pauseAutoSlide();
            } else if (e.key === 'ArrowLeft') {
                this.prevSlide();
                this.pauseAutoSlide();
            }
        });

        // Pause on hover
        container.addEventListener('mouseenter', () => this.stopAutoSlide());
        container.addEventListener('mouseleave', () => this.startAutoSlide());

        // Handle visibility change
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.stopAutoSlide();
            } else {
                this.startAutoSlide();
            }
        });
    }

    handleSwipe() {
        const swipeThreshold = 50;
        const diff = this.touchStartX - this.touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                this.nextSlide();
            } else {
                this.prevSlide();
            }
            this.pauseAutoSlide();
        }
    }

    goToSlide(slideIndex) {
        if (this.isAnimating || slideIndex === this.currentSlide) return;

        this.isAnimating = true;
        
        if (slideIndex < 0) {
            this.currentSlide = this.slides.length - 1;
        } else if (slideIndex >= this.slides.length) {
            this.currentSlide = 0;
        } else {
            this.currentSlide = slideIndex;
        }

        this.updateSlidePosition();
        
        setTimeout(() => {
            this.isAnimating = false;
        }, this.config.animationDuration);
    }

    nextSlide() {
        this.goToSlide(this.currentSlide + 1);
    }

    prevSlide() {
        this.goToSlide(this.currentSlide - 1);
    }

    updateSlidePosition() {
        if (this.slides.length === 0) return;

        this.slides.forEach((slide, index) => {
            slide.classList.remove('active', 'prev', 'next');
            
            if (index === this.currentSlide) {
                slide.classList.add('active');
            } else if (index < this.currentSlide) {
                slide.classList.add('prev');
            } else {
                slide.classList.add('next');
            }
        });

        // Update indicators
        this.indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentSlide);
        });

        // Announce to screen readers
        this.announceSlideChange();
    }

    announceSlideChange() {
        const currentProject = this.projects[this.currentSlide];
        if (currentProject) {
            const announcement = `Now showing ${currentProject.title} by ${currentProject.student}`;
            this.announceToScreenReader(announcement);
        }
    }

    announceToScreenReader(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = message;
        
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }

    startAutoSlide() {
        this.stopAutoSlide();
        this.autoSlideInterval = setInterval(() => {
            this.nextSlide();
        }, this.config.autoSlideDelay);
    }

    stopAutoSlide() {
        if (this.autoSlideInterval) {
            clearInterval(this.autoSlideInterval);
            this.autoSlideInterval = null;
        }
    }

    pauseAutoSlide() {
        this.stopAutoSlide();
        setTimeout(() => {
            this.startAutoSlide();
        }, this.config.pauseDelay);
    }

    isCarouselInView() {
        const container = document.querySelector('.carousel-container');
        if (!container) return false;

        const rect = container.getBoundingClientRect();
        return rect.top < window.innerHeight && rect.bottom > 0;
    }

    initStatsAnimation() {
        const statsSection = document.querySelector('.showcase-stats');
        if (!statsSection) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateStats();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(statsSection);
    }

    animateStats() {
        const statNumbers = document.querySelectorAll('.showcase-stats .stat-number[data-target]');
        
        statNumbers.forEach((stat, index) => {
            setTimeout(() => {
                const target = parseInt(stat.dataset.target);
                this.animateNumber(stat, target);
            }, index * 200);
        });
    }

    async animateNumber(element, target) {
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;

        const updateNumber = () => {
            current += increment;
            if (current < target) {
                element.textContent = Math.floor(current);
                requestAnimationFrame(updateNumber);
            } else {
                element.textContent = target;
            }
        };

        requestAnimationFrame(updateNumber);
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-ZA', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    }

    destroy() {
        this.stopAutoSlide();
    }
}

// ===== ENHANCED LIVE STATISTICS =====
class LiveStatistics {
    constructor() {
        this.statsAnimated = false;
        this.refreshInterval = null;
        this.config = {
            refreshDelay: 30000,
            animationDuration: 2000,
            staggerDelay: 200
        };
        
        this.init();
    }

    init() {
        this.setupObserver();
        this.initActivityStatus();
        this.setupCardInteractions();
    }

    setupObserver() {
        const statsSection = document.querySelector('.statistics-section');
        if (!statsSection) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.statsAnimated) {
                    this.animateAllStats();
                    this.startRefreshCycle();
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: '0px 0px -100px 0px'
        });

        observer.observe(statsSection);
    }

    async animateAllStats() {
        this.statsAnimated = true;
        
        const statNumbers = document.querySelectorAll('.statistics-section .stat-number[data-target]');
        
        for (let i = 0; i < statNumbers.length; i++) {
            const stat = statNumbers[i];
            const target = parseInt(stat.dataset.target);
            const suffix = stat.dataset.suffix || '';
            
            setTimeout(() => {
                this.animateStatCounter(stat, target, suffix);
            }, i * this.config.staggerDelay);
        }

        // Animate highlights after stats
        setTimeout(() => {
            this.animateHighlights();
        }, statNumbers.length * this.config.staggerDelay + 1000);
    }

    animateStatCounter(element, target, suffix) {
        const statCard = element.closest('.stat-card');
        if (!statCard) return;

        // Add visual feedback
        element.classList.add('counting');
        statCard.classList.add('highlight');

        const duration = this.config.animationDuration;
        const increment = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                element.textContent = Math.floor(current) + suffix;
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target + suffix;
                element.classList.remove('counting');
                statCard.classList.add('animated');
                
                // Add completion effect
                setTimeout(() => {
                    statCard.classList.remove('highlight');
                }, 500);
            }
        };

        requestAnimationFrame(updateCounter);
    }

    animateHighlights() {
        const highlights = document.querySelectorAll('.highlight-item');
        
        highlights.forEach((highlight, index) => {
            setTimeout(() => {
                highlight.style.opacity = '0';
                highlight.style.transform = 'translateX(-20px)';
                highlight.style.transition = 'all 0.6s ease';
                
                requestAnimationFrame(() => {
                    highlight.style.opacity = '1';
                    highlight.style.transform = 'translateX(0)';
                });
            }, index * 300);
        });
    }

    initActivityStatus() {
        const statusElement = document.getElementById('currentActivity');
        if (!statusElement) return;

        const activities = [
            "47 students actively coding this week",
            "12 new projects started today",
            "3 students just completed their first game",
            "New web development class starting Monday",
            "5 micro:bit projects in progress",
            "Python workshop scheduled for tomorrow",
            "Scratch competition entries being reviewed",
            "2 students advanced to intermediate level"
        ];

        let currentIndex = 0;

        const rotateStatus = () => {
            statusElement.style.opacity = '0';
            
            setTimeout(() => {
                statusElement.textContent = activities[currentIndex];
                statusElement.style.opacity = '1';
                currentIndex = (currentIndex + 1) % activities.length;
            }, 300);
        };

        // Initial rotation
        setTimeout(rotateStatus, 2000);
        
        // Continue rotating every 4 seconds
        setInterval(rotateStatus, 4000);
    }

    setupCardInteractions() {
        const statCards = document.querySelectorAll('.stat-card');
        
        statCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                const pulseRing = card.querySelector('.pulse-ring');
                if (pulseRing) {
                    pulseRing.style.animation = 'pulse 1s ease-in-out infinite';
                }
            });

            card.addEventListener('mouseleave', () => {
                const pulseRing = card.querySelector('.pulse-ring');
                if (pulseRing) {
                    pulseRing.style.animation = '';
                }
            });

            // Add click interaction for mobile
            card.addEventListener('click', () => {
                card.classList.add('clicked');
                setTimeout(() => {
                    card.classList.remove('clicked');
                }, 200);
            });
        });
    }

    startRefreshCycle() {
        this.refreshInterval = setInterval(() => {
            this.refreshStats();
        }, this.config.refreshDelay);
    }

    refreshStats() {
        const statNumbers = document.querySelectorAll('.statistics-section .stat-number[data-target]');
        
        statNumbers.forEach(stat => {
            const currentValue = parseInt(stat.textContent.replace(/\D/g, ''));
            const baseTarget = parseInt(stat.dataset.target);
            const suffix = stat.dataset.suffix || '';
            
            // Add small random variations to simulate live updates
            const variation = Math.floor(Math.random() * 5) - 2; // -2 to +2
            const newTarget = Math.max(baseTarget + variation, 0);
            
            if (Math.abs(newTarget - currentValue) > 1) {
                this.quickUpdateStat(stat, currentValue, newTarget, suffix);
            }
        });
    }

    quickUpdateStat(element, current, target, suffix) {
        const increment = target > current ? 1 : -1;
        
        const quickUpdate = () => {
            if (Math.abs(current - target) > 0) {
                current += increment;
                element.textContent = current + suffix;
                setTimeout(quickUpdate, 50);
            }
        };
        
        quickUpdate();
    }

    destroy() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
        }
    }
}

// ===== ENHANCED PROGRAM CARDS =====
class ProgramCards {
    constructor() {
        this.init();
    }

    init() {
        this.enhanceCardInteractions();
        this.setupAccessibility();
        this.initializeCards();
    }

    enhanceCardInteractions() {
        const programCards = document.querySelectorAll('.program-card');
        
        programCards.forEach((card, index) => {
            // Enhanced hover effects
            card.addEventListener('mouseenter', () => {
                this.handleCardHover(card);
            });

            card.addEventListener('mouseleave', () => {
                this.handleCardLeave(card);
            });

            // Mobile tap handling
            card.addEventListener('click', (e) => {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    this.handleMobileCardTap(card);
                }
            });

            // Keyboard navigation
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.handleCardActivation(card);
                }
            });

            // Add tabindex for keyboard navigation
            card.setAttribute('tabindex', '0');
            card.setAttribute('role', 'button');
            
            const programType = card.dataset.program || `program-${index + 1}`;
            card.setAttribute('aria-label', `Learn more about ${programType} program`);
        });
    }

    handleCardHover(card) {
        // Smooth scroll to ensure card is visible
        setTimeout(() => {
            this.ensureCardVisible(card);
        }, 300);

        // Animate progress bars
        const progressFill = card.querySelector('.progress-fill');
        if (progressFill) {
            const targetWidth = progressFill.style.width || '50%';
            progressFill.style.width = '0%';
            setTimeout(() => {
                progressFill.style.width = targetWidth;
            }, 100);
        }

        // Add glow effect
        card.style.boxShadow = '0 20px 40px rgba(0, 217, 255, 0.3)';
    }

    handleCardLeave(card) {
        card.style.boxShadow = '';
    }

    handleMobileCardTap(card) {
        card.classList.toggle('flipped');
        this.ensureCardVisible(card);
        
        // Announce state change to screen readers
        const isFlipped = card.classList.contains('flipped');
        const announcement = isFlipped ? 'Card expanded' : 'Card collapsed';
        this.announceToScreenReader(announcement);
    }

    handleCardActivation(card) {
        if (window.innerWidth <= 768) {
            this.handleMobileCardTap(card);
        } else {
            // For desktop, maybe navigate to programs page
            const programType = card.dataset.program;
            if (programType) {
                window.location.href = `programs.html#${programType}`;
            }
        }
    }

    ensureCardVisible(card) {
        const navbar = document.querySelector('.navbar');
        const navbarHeight = navbar ? navbar.offsetHeight : 80;
        const cardRect = card.getBoundingClientRect();
        const cardTop = cardRect.top + window.pageYOffset;
        
        const scrollTo = cardTop - navbarHeight - 20;
        const viewportHeight = window.innerHeight;
        const cardBottom = cardRect.bottom;
        
        if (cardBottom > viewportHeight - 50) {
            window.scrollTo({
                top: scrollTo,
                behavior: 'smooth'
            });
        }
    }

    setupAccessibility() {
        // Add screen reader only text for better descriptions
        const style = document.createElement('style');
        style.textContent = `
            .sr-only {
                position: absolute;
                width: 1px;
                height: 1px;
                padding: 0;
                margin: -1px;
                overflow: hidden;
                clip: rect(0, 0, 0, 0);
                white-space: nowrap;
                border: 0;
            }
            
            @media (max-width: 768px) {
                .program-card.flipped .program-card-inner {
                    transform: rotateY(180deg);
                }
                
                .flip-indicator {
                    animation: tapPulse 2s ease-in-out infinite;
                }
                
                @keyframes tapPulse {
                    0%, 100% { transform: scale(1); opacity: 0.8; }
                    50% { transform: scale(1.1); opacity: 1; }
                }
            }
        `;
        document.head.appendChild(style);
    }

    initializeCards() {
        // Set initial states and add any missing elements
        const programCards = document.querySelectorAll('.program-card');
        
        programCards.forEach(card => {
            // Ensure flip indicator exists for mobile
            if (!card.querySelector('.flip-indicator') && window.innerWidth <= 768) {
                const flipIndicator = document.createElement('div');
                flipIndicator.className = 'flip-indicator';
                flipIndicator.innerHTML = '<span>Tap to explore</span>';
                
                const cardFront = card.querySelector('.program-card-front');
                if (cardFront) {
                    cardFront.appendChild(flipIndicator);
                }
            }
        });
    }

    announceToScreenReader(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.className = 'sr-only';
        announcement.textContent = message;
        
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }
}

// ===== ENHANCED CONTACT FORM =====
class ContactForm {
    constructor() {
        this.form = document.querySelector('#contactForm');
        this.init();
    }

    init() {
        if (!this.form) return;

        this.setupFormValidation();
        this.setupFormSubmission();
        this.setupProgressiveEnhancement();
    }

    setupFormValidation() {
        const fields = this.form.querySelectorAll('input, select, textarea');
        
        fields.forEach(field => {
            // Real-time validation
            field.addEventListener('blur', () => this.validateField(field));
            field.addEventListener('input', () => this.clearFieldError(field));
        });
    }

    setupFormSubmission() {
        this.form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            if (this.validateForm()) {
                await this.submitForm();
            }
        });
    }

    validateForm() {
        const requiredFields = this.form.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        return isValid;
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let message = '';

        // Required validation
        if (field.hasAttribute('required') && !value) {
            message = 'This field is required';
            isValid = false;
        }
        // Email validation
        else if (field.type === 'email' && value && !this.validateEmail(value)) {
            message = 'Please enter a valid email address';
            isValid = false;
        }
        // Phone validation (if it's a phone field)
        else if (field.type === 'tel' && value && !this.validatePhoneNumber(value)) {
            message = 'Please enter a valid phone number';
            isValid = false;
        }

        if (isValid) {
            this.clearFieldError(field);
        } else {
            this.showFieldError(field, message);
        }

        return isValid;
    }

    async submitForm() {
        const submitBtn = this.form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        try {
            // Show loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            
            // Simulate API call (replace with actual submission)
            await this.delay(2000);
            
            // Show success message
            this.showSuccessMessage();
            this.form.reset();
            
        } catch (error) {
            console.error('Form submission error:', error);
            this.showErrorMessage('Sorry, there was an error sending your message. Please try again.');
        } finally {
            // Restore button
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }
    }

    setupProgressiveEnhancement() {
        // Add helpful features for better UX
        this.setupAutocomplete();
        this.setupCharacterCounts();
        this.setupProgramRecommendation();
    }

    setupAutocomplete() {
        // Add autocomplete attributes for better UX
        const emailField = this.form.querySelector('input[type="email"]');
        if (emailField) {
            emailField.setAttribute('autocomplete', 'email');
        }

        const nameField = this.form.querySelector('input[name*="name"]');
        if (nameField) {
            nameField.setAttribute('autocomplete', 'name');
        }
    }

    setupCharacterCounts() {
        const textareas = this.form.querySelectorAll('textarea');
        
        textareas.forEach(textarea => {
            const maxLength = 500; // Default max length
            textarea.setAttribute('maxlength', maxLength);
            
            const counter = document.createElement('div');
            counter.className = 'character-counter';
            counter.style.cssText = `
                font-size: 0.85rem;
                color: var(--text-color);
                opacity: 0.7;
                text-align: right;
                margin-top: 0.25rem;
            `;
            
            const updateCounter = () => {
                const remaining = maxLength - textarea.value.length;
                counter.textContent = `${remaining} characters remaining`;
                counter.style.color = remaining < 50 ? '#ef4444' : 'var(--text-color)';
            };
            
            textarea.addEventListener('input', updateCounter);
            textarea.parentNode.appendChild(counter);
            updateCounter();
        });
    }

    setupProgramRecommendation() {
        const ageField = this.form.querySelector('select[name*="age"]');
        const programField = this.form.querySelector('select[name*="program"]');
        
        if (ageField && programField) {
            ageField.addEventListener('change', () => {
                const age = parseInt(ageField.value);
                let recommendedProgram = '';
                
                if (age >= 7 && age <= 10) {
                    recommendedProgram = 'junior';
                } else if (age >= 11 && age <= 13) {
                    recommendedProgram = 'intermediate';
                } else if (age >= 14 && age <= 17) {
                    recommendedProgram = 'senior';
                }
                
                if (recommendedProgram) {
                    programField.value = recommendedProgram;
                    this.showRecommendationMessage(age, recommendedProgram);
                }
            });
        }
    }

    showRecommendationMessage(age, program) {
        const programNames = {
            junior: 'Junior Ninjas',
            intermediate: 'Code Explorers',
            senior: 'Tech Innovators'
        };
        
        const message = `Based on age ${age}, we recommend ${programNames[program]}!`;
        
        const notification = document.createElement('div');
        notification.className = 'recommendation-notification';
        notification.style.cssText = `
            background: rgba(0, 217, 255, 0.1);
            border: 1px solid var(--secondary-color);
            color: var(--secondary-color);
            padding: 0.75rem;
            border-radius: 8px;
            margin-top: 0.5rem;
            font-size: 0.9rem;
        `;
        notification.textContent = message;
        
        // Remove existing notifications
        const existing = this.form.querySelector('.recommendation-notification');
        if (existing) existing.remove();
        
        // Add new notification
        const programField = this.form.querySelector('select[name*="program"]');
        programField.parentNode.appendChild(notification);
        
        // Remove after 5 seconds
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }

    showSuccessMessage() {
        const message = document.createElement('div');
        message.className = 'form-success-message';
        message.style.cssText = `
            background: rgba(34, 197, 94, 0.1);
            border: 2px solid #22c55e;
            color: #22c55e;
            padding: 1rem;
            border-radius: 10px;
            margin-bottom: 1rem;
            text-align: center;
        `;
        message.innerHTML = `
            <i class="fas fa-check-circle"></i>
            Thank you for your message! We'll get back to you within 24 hours.
        `;
        
        this.