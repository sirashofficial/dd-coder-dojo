/**
 * DD Coder Dojo - Enhanced Contact & Registration Page Functionality
 * Combined contact form and registration with tabs, validation, accessibility, and UX improvements
 */

class ContactPage {
    constructor() {
        this.form = null;
        this.submitButton = null;
        this.successMessage = null;
        this.isSubmitting = false;
        
        // Tab system
        this.currentTab = 'contact';
        this.tabButtons = null;
        this.tabContents = null;
        
        // Registration form
        this.registrationForm = null;
        this.currentStep = 1;
        this.totalSteps = 3;
        this.formData = {};
        
        this.config = {
            maxMessageLength: 1000,
            debounceDelay: 300,
            animationDuration: 300,
            autoSaveDelay: 2000,
            validationDelay: 300
        };

        this.validationRules = {
            required: (value) => value.trim().length > 0,
            email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
            phone: (value) => /^(\+27|0)[0-9]{9}$/.test(value.replace(/\s/g, '')),
            age: (value) => {
                const age = parseInt(value);
                return age >= 7 && age <= 17;
            },
            name: (value) => value.trim().length >= 2 && /^[a-zA-Z\s]+$/.test(value)        };

        this.init();
    }

    async init() {
        try {
            console.log('📞 Initializing contact & registration page...');
            
            await this.waitForMainApp();
            this.setupElements();
            this.setupTabSystem();
            this.setupFormValidation();
            this.setupFormSubmission();
            this.setupRegistrationSteps();
            this.setupEnhancements();
            this.setupAccessibility();
            this.handleURLHash();
            
            console.log('✅ Contact & registration page initialized successfully!');
            
        } catch (error) {
            console.error('❌ Contact & registration page initialization failed:', error);
        }    }

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
        
        // Tab system elements
        this.tabButtons = document.querySelectorAll('.tab-btn');
        this.tabContents = document.querySelectorAll('.tab-content');
        
        // Registration form elements
        this.registrationForm = document.getElementById('registrationForm');

        if (!this.form) {
            console.warn('Contact form not found');
        }

