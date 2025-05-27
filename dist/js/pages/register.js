/**
 * DD Coder Dojo - Enhanced Registration Page Functionality
 * Multi-step form with validation, accessibility, and smooth UX
 */

class RegistrationForm {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 3;
        this.formData = {};
        this.isSubmitting = false;
        
        this.config = {
            autoSaveDelay: 2000,
            validationDelay: 300,
            animationDuration: 400
        };

        this.validationRules = {
            required: (value) => value.trim().length > 0,
            email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
            phone: (value) => /^(\+27|0)[0-9]{9}$/.test(value.replace(/\s/g, '')),
            age: (value) => {
                const age = parseInt(value);
                return age >= 7 && age <= 17;
            },
            name: (value) => value.trim().length >= 2 && /^[a-zA-Z\s]+$/.test(value)
        };

        this.init();
    }

    async init() {
        try {
            console.log('📝 Initializing registration form...');
            
            await this.waitForMainApp();
            this.setupElements();
            this.setupStepSystem();
            this.setupValidation();
            this.setupFormSubmission();
            this.setupEnhancements();
            this.setupAccessibility();
            this.loadSavedData();
            
            console.log('✅ Registration form initialized successfully!');
            
        } catch (error) {
            console.error('❌ Registration form initialization failed:', error);
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
        this.form = document.getElementById('registrationForm');
        this.steps = this.form?.querySelectorAll('.form-step');
        this.stepIndicators = document.querySelectorAll('.step');
        this.nextBtn = document.getElementById('nextBtn');
        this.prevBtn = document.getElementById('prevBtn');
        this.submitBtn = document.getElementById('submitBtn');
        this.successMessage = document.getElementById('successMessage');

        if (!this.form) {
            console.warn('Registration form not found');
            return;
        }

        // Store original button texts
        if (this.nextBtn) this.nextBtn.dataset.originalText = this.nextBtn.innerHTML;
        if (this.submitBtn) this.submitBtn.dataset.originalText = this.submitBtn.innerHTML;
    }

    setupStepSystem() {
        if (!this.form) return;

        // Setup step navigation
        this.updateStepDisplay();
        this.setupStepNavigation();
        this.setupStepValidation();
        
        // Add step progress animation
        this.animateStepProgress();
    }

    setupStepNavigation() {
        // Next button
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.nextStep());
        }

        // Previous button  
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.prevStep());
        }

        // Step indicator clicks
        this.stepIndicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                const stepNumber = index + 1;
                if (this.canNavigateToStep(stepNumber)) {
                    this.goToStep(stepNumber);
                }
            });
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!this.isFormInFocus()) return;

            if (e.key === 'PageDown' && !e.shiftKey) {
                e.preventDefault();
                this.nextStep();
            } else if (e.key === 'PageUp' && !e.shiftKey) {
                e.preventDefault();
                this.prevStep();
            }
        });
    }

    setupStepValidation() {
        // Validate step before allowing navigation
        this.steps?.forEach((step, index) => {
            const stepNumber = index + 1;
            const fields = step.querySelectorAll('input, select, textarea');
            
            fields.forEach(field => {
                field.addEventListener('blur', () => {
                    this.validateField(field);
                    this.updateStepIndicator(stepNumber);
                });
            });
        });
    }

    nextStep() {
        if (this.currentStep >= this.totalSteps) return;
        if (!this.validateCurrentStep()) return;

        this.saveStepData();
        this.currentStep++;
        this.updateStepDisplay();
        this.announceStepChange();
    }

    prevStep() {
        if (this.currentStep <= 1) return;

        this.currentStep--;
        this.updateStepDisplay();
        this.announceStepChange();
    }

    goToStep(stepNumber) {
        if (stepNumber < 1 || stepNumber > this.totalSteps) return;
        if (stepNumber === this.currentStep) return;

        // Validate all previous steps
        for (let i = 1; i < stepNumber; i++) {
            if (!this.validateStep(i)) {
                this.showStepError(i, 'Please complete this step before proceeding');
                return;
            }
        }

        this.currentStep = stepNumber;
        this.updateStepDisplay();
        this.announceStepChange();
    }

    updateStepDisplay() {
        // Update step visibility with animation
        this.steps?.forEach((step, index) => {
            const stepNumber = index + 1;
            const isActive = stepNumber === this.currentStep;
            
            if (isActive) {
                step.style.display = 'block';
                setTimeout(() => {
                    step.classList.add('active');
                }, 10);
            } else {
                step.classList.remove('active');
                setTimeout(() => {
                    step.style.display = 'none';
                }, this.config.animationDuration);
            }
        });

        // Update step indicators
        this.stepIndicators.forEach((indicator, index) => {
            const stepNumber = index + 1;
            
            indicator.classList.remove('active', 'completed');
            
            if (stepNumber === this.currentStep) {
                indicator.classList.add('active');
            } else if (stepNumber < this.currentStep) {
                indicator.classList.add('completed');
            }
            
            // Update accessibility
            indicator.setAttribute('aria-current', stepNumber === this.currentStep ? 'step' : 'false');
        });

        // Update navigation buttons
        this.updateNavigationButtons();
        
        // Focus first field in new step
        this.focusFirstField();
    }

    updateNavigationButtons() {
        if (this.prevBtn) {
            this.prevBtn.style.display = this.currentStep === 1 ? 'none' : 'inline-flex';
        }

        if (this.nextBtn && this.submitBtn) {
            if (this.currentStep === this.totalSteps) {
                this.nextBtn.style.display = 'none';
                this.submitBtn.style.display = 'inline-flex';
            } else {
                this.nextBtn.style.display = 'inline-flex';
                this.submitBtn.style.display = 'none';
            }
        }
    }

    focusFirstField() {
        setTimeout(() => {
            const currentStepEl = this.form.querySelector(`.form-step[data-step="${this.currentStep}"]`) ||
                                 this.form.querySelector('.form-step.active');
            
            if (currentStepEl) {
                const firstField = currentStepEl.querySelector('input, select, textarea');
                if (firstField) {
                    firstField.focus();
                }
            }
        }, this.config.animationDuration);
    }

    animateStepProgress() {
        const progressPercentage = ((this.currentStep - 1) / (this.totalSteps - 1)) * 100;
        const progressBar = document.querySelector('.step-progress-bar');
        
        if (progressBar) {
            progressBar.style.width = `${progressPercentage}%`;
        }
    }

    setupValidation() {
        if (!this.form) return;

        const fields = this.form.querySelectorAll('input, select, textarea');
        
        fields.forEach(field => {
            // Real-time validation with debouncing
            const debouncedValidation = this.debounce(() => {
                this.validateField(field);
            }, this.config.validationDelay);

            field.addEventListener('input', debouncedValidation);
            field.addEventListener('blur', () => this.validateField(field));
            field.addEventListener('focus', () => this.clearFieldError(field));
        });

        // Setup special validations
        this.setupProgramRecommendation();
        this.setupDependentFields();
        this.setupPasswordStrength();
    }

    setupProgramRecommendation() {
        const dobField = this.form.querySelector('#dateOfBirth');
        const programField = this.form.querySelector('input[name="program"]:checked, select[name="program"]');
        
        if (dobField) {
            dobField.addEventListener('change', () => {
                const age = this.calculateAge(dobField.value);
                if (age) {
                    this.recommendProgram(age);
                }
            });
        }
    }

    setupDependentFields() {
        // Show/hide fields based on selections
        const relationshipField = this.form.querySelector('#relationship');
        if (relationshipField) {
            relationshipField.addEventListener('change', () => {
                this.handleRelationshipChange(relationshipField.value);
            });
        }
    }

    setupPasswordStrength() {
        // If you add password fields in the future
        const passwordFields = this.form.querySelectorAll('input[type="password"]');
        passwordFields.forEach(field => {
            this.addPasswordStrengthIndicator(field);
        });
    }

    validateCurrentStep() {
        const currentStepEl = this.form.querySelector('.form-step.active');
        if (!currentStepEl) return true;

        const fields = currentStepEl.querySelectorAll('input, select, textarea');
        let isValid = true;

        fields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        return isValid;
    }

    validateStep(stepNumber) {
        const stepEl = this.form.querySelector(`.form-step[data-step="${stepNumber}"]`);
        if (!stepEl) return true;

        const fields = stepEl.querySelectorAll('input, select, textarea');
        let isValid = true;

        fields.forEach(field => {
            if (!this.validateField(field, false)) {
                isValid = false;
            }
        });

        return isValid;
    }

    validateField(field, showError = true) {
        const value = field.value.trim();
        const fieldName = field.name || field.id;
        let isValid = true;
        let errorMessage = '';

        // Required validation
        if (field.hasAttribute('required') && !this.validationRules.required(value)) {
            isValid = false;
            errorMessage = 'This field is required';
        }
        // Type-specific validation
        else if (value && field.type === 'email' && !this.validationRules.email(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
        else if (value && field.type === 'tel' && !this.validationRules.phone(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number';
        }
        else if (value && field.type === 'date' && fieldName.includes('Birth')) {
            const age = this.calculateAge(value);
            if (!age || !this.validationRules.age(age)) {
                isValid = false;
                errorMessage = 'Student must be between 7 and 17 years old';
            }
        }
        else if (value && fieldName.toLowerCase().includes('name') && !this.validationRules.name(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid name (letters and spaces only)';
        }

        // Program selection validation
        if (field.type === 'radio' && field.name === 'program') {
            const checkedProgram = this.form.querySelector('input[name="program"]:checked');
            if (field.hasAttribute('required') && !checkedProgram) {
                isValid = false;
                errorMessage = 'Please select a program';
            }
        }

        if (showError) {
            if (isValid) {
                this.clearFieldError(field);
                this.showFieldSuccess(field);
            } else {
                this.showFieldError(field, errorMessage);
            }
        }

        return isValid;
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

    async validateForm() {
        let isValid = true;
        let firstInvalidField = null;

        // Validate all steps
        for (let i = 1; i <= this.totalSteps; i++) {
            if (!this.validateStep(i)) {
                isValid = false;
                if (!firstInvalidField) {
                    // Go to first invalid step
                    this.goToStep(i);
                    firstInvalidField = this.form.querySelector('.form-step.active input.error, .form-step.active select.error');
                }
            }
        }

        if (firstInvalidField) {
            firstInvalidField.focus();
        }

        return isValid;
    }

    async submitForm() {
        if (!this.form || this.isSubmitting) return;

        this.isSubmitting = true;
        this.setSubmitState('loading');

        try {
            // Collect all form data
            const formData = this.collectFormData();
            
            // Add metadata
            formData.submittedAt = new Date().toISOString();
            formData.userAgent = navigator.userAgent;
            formData.referrer = document.referrer;

            // Simulate API call (replace with actual endpoint)
            await this.delay(2000);

            // In production, send to your backend:
            // const response = await fetch('/api/register', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(formData)
            // });

            this.handleSubmitSuccess(formData);

        } catch (error) {
            console.error('Form submission error:', error);
            this.handleSubmitError(error);
        } finally {
            this.isSubmitting = false;
        }
    }

    collectFormData() {
        const formData = new FormData(this.form);
        const data = {};

        // Convert FormData to object
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }

        // Calculate student age
        if (data.dateOfBirth) {
            data.studentAge = this.calculateAge(data.dateOfBirth);
        }

        // Add recommended program if not selected
        if (!data.program && data.studentAge) {
            data.recommendedProgram = this.getRecommendedProgram(data.studentAge);
        }

        return data;
    }

    handleSubmitSuccess(data) {
        // Generate reference number
        const referenceNumber = this.generateReferenceNumber();
        
        // Show success message
        this.showSuccessMessage(referenceNumber);
        
        // Clear saved data
        this.clearSavedData();
        
        // Track successful submission
        this.trackSubmission('success', data);
        
        // Hide form and show success
        this.form.style.display = 'none';
        
        console.log('Registration submitted successfully:', data);
    }

    handleSubmitError(error) {
        this.setSubmitState('error');
        this.showErrorMessage('Sorry, there was an error processing your registration. Please try again.');
        this.trackSubmission('error', { error: error.message });
    }

    setSubmitState(state) {
        if (!this.submitBtn) return;

        const states = {
            default: {
                text: this.submitBtn.dataset.originalText,
                disabled: false,
                className: ''
            },
            loading: {
                text: '<i class="fas fa-spinner fa-spin"></i> Submitting Registration...',
                disabled: true,
                className: 'loading'
            },
            error: {
                text: '<i class="fas fa-exclamation-triangle"></i> Try Again',
                disabled: false,
                className: 'error'
            },
            success: {
                text: '<i class="fas fa-check"></i> Registered!',
                disabled: true,
                className: 'success'
            }
        };

        const config = states[state] || states.default;
        this.submitBtn.innerHTML = config.text;
        this.submitBtn.disabled = config.disabled;
        this.submitBtn.className = this.submitBtn.className.replace(/\b(loading|error|success)\b/g, '');
        if (config.className) {
            this.submitBtn.classList.add(config.className);
        }
    }

    setupEnhancements() {
        this.setupAutoSave();
        this.setupFieldEnhancements();
        this.setupProgressTracking();
        this.setupFormAnalytics();
    }

    setupAutoSave() {
        // Auto-save form data to localStorage
        const fields = this.form.querySelectorAll('input, select, textarea');
        
        fields.forEach(field => {
            field.addEventListener('input', this.debounce(() => {
                this.saveFormData();
            }, this.config.autoSaveDelay));
        });
    }

    setupFieldEnhancements() {
        // Date of birth enhancements
        const dobField = this.form.querySelector('#dateOfBirth');
        if (dobField) {
            dobField.max = new Date().toISOString().split('T')[0]; // Cannot be future
            dobField.min = new Date(Date.now() - 17 * 365.25 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // Max 17 years ago
        }

        // Phone number formatting
        const phoneFields = this.form.querySelectorAll('input[type="tel"]');
        phoneFields.forEach(field => {
            field.addEventListener('input', (e) => {
                this.formatPhoneNumber(e.target);
            });
        });

        // Name field enhancements
        const nameFields = this.form.querySelectorAll('input[name*="Name"], input[name*="name"]');
        nameFields.forEach(field => {
            field.addEventListener('input', (e) => {
                // Capitalize first letter of each word
                e.target.value = e.target.value.replace(/\b\w/g, l => l.toUpperCase());
            });
        });
    }

    setupProgressTracking() {
        // Track form completion progress
        const totalFields = this.form.querySelectorAll('input[required], select[required], textarea[required]').length;
        
        const updateProgress = () => {
            const completedFields = Array.from(this.form.querySelectorAll('input[required], select[required], textarea[required]'))
                .filter(field => field.value.trim()).length;
            
            const percentage = Math.round((completedFields / totalFields) * 100);
            this.updateProgressIndicator(percentage);
        };

        this.form.addEventListener('input', updateProgress);
        this.form.addEventListener('change', updateProgress);
        updateProgress();
    }

    setupFormAnalytics() {
        // Track form interaction metrics
        this.formMetrics = {
            startTime: Date.now(),
            stepTimes: {},
            fieldFocusTimes: {},
            errors: []
        };

        // Track time spent on each step
        this.formMetrics.stepTimes[this.currentStep] = Date.now();

        // Track field focus times
        const fields = this.form.querySelectorAll('input, select, textarea');
        fields.forEach(field => {
            field.addEventListener('focus', () => {
                this.formMetrics.fieldFocusTimes[field.name] = Date.now();
            });
        });
    }

    setupAccessibility() {
        // Enhance form accessibility
        this.form.setAttribute('novalidate', 'true'); // Use custom validation
        
        // Add fieldsets and legends for better structure
        this.steps?.forEach((step, index) => {
            const stepNumber = index + 1;
            step.setAttribute('aria-labelledby', `step-${stepNumber}-title`);
            step.setAttribute('role', 'tabpanel');
        });

        // Improve step indicators
        this.stepIndicators.forEach((indicator, index) => {
            const stepNumber = index + 1;
            indicator.setAttribute('role', 'tab');
            indicator.setAttribute('aria-controls', `step-${stepNumber}`);
            indicator.setAttribute('aria-label', `Step ${stepNumber} of ${this.totalSteps}`);
        });

        // Add live region for announcements
        this.createLiveRegion();
    }

    createLiveRegion() {
        const liveRegion = document.createElement('div');
        liveRegion.id = 'form-announcements';
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        
        document.body.appendChild(liveRegion);
        this.liveRegion = liveRegion;
    }

    // Helper Methods
    calculateAge(birthDate) {
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        
        return age;
    }

    getRecommendedProgram(age) {
        if (age >= 7 && age <= 10) return 'junior';
        if (age >= 11 && age <= 13) return 'intermediate';
        if (age