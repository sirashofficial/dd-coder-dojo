/**
 * Code with Ubuntu - Enhanced Home Page Functionality
 * Clean, properly structured JavaScript for the home page
 */

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

    @keyframes matrix-fall {
        0% { transform: translateY(-100%); opacity: 1; }
        100% { transform: translateY(100vh); opacity: 0; }
    }

    @keyframes particle-float {
        0%, 100% { transform: translate(0, 0) rotate(0deg); }
        25% { transform: translate(20px, -20px) rotate(90deg); }
        50% { transform: translate(-10px, -40px) rotate(180deg); }
        75% { transform: translate(-30px, -20px) rotate(270deg); }
    }

    @keyframes float {
        0%, 100% { transform: translate(0, 0) rotate(0deg); }
        33% { transform: translate(10px, -10px) rotate(120deg); }
        66% { transform: translate(-5px, -20px) rotate(240deg); }
    }

    @keyframes blink {
        0%, 50% { border-right-color: var(--secondary-color); }
        51%, 100% { border-right-color: transparent; }
    }

    /* Responsive enhancements */
    @media (max-width: 768px) {
        .hero-stats {
            gap: 1rem;
        }
    }
`;

document.head.appendChild(enhancedStyles);

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
        const typingElements = document.querySelectorAll('.typing-animation');
        
        for (const typingElement of typingElements) {
            const text = typingElement.dataset.text || typingElement.textContent;
            const speed = parseInt(typingElement.dataset.speed) || 150;
            
            typingElement.textContent = '';
            
            for (let i = 0; i < text.length; i++) {
                await this.delay(speed);
                typingElement.textContent += text[i];
            }
        }
    }

    initRotatingWords() {
        const rotatingElements = document.querySelectorAll('.rotating-words');
        
        rotatingElements.forEach(element => {
            const words = element.dataset.words ? element.dataset.words.split(',') : [];
            if (words.length === 0) return;
            
            let currentIndex = 0;
            
            const rotateWords = () => {
                element.style.opacity = '0';
                
                setTimeout(() => {
                    element.textContent = words[currentIndex];
                    element.style.opacity = '1';
                    currentIndex = (currentIndex + 1) % words.length;
                }, 300);
            };
            
            // Start with first word
            element.textContent = words[0];
            
            // Rotate every 3 seconds
            const intervalId = setInterval(rotateWords, 3000);
            this.animations.set(`rotating-${Date.now()}`, intervalId);
        });
    }

    initMatrixRain() {
        const matrixContainers = document.querySelectorAll('.matrix-rain');
        
        matrixContainers.forEach(container => {
            const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*(){}[]<>';
            const columns = Math.floor(container.offsetWidth / 20);
            
            container.style.position = 'relative';
            container.style.overflow = 'hidden';
            
            for (let i = 0; i < columns; i++) {
                this.createMatrixColumn(container, i, characters);
            }
        });
    }

    createMatrixColumn(container, index, characters) {
        const column = document.createElement('div');
        column.style.cssText = `
            position: absolute;
            left: ${index * 20}px;
            top: 0;
            width: 20px;
            height: 100%;
            color: var(--secondary-color);
            font-family: monospace;
            font-size: 14px;
            overflow: hidden;
            animation: matrix-fall ${Math.random() * 3 + 2}s linear infinite;
        `;
        
        const updateColumn = () => {
            const char = characters[Math.floor(Math.random() * characters.length)];
            column.textContent = char;
        };
        
        updateColumn();
        const intervalId = setInterval(updateColumn, Math.random() * 200 + 100);
        this.animations.set(`matrix-${index}`, intervalId);
        
        container.appendChild(column);
    }

    initFloatingParticles() {
        const particleContainers = document.querySelectorAll('.floating-particles');
        
        particleContainers.forEach(container => {
            const particleCount = parseInt(container.dataset.count) || 20;
            
            for (let i = 0; i < particleCount; i++) {
                this.createParticle(container);
            }
        });
    }

    createParticle(container) {
        const particle = document.createElement('div');
        const size = Math.random() * 4 + 2;
        
        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: var(--secondary-color);
            border-radius: 50%;
            opacity: ${Math.random() * 0.5 + 0.3};
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: float ${Math.random() * 10 + 10}s linear infinite;
        `;
        
        container.appendChild(particle);
    }

    initCounterAnimations() {
        const counters = document.querySelectorAll('.counter-animation');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        });
        
        counters.forEach(counter => observer.observe(counter));
    }

    async animateCounter(element) {
        const target = parseInt(element.dataset.target) || 0;
        const duration = parseInt(element.dataset.duration) || 2000;
        const steps = 60;
        const increment = target / steps;
        
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            if (current >= target) {
                element.textContent = target;
                return;
            }
            
            element.textContent = Math.floor(current);
            requestAnimationFrame(updateCounter);
        };
        
        updateCounter();
    }

    initCodeAnimation() {
        const codeElements = document.querySelectorAll('.code-animation');
        
        codeElements.forEach(element => {
            const lines = element.innerHTML.split('\n');
            element.innerHTML = '';
            
            lines.forEach((line, index) => {
                const lineElement = document.createElement('div');
                lineElement.textContent = line;
                lineElement.style.opacity = '0';
                lineElement.style.transform = 'translateX(-20px)';
                lineElement.style.transition = `all 0.5s ease ${index * 0.1}s`;
                
                element.appendChild(lineElement);
                
                setTimeout(() => {
                    lineElement.style.opacity = '1';
                    lineElement.style.transform = 'translateX(0)';
                }, index * 100);
            });
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