        // Store original button text
        if (this.submitButton) {
            this.submitButton.dataset.originalText = this.submitButton.innerHTML;
        }
    }

    setupTabSystem() {
        if (!this.tabButtons || this.tabButtons.length === 0) return;

        this.tabButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const targetTab = button.getAttribute('data-tab');
                this.switchTab(targetTab);
            });
        });

        // Handle keyboard navigation
        this.tabButtons.forEach((button, index) => {
            button.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                    e.preventDefault();
                    const nextIndex = e.key === 'ArrowLeft' 
                        ? (index - 1 + this.tabButtons.length) % this.tabButtons.length
                        : (index + 1) % this.tabButtons.length;
                    this.tabButtons[nextIndex].focus();
                    this.switchTab(this.tabButtons[nextIndex].getAttribute('data-tab'));
                }
            });
        });
    }

    switchTab(targetTab) {
        if (this.currentTab === targetTab) return;

        // Update tab buttons
        this.tabButtons.forEach(button => {
            const isActive = button.getAttribute('data-tab') === targetTab;
            button.classList.toggle('active', isActive);
            button.setAttribute('aria-selected', isActive);
            button.setAttribute('tabindex', isActive ? '0' : '-1');
        });

        // Update tab contents
        this.tabContents.forEach(content => {
            const isActive = content.id === `${targetTab}Tab`;
            content.classList.toggle('active', isActive);
            content.setAttribute('aria-hidden', !isActive);
        });

        this.currentTab = targetTab;

        // Update URL hash without scrolling
        if (targetTab === 'register') {
            history.replaceState(null, null, '#register');
        } else {
            history.replaceState(null, null, location.pathname);
        }

        // Focus management
        if (targetTab === 'register') {
            const firstInput = document.querySelector('#registerTab input:first-of-type');
            if (firstInput) {
                setTimeout(() => firstInput.focus(), 100);
            }
        }
    }

    handleURLHash() {
        const hash = window.location.hash.substring(1);
        if (hash === 'register') {
            this.switchTab('register');
        }

        // Listen for hash changes
        window.addEventListener('hashchange', () => {
            const newHash = window.location.hash.substring(1);
            if (newHash === 'register') {
                this.switchTab('register');
            } else if (newHash === '') {
                this.switchTab('contact');
            }        });
    }

    setupRegistrationSteps() {
        if (!this.registrationForm) return;

        // Step navigation buttons
        const nextButtons = this.registrationForm.querySelectorAll('.next-step');
        const prevButtons = this.registrationForm.querySelectorAll('.prev-step');
        
        nextButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.nextStep();
            });
        });

        prevButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.prevStep();
            });
        });

        // Form validation for registration
        const regFields = this.registrationForm.querySelectorAll('input, select, textarea');
        regFields.forEach(field => {
            const debouncedValidation = this.debounce(() => {
                this.validateRegistrationField(field);
            }, this.config.validationDelay);

            field.addEventListener('blur', () => this.validateRegistrationField(field));
            field.addEventListener('input', debouncedValidation);
            field.addEventListener('focus', () => this.clearFieldError(field));
        });

        // Registration form submission
        this.registrationForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (this.isSubmitting) return;
            
            if (await this.validateRegistrationForm()) {
                await this.submitRegistrationForm();
            }
        });

        // Auto-save functionality
        this.setupAutoSave();
        
        // Load saved data
        this.loadSavedData();
        
        // Initialize step display
        this.updateStepDisplay();
    }

    nextStep() {
        if (this.currentStep >= this.totalSteps) return;
        
        // Validate current step before proceeding
        if (!this.validateCurrentStep()) {
            return;
        }

        this.currentStep++;
        this.updateStepDisplay();
        this.saveFormData();
    }

    prevStep() {
        if (this.currentStep <= 1) return;
        
        this.currentStep--;
        this.updateStepDisplay();
    }

    updateStepDisplay() {
        // Update step indicator
        const stepIndicator = document.querySelector('.step-indicator');
        if (stepIndicator) {
            const steps = stepIndicator.querySelectorAll('.step');
            steps.forEach((step, index) => {
                const stepNumber = index + 1;
                step.classList.toggle('active', stepNumber === this.currentStep);
                step.classList.toggle('completed', stepNumber < this.currentStep);
            });
        }

        // Show/hide step content
        const stepContents = this.registrationForm.querySelectorAll('.step-content');
        stepContents.forEach((content, index) => {
            const stepNumber = index + 1;
            content.classList.toggle('active', stepNumber === this.currentStep);
            content.style.display = stepNumber === this.currentStep ? 'block' : 'none';
        });

        // Update navigation buttons
        const prevButton = this.registrationForm.querySelector('.prev-step');
        const nextButton = this.registrationForm.querySelector('.next-step');
        const submitButton = this.registrationForm.querySelector('.submit-btn');

        if (prevButton) {
            prevButton.style.display = this.currentStep === 1 ? 'none' : 'inline-block';
        }

        if (nextButton) {
            nextButton.style.display = this.currentStep === this.totalSteps ? 'none' : 'inline-block';
        }

        if (submitButton) {
            submitButton.style.display = this.currentStep === this.totalSteps ? 'inline-block' : 'none';
        }

        // Update progress
        this.updateProgress();
    }

    updateProgress() {
        const progressBar = document.querySelector('.progress-bar');
        if (progressBar) {
            const progress = (this.currentStep / this.totalSteps) * 100;
            progressBar.style.width = `${progress}%`;
        }
    }

    validateCurrentStep() {
        const currentStepContent = this.registrationForm.querySelector(`.step-content:nth-child(${this.currentStep})`);
        if (!currentStepContent) return true;

        const fields = currentStepContent.querySelectorAll('input[required], select[required], textarea[required]');
        let isValid = true;

        fields.forEach(field => {
            if (!this.validateRegistrationField(field)) {
                isValid = false;
            }
        });

        return isValid;
    }

    validateRegistrationField(field) {
        const value = field.value.trim();
        const fieldName = field.name || field.id;
        let isValid = true;
        let errorMessage = '';

        // Required field validation
        if (field.hasAttribute('required') && !this.validationRules.required(value)) {
            isValid = false;
            errorMessage = 'This field is required';
        }

        // Specific field validations
        if (value && fieldName) {
            switch (fieldName) {
                case 'email':
                case 'parentEmail':
                    if (!this.validationRules.email(value)) {
                        isValid = false;
                        errorMessage = 'Please enter a valid email address';
                    }
                    break;
                case 'phone':
                case 'parentPhone':
                    if (!this.validationRules.phone(value)) {
                        isValid = false;
                        errorMessage = 'Please enter a valid South African phone number';
                    }
                    break;
                case 'studentName':
                case 'parentName':
                    if (!this.validationRules.name(value)) {
                        isValid = false;
                        errorMessage = 'Please enter a valid name (letters and spaces only)';
                    }
                    break;
                case 'age':
                    if (!this.validationRules.age(value)) {
                        isValid = false;
                        errorMessage = 'Age must be between 7 and 17 years';
                    }
                    break;
            }
        }

        // Update field UI
        this.updateFieldValidation(field, isValid, errorMessage);
        return isValid;
    }

    setupAutoSave() {
        if (!this.registrationForm) return;

        const fields = this.registrationForm.querySelectorAll('input, select, textarea');
        let autoSaveTimeout;

        fields.forEach(field => {
            field.addEventListener('input', () => {
                clearTimeout(autoSaveTimeout);
                autoSaveTimeout = setTimeout(() => {
                    this.saveFormData();
                }, this.config.autoSaveDelay);
            });
        });
    }

    saveFormData() {
        if (!this.registrationForm) return;

        const formData = new FormData(this.registrationForm);
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }

        this.formData = { ...this.formData, ...data };
        
        // Save to localStorage
        try {
            localStorage.setItem('ddcd_registration_data', JSON.stringify({
                data: this.formData,
                step: this.currentStep,
                timestamp: Date.now()
            }));
        } catch (error) {
            console.warn('Could not save form data to localStorage:', error);
        }
    }

    updateFieldValidation(field, isValid, errorMessage = '') {
        if (!field) return;

        const formGroup = field.closest('.form-group');
        if (!formGroup) return;

        // Remove existing validation classes and error messages
        field.classList.remove('valid', 'invalid');
        formGroup.classList.remove('has-error', 'has-success');
        
        // Remove existing error message
        const existingError = formGroup.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        if (isValid) {
            // Add success styling
            field.classList.add('valid');
            formGroup.classList.add('has-success');
            field.setAttribute('aria-invalid', 'false');
            field.removeAttribute('aria-describedby');
        } else {
            // Add error styling
            field.classList.add('invalid');
            formGroup.classList.add('has-error');
            field.setAttribute('aria-invalid', 'true');
            
            // Create and add error message
            if (errorMessage) {
                const errorElement = document.createElement('div');
                errorElement.className = 'error-message';
                errorElement.textContent = errorMessage;
                errorElement.setAttribute('role', 'alert');
                errorElement.setAttribute('aria-live', 'polite');
                
                // Set up ARIA relationship
                const errorId = `${field.id || field.name}-error`;
                errorElement.id = errorId;
                field.setAttribute('aria-describedby', errorId);
                
                // Insert error message after the field
                field.parentNode.insertBefore(errorElement, field.nextSibling);
            }
        }
    }

    loadSavedData() {
        try {
            const saved = localStorage.getItem('ddcd_registration_data');
            if (saved) {
                const { data, step, timestamp } = JSON.parse(saved);
                
                // Check if data is not too old (24 hours)
                if (Date.now() - timestamp < 24 * 60 * 60 * 1000) {
                    this.formData = data;
                    this.currentStep = step || 1;
                    
                    // Populate form fields
                    Object.entries(data).forEach(([key, value]) => {
                        const field = this.registrationForm?.querySelector(`[name="${key}"]`);
                        if (field) {
                            field.value = value;
                        }
                    });
                    
                    this.updateStepDisplay();
                }
            }
        } catch (error) {
            console.warn('Could not load saved form data:', error);
        }
    }

    async validateRegistrationForm() {
        if (!this.registrationForm) return false;

        const fields = this.registrationForm.querySelectorAll('input, select, textarea');
        let isValid = true;

        fields.forEach(field => {
            if (!this.validateRegistrationField(field)) {
                isValid = false;
            }
        });

        return isValid;
    }

    async submitRegistrationForm() {
        if (this.isSubmitting) return;

        this.isSubmitting = true;
        const submitButton = this.registrationForm.querySelector('.submit-btn');
        
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
        }

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Clear saved data
            localStorage.removeItem('ddcd_registration_data');

            // Show success message
            this.showRegistrationSuccess();
            
            // Reset form
            this.registrationForm.reset();
            this.currentStep = 1;
            this.updateStepDisplay();

        } catch (error) {
            console.error('Registration submission failed:', error);
            this.showError('Registration failed. Please try again.');
        } finally {
            this.isSubmitting = false;
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Registration';
            }
        }
    }

    showRegistrationSuccess() {
        const successMessage = document.getElementById('registrationSuccessMessage');
        if (successMessage) {
            successMessage.style.display = 'block';
            successMessage.scrollIntoView({ behavior: 'smooth' });
            
            // Hide after 10 seconds
            setTimeout(() => {
                successMessage.style.display = 'none';
            }, 10000);
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

    setupRegistrationSteps() {
        if (!this.registrationForm) return;

        // Step navigation buttons
        const nextButtons = this.registrationForm.querySelectorAll('.next-step');
        const prevButtons = this.registrationForm.querySelectorAll('.prev-step');
        
        nextButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.nextStep();
            });
        });

        prevButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.prevStep();
            });
        });

        // Form validation for registration
        const regFields = this.registrationForm.querySelectorAll('input, select, textarea');
        regFields.forEach(field => {
            const debouncedValidation = this.debounce(() => {
                this.validateRegistrationField(field);
            }, this.config.validationDelay);

            field.addEventListener('blur', () => this.validateRegistrationField(field));
            field.addEventListener('input', debouncedValidation);
            field.addEventListener('focus', () => this.clearFieldError(field));
        });

        // Registration form submission
        this.registrationForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (this.isSubmitting) return;
            
            if (await this.validateRegistrationForm()) {
                await this.submitRegistrationForm();
            }
        });

        // Auto-save functionality
        this.setupAutoSave();
    }

    nextStep() {
        if (this.currentStep >= this.totalSteps) return;
        
        // Validate current step before proceeding
        if (!this.validateCurrentStep()) {
            return;
        }

        this.currentStep++;
        this.updateStepDisplay();
        this.saveFormData();
    }

    prevStep() {
        if (this.currentStep <= 1) return;
        
        this.currentStep--;
        this.updateStepDisplay();
    }

    updateStepDisplay() {
        // Update step indicator
        const stepIndicator = document.querySelector('.step-indicator');
        if (stepIndicator) {
            const steps = stepIndicator.querySelectorAll('.step');
            steps.forEach((step, index) => {
                const stepNumber = index + 1;
                step.classList.toggle('active', stepNumber === this.currentStep);
                step.classList.toggle('completed', stepNumber < this.currentStep);
            });
        }

        // Show/hide step content
        const stepContents = this.registrationForm.querySelectorAll('.step-content');
        stepContents.forEach((content, index) => {
            const stepNumber = index + 1;
            content.classList.toggle('active', stepNumber === this.currentStep);
            content.style.display = stepNumber === this.currentStep ? 'block' : 'none';
        });

        // Update navigation buttons
        const prevButton = this.registrationForm.querySelector('.prev-step');
        const nextButton = this.registrationForm.querySelector('.next-step');
        const submitButton = this.registrationForm.querySelector('.submit-btn');

        if (prevButton) {
            prevButton.style.display = this.currentStep === 1 ? 'none' : 'inline-block';
        }

        if (nextButton) {
            nextButton.style.display = this.currentStep === this.totalSteps ? 'none' : 'inline-block';
        }

        if (submitButton) {
            submitButton.style.display = this.currentStep === this.totalSteps ? 'inline-block' : 'none';
        }

        // Update progress
        this.updateProgress();
    }

    updateProgress() {
        const progressBar = document.querySelector('.progress-bar');
        if (progressBar) {
            const progress = (this.currentStep / this.totalSteps) * 100;
            progressBar.style.width = `${progress}%`;
        }
    }

    validateCurrentStep() {
        const currentStepContent = this.registrationForm.querySelector(`.step-content:nth-child(${this.currentStep})`);
        if (!currentStepContent) return true;

        const fields = currentStepContent.querySelectorAll('input[required], select[required], textarea[required]');
        let isValid = true;

        fields.forEach(field => {
            if (!this.validateRegistrationField(field)) {
                isValid = false;
            }
        });

        return isValid;
    }

    validateRegistrationField(field) {
        const value = field.value.trim();
        const fieldName = field.name || field.id;
        let isValid = true;
        let errorMessage = '';

        // Required field validation
        if (field.hasAttribute('required') && !this.validationRules.required(value)) {
            isValid = false;
            errorMessage = 'This field is required';
        }

        // Specific field validations
        if (value && fieldName) {
            switch (fieldName) {
                case 'email':
                case 'parentEmail':
                    if (!this.validationRules.email(value)) {
                        isValid = false;
                        errorMessage = 'Please enter a valid email address';
                    }
                    break;
                case 'phone':
                case 'parentPhone':
                    if (!this.validationRules.phone(value)) {
                        isValid = false;
                        errorMessage = 'Please enter a valid South African phone number';
                    }
                    break;
                case 'studentName':
                case 'parentName':
                    if (!this.validationRules.name(value)) {
                        isValid = false;
                        errorMessage = 'Please enter a valid name (letters and spaces only)';
                    }
                    break;
                case 'age':
                    if (!this.validationRules.age(value)) {
                        isValid = false;
                        errorMessage = 'Age must be between 7 and 17 years';
                    }
                    break;
            }
        }

        // Update field UI
        this.updateFieldValidation(field, isValid, errorMessage);
        return isValid;
    }

    setupAutoSave() {
        if (!this.registrationForm) return;

        const fields = this.registrationForm.querySelectorAll('input, select, textarea');
        let autoSaveTimeout;

        fields.forEach(field => {
            field.addEventListener('input', () => {
                clearTimeout(autoSaveTimeout);
                autoSaveTimeout = setTimeout(() => {
                    this.saveFormData();
                }, this.config.autoSaveDelay);
            });
        });
    }

    saveFormData() {
        if (!this.registrationForm) return;

        const formData = new FormData(this.registrationForm);
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }

        this.formData = { ...this.formData, ...data };
        
        // Save to localStorage
        try {
            localStorage.setItem('ddcd_registration_data', JSON.stringify({
                data: this.formData,
                step: this.currentStep,
                timestamp: Date.now()
            }));
        } catch (error) {
            console.warn('Could not save form data to localStorage:', error);
        }
    }

    updateFieldValidation(field, isValid, errorMessage = '') {
        if (!field) return;

        const formGroup = field.closest('.form-group');
        if (!formGroup) return;

        // Remove existing validation classes and error messages
        field.classList.remove('valid', 'invalid');
        formGroup.classList.remove('has-error', 'has-success');
        
        // Remove existing error message
        const existingError = formGroup.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        if (isValid) {
            // Add success styling
            field.classList.add('valid');
            formGroup.classList.add('has-success');
            field.setAttribute('aria-invalid', 'false');
            field.removeAttribute('aria-describedby');
        } else {
            // Add error styling
            field.classList.add('invalid');
            formGroup.classList.add('has-error');
            field.setAttribute('aria-invalid', 'true');
            
            // Create and add error message
            if (errorMessage) {
                const errorElement = document.createElement('div');
                errorElement.className = 'error-message';
                errorElement.textContent = errorMessage;
                errorElement.setAttribute('role', 'alert');
                errorElement.setAttribute('aria-live', 'polite');
                
                // Set up ARIA relationship
                const errorId = `${field.id || field.name}-error`;
                errorElement.id = errorId;
                field.setAttribute('aria-describedby', errorId);
                
                // Insert error message after the field
                field.parentNode.insertBefore(errorElement, field.nextSibling);
            }
        }
    }

    loadSavedData() {
        try {
            const saved = localStorage.getItem('ddcd_registration_data');
            if (saved) {
                const { data, step, timestamp } = JSON.parse(saved);
                
                // Check if data is not too old (24 hours)
                if (Date.now() - timestamp < 24 * 60 * 60 * 1000) {
                    this.formData = data;
                    this.currentStep = step || 1;
                    
                    // Populate form fields
                    Object.entries(data).forEach(([key, value]) => {
                        const field = this.registrationForm?.querySelector(`[name="${key}"]`);
                        if (field) {
                            field.value = value;
                        }
                    });
                    
                    this.updateStepDisplay();
                }
            }
        } catch (error) {
            console.warn('Could not load saved form data:', error);
        }
    }

    async validateRegistrationForm() {
        if (!this.registrationForm) return false;

        const fields = this.registrationForm.querySelectorAll('input, select, textarea');
        let isValid = true;

        fields.forEach(field => {
            if (!this.validateRegistrationField(field)) {
                isValid = false;
            }
        });

        return isValid;
    }

    async submitRegistrationForm() {
        if (this.isSubmitting) return;

        this.isSubmitting = true;
        const submitButton = this.registrationForm.querySelector('.submit-btn');
        
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
        }

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Clear saved data
            localStorage.removeItem('ddcd_registration_data');

            // Show success message
            this.showRegistrationSuccess();
            
            // Reset form
            this.registrationForm.reset();
            this.currentStep = 1;
            this.updateStepDisplay();

        } catch (error) {
            console.error('Registration submission failed:', error);
            this.showError('Registration failed. Please try again.');
        } finally {
            this.isSubmitting = false;
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Registration';
            }
        }
    }

    showRegistrationSuccess() {
        const successMessage = document.getElementById('registrationSuccessMessage');
        if (successMessage) {
            successMessage.style.display = 'block';
            successMessage.scrollIntoView({ behavior: 'smooth' });
            
            // Hide after 10 seconds
            setTimeout(() => {
                successMessage.style.display = 'none';
            }, 10000);
        }
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
        // Simple alert for now - in production, you might show a modal        const programInfo = Object.values(this.scheduleData).find(p => p.program === program);
        if (programInfo) {
            const message = `${program}\nAges: ${programInfo.ages}\nTime: ${programInfo.time}\n\nWould you like to register?`;
            if (confirm(message)) {
                window.location.href = 'contact.html#register';
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
