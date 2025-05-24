/**
 * DD Coder Dojo - Enhanced Contact Page Functionality
 * Comprehensive contact form with validation, accessibility, and UX improvements
 */

class ContactPage {
    constructor() {
        this.form = null;
        this.submitButton = null;
        this.successMessage = null;
        this.isSubmitting = false;
        
        this.config = {
            maxMessageLength: 1000,
            debounceDelay: 300,
            animationDuration: 300
        };

        this.init();
    }

    async init() {
        try {
            console.log('📞 Initializing contact page...');
            
            await this.waitForMainApp();
            this.setupElements();
            this.setupFormValidation();
            this.setupFormSubmission();
            this.setupEnhancements();
            this.setupAccessibility();
            
            console.log('✅ Contact page initialized successfully!');
            
        } catch (error) {
            console.error('❌ Contact page initialization failed:', error);
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

    setupElements() {
        this.form = document.getElementById('contactForm');
        this.submitButton = this.form?.querySelector('button[type="submit"], .submit-btn');
        this.successMessage = document.getElementById('successMessage');

        if (!this.form) {
            console.warn('Contact form not found');
            return;
        }

        // Store original button text
        if (this.submitButton) {
            this.submitButton.dataset.originalText = this.submitButton.innerHTML;
        }
    }

    setupFormValidation() {
        if (!this.form) return;

        const fields = this.form.querySelectorAll('input, select, textarea');
        
        fields.forEach(field => {
            // Real-time validation with debouncing
            const debouncedValidation = this.debounce(() => {
                this.validateField(field);
            }, this.config.debounceDelay);

            field.addEventListener('blur', () => this.validateField(field));
            field.addEventListener('input', debouncedValidation);
            
            // Clear errors on focus
            field.addEventListener('focus', () => this.clearFieldError(field));
        });

        // Age-based program recommendation
        this.setupProgramRecommendation();
    }

    setupFormSubmission() {
        if (!this.form) return;

        this.form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            if (this.isSubmitting) return;
            
            if (await this.validateForm()) {
                await this.submitForm();
            }
        });
    }

    setupProgramRecommendation() {
        const studentAgeField = this.form.querySelector('#studentAge, select[name*="age"]');
        const programField = this.form.querySelector('#program, select[name*="program"]');
        
        if (!studentAgeField || !programField) return;

        studentAgeField.addEventListener('change', () => {
            const age = parseInt(studentAgeField.value);
            if (isNaN(age)) return;

            let recommendedProgram = '';
            let programName = '';

            if (age >= 7 && age <= 10) {
                recommendedProgram = 'junior';
                programName = 'Junior Ninjas';
            } else if (age >= 11 && age <= 13) {
                recommendedProgram = 'intermediate';
                programName = 'Code Explorers';
            } else if (age >= 14 && age <= 17) {
                recommendedProgram = 'senior';
                programName = 'Tech Innovators';
            }

            if (recommendedProgram) {
                programField.value = recommendedProgram;
                this.showRecommendationMessage(age, programName);
            }
        });
    }

    setupEnhancements() {
        this.setupCharacterCounts();
        this.setupFieldEnhancements();
        this.setupProgressIndicator();
    }

    setupCharacterCounts() {
        const messageField = this.form.querySelector('#message, textarea[name*="message"]');
        if (!messageField) return;

        const maxLength = this.config.maxMessageLength;
        messageField.setAttribute('maxlength', maxLength);

        const counter = document.createElement('div');
        counter.className = 'character-counter';
        counter.style.cssText = `
            font-size: 0.85rem;
            color: var(--text-color);
            opacity: 0.7;
            text-align: right;
            margin-top: 0.25rem;
            transition: color 0.3s ease;
        `;

        const updateCounter = () => {
            const remaining = maxLength - messageField.value.length;
            const percentage = (messageField.value.length / maxLength) * 100;
            
            counter.textContent = `${remaining} characters remaining`;
            
            if (percentage > 90) {
                counter.style.color = '#ef4444';
            } else if (percentage > 75) {
                counter.style.color = '#f59e0b';
            } else {
                counter.style.color = 'var(--text-color)';
            }
        };

        messageField.addEventListener('input', updateCounter);
        messageField.parentNode.appendChild(counter);
        updateCounter();
    }

