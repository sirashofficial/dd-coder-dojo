// ===== HOME PAGE MAIN CLASS =====
class HomePage {
    constructor() {
        this.components = new Map();
        this.init();
    }

    async init() {
        try {
            console.log('🚀 Initializing Home Page...');
            
            // Initialize core components
            await this.initializeComponents();
            
            // Setup global interactions
            this.setupGlobalInteractions();
            
            console.log('✅ Home page initialized successfully');
            
        } catch (error) {
            console.error('❌ Home page initialization failed:', error);
        }
    }

    async initializeComponents() {
        // Initialize Hero Animations
        if (document.querySelector('.hero-section')) {
            this.components.set('hero', new HeroAnimations());
        }

        // Initialize Student Showcase
        if (document.querySelector('.student-showcase')) {
            this.components.set('showcase', new StudentShowcase());
        }

        // Initialize Live Statistics
        if (document.querySelector('.statistics-section')) {
            this.components.set('stats', new LiveStatistics());
        }

        // Initialize Program Cards
        if (document.querySelector('.programs-section')) {
            this.components.set('programs', new ProgramCards());
        }

        // Initialize Contact Form
        if (document.querySelector('#contactForm')) {
            this.components.set('contact', new ContactForm());
        }
    }

    setupGlobalInteractions() {
        // Add keyboard navigation support
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });

        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    destroy() {
        this.components.forEach((component, key) => {
            if (component && typeof component.destroy === 'function') {
                component.destroy();
            }
        });
        this.components.clear();
    }
}

// ===== ENHANCED HERO ANIMATIONS CLASS =====
class HeroAnimations {
    constructor() {
        this.animations = new Map();
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
        
        // Create navigation controls
        this.createNavigationControls(container);
        this.createIndicators(container);
        
        // Set initial slide
        this.updateSlidePosition();
    }

    createProjectSlide(project, index) {
        const slide = document.createElement('div');
        slide.className = 'project-slide';
        slide.setAttribute('role', 'tabpanel');
        slide.setAttribute('aria-label', `Project ${index + 1}: ${project.title}`);
        
        slide.innerHTML = `
            <div class="project-content">
                <div class="project-header">
                    <h3 class="project-title">${project.title}</h3>
                    <div class="project-meta">
                        <span class="student-name">by ${project.student}</span>
                        <span class="student-age">Age ${project.age}</span>
                    </div>
                </div>
                
                <div class="project-body">
                    <p class="project-description">${project.description}</p>
                    
                    <div class="project-details">
                        <div class="difficulty-badge ${project.difficulty.toLowerCase()}">
                            ${project.difficulty}
                        </div>
                        
                        <div class="program-badge">
                            ${project.program}
                        </div>
                    </div>
                    
                    <div class="tech-tags">
                        ${project.tech.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                    </div>
                    
                    <div class="project-stats">
                        <span class="likes">
                            <i class="fas fa-heart"></i>
                            ${project.likes}
                        </span>
                        <span class="date">
                            <i class="fas fa-calendar"></i>
                            ${this.formatDate(project.date)}
                        </span>
                    </div>
                </div>
            </div>
        `;
        
        return slide;
    }

    createNavigationControls(container) {
        // Remove existing controls
        const existingControls = container.querySelectorAll('.nav-btn');
        existingControls.forEach(btn => btn.remove());
        
        const prevBtn = document.createElement('button');
        prevBtn.className = 'nav-btn nav-btn-prev';
        prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
        prevBtn.setAttribute('aria-label', 'Previous project');
        
        const nextBtn = document.createElement('button');
        nextBtn.className = 'nav-btn nav-btn-next';
        nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
        nextBtn.setAttribute('aria-label', 'Next project');
        
        container.appendChild(prevBtn);
        container.appendChild(nextBtn);
    }

