/**
 * Code with Ubuntu - Advanced Data Management System
 * Phase 7: Data Management & Analytics Implementation
 * 
 * Centralized data management with validation, caching, versioning,
 * and dynamic content loading capabilities.
 */

class DataManager {
    constructor() {
        this.config = {
            cacheEnabled: true,
            cacheExpiry: 1800000, // 30 minutes
            validateData: true,
            enableVersioning: true,
            autoBackup: true,
            compressionEnabled: true,
            maxCacheSize: 50 * 1024 * 1024, // 50MB
            retryAttempts: 3,
            retryDelay: 1000
        };

        this.cache = new Map();
        this.schemas = new Map();
        this.versions = new Map();
        this.subscribers = new Map();
        this.backups = new Map();
        this.loadingStates = new Map();
        
        this.init();
    }

    init() {
        console.log('🗃️ Initializing Advanced Data Management System...');
        
        try {
            this.setupDataSchemas();
            this.initializeCache();
            this.setupEventListeners();
            this.loadPersistedData();
            this.startAutoBackup();
            
            console.log('✅ Data Management System initialized successfully');
            
        } catch (error) {
            console.error('❌ Failed to initialize Data Management System:', error);
        }
    }

    // === DATA SCHEMAS ===

    setupDataSchemas() {
        // Team member schema
        this.schemas.set('team', {
            required: ['id', 'name', 'role'],
            optional: ['bio', 'avatar', 'social', 'specialties'],
            validation: {
                id: { type: 'number', min: 1 },
                name: { type: 'string', minLength: 2, maxLength: 100 },
                role: { type: 'string', enum: ['instructor', 'mentor', 'volunteer', 'staff'] },
                bio: { type: 'string', maxLength: 500 },
                avatar: { type: 'string', format: 'url' },
                social: { type: 'object' },
                specialties: { type: 'array', items: { type: 'string' } }
            }
        });

        // Event schema
        this.schemas.set('events', {
            required: ['id', 'title', 'date', 'type'],
            optional: ['description', 'instructor', 'duration', 'ageGroup', 'maxParticipants'],
            validation: {
                id: { type: 'number', min: 1 },
                title: { type: 'string', minLength: 3, maxLength: 200 },
                date: { type: 'string', format: 'date' },
                type: { type: 'string', enum: ['class', 'workshop', 'event', 'fundraiser'] },
                description: { type: 'string', maxLength: 1000 },
                instructor: { type: 'string', maxLength: 100 },
                duration: { type: 'number', min: 30, max: 480 },
                ageGroup: { type: 'string', maxLength: 50 },
                maxParticipants: { type: 'number', min: 1, max: 100 }
            }
        });

        // Project schema
        this.schemas.set('projects', {
            required: ['id', 'title', 'student', 'technology'],
            optional: ['description', 'image', 'github', 'demo', 'category', 'difficulty'],
            validation: {
                id: { type: 'number', min: 1 },
                title: { type: 'string', minLength: 3, maxLength: 200 },
                student: { type: 'string', minLength: 2, maxLength: 100 },
                technology: { type: 'array', items: { type: 'string' } },
                description: { type: 'string', maxLength: 1000 },
                image: { type: 'string', format: 'url' },
                github: { type: 'string', format: 'url' },
                demo: { type: 'string', format: 'url' },
                category: { type: 'string', enum: ['web', 'mobile', 'game', 'ai', 'data'] },
                difficulty: { type: 'string', enum: ['beginner', 'intermediate', 'advanced'] }
            }
        });

        // Resource schema
        this.schemas.set('resources', {
            required: ['id', 'title', 'url', 'category'],
            optional: ['description', 'difficulty', 'ageGroup', 'language', 'rating'],
            validation: {
                id: { type: 'number', min: 1 },
                title: { type: 'string', minLength: 3, maxLength: 200 },
                url: { type: 'string', format: 'url' },
                category: { type: 'string', enum: ['tutorial', 'tool', 'game', 'documentation', 'video'] },
                description: { type: 'string', maxLength: 500 },
                difficulty: { type: 'string', enum: ['beginner', 'intermediate', 'advanced'] },
                ageGroup: { type: 'string', maxLength: 50 },
                language: { type: 'string', maxLength: 50 },
                rating: { type: 'number', min: 1, max: 5 }
            }
        });

        console.log('📋 Data schemas configured');
    }

    // === DATA LOADING AND CACHING ===

    async loadData(type, options = {}) {
        const { 
            forceFresh = false, 
            fallback = true, 
            validate = true,
            transform = null 
        } = options;

        const cacheKey = this.generateCacheKey(type, options);
        
        // Check loading state
        if (this.loadingStates.has(cacheKey)) {
            return this.loadingStates.get(cacheKey);
        }

        // Check cache first
        if (!forceFresh && this.cache.has(cacheKey)) {
            const cached = this.cache.get(cacheKey);
            if (this.isCacheValid(cached)) {
                console.log(`📦 Loading ${type} from cache`);
                return cached.data;
            }
        }

        // Create loading promise
        const loadingPromise = this.fetchData(type, options);
        this.loadingStates.set(cacheKey, loadingPromise);

        try {
            let data = await loadingPromise;

            // Apply transformation if provided
            if (transform && typeof transform === 'function') {
                data = transform(data);
            }

            // Validate data if enabled
            if (validate && this.config.validateData) {
                data = this.validateAndCleanData(type, data);
            }

            // Cache the data
            this.cacheData(cacheKey, data);

            // Create backup
            if (this.config.autoBackup) {
                this.createBackup(type, data);
            }

            // Update version
            if (this.config.enableVersioning) {
                this.updateVersion(type, data);
            }

            // Notify subscribers
            this.notifySubscribers(type, data);

            console.log(`✅ ${type} data loaded successfully`);
            return data;

        } catch (error) {
            console.warn(`⚠️ Failed to load ${type} data:`, error);

            // Try fallback data
            if (fallback) {
                const fallbackData = this.getFallbackData(type);
                if (fallbackData) {
                    console.log(`🔄 Using fallback data for ${type}`);
                    return fallbackData;
                }
            }

            throw error;
        } finally {
            this.loadingStates.delete(cacheKey);
        }
    }

    async fetchData(type, options = {}) {
        const url = this.getDataUrl(type, options);
        const retryCount = options.retryCount || 0;

        try {
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            return data;

        } catch (error) {
            if (retryCount < this.config.retryAttempts) {
                console.log(`🔄 Retrying ${type} data fetch (attempt ${retryCount + 1})`);
                
                await this.delay(this.config.retryDelay * (retryCount + 1));
                return this.fetchData(type, { ...options, retryCount: retryCount + 1 });
            }

            throw error;
        }
    }

    getDataUrl(type, options = {}) {
        const baseUrls = {
            team: 'data/team.json',
            events: 'data/events.json',
            projects: 'data/projects.json',
            resources: 'data/resources.json',
            programs: 'data/programs.json',
            statistics: 'data/statistics.json'
        };

        let url = baseUrls[type];
        if (!url) {
            throw new Error(`Unknown data type: ${type}`);
        }

        // Add query parameters if needed
        if (options.version) {
            url += `?v=${options.version}`;
        }

        return url;
    }

    // === DATA VALIDATION ===

    validateAndCleanData(type, data) {
        const schema = this.schemas.get(type);
        if (!schema) {
            console.warn(`No schema found for data type: ${type}`);
            return data;
        }

        if (!Array.isArray(data)) {
            console.warn(`Expected array for ${type}, got ${typeof data}`);
            return [];
        }

        const validatedData = data.filter((item, index) => {
            try {
                return this.validateItem(item, schema, `${type}[${index}]`);
            } catch (error) {
                console.warn(`Validation failed for ${type}[${index}]:`, error.message);
                return false;
            }
        }).map(item => this.cleanItem(item, schema));

        console.log(`✅ Validated ${validatedData.length}/${data.length} ${type} items`);
        return validatedData;
    }