    setupFieldEnhancements() {
        // Email field enhancements
        const emailField = this.form.querySelector('#email, input[type="email"]');
        if (emailField) {
            emailField.setAttribute('autocomplete', 'email');
            emailField.setAttribute('spellcheck', 'false');
            
            // Add email format helper
            const helper = document.createElement('small');
            helper.style.cssText = `
                color: var(--text-color);
                opacity: 0.6;
                font-size: 0.8rem;
                margin-top: 0.25rem;
                display: block;
            `;
            helper.textContent = 'We\'ll use this to send you updates about your inquiry';
            emailField.parentNode.appendChild(helper);
        }

        // Phone field enhancements
        const phoneField = this.form.querySelector('#phone, input[type="tel"]');
        if (phoneField) {
            phoneField.setAttribute('autocomplete', 'tel');
            phoneField.setAttribute('placeholder', '+27 or 0XX XXX XXXX');
            
            // Format phone number as user types
            phoneField.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length > 0) {
                    if (value.startsWith('27')) {
                        value = '+' + value;
                    } else if (value.startsWith('0')) {
                        // South African format
                        if (value.length > 3) {
                            value = value.substring(0, 3) + ' ' + value.substring(3, 6) + ' ' + value.substring(6, 10);
                        }
                    }
                }
                e.target.value = value;
            });
        }

        // Name field enhancements
        const nameFields = this.form.querySelectorAll('input[name*="name"], input[name*="Name"]');
        nameFields.forEach(field => {
            field.setAttribute('autocomplete', field.name.includes('parent') ? 'name' : 'name');
            field.setAttribute('spellcheck', 'false');
        });
    }

    setupProgressIndicator() {
        const requiredFields = this.form.querySelectorAll('[required]');
        if (requiredFields.length === 0) return;

        const progressContainer = document.createElement('div');
        progressContainer.className = 'form-progress';
        progressContainer.style.cssText = `
            margin-bottom: 1.5rem;
            padding: 1rem;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 10px;
            border: 1px solid rgba(255, 255, 255, 0.1);
        `;

        const progressLabel = document.createElement('div');
        progressLabel.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 0.5rem;
            font-size: 0.9rem;
            color: var(--text-color);
        `;

        const progressText = document.createElement('span');
        progressText.textContent = 'Form Completion';

        const progressPercentage = document.createElement('span');
        progressPercentage.className = 'progress-percentage';

        progressLabel.appendChild(progressText);
        progressLabel.appendChild(progressPercentage);

        const progressBar = document.createElement('div');
        progressBar.style.cssText = `
            width: 100%;
            height: 6px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 3px;
            overflow: hidden;
        `;

        const progressFill = document.createElement('div');
        progressFill.className = 'progress-fill';
        progressFill.style.cssText = `
            height: 100%;
            background: linear-gradient(45deg, var(--primary-color), var(--secondary-color));
            width: 0%;
            transition: width 0.3s ease;
            border-radius: 3px;
        `;

        progressBar.appendChild(progressFill);
        progressContainer.appendChild(progressLabel);
        progressContainer.appendChild(progressBar);

        // Insert progress indicator at the top of the form
        this.form.insertBefore(progressContainer, this.form.firstChild);

        // Update progress as fields are filled
        const updateProgress = () => {
            let filledFields = 0;
            requiredFields.forEach(field => {
                if (field.value.trim()) filledFields++;
            });

            const percentage = Math.round((filledFields / requiredFields.length) * 100);
            progressFill.style.width = `${percentage}%`;
            progressPercentage.textContent = `${percentage}%`;
        };

        requiredFields.forEach(field => {
            field.addEventListener('input', updateProgress);
            field.addEventListener('change', updateProgress);
        });

        updateProgress();
    }

    setupAccessibility() {
        // Add aria-labels and improve form accessibility
        const formGroups = this.form.querySelectorAll('.form-group');
        
        formGroups.forEach(group => {
            const label = group.querySelector('label');
            const field = group.querySelector('input, select, textarea');
            
            if (label && field) {
                const labelId = `label-${field.name || Math.random().toString(36).substr(2, 9)}`;
                label.id = labelId;
                field.setAttribute('aria-labelledby', labelId);
                
                if (field.hasAttribute('required')) {
                    field.setAttribute('aria-required', 'true');
                }
            }
        });

        // Add form navigation hints
        const fieldsets = this.form.querySelectorAll('fieldset');
        fieldsets.forEach((fieldset, index) => {
            fieldset.setAttribute('aria-label', `Section ${index + 1} of form`);
        });
    }

    async validateForm() {
        const requiredFields = this.form.querySelectorAll('[required]');
        let isValid = true;
        let firstInvalidField = null;

        // Validate all required fields
        for (const field of requiredFields) {
            if (!this.validateField(field)) {
                isValid = false;
                if (!firstInvalidField) {
                    firstInvalidField = field;
                }
            }
        }

        // Focus on first invalid field
        if (firstInvalidField) {
            firstInvalidField.focus();
            this.scrollToField(firstInvalidField);
        }

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
        else if (field.type === 'email' && value) {
            if (!this.validateEmail(value)) {
                message = 'Please enter a valid email address';
                isValid = false;
            }
        }
        // Phone validation
        else if (field.type === 'tel' && value) {
            if (!this.validatePhoneNumber(value)) {
                message = 'Please enter a valid South African phone number';
                isValid = false;
            }
        }
        // Student age validation
        else if (field.name === 'studentAge' && value) {
            const age = parseInt(value);
            if (age < 7 || age > 17) {
                message = 'Student age must be between 7 and 17';
                isValid = false;
            }
        }

        if (isValid) {
            this.clearFieldError(field);
            this.showFieldSuccess(field);
        } else {
            this.showFieldError(field, message);
        }

        return isValid;
    }

    async submitForm() {
        if (!this.form || this.isSubmitting) return;

        this.isSubmitting = true;
        this.setSubmitState('loading');

        try {
            // Collect form data
            const formData = new FormData(this.form);
            const data = Object.fromEntries(formData.entries());

            // Add timestamp
            data.submittedAt = new Date().toISOString();

            // Simulate API call (replace with actual endpoint)
            await this.delay(2000);

            // In a real implementation, you would send data to your backend:
            // const response = await fetch('/api/contact', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(data)
            // });

            this.handleSubmitSuccess(data);

        } catch (error) {
            console.error('Form submission error:', error);
            this.handleSubmitError(error);
        } finally {
            this.isSubmitting = false;
            this.setSubmitState('default');
        }
    }

    handleSubmitSuccess(data) {
        // Show success message
        this.showSuccessMessage();
        
        // Reset form
        this.form.reset();
        
        // Clear any existing errors
        this.clearAllErrors();
        
        // Update progress indicator
        const progressFill = this.form.querySelector('.progress-fill');
        const progressPercentage = this.form.querySelector('.progress-percentage');
        if (progressFill && progressPercentage) {
            progressFill.style.width = '0%';
            progressPercentage.textContent = '0%';
        }

        // Log for debugging (remove in production)
        console.log('Form submitted successfully:', data);

        // Track submission (if you have analytics)
        this.trackFormSubmission('success', data);
    }

    handleSubmitError(error) {
        this.showErrorMessage('Sorry, there was an error sending your message. Please try again or contact us directly.');
        this.trackFormSubmission('error', { error: error.message });
    }

    setSubmitState(state) {
        if (!this.submitButton) return;

        const states = {
            default: {
                text: this.submitButton.dataset.originalText,
                disabled: false,
                className: ''
            },
            loading: {
                text: '<i class="fas fa-spinner fa-spin"></i> Sending...',
                disabled: true,
                className: 'loading'
            },
            success: {
                text: '<i class="fas fa-check"></i> Sent!',
                disabled: false,
                className: 'success'
            }
        };

        const config = states[state];
        if (config) {
            this.submitButton.innerHTML = config.text;
            this.submitButton.disabled = config.disabled;
            this.submitButton.className = this.submitButton.className.replace(/\b(loading|success)\b/g, '');
            if (config.className) {
                this.submitButton.classList.add(config.className);
            }
        }
    }

    showSuccessMessage() {
        if (this.successMessage) {
            this.successMessage.classList.add('show');
            this.successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Hide after 10 seconds
            setTimeout(() => {
                this.successMessage.classList.remove('show');
            }, 10000);
        } else {
            // Create and show inline success message
            const message = this.createMessage('success', 
                '<i class="fas fa-check-circle"></i> Thank you for your message! We\'ll get back to you within 24 hours.');
            this.form.insertBefore(message, this.form.firstChild);
        }
    }

    showErrorMessage(text) {
        const message = this.createMessage('error', 
            `<i class="fas fa-exclamation-triangle"></i> ${text}`);
        this.form.insertBefore(message, this.form.firstChild);
    }

    showRecommendationMessage(age, programName) {
        // Remove existing recommendation
        const existing = this.form.querySelector('.recommendation-message');
        if (existing) existing.remove();

        const message = this.createMessage('recommendation', 
            `<i class="fas fa-lightbulb"></i> Based on age ${age}, we recommend ${programName}!`);
        
        const programField = this.form.querySelector('#program, select[name*="program"]');
        if (programField) {
            programField.parentNode.appendChild(message);
            
            // Remove after 5 seconds
            setTimeout(() => {
                message.remove();
            }, 5000);
        }
    }

    createMessage(type, content) {
        const message = document.createElement('div');
        message.className = `form-message ${type}-message`;
        
        const styles = {
            success: 'background: rgba(34, 197, 94, 0.1); border: 2px solid #22c55e; color: #22c55e;',
            error: 'background: rgba(239, 68, 68, 0.1); border: 2px solid #ef4444; color: #ef4444;',
            recommendation: 'background: rgba(0, 217, 255, 0.1); border: 1px solid var(--secondary-color); color: var(--secondary-color);'
        };

        message.style.cssText = `
            ${styles[type]}
            padding: 1rem;
            border-radius: 10px;
            margin-bottom: 1rem;
            text-align: center;
            font-size: 0.95rem;
            animation: slideDown ${this.config.animationDuration}ms ease-out;
        `;
        
        message.innerHTML = content;
        
        // Auto-remove error and success messages after 8 seconds
        if (type === 'success' || type === 'error') {
            setTimeout(() => {
                if (message.parentNode) {
                    message.style.animation = `slideUp ${this.config.animationDuration}ms ease-in forwards`;
                    setTimeout(() => message.remove(), this.config.animationDuration);
                }
            }, 8000);
        }
        
        return message;
    }

    showFieldError(field, message) {
        this.clearFieldError(field);
        
        field.style.borderColor = '#ef4444';
        field.style.background = 'rgba(239, 68, 68, 0.05)';
        field.setAttribute('aria-invalid', 'true');
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.style.cssText = `
            color: #ef4444;
            font-size: 0.85rem;
            margin-top: 0.25rem;
            display: flex;
            align-items: center;
            gap: 0.25rem;
        `;
        errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i>${message}`;
        errorDiv.id = `${field.id || field.name}-error`;
        
        field.setAttribute('aria-describedby', errorDiv.id);
        field.parentNode.appendChild(errorDiv);
        
        // Add shake animation
        field.style.animation = 'shake 0.3s ease-in-out';
        setTimeout(() => {
            field.style.animation = '';
        }, 300);
    }

    showFieldSuccess(field) {
        if (field.value.trim() && !field.parentNode.querySelector('.field-error')) {
            field.style.borderColor = '#22c55e';
            field.style.background = 'rgba(34, 197, 94, 0.05)';
            
            // Add success icon if not already present
            if (!field.parentNode.querySelector('.field-success-icon')) {
                const successIcon = document.createElement('div');
                successIcon.className = 'field-success-icon';
                successIcon.style.cssText = `
                    position: absolute;
                    right: 10px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #22c55e;
                    pointer-events: none;
                `;
                successIcon.innerHTML = '<i class="fas fa-check-circle"></i>';
                
                field.parentNode.style.position = 'relative';
                field.parentNode.appendChild(successIcon);
            }
        }
    }

    clearFieldError(field) {
        field.style.borderColor = '';
        field.style.background = '';
        field.removeAttribute('aria-invalid');
        field.removeAttribute('aria-describedby');
        
        const errorDiv = field.parentNode.querySelector('.field-error');
        if (errorDiv) {
            errorDiv.remove();
        }
        
        const successIcon = field.parentNode.querySelector('.field-success-icon');
        if (successIcon) {
            successIcon.remove();
        }
    }

    clearAllErrors() {
        const fields = this.form.querySelectorAll('input, select, textarea');
        fields.forEach(field => this.clearFieldError(field));
        
        const messages = this.form.querySelectorAll('.form-message');
        messages.forEach(message => message.remove());
    }

    scrollToField(field) {
        const navbar = document.querySelector('.navbar');
        const navbarHeight = navbar ? navbar.offsetHeight : 80;
        const fieldTop = field.getBoundingClientRect().top + window.pageYOffset;
        
        window.scrollTo({
            top: fieldTop - navbarHeight - 20,
            behavior: 'smooth'
        });
    }

    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    validatePhoneNumber(phone) {
        // South African phone number validation
        const cleaned = phone.replace(/\s/g, '').replace(/[^\d+]/g, '');
        const phoneRegex = /^(\+27|0)[0-9]{9}$/;
        return phoneRegex.test(cleaned);
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

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    trackFormSubmission(status, data) {
        // Track form submissions for analytics
        console.log(`Form submission ${status}:`, data);
        
        // In production, you might send this to Google Analytics or another service:
        // gtag('event', 'form_submit', {
        //     event_category: 'Contact',
        //     event_label: status,
        //     value: 1
        // });
    }

    destroy() {
        // Clean up event listeners and intervals
        this.isSubmitting = false;
        
        // Remove any temporary elements
        const tempElements = document.querySelectorAll('.form-message, .character-counter, .field-error, .field-success-icon');
        tempElements.forEach(el => el.remove());
    }
}

