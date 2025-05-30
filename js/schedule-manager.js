// ===== ENHANCED WEEKLY SCHEDULE MANAGER =====
class WeeklyScheduleManager {
    constructor() {
        this.init();
    }

    init() {
        this.populateWeekDates();
        this.addScheduleInteractions();
        this.setupResponsiveScrolling();
    }

    populateWeekDates() {
        const today = new Date();
        const currentWeek = this.getCurrentWeek(today);
        
        // Populate current week date
        const currentWeekElement = document.getElementById('currentWeekDate');
        if (currentWeekElement) {
            const startOfWeek = currentWeek[0];
            const endOfWeek = currentWeek[6];
            const options = { month: 'short', day: 'numeric' };
            const startStr = startOfWeek.toLocaleDateString('en-US', options);
            const endStr = endOfWeek.toLocaleDateString('en-US', options);
            currentWeekElement.textContent = `${startStr} - ${endStr}`;
        }

        // Populate individual day dates
        const dayIds = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
        const dayMapping = {
            monday: 1,
            tuesday: 2, 
            wednesday: 3,
            thursday: 4,
            friday: 5
        };

        dayIds.forEach(dayId => {
            const dateElement = document.getElementById(`${dayId}Date`);
            if (dateElement) {
                const dayIndex = dayMapping[dayId];
                const date = currentWeek[dayIndex];
                const options = { month: 'short', day: 'numeric' };
                dateElement.textContent = date.toLocaleDateString('en-US', options);
            }
        });

        // Add current day highlighting
        this.highlightCurrentDay(today);
    }

    getCurrentWeek(date) {
        const week = [];
        const startOfWeek = new Date(date);
        const day = startOfWeek.getDay();
        const diff = startOfWeek.getDate() - day; // Adjust to start on Sunday
        startOfWeek.setDate(diff);
        
        for (let i = 0; i < 7; i++) {
            const weekDay = new Date(startOfWeek);
            weekDay.setDate(startOfWeek.getDate() + i);
            week.push(weekDay);
        }
        
        return week;
    }

    highlightCurrentDay(today) {
        const currentDayName = today.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
        const dayCard = document.querySelector(`.schedule-day-card.${currentDayName}`);
        
        if (dayCard) {
            dayCard.classList.add('current-day');
            
            // Add a subtle pulse animation for current day
            const style = document.createElement('style');
            style.textContent = `
                .schedule-day-card.current-day {
                    border-color: var(--accent-color) !important;
                    animation: currentDayPulse 2s ease-in-out infinite;
                }
                
                .schedule-day-card.current-day::after {
                    content: 'Today';
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    background: var(--accent-color);
                    color: white;
                    padding: 0.25rem 0.5rem;
                    border-radius: 15px;
                    font-size: 0.7rem;
                    font-weight: 600;
                    z-index: 3;
                }
                
                @keyframes currentDayPulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.02); }
                }
            `;
            document.head.appendChild(style);
        }
    }

    addScheduleInteractions() {
        const scheduleCards = document.querySelectorAll('.schedule-day-card');
        
        scheduleCards.forEach(card => {
            // Add hover interactions
            card.addEventListener('mouseenter', () => {
                this.showClassDetails(card);
            });
            
            card.addEventListener('mouseleave', () => {
                this.hideClassDetails(card);
            });
            
            // Add click interactions for mobile
            card.addEventListener('click', () => {
                this.toggleClassDetails(card);
            });
        });
    }

    showClassDetails(card) {
        const programInfo = card.querySelector('.program-info');
        if (programInfo && !card.querySelector('.additional-info')) {
            const additionalInfo = document.createElement('div');
            additionalInfo.className = 'additional-info';
            additionalInfo.innerHTML = `
                <div class="class-size">
                    <i class="fas fa-users"></i>
                    <span>Max 12 students</span>
                </div>
                <div class="registration-status">
                    <i class="fas fa-check-circle"></i>
                    <span>Open for registration</span>
                </div>
            `;
            programInfo.appendChild(additionalInfo);
            
            // Animate in
            setTimeout(() => {
                additionalInfo.style.opacity = '1';
                additionalInfo.style.transform = 'translateY(0)';
            }, 100);
        }
    }

    hideClassDetails(card) {
        const additionalInfo = card.querySelector('.additional-info');
        if (additionalInfo) {
            additionalInfo.style.opacity = '0';
            additionalInfo.style.transform = 'translateY(10px)';
            setTimeout(() => {
                additionalInfo.remove();
            }, 300);
        }
    }