    createIndicators(container) {
        // Remove existing indicators
        let indicatorContainer = container.querySelector('.carousel-indicators');
        if (indicatorContainer) {
            indicatorContainer.remove();
        }
        
        indicatorContainer = document.createElement('div');
        indicatorContainer.className = 'carousel-indicators';
        indicatorContainer.setAttribute('role', 'tablist');
        indicatorContainer.setAttribute('aria-label', 'Project navigation');
        
        this.projects.forEach((_, index) => {
            const indicator = document.createElement('button');
            indicator.className = 'indicator';
            indicator.setAttribute('role', 'tab');
            indicator.setAttribute('aria-label', `Go to project ${index + 1}`);
            indicator.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
            indicator.dataset.slide = index;
            
            indicatorContainer.appendChild(indicator);
        });
        
        container.appendChild(indicatorContainer);
        this.indicators = indicatorContainer.querySelectorAll('.indicator');
    }

    setupEventListeners() {
        const container = document.querySelector('.carousel-container');
        if (!container) return;

        // Navigation buttons
        container.addEventListener('click', (e) => {
            if (e.target.closest('.nav-btn-prev')) {
                this.prevSlide();
            } else if (e.target.closest('.nav-btn-next')) {
                this.nextSlide();
            } else if (e.target.closest('.indicator')) {
                const slideIndex = parseInt(e.target.dataset.slide);
                this.goToSlide(slideIndex);
            }
        });

        // Touch/swipe support
        container.addEventListener('touchstart', (e) => {
            this.touchStartX = e.touches[0].clientX;
        });

        container.addEventListener('touchend', (e) => {
            this.touchEndX = e.changedTouches[0].clientX;
            this.handleSwipe();
        });

        // Keyboard navigation
        container.addEventListener('keydown', (e) => {
            switch (e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    this.prevSlide();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.nextSlide();
                    break;
                case 'Home':
                    e.preventDefault();
                    this.goToSlide(0);
                    break;
                case 'End':
                    e.preventDefault();
                    this.goToSlide(this.projects.length - 1);
                    break;
            }
        });

        // Pause auto-slide on hover or focus
        container.addEventListener('mouseenter', () => this.pauseAutoSlide());
        container.addEventListener('mouseleave', () => this.startAutoSlide());
        container.addEventListener('focusin', () => this.pauseAutoSlide());
        container.addEventListener('focusout', () => this.startAutoSlide());
    }

    nextSlide() {
        if (this.isAnimating) return;
        this.currentSlide = (this.currentSlide + 1) % this.projects.length;
        this.updateSlidePosition();
    }

    prevSlide() {
        if (this.isAnimating) return;
        this.currentSlide = this.currentSlide === 0 ? this.projects.length - 1 : this.currentSlide - 1;
        this.updateSlidePosition();
    }

    goToSlide(index) {
        if (this.isAnimating || index === this.currentSlide) return;
        this.currentSlide = index;
        this.updateSlidePosition();
    }

    updateSlidePosition() {
        if (!this.slides.length) return;

        this.isAnimating = true;
        
        const track = document.querySelector('.carousel-track');
        const translateX = -this.currentSlide * 100;
        
        track.style.transform = `translateX(${translateX}%)`;
        
        // Update indicators
        this.indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentSlide);
            indicator.setAttribute('aria-selected', index === this.currentSlide ? 'true' : 'false');
        });

        // Update slides active state
        this.slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === this.currentSlide);
        });

        // Announce slide change for screen readers
        this.announceSlideChange();

        // Reset animation flag
        setTimeout(() => {
            this.isAnimating = false;
        }, this.config.animationDuration);
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
        }
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
            month: 'short',
            day: 'numeric'
        });
    }

    destroy() {
        this.stopAutoSlide();
    }
}

// ===== LIVE STATISTICS CLASS =====
class LiveStatistics {
    constructor() {
        this.stats = [
            { element: '.students-count', target: 1200, suffix: '+', duration: 2000 },
            { element: '.projects-count', target: 350, suffix: '+', duration: 2500 },
            { element: '.programs-count', target: 12, suffix: '', duration: 1500 },
            { element: '.success-rate', target: 95, suffix: '%', duration: 2200 }
        ];
        
        this.init();
    }