// ===== ENHANCED SCHEDULE DISPLAY =====
class ScheduleDisplay {
    constructor() {
        this.scheduleData = {
            monday: { program: 'Tech Innovators', time: '14:00-16:00', ages: '14-17' },
            tuesday: { program: 'Code Explorers', time: '14:00-16:00', ages: '11-13' },
            wednesday: { program: 'Code Explorers', time: '14:00-16:00', ages: '11-13' },
            thursday: { program: 'Junior Ninjas', time: '14:00-15:00', ages: '7-10' },
            friday: { program: 'Junior Ninjas', time: '13:00-15:00', ages: '7-10' }
        };
        
        this.init();
    }

    init() {
        this.enhanceScheduleDisplay();
        this.addCurrentDayHighlight();
        this.setupScheduleInteractions();
    }

    enhanceScheduleDisplay() {
        const scheduleContainer = document.querySelector('.schedule-grid');
        if (!scheduleContainer) return;

        // Add enhanced schedule information
        Object.entries(this.scheduleData).forEach(([day, info]) => {
            const dayElement = scheduleContainer.querySelector(`[data-day="${day}"]`);
            if (dayElement) {
                this.enhanceScheduleDay(dayElement, day, info);
            }
        });
    }

    enhanceScheduleDay(element, day, info) {
        // Add availability indicator
        const now = new Date();
        const dayName = day.charAt(0).toUpperCase() + day.slice(1);
        const isToday = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase() === day;
        const isAvailable = this.isClassAvailable(day, info.time);

        element.classList.toggle('today', isToday);
        element.classList.toggle('available', isAvailable);

        // Add detailed information
        if (!element.querySelector('.schedule-details')) {
            const details = document.createElement('div');
            details.className = 'schedule-details';
            details.innerHTML = `
                <div class="program-name">${info.program}</div>
                <div class="class-time">${info.time}</div>
                <div class="age-group">Ages ${info.ages}</div>
                ${isToday ? '<div class="today-indicator">Today</div>' : ''}
                ${isAvailable ? '<div class="status available">Available</div>' : '<div class="status full">In Session</div>'}
            `;
            element.appendChild(details);
        }
    }

