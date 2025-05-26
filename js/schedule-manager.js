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

// ===== HACKATHON COUNTDOWN TIMER =====
class HackathonCountdown {
    constructor() {
        this.targetDate = new Date('2025-07-26T09:00:00'); // July 26, 2025 at 9:00 AM
        this.init();
    }

    init() {
        this.updateCountdown();
        this.startTimer();
    }

    updateCountdown() {
        const now = new Date().getTime();
        const distance = this.targetDate.getTime() - now;

        if (distance < 0) {
            // Event has passed
            this.displayEventEnded();
            return;
        }        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Update the display
        const daysElement = document.getElementById('days');
        const hoursElement = document.getElementById('hours');
        const minutesElement = document.getElementById('minutes');
        const secondsElement = document.getElementById('seconds');

        if (daysElement) daysElement.textContent = days.toString().padStart(2, '0');
        if (hoursElement) hoursElement.textContent = hours.toString().padStart(2, '0');
        if (minutesElement) minutesElement.textContent = minutes.toString().padStart(2, '0');
        if (secondsElement) secondsElement.textContent = seconds.toString().padStart(2, '0');

        // Add excitement as the date approaches
        this.addCountdownEffects(days);
    }

    addCountdownEffects(daysRemaining) {
        const countdownElement = document.getElementById('hackathonCountdown');
        if (!countdownElement) return;

        // Remove existing effect classes
        countdownElement.classList.remove('countdown-urgent', 'countdown-soon', 'countdown-imminent');

        if (daysRemaining <= 1) {
            countdownElement.classList.add('countdown-imminent');
        } else if (daysRemaining <= 7) {
            countdownElement.classList.add('countdown-urgent');
        } else if (daysRemaining <= 30) {
            countdownElement.classList.add('countdown-soon');
        }
    }

    displayEventEnded() {
        const countdownElement = document.getElementById('hackathonCountdown');
        if (countdownElement) {
            countdownElement.innerHTML = `
                <div class="countdown-ended">
                    <div class="ended-message">
                        <i class="fas fa-check-circle"></i>
                        <span>Event Completed! Thanks to all participants!</span>
                    </div>
                </div>
            `;
        }
    }    startTimer() {
        // Update every second for more responsive countdown
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