    validateItem(item, schema, context = '') {
        // Check required fields
        for (const field of schema.required) {
            if (!(field in item) || item[field] === null || item[field] === undefined) {
                throw new Error(`Missing required field: ${field} in ${context}`);
            }
        }

        // Validate field types and constraints
        for (const [field, rules] of Object.entries(schema.validation)) {
            if (field in item && item[field] !== null && item[field] !== undefined) {
                this.validateField(item[field], rules, `${context}.${field}`);
            }
        }

        return true;
    }

    validateField(value, rules, context = '') {
        // Type validation
        if (rules.type) {
            if (!this.validateType(value, rules.type)) {
                throw new Error(`Invalid type for ${context}: expected ${rules.type}, got ${typeof value}`);
            }
        }

        // String validations
        if (rules.type === 'string') {
            if (rules.minLength && value.length < rules.minLength) {
                throw new Error(`${context} too short: minimum ${rules.minLength} characters`);
            }
            if (rules.maxLength && value.length > rules.maxLength) {
                throw new Error(`${context} too long: maximum ${rules.maxLength} characters`);
            }
            if (rules.enum && !rules.enum.includes(value)) {
                throw new Error(`${context} invalid value: must be one of ${rules.enum.join(', ')}`);
            }
            if (rules.format === 'url' && !this.isValidUrl(value)) {
                throw new Error(`${context} invalid URL format`);
            }
            if (rules.format === 'date' && !this.isValidDate(value)) {
                throw new Error(`${context} invalid date format`);
            }
        }

        // Number validations
        if (rules.type === 'number') {
            if (rules.min !== undefined && value < rules.min) {
                throw new Error(`${context} too small: minimum ${rules.min}`);
            }
            if (rules.max !== undefined && value > rules.max) {
                throw new Error(`${context} too large: maximum ${rules.max}`);
            }
        }

        // Array validations
        if (rules.type === 'array') {
            if (rules.items) {
                value.forEach((item, index) => {
                    this.validateField(item, rules.items, `${context}[${index}]`);
                });
            }
        }
    }

    validateType(value, expectedType) {
        switch (expectedType) {
            case 'string':
                return typeof value === 'string';
            case 'number':
                return typeof value === 'number' && !isNaN(value);
            case 'boolean':
                return typeof value === 'boolean';
            case 'array':
                return Array.isArray(value);
            case 'object':
                return typeof value === 'object' && value !== null && !Array.isArray(value);
            default:
                return true;
        }
    }

    cleanItem(item, schema) {
        const cleaned = {};
        const allFields = [...schema.required, ...schema.optional];

        for (const field of allFields) {
            if (field in item) {
                cleaned[field] = item[field];
            }
        }

        return cleaned;
    }

    // === CACHING SYSTEM ===

    cacheData(key, data) {
        if (!this.config.cacheEnabled) return;

        const cacheEntry = {
            data: this.config.compressionEnabled ? this.compressData(data) : data,
            timestamp: Date.now(),
            size: this.calculateSize(data),
            compressed: this.config.compressionEnabled
        };

        this.cache.set(key, cacheEntry);
        this.manageCacheSize();

        console.log(`💾 Cached data: ${key} (${this.formatSize(cacheEntry.size)})`);
    }

    isCacheValid(cacheEntry) {
        const age = Date.now() - cacheEntry.timestamp;
        return age < this.config.cacheExpiry;
    }

    manageCacheSize() {
        const totalSize = Array.from(this.cache.values())
            .reduce((sum, entry) => sum + entry.size, 0);

        if (totalSize > this.config.maxCacheSize) {
            // Remove oldest entries
            const entries = Array.from(this.cache.entries())
                .sort((a, b) => a[1].timestamp - b[1].timestamp);

            let removedSize = 0;
            for (const [key, entry] of entries) {
                this.cache.delete(key);
                removedSize += entry.size;
                
                if (totalSize - removedSize <= this.config.maxCacheSize * 0.8) {
                    break;
                }
            }

            console.log(`🧹 Cache cleanup: removed ${this.formatSize(removedSize)}`);
        }
    }