    isClassAvailable(day, timeRange) {
        const now = new Date();
        const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
        
        if (currentDay !== day) return true;

        const [startTime, endTime] = timeRange.split('-');
        const currentTime = now.getHours() * 100 + now.getMinutes();
        const classStart = this.parseTime(startTime);
        const classEnd = this.parseTime(endTime);

        return currentTime < classStart || currentTime > classEnd;
    }

    parseTime(timeStr) {
        const [hours, minutes] = timeStr.split(':').map(Number);
        return hours * 100 + minutes;
    }

    addCurrentDayHighlight() {
        const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
        const todayElement = document.querySelector(`[data-day="${today}"]`);
        
        if (todayElement) {
            todayElement.classList.add('current-day');
            
            // Scroll to today's schedule if on mobile
            if (window.innerWidth <= 768) {
                setTimeout(() => {
                    todayElement.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'nearest',
                        inline: 'center'
                    });
                }, 500);
            }
        }
    }

    setupScheduleInteractions() {
        const scheduleItems = document.querySelectorAll('.schedule-day');
        
        scheduleItems.forEach(item => {
            item.addEventListener('click', () => {
                const program = item.dataset.program;
                if (program) {
                    // Animate click
                    item.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        item.style.transform = '';
                    }, 150);

                    // Show program details in a modal or redirect
                    this.showProgramDetails(program);
                }
            });
        });
    }

    showProgramDetails(program) {
        // Simple alert for now - in production, you might show a modal
        const programInfo = Object.values(this.scheduleData).find(p => p.program === program);
        if (programInfo) {
            const message = `${program}\nAges: ${programInfo.ages}\nTime: ${programInfo.time}\n\nWould you like to register?`;
            if (confirm(message)) {
                window.location.href = 'register.html';
            }
        }
    }
}