    toggleClassDetails(card) {
        const additionalInfo = card.querySelector('.additional-info');
        if (additionalInfo) {
            this.hideClassDetails(card);
        } else {
            this.showClassDetails(card);
        }
    }    setupResponsiveScrolling() {
        // Add horizontal scrolling hint for mobile
        if (window.innerWidth <= 768) {
            const weeklySchedule = document.querySelector('.weekly-schedule');
            if (weeklySchedule) {
                weeklySchedule.style.overflowX = 'auto';
                weeklySchedule.style.scrollSnapType = 'x mandatory';
                
                const cards = weeklySchedule.querySelectorAll('.schedule-day-card');
                cards.forEach(card => {
                    card.style.scrollSnapAlign = 'start';
                });
            }
        }
    }
}

// ===== ENHANCED HACKATHON COUNTDOWN TIMER =====
class HackathonCountdown {
    constructor() {
        this.targetDate = new Date('2025-07-26T09:00:00'); // July 26, 2025 at 9:00 AM
        this.totalDuration = this.targetDate.getTime() - new Date('2024-01-01').getTime(); // Calculate from a fixed start date
        this.particles = [];
        this.init();
    }

    init() {
        this.setupInteractiveElements();
        this.initializeParticles();
        this.updateCountdown();
        this.startTimer();
    }    setupInteractiveElements() {
        // Add click effects to countdown units
        const countdownUnits = document.querySelectorAll('.time-unit');
        countdownUnits.forEach(unit => {
            unit.addEventListener('click', () => {
                this.triggerClickEffect(unit);
            });

            unit.addEventListener('mouseenter', () => {
                this.triggerHoverEffect(unit, true);
            });

            unit.addEventListener('mouseleave', () => {
                this.triggerHoverEffect(unit, false);
            });
        });

        // Add excitement meter interactions
        const excitementMeter = document.querySelector('.excitement-meter');
        if (excitementMeter) {
            excitementMeter.addEventListener('click', () => {
                this.triggerExcitementBoost();
            });
        }
    }