    // === VERSIONING SYSTEM ===

    updateVersion(type, data) {
        const hash = this.calculateHash(data);
        const version = {
            hash,
            timestamp: Date.now(),
            size: this.calculateSize(data),
            itemCount: Array.isArray(data) ? data.length : 1
        };

        this.versions.set(type, version);
        console.log(`📋 Version updated for ${type}: ${hash.substring(0, 8)}`);
    }

    getVersion(type) {
        return this.versions.get(type);
    }

    hasDataChanged(type, newData) {
        const currentVersion = this.versions.get(type);
        if (!currentVersion) return true;

        const newHash = this.calculateHash(newData);
        return currentVersion.hash !== newHash;
    }

    // === BACKUP SYSTEM ===

    createBackup(type, data) {
        const backup = {
            data: JSON.stringify(data),
            timestamp: Date.now(),
            size: this.calculateSize(data)
        };

        const backups = this.backups.get(type) || [];
        backups.push(backup);

        // Keep only last 5 backups
        if (backups.length > 5) {
            backups.splice(0, backups.length - 5);
        }

        this.backups.set(type, backups);
        console.log(`💾 Backup created for ${type}`);
    }

    restoreFromBackup(type, index = 0) {
        const backups = this.backups.get(type);
        if (!backups || !backups[index]) {
            throw new Error(`No backup found for ${type} at index ${index}`);
        }

        const backup = backups[index];
        const data = JSON.parse(backup.data);

        console.log(`🔄 Restored ${type} from backup (${new Date(backup.timestamp).toLocaleString()})`);
        return data;
    }

    startAutoBackup() {
        if (!this.config.autoBackup) return;

        setInterval(() => {
            for (const [key, cacheEntry] of this.cache.entries()) {
                const type = this.extractTypeFromCacheKey(key);
                if (type) {
                    const data = this.config.compressionEnabled ? 
                        this.decompressData(cacheEntry.data) : cacheEntry.data;
                    this.createBackup(type, data);
                }
            }
        }, 600000); // Every 10 minutes
    }

    // === SUBSCRIPTION SYSTEM ===

    subscribe(type, callback) {
        if (!this.subscribers.has(type)) {
            this.subscribers.set(type, new Set());
        }
        
        this.subscribers.get(type).add(callback);
        
        return () => {
            this.subscribers.get(type)?.delete(callback);
        };
    }