// ===== CONTACT MAP INTEGRATION =====
class ContactMap {
    constructor() {
        this.mapContainer = null;
        this.coordinates = {
            lat: -29.8719, // Approximate coordinates for Wentworth, Durban
            lng: 30.9689
        };
        
        this.init();
    }

    init() {
        this.mapContainer = document.getElementById('contactMap');
        if (this.mapContainer) {
            this.initializeMap();
        } else {
            this.createMapPlaceholder();
        }
    }

    createMapPlaceholder() {
        const contactInfo = document.querySelector('.contact-info');
        if (!contactInfo) return;

        const mapPlaceholder = document.createElement('div');
        mapPlaceholder.className = 'map-placeholder';
        mapPlaceholder.style.cssText = `
            background: var(--surface-color);
            border-radius: 15px;
            padding: 2rem;
            text-align: center;
            margin-top: 2rem;
            border: 1px solid rgba(255, 255, 255, 0.1);
        `;

        mapPlaceholder.innerHTML = `
            <div style="margin-bottom: 1rem;">
                <i class="fas fa-map-marker-alt" style="font-size: 2rem; color: var(--secondary-color);"></i>
            </div>
            <h4 style="color: var(--light-color); margin-bottom: 1rem;">Find Us</h4>
            <p style="color: var(--text-color); margin-bottom: 1.5rem;">
                178 Austerville Drive<br>
                Wentworth, Durban<br>
                KwaZulu-Natal, 4052
            </p>
            <a href="https://www.google.com/maps/search/178+Austerville+Drive+Wentworth+Durban" 
               target="_blank" 
               rel="noopener noreferrer"
               class="btn btn-secondary"
               style="display: inline-flex; align-items: center; gap: 0.5rem;">
                <i class="fas fa-external-link-alt"></i>
                Open in Google Maps
            </a>
        `;

        contactInfo.appendChild(mapPlaceholder);
    }