    initializeParticles() {
        const particlesContainer = document.querySelector('.particles-container');
        if (particlesContainer) {
            // Create additional dynamic particles for countdown excitement
            for (let i = 0; i < 3; i++) {
                const particle = document.createElement('div');
                particle.className = 'countdown-particle';
                particle.style.cssText = `
                    position: absolute;
                    width: 4px;
                    height: 4px;
                    background: rgba(255, 215, 0, 0.6);
                    border-radius: 50%;
                    animation: floatCountdownParticle ${3 + Math.random() * 2}s infinite ease-in-out;
                    animation-delay: ${Math.random() * 2}s;
                    left: ${Math.random() * 100}%;
                    top: ${Math.random() * 100}%;
                `;
                particlesContainer.appendChild(particle);
                this.particles.push(particle);
            }
        }
    }    updateCountdown() {
        const now = new Date().getTime();
        const distance = this.targetDate.getTime() - now;

        if (distance < 0) {
            this.displayEventEnded();
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Update the display with modern circular progress
        this.updateCountdownUnit('days', days, 365);
        this.updateCountdownUnit('hours', hours, 24);
        this.updateCountdownUnit('minutes', minutes, 60);
        this.updateCountdownUnit('seconds', seconds, 60);

        // Update excitement meter
        this.updateExcitementMeter(distance);

        // Add visual effects based on urgency
        this.addCountdownEffects(days);
    }    updateCountdownUnit(unit, value, maxValue) {
        // Update the number display
        const numberElement = document.getElementById(unit);
        if (numberElement) {
            numberElement.textContent = value.toString().padStart(2, '0');
        }

        // Update the circular progress using conic-gradient
        const progressElement = document.querySelector(`.circle-progress[data-unit="${unit}"]`);
        if (progressElement) {
            const percentage = (value / maxValue) * 360; // Convert to degrees
            progressElement.style.background = `conic-gradient(#0ea5e9 ${percentage}deg, transparent ${percentage}deg)`;
        }
    }updateExcitementMeter(distance) {
        const excitementMeter = document.querySelector('.excitement-meter');
        const excitementFill = document.querySelector('.meter-fill');
        const excitementText = document.querySelector('.meter-text');
        
        if (!excitementMeter || !excitementFill || !excitementText) return;

        const daysRemaining = Math.floor(distance / (1000 * 60 * 60 * 24));
        let excitementLevel, excitementMessage;

        if (daysRemaining <= 1) {
            excitementLevel = 100;
            excitementMessage = "🔥 IT'S HAPPENING!";
        } else if (daysRemaining <= 7) {
            excitementLevel = 85;
            excitementMessage = "⚡ Almost here!";
        } else if (daysRemaining <= 30) {
            excitementLevel = 65;
            excitementMessage = "🚀 Getting excited!";
        } else if (daysRemaining <= 90) {
            excitementLevel = 40;
            excitementMessage = "📅 Mark your calendar!";
        } else {
            excitementLevel = 20;
            excitementMessage = "⏰ Save the date!";
        }

        excitementFill.style.width = `${excitementLevel}%`;
        excitementText.textContent = excitementMessage;

        // Add glow effect based on excitement
        excitementMeter.style.setProperty('--excitement-glow', 
            `rgba(255, 215, 0, ${excitementLevel / 100 * 0.6})`);
    }

    addCountdownEffects(daysRemaining) {
        const countdownElement = document.querySelector('.modern-hackathon-section');
        if (!countdownElement) return;

        // Remove existing effect classes
        countdownElement.classList.remove('countdown-urgent', 'countdown-soon', 'countdown-imminent');

        if (daysRemaining <= 1) {
            countdownElement.classList.add('countdown-imminent');
            this.intensifyParticles();
        } else if (daysRemaining <= 7) {
            countdownElement.classList.add('countdown-urgent');
        } else if (daysRemaining <= 30) {
            countdownElement.classList.add('countdown-soon');
        }
    }

    intensifyParticles() {
        this.particles.forEach(particle => {
            particle.style.animationDuration = '1s';
            particle.style.background = 'rgba(255, 69, 0, 0.8)';
        });
    }

    triggerClickEffect(unit) {
        unit.style.transform = 'scale(1.1)';
        unit.style.transition = 'transform 0.2s ease-out';
        
        setTimeout(() => {
            unit.style.transform = 'scale(1)';
        }, 200);

        // Create ripple effect
        const ripple = document.createElement('div');
        ripple.className = 'click-ripple';
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 215, 0, 0.3);
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
            left: 50%;
            top: 50%;
            width: 100px;
            height: 100px;
            margin-left: -50px;
            margin-top: -50px;
        `;
        
        unit.style.position = 'relative';
        unit.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }    triggerHoverEffect(unit, isHover) {
        const timeCircle = unit.querySelector('.time-circle');
        if (timeCircle) {
            if (isHover) {
                timeCircle.style.transform = 'scale(1.05)';
                timeCircle.style.boxShadow = '0 0 20px rgba(255, 215, 0, 0.6)';
            } else {
                timeCircle.style.transform = 'scale(1)';
                timeCircle.style.boxShadow = '0 0 15px rgba(100, 255, 218, 0.3)';
            }
        }
    }

    triggerExcitementBoost() {
        const excitementMeter = document.querySelector('.excitement-meter');
        excitementMeter.style.transform = 'scale(1.05)';
        excitementMeter.style.transition = 'transform 0.3s ease-out';
        
        setTimeout(() => {
            excitementMeter.style.transform = 'scale(1)';
        }, 300);
    }

    displayEventEnded() {
        const countdownContainer = document.querySelector('.countdown-column');
        if (countdownContainer) {
            countdownContainer.innerHTML = `
                <div class="countdown-ended">
                    <div class="ended-icon">
                        <i class="fas fa-trophy"></i>
                    </div>
                    <div class="ended-message">
                        <h3>Event Completed!</h3>
                        <p>Thanks to all participants for making it amazing!</p>
                    </div>
                    <div class="ended-stats">
                        <div class="stat">
                            <span class="stat-number">250+</span>
                            <span class="stat-label">Participants</span>
                        </div>
                        <div class="stat">
                            <span class="stat-number">48</span>
                            <span class="stat-label">Hours of Coding</span>
                        </div>
                        <div class="stat">
                            <span class="stat-number">50+</span>
                            <span class="stat-label">Projects Created</span>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    startTimer() {
        // Update every second for smooth animations
        setInterval(() => {
            this.updateCountdown();
        }, 1000);
    }
}

// Initialize the enhanced schedule when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    // Initialize weekly schedule if on home page
    if (document.querySelector('.coding-schedule-section')) {
        new WeeklyScheduleManager();
    }
    
    // Initialize hackathon countdown if countdown element exists
    if (document.getElementById('hackathonCountdown')) {
        new HackathonCountdown();
    }
});