    notifySubscribers(type, data) {
        const callbacks = this.subscribers.get(type);
        if (callbacks) {
            callbacks.forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error('Error in data subscriber callback:', error);
                }
            });
        }
    }

    // === FALLBACK DATA ===

    getFallbackData(type) {
        const fallbackData = {
            team: [
                {
                    id: 1,
                    name: "John Doe",
                    role: "instructor",
                    bio: "Lead instructor with 10+ years experience",
                    specialties: ["JavaScript", "Python", "Web Development"]
                }
            ],
            events: [
                {
                    id: 1,
                    title: "Introduction to Programming",
                    date: new Date().toISOString().split('T')[0],
                    type: "class",
                    description: "Learn the basics of programming"
                }
            ],
            projects: [
                {
                    id: 1,
                    title: "Sample Project",
                    student: "Student Name",
                    technology: ["HTML", "CSS", "JavaScript"],
                    description: "A sample project demonstrating web development skills"
                }
            ],
            resources: [
                {
                    id: 1,
                    title: "Scratch Programming",
                    url: "https://scratch.mit.edu",
                    category: "tool",
                    description: "Visual programming language for beginners"
                }
            ]
        };

        return fallbackData[type] || [];
    }

    // === UTILITY METHODS ===

    generateCacheKey(type, options = {}) {
        const optionsString = JSON.stringify(options);
        return `${type}_${this.calculateHash(optionsString).substring(0, 8)}`;
    }

    calculateHash(data) {
        const str = typeof data === 'string' ? data : JSON.stringify(data);
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash).toString(36);
    }

    calculateSize(data) {
        return new Blob([JSON.stringify(data)]).size;
    }

    formatSize(bytes) {
        const units = ['B', 'KB', 'MB', 'GB'];
        let size = bytes;
        let unitIndex = 0;

        while (size >= 1024 && unitIndex < units.length - 1) {
            size /= 1024;
            unitIndex++;
        }

        return `${size.toFixed(1)} ${units[unitIndex]}`;
    }

    compressData(data) {
        // Simple compression simulation (in real implementation, use proper compression)
        return JSON.stringify(data);
    }

    decompressData(compressedData) {
        // Simple decompression simulation
        return JSON.parse(compressedData);
    }

    extractTypeFromCacheKey(key) {
        return key.split('_')[0];
    }

    isValidUrl(string) {
        try {
            new URL(string);
            return true;
        } catch {
            return false;
        }
    }

    isValidDate(string) {
        const date = new Date(string);
        return date instanceof Date && !isNaN(date);
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    initializeCache() {
        // Load cache from localStorage if available
        try {
            const stored = localStorage.getItem('dd_data_cache');
            if (stored) {
                const cacheData = JSON.parse(stored);
                for (const [key, value] of Object.entries(cacheData)) {
                    this.cache.set(key, value);
                }
                console.log('📦 Cache restored from localStorage');
            }
        } catch (error) {
            console.warn('Failed to restore cache from localStorage:', error);
        }
    }

    setupEventListeners() {
        // Save cache before page unload
        window.addEventListener('beforeunload', () => {
            this.persistCache();
        });

        // Handle visibility changes
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.persistCache();
            }
        });
    }

    persistCache() {
        try {
            const cacheData = Object.fromEntries(this.cache.entries());
            localStorage.setItem('dd_data_cache', JSON.stringify(cacheData));
        } catch (error) {
            console.warn('Failed to persist cache to localStorage:', error);
        }
    }

    loadPersistedData() {
        // Load any persisted application state
        console.log('📁 Loading persisted data...');
    }

    // === PUBLIC API ===

    async getTeamData(options = {}) {
        return this.loadData('team', options);
    }

    async getEventsData(options = {}) {
        return this.loadData('events', options);
    }

    async getProjectsData(options = {}) {
        return this.loadData('projects', options);
    }

    async getResourcesData(options = {}) {
        return this.loadData('resources', options);
    }

    async getProgramsData(options = {}) {
        return this.loadData('programs', options);
    }

    async getStatisticsData(options = {}) {
        return this.loadData('statistics', options);
    }

    clearCache(type = null) {
        if (type) {
            const keysToDelete = Array.from(this.cache.keys())
                .filter(key => key.startsWith(type));
            keysToDelete.forEach(key => this.cache.delete(key));
            console.log(`🧹 Cleared cache for ${type}`);
        } else {
            this.cache.clear();
            console.log('🧹 Cleared all cache');
        }
    }

    getCacheStats() {
        const entries = Array.from(this.cache.values());
        const totalSize = entries.reduce((sum, entry) => sum + entry.size, 0);
        
        return {
            entryCount: entries.length,
            totalSize: totalSize,
            totalSizeFormatted: this.formatSize(totalSize),
            oldestEntry: Math.min(...entries.map(e => e.timestamp)),
            newestEntry: Math.max(...entries.map(e => e.timestamp))
        };
    }

    exportData() {
        return {
            cache: Object.fromEntries(this.cache.entries()),
            versions: Object.fromEntries(this.versions.entries()),
            backups: Object.fromEntries(this.backups.entries()),
            config: this.config,
            stats: this.getCacheStats()
        };
    }
}

// Initialize Data Manager
const dataManager = new DataManager();

// Export for global access
window.DDDataManager = dataManager;

console.log('🗃️ Code with Ubuntu Data Management System loaded successfully!');