    init() {
        this.setupStatsObserver();
    }

    setupStatsObserver() {
        const statsSection = document.querySelector('.statistics-section');
        if (!statsSection) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateAllStats();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        observer.observe(statsSection);
    }

    animateAllStats() {
        this.stats.forEach((stat, index) => {
            setTimeout(() => {
                this.animateStatistic(stat);
            }, index * 200);
        });
    }

    animateStatistic(stat) {
        const element = document.querySelector(stat.element);
        if (!element) return;

        const startTime = performance.now();
        const startValue = 0;
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / stat.duration, 1);
            
            const currentValue = Math.floor(startValue + (stat.target * this.easeOutCubic(progress)));
            element.textContent = currentValue + stat.suffix;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                element.textContent = stat.target + stat.suffix;
                element.closest('.stat-card')?.classList.add('animated');
            }
        };
        
        requestAnimationFrame(animate);
    }

    easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }
}

// ===== PROGRAM CARDS CLASS =====
class ProgramCards {
    constructor() {
        this.cards = [];
        this.init();
    }

    init() {
        this.setupCards();
        this.setupIntersectionObserver();
    }

    setupCards() {
        const programCards = document.querySelectorAll('.program-card');
        
        programCards.forEach((card, index) => {
            this.cards.push({
                element: card,
                index: index,
                isFlipped: false
            });
            
            // Add click handler for flip effect
            card.addEventListener('click', () => this.flipCard(card));
            
            // Add keyboard support
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.flipCard(card);
                }
            });
        });
    }

    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('section-in-view');
                }
            });
        }, { threshold: 0.2 });

        this.cards.forEach(card => {
            observer.observe(card.element);
        });
    }

    flipCard(cardElement) {
        const cardData = this.cards.find(card => card.element === cardElement);
        if (!cardData) return;

        cardData.isFlipped = !cardData.isFlipped;
        cardElement.classList.toggle('flipped', cardData.isFlipped);
        
        // Update aria-expanded for accessibility
        const button = cardElement.querySelector('.flip-btn');
        if (button) {
            button.setAttribute('aria-expanded', cardData.isFlipped.toString());
        }
    }
}

// ===== CONTACT FORM CLASS =====
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
            animation: slide-in 0.3s ease-out;
        `;
        notification.textContent = message;
        
        // Remove any existing recommendation
        const existing = this.form.querySelector('.recommendation-notification');
        if (existing) existing.remove();
        
        // Add after the program field
        programField.parentNode.appendChild(notification);
        
        // Auto-remove after 5 seconds
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
        
        this.form.insertBefore(message, this.form.firstChild);
        
        // Auto-remove after 8 seconds
        setTimeout(() => {
            if (message.parentNode) {
                message.remove();
            }
        }, 8000);
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
        
        // Auto-remove after 6 seconds
        setTimeout(() => {
            if (message.parentNode) {
                message.remove();
            }
        }, 6000);
    }

    showFieldError(field, message) {
        // Clear any existing error
        this.clearFieldError(field);
        
        // Add error styling
        field.style.borderColor = '#ef4444';
        field.style.background = 'rgba(239, 68, 68, 0.05)';
        field.setAttribute('aria-invalid', 'true');
        
        // Create error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.style.cssText = `
            color: #ef4444;
            font-size: 0.85rem;
            margin-top: 0.25rem;
        `;
        errorDiv.textContent = message;
        
        // Link error to field for accessibility
        const errorId = `error-${field.name || field.id || Math.random().toString(36).substr(2, 9)}`;
        errorDiv.id = errorId;
        field.setAttribute('aria-describedby', errorId);
        
        // Insert error message
        field.parentNode.appendChild(errorDiv);
    }

    clearFieldError(field) {
        // Remove error styling
        field.style.borderColor = '';
        field.style.background = '';
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

// ===== ADD ENHANCED CSS STYLES =====
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

    /* Screen reader only text */
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

document.head.appendChild(enhancedStyles);

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