    initializeMap() {
        // Placeholder for future map integration
        // You could integrate with Google Maps, OpenStreetMap, or another service
        console.log('Map integration ready for implementation');
    }
}

// ===== PAGE INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    try {
        new ContactPage();
        new ScheduleDisplay();
        new ContactMap();
    } catch (error) {
        console.error('❌ Contact page startup error:', error);
    }
});

// ===== ADD ENHANCED STYLES =====
const contactStyles = document.createElement('style');
contactStyles.textContent = `
    /* Contact page enhancements */
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes slideUp {
        from {
            opacity: 1;
            transform: translateY(0);
        }
        to {
            opacity: 0;
            transform: translateY(-10px);
        }
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
    
    .form-progress {
        transition: all 0.3s ease;
    }
    
    .schedule-day {
        transition: all 0.3s ease;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    
    .schedule-day::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
        transition: left 0.6s;
    }
    
    .schedule-day:hover::before {
        left: 100%;
    }
    
    .schedule-day.today {
        border-color: var(--secondary-color);
        box-shadow: 0 0 20px rgba(0, 217, 255, 0.3);
    }
    
    .schedule-day.current-day {
        background: rgba(0, 217, 255, 0.1);
    }
    
    .today-indicator {
        background: var(--secondary-color);
        color: white;
        font-size: 0.7rem;
        padding: 0.2rem 0.5rem;
        border-radius: 10px;
        font-weight: bold;
        margin-top: 0.5rem;
    }
    
    .status {
        font-size: 0.75rem;
        padding: 0.2rem 0.5rem;
        border-radius: 8px;
        margin-top: 0.5rem;
        font-weight: 500;
    }
    
    .status.available {
        background: rgba(34, 197, 94, 0.2);
        color: #22c55e;
    }
    
    .status.full {
        background: rgba(239, 68, 68, 0.2);
        color: #ef4444;
    }
    
    .field-success-icon {
        animation: successPop 0.3s ease-out;
    }
    
    @keyframes successPop {
        0% { transform: translateY(-50%) scale(0); }
        50% { transform: translateY(-50%) scale(1.2); }
        100% { transform: translateY(-50%) scale(1); }
    }
    
    .submit-btn.loading {
        position: relative;
        color: transparent;
    }
    
    .submit-btn.success {
        background: #22c55e;
        transform: scale(1.05);
    }
    
    /* Mobile optimizations */
    @media (max-width: 768px) {
        .schedule-grid {
            display: flex;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            gap: 1rem;
            padding-bottom: 1rem;
        }
        
        .schedule-day {
            min-width: 200px;
            scroll-snap-align: center;
        }
        
        .form-progress {
            margin: 0 -1rem 1.5rem -1rem;
            border-radius: 0;
        }
    }
    
    /* Accessibility improvements */
    @media (prefers-reduced-motion: reduce) {
        .schedule-day::before,
        .field-success-icon,
        .form-message {
            animation: none !important;
            transition: none !important;
        }
    }
    
    /* Focus improvements for keyboard navigation */
    .keyboard-navigation .schedule-day:focus,
    .keyboard-navigation .submit-btn:focus {
        outline: 3px solid var(--secondary-color);
        outline-offset: 2px;
    }
`;

document.head.appendChild(contactStyles);