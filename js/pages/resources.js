/**
 * Code with Ubuntu - Enhanced Resources Page Functionality
 * Interactive learning resources with categorization, search, and progress tracking
 */

class ResourcesManager {
    constructor() {
        this.resources = [];
        this.favorites = this.loadFavorites();
        this.visitedResources = this.loadVisitedResources();
        this.currentCategory = 'all';
        this.searchQuery = '';
        this.sortBy = 'relevance';
        
        this.config = {
            searchDelay: 300,
            animationDelay: 100,
            progressUpdateInterval: 30000
        };

        this.init();
    }

    async init() {
        try {
            console.log('📚 Initializing resources page...');
            
            await this.loadResourcesData();
            this.setupResourceCategories();
            this.setupResourceSearch();
            this.setupResourceTracking();
            this.setupResourceInteractions();
            this.setupPartnerResources();
            this.loadUserData();
            this.enhanceResourceCards();
            
            console.log('✅ Resources page initialized successfully!');
            
        } catch (error) {
            console.error('❌ Resources initialization failed:', error);
        }
    }

    async loadResourcesData() {
        // In production, this would fetch from an API
        this.resources = [
            // Beginner Resources
            {
                id: 1,
                title: "CS Unplugged",
                description: "Learn computer science concepts without a computer! Perfect for understanding the logic of how computers think.",
                url: "https://csunplugged.org/",
                category: "beginner",
                difficulty: "Beginner",
                type: "website",
                tags: ["logic", "unplugged", "concepts", "offline"],
                ageGroup: "7-12",
                estimatedTime: "30-60 minutes per activity",
                language: "Multiple languages",
                rating: 4.8,
                reviews: 156,
                featured: true,
                lastUpdated: "2024-12-15"
            },
            {
                id: 2,
                title: "Blockly Games",
                description: "Fun games that teach drag and drop coding. Available online or download for offline use.",
                url: "https://blockly.games/",
                category: "beginner",
                difficulty: "Beginner",
                type: "interactive",
                tags: ["blockly", "games", "drag-drop", "offline"],
                ageGroup: "8-14",
                estimatedTime: "15-45 minutes per game",
                language: "Multiple languages",
                rating: 4.6,
                reviews: 203,
                featured: false,
                lastUpdated: "2024-11-20"
            },
            {
                id: 3,
                title: "Scratch Programming",
                description: "Our platform of choice! Create simple programs or complex games and interactive projects with visual programming.",
                url: "https://scratch.mit.edu/",
                category: "beginner",
                difficulty: "Beginner to Intermediate",
                type: "platform",
                tags: ["scratch", "visual", "games", "animation", "stories"],
                ageGroup: "8-16",
                estimatedTime: "Unlimited",
                language: "Multiple languages including isiZulu",
                rating: 4.9,
                reviews: 1247,
                featured: true,
                lastUpdated: "2025-01-10"
            },
            {
                id: 4,
                title: "Google CS First",
                description: "A comprehensive curriculum including videos and activities all using Scratch programming.",
                url: "https://csfirst.withgoogle.com/",
                category: "beginner",
                difficulty: "Beginner",
                type: "curriculum",
                tags: ["google", "curriculum", "scratch", "videos", "structured"],
                ageGroup: "9-14",
                estimatedTime: "2-4 hours per module",
                language: "English",
                rating: 4.5,
                reviews: 89,
                featured: false,
                lastUpdated: "2024-10-30"
            },
            // Physical Computing
            {
                id: 5,
                title: "BBC micro:bit",
                description: "Affordable microcontroller boards - code with MakeCode blocks, JavaScript or Python to create amazing projects.",
                url: "https://microbit.org/",
                category: "physical",
                difficulty: "Intermediate",
                type: "hardware",
                tags: ["microbit", "hardware", "sensors", "makecode", "python"],
                ageGroup: "10-17",
                estimatedTime: "1-3 hours per project",
                language: "Multiple languages",
                rating: 4.7,
                reviews: 312,
                featured: true,
                lastUpdated: "2024-12-05"
            },
            {
                id: 6,
                title: "MakeCode",
                description: "Visual programming environment that can interact with other devices and programs including Minecraft!",
                url: "https://makecode.org/",
                category: "physical",
                difficulty: "Beginner to Advanced",
                type: "platform",
                tags: ["makecode", "blocks", "minecraft", "devices", "visual"],
                ageGroup: "10-17",
                estimatedTime: "30 minutes to several hours",
                language: "Multiple languages",
                rating: 4.6,
                reviews: 178,
                featured: false,
                lastUpdated: "2024-11-15"
            },
            // Advanced Resources
            {
                id: 7,
                title: "freeCodeCamp",
                description: "Comprehensive web development curriculum with certificates. Learn HTML, CSS, JavaScript, and much more.",
                url: "https://www.freecodecamp.org/",
                category: "advanced",
                difficulty: "Intermediate to Advanced",
                type: "curriculum",
                tags: ["web-development", "html", "css", "javascript", "certificates"],
                ageGroup: "14-17",
                estimatedTime: "300+ hours for full curriculum",
                language: "Multiple languages",
                rating: 4.7,
                reviews: 892,
                featured: true,
                lastUpdated: "2025-01-05"
            },
            {
                id: 8,
                title: "MIT App Inventor",
                description: "Build real mobile apps with drag-and-drop programming! Create apps that run on Android devices.",
                url: "https://appinventor.mit.edu/",
                category: "advanced",
                difficulty: "Intermediate",
                type: "platform",
                tags: ["app-inventor", "mobile", "android", "apps", "drag-drop"],
                ageGroup: "13-17",
                estimatedTime: "2-6 hours per app",
                language: "Multiple languages",
                rating: 4.5,
                reviews: 234,
                featured: true,
                lastUpdated: "2024-11-30"
            },
            // Global Movements
            {
                id: 9,
                title: "Africa Code Week",
                description: "International movement to bring coding to Africa with tons of links and resources for African students.",
                url: "https://africacodeweek.org/",
                category: "global",
                difficulty: "All Levels",
                type: "movement",
                tags: ["africa", "community", "events", "resources", "movement"],
                ageGroup: "7-17",
                estimatedTime: "Varies by event",
                language: "Multiple African languages",
                rating: 4.6,
                reviews: 145,
                featured: true,
                lastUpdated: "2024-10-01"
            },
            {
                id: 10,
                title: "Code.org",
                description: "Our primary curriculum partner - courses for all ages and skill levels with teacher support and resources.",
                url: "https://code.org/",
                category: "global",
                difficulty: "All Levels",
                type: "curriculum",
                tags: ["code-org", "curriculum", "teacher-support", "structured", "progressive"],
                ageGroup: "4-18",
                estimatedTime: "20+ hours per course",
                language: "Multiple languages",
                rating: 4.9,
                reviews: 1876,
                featured: true,
                lastUpdated: "2025-01-15"
            }
        ];
    }

    setupResourceCategories() {
        const categoryCards = document.querySelectorAll('.category-card');
        
        categoryCards.forEach((card, index) => {
            this.enhanceCategoryCard(card, index);
        });

        this.setupCategoryFilters();
    }

    enhanceCategoryCard(card, index) {
        card.addEventListener('click', () => {
            this.handleCategorySelect(card);
        });

        card.setAttribute('tabindex', '0');
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.handleCategorySelect(card);
            }
        });

        this.addCategoryProgress(card, index);
        card.style.animationDelay = `${index * this.config.animationDelay}ms`;
    }

    addCategoryProgress(card, categoryIndex) {
        const categoryName = this.getCategoryFromCard(card);
        const categoryResources = this.resources.filter(r => r.category === categoryName);
        const visitedInCategory = categoryResources.filter(r => 
            this.visitedResources.includes(r.id)
        ).length;
        
        const progressBar = document.createElement('div');
        progressBar.className = 'category-progress';
        progressBar.style.cssText = `
            margin-top: 1rem;
            padding: 0.5rem 0;
        `;

        const progressPercentage = categoryResources.length > 0 ? 
            Math.round((visitedInCategory / categoryResources.length) * 100) : 0;

        progressBar.innerHTML = `
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                <span style="font-size: 0.8rem; color: var(--text-color);">Progress</span>
                <span style="font-size: 0.8rem; color: var(--secondary-color);">${progressPercentage}%</span>
            </div>
            <div style="
                width: 100%;
                height: 4px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 2px;
                overflow: hidden;
            ">
                <div style="
                    width: ${progressPercentage}%;
                    height: 100%;
                    background: linear-gradient(45deg, var(--primary-color), var(--secondary-color));
                    transition: width 0.5s ease;
                    border-radius: 2px;
                "></div>
            </div>
        `;

        card.querySelector('.category-content').appendChild(progressBar);
    }

    setupCategoryFilters() {
        const categoriesContainer = this.createCategoryFilters();
        
        const resourcesIntro = document.querySelector('.resources-intro');
        if (resourcesIntro && categoriesContainer) {
            resourcesIntro.insertAdjacentElement('afterend', categoriesContainer);
        }
    }

    createCategoryFilters() {
        const categories = [...new Set(this.resources.map(r => r.category))];
        
        const filtersContainer = document.createElement('div');
        filtersContainer.className = 'resource-filters';
        filtersContainer.style.cssText = `
            display: flex;
            justify-content: center;
            gap: 1rem;
            margin: 2rem 0;
            flex-wrap: wrap;
        `;

        const allFilter = this.createFilterButton('all', 'All Resources', true);
        filtersContainer.appendChild(allFilter);

        categories.forEach(category => {
            const displayName = this.getCategoryDisplayName(category);
            const filterBtn = this.createFilterButton(category, displayName, false);
            filtersContainer.appendChild(filterBtn);
        });

        return filtersContainer;
    }

    createFilterButton(category, displayName, isActive) {
        const button = document.createElement('button');
        button.className = `resource-filter-btn ${isActive ? 'active' : ''}`;
        button.dataset.category = category;
        button.textContent = displayName;
        button.style.cssText = `
            padding: 0.75rem 1.5rem;
            border: 2px solid var(--secondary-color);
            background: ${isActive ? 'var(--secondary-color)' : 'transparent'};
            color: ${isActive ? 'white' : 'var(--secondary-color)'};
            border-radius: 25px;
            cursor: pointer;
            transition: all 0.3s ease;
            font-weight: 500;
        `;

        button.addEventListener('click', () => {
            this.setResourceFilter(category);
            this.updateFilterButtons(button);
        });

        return button;
    }

    setupResourceSearch() {
        const searchContainer = this.createResourceSearch();
        
        const filtersContainer = document.querySelector('.resource-filters');
        if (filtersContainer && searchContainer) {
            filtersContainer.insertAdjacentElement('afterend', searchContainer);
        }
    }

    createResourceSearch() {
        const searchContainer = document.createElement('div');
        searchContainer.className = 'resource-search-container';
        searchContainer.style.cssText = `
            max-width: 600px;
            margin: 2rem auto;
            position: relative;
        `;

        searchContainer.innerHTML = `
            <input type="text" 
                   class="resource-search" 
                   placeholder="Search resources by title, description, or technology..."
                   style="
                       width: 100%;
                       padding: 1rem 1rem 1rem 3rem;
                       border: 2px solid rgba(255, 255, 255, 0.1);
                       border-radius: 25px;
                       background: var(--surface-color);
                       color: var(--text-color);
                       font-size: 1rem;
                       transition: all 0.3s ease;
                   ">
            <i class="fas fa-search" style="
                position: absolute;
                left: 1rem;
                top: 50%;
                transform: translateY(-50%);
                color: var(--text-color);
                opacity: 0.6;
            "></i>
        `;

        const searchInput = searchContainer.querySelector('.resource-search');

        const debouncedSearch = this.debounce((query) => {
            this.setResourceSearch(query);
        }, this.config.searchDelay);

        searchInput.addEventListener('input', (e) => {
            debouncedSearch(e.target.value);
        });

        return searchContainer;
    }

    setupResourceTracking() {
        this.setupResourceLinks();
        this.setupFavoriteSystem();
        this.setupProgressTracking();
    }

    setupResourceLinks() {
        const resourceLinks = document.querySelectorAll('.resource-item a');
        
        resourceLinks.forEach(link => {
            this.enhanceResourceLink(link);
        });
    }

    enhanceResourceLink(link) {
        const originalHref = link.href;
        const resourceId = this.getResourceIdFromUrl(originalHref);
        
        link.addEventListener('click', (e) => {
            this.trackResourceVisit(resourceId, originalHref);
            this.markResourceAsVisited(resourceId);
        });

        this.addResourceLinkEnhancements(link, resourceId);
    }

    addResourceLinkEnhancements(link, resourceId) {
        const resource = this.resources.find(r => r.id === resourceId);
        if (!resource) return;

        const metadata = document.createElement('div');
        metadata.className = 'resource-metadata';
        metadata.style.cssText = `
            font-size: 0.8rem;
            color: var(--text-color);
            opacity: 0.7;
            margin-top: 0.5rem;
            display: flex;
            gap: 1rem;
            flex-wrap: wrap;
        `;

        metadata.innerHTML = `
            <span><i class="fas fa-clock"></i> ${resource.estimatedTime}</span>
            <span><i class="fas fa-signal"></i> ${resource.difficulty}</span>
            <span><i class="fas fa-star"></i> ${resource.rating}/5</span>
            ${resource.ageGroup ? `<span><i class="fas fa-users"></i> Ages ${resource.ageGroup}</span>` : ''}
        `;

        const favoriteBtn = document.createElement('button');
        favoriteBtn.className = 'favorite-btn';
        favoriteBtn.innerHTML = this.favorites.includes(resourceId) ? 
            '<i class="fas fa-heart"></i>' : '<i class="far fa-heart"></i>';
        favoriteBtn.style.cssText = `
            background: none;
            border: none;
            color: var(--accent-color);
            cursor: pointer;
            font-size: 1.1rem;
            padding: 0.25rem;
            transition: all 0.3s ease;
        `;

        favoriteBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.toggleFavorite(resourceId);
            favoriteBtn.innerHTML = this.favorites.includes(resourceId) ? 
                '<i class="fas fa-heart"></i>' : '<i class="far fa-heart"></i>';
        });

        link.parentNode.appendChild(metadata);
        link.parentNode.appendChild(favoriteBtn);

        if (this.visitedResources.includes(resourceId)) {
            link.style.opacity = '0.7';
            link.insertAdjacentHTML('beforeend', ' <i class="fas fa-check-circle" style="color: var(--accent-color); font-size: 0.8rem;"></i>');
        }
    }

    setupFavoriteSystem() {
        this.createFavoritesSection();
    }

    createFavoritesSection() {
        if (this.favorites.length === 0) return;

        const favoritesSection = document.createElement('section');
        favoritesSection.className = 'favorites-section';
        favoritesSection.style.cssText = `
            background: var(--surface-color);
            padding: 3rem;
            border-radius: 20px;
            margin: 3rem 0;
            border: 1px solid rgba(255, 255, 255, 0.1);
        `;

        favoritesSection.innerHTML = `
            <h2 style="color: var(--secondary-color); margin-bottom: 1.5rem;">
                <i class="fas fa-heart"></i> Your Favorite Resources
            </h2>
            <div class="favorites-grid" style="
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 1.5rem;
            "></div>
        `;

        const favoritesGrid = favoritesSection.querySelector('.favorites-grid');
        
        this.favorites.forEach(resourceId => {
            const resource = this.resources.find(r => r.id === resourceId);
            if (resource) {
                const favoriteCard = this.createFavoriteCard(resource);
                favoritesGrid.appendChild(favoriteCard);
            }
        });

        const partnerResources = document.querySelector('.partner-resources');
        if (partnerResources) {
            partnerResources.insertAdjacentElement('beforebegin', favoritesSection);
        }
    }

    createFavoriteCard(resource) {
        const card = document.createElement('div');
        card.className = 'favorite-card';
        card.style.cssText = `
            background: rgba(255, 255, 255, 0.05);
            padding: 1.5rem;
            border-radius: 15px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            transition: all 0.3s ease;
        `;

        card.innerHTML = `
            <h3 style="color: var(--light-color); margin-bottom: 0.5rem;">${resource.title}</h3>
            <p style="color: var(--text-color); font-size: 0.9rem; margin-bottom: 1rem;">${resource.description.substring(0, 100)}...</p>
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <a href="${resource.url}" target="_blank" class="btn btn-secondary" style="font-size: 0.9rem;">
                    Visit Resource
                </a>
                <button class="remove-favorite" data-resource-id="${resource.id}" style="
                    background: none;
                    border: none;
                    color: var(--accent-color);
                    cursor: pointer;
                    font-size: 1.1rem;
                ">
                    <i class="fas fa-heart"></i>
                </button>
            </div>
        `;

        const removeBtn = card.querySelector('.remove-favorite');
        removeBtn.addEventListener('click', () => {
            this.toggleFavorite(resource.id);
            card.remove();
        });

        return card;
    }

    setupProgressTracking() {
        this.updateLearningProgress();
        
        setInterval(() => {
            this.updateLearningProgress();
        }, this.config.progressUpdateInterval);
    }

    updateLearningProgress() {
        const progressContainer = this.createProgressContainer();
        
        const resourcesIntro = document.querySelector('.resources-intro');
        if (resourcesIntro && progressContainer) {
            const existingProgress = resourcesIntro.querySelector('.learning-progress');
            if (existingProgress) {
                existingProgress.replaceWith(progressContainer);
            } else {
                resourcesIntro.appendChild(progressContainer);
            }
        }
    }

    createProgressContainer() {
        const progressContainer = document.createElement('div');
        progressContainer.className = 'learning-progress';
        progressContainer.style.cssText = `
            background: linear-gradient(135deg, rgba(0, 217, 255, 0.1), rgba(102, 0, 255, 0.1));
            border: 1px solid var(--secondary-color);
            padding: 2rem;
            border-radius: 15px;
            margin-top: 2rem;
        `;

        const totalResources = this.resources.length;
        const visitedCount = this.visitedResources.length;
        const favoriteCount = this.favorites.length;
        const progressPercentage = Math.round((visitedCount / totalResources) * 100);

        progressContainer.innerHTML = `
            <h3 style="color: var(--light-color); margin-bottom: 1rem;">
                <i class="fas fa-chart-line"></i> Your Learning Progress
            </h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
                <div style="text-align: center;">
                    <div style="font-size: 2rem; color: var(--secondary-color); font-weight: bold;">${visitedCount}</div>
                    <div style="color: var(--text-color); font-size: 0.9rem;">Resources Explored</div>
                </div>
                <div style="text-align: center;">
                    <div style="font-size: 2rem; color: var(--accent-color); font-weight: bold;">${favoriteCount}</div>
                    <div style="color: var(--text-color); font-size: 0.9rem;">Favorites Saved</div>
                </div>
                <div style="text-align: center;">
                    <div style="font-size: 2rem; color: var(--primary-color); font-weight: bold;">${progressPercentage}%</div>
                    <div style="color: var(--text-color); font-size: 0.9rem;">Overall Progress</div>
                </div>
            </div>
            <div style="
                width: 100%;
                height: 8px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 4px;
                overflow: hidden;
            ">
                <div style="
                    width: ${progressPercentage}%;
                    height: 100%;
                    background: linear-gradient(45deg, var(--primary-color), var(--secondary-color));
                    transition: width 0.5s ease;
                    border-radius: 4px;
                "></div>
            </div>
        `;

        return progressContainer;
    }

    setupResourceInteractions() {
        this.enhanceResourceCards();
        this.setupResourceAnimations();
    }

    enhanceResourceCards() {
        const categoryCards = document.querySelectorAll('.category-card');
        
        categoryCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                const category = this.getCategoryFromCard(card);
                this.trackCategoryInteraction('hover', category);
            });

            card.addEventListener('click', () => {
                const category = this.getCategoryFromCard(card);
                this.trackCategoryInteraction('click', category);
            });
        });
    }

    setupResourceAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        document.querySelectorAll('.category-card, .resource-partner').forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'all 0.6s ease';
            observer.observe(card);
        });
    }

    setupPartnerResources() {
        const partnerCards = document.querySelectorAll('.resource-partner');
        
        partnerCards.forEach(card => {
            this.enhancePartnerCard(card);
        });
    }

    enhancePartnerCard(card) {
        // Add click tracking for partner resources
        const partnerLinks = card.querySelectorAll('.partner-links a');
        
        partnerLinks.forEach(link => {
            link.addEventListener('click', () => {
                const partnerName = card.querySelector('h3').textContent;
                this.trackPartnerInteraction(partnerName, link.href);
            });
        });
    }

    // Utility functions
    getCategoryFromCard(card) {
        const header = card.querySelector('.category-header h3');
        if (!header) return 'unknown';
        
        const text = header.textContent.toLowerCase();
        if (text.includes('beginner')) return 'beginner';
        if (text.includes('physical')) return 'physical';
        if (text.includes('advanced')) return 'advanced';
        if (text.includes('global')) return 'global';
        return 'other';
    }

    getCategoryDisplayName(category) {
        const names = {
            beginner: 'Beginner',
            physical: 'Physical Computing',
            advanced: 'Advanced',
            global: 'Global Movements',
            other: 'Other'
        };
        return names[category] || category;
    }

    getResourceIdFromUrl(url) {
        // Simple mapping based on URL - in production, this would be more sophisticated
        const urlMap = {
            'csunplugged.org': 1,
            'blockly.games': 2,
            'scratch.mit.edu': 3,
            'csfirst.withgoogle.com': 4,
            'microbit.org': 5,
            'makecode.org': 6,
            'freecodecamp.org': 7,
            'appinventor.mit.edu': 8,
            'africacodeweek.org': 9,
            'code.org': 10
        };

        for (const [domain, id] of Object.entries(urlMap)) {
            if (url.includes(domain)) {
                return id;
            }
        }
        return Math.floor(Math.random() * 1000); // Fallback for unknown URLs
    }

    // Filter and search functions
    setResourceFilter(category) {
        this.currentCategory = category;
        this.filterResources();
    }

    setResourceSearch(query) {
        this.searchQuery = query.toLowerCase();
        this.filterResources();
    }

    filterResources() {
        const categoryCards = document.querySelectorAll('.category-card');
        
        categoryCards.forEach(card => {
            const shouldShow = this.shouldShowCategory(card);
            card.style.display = shouldShow ? 'block' : 'none';
        });
    }

    shouldShowCategory(card) {
        const category = this.getCategoryFromCard(card);
        
        // Check category filter
        if (this.currentCategory !== 'all' && category !== this.currentCategory) {
            return false;
        }

        // Check search query
        if (this.searchQuery) {
            const text = card.textContent.toLowerCase();
            return text.includes(this.searchQuery);
        }

        return true;
    }

    updateFilterButtons(activeButton) {
        const filterButtons = document.querySelectorAll('.resource-filter-btn');
        
        filterButtons.forEach(btn => {
            const isActive = btn === activeButton;
            btn.classList.toggle('active', isActive);
            btn.style.background = isActive ? 'var(--secondary-color)' : 'transparent';
            btn.style.color = isActive ? 'white' : 'var(--secondary-color)';
        });
    }

    // Tracking functions
    trackResourceVisit(resourceId, url) {
        console.log(`📊 Resource visited: ${resourceId} - ${url}`);
        // In production, this would send data to analytics
    }

    trackCategoryInteraction(action, category) {
        console.log(`📊 Category ${action}: ${category}`);
        // In production, this would send data to analytics
    }

    trackPartnerInteraction(partnerName, url) {
        console.log(`📊 Partner interaction: ${partnerName} - ${url}`);
        // In production, this would send data to analytics
    }

    markResourceAsVisited(resourceId) {
        if (!this.visitedResources.includes(resourceId)) {
            this.visitedResources.push(resourceId);
            this.saveVisitedResources();
            this.updateLearningProgress();
        }
    }

    toggleFavorite(resourceId) {
        const index = this.favorites.indexOf(resourceId);
        
        if (index > -1) {
            this.favorites.splice(index, 1);
        } else {
            this.favorites.push(resourceId);
        }
        
        this.saveFavorites();
        this.updateLearningProgress();
    }

    // Data persistence functions
    loadFavorites() {
        try {
            const saved = localStorage.getItem('ddCoderDojo_favorites');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error('Error loading favorites:', error);
            return [];
        }
    }

    saveFavorites() {
        try {
            localStorage.setItem('ddCoderDojo_favorites', JSON.stringify(this.favorites));
        } catch (error) {
            console.error('Error saving favorites:', error);
        }
    }

    loadVisitedResources() {
        try {
            const saved = localStorage.getItem('ddCoderDojo_visited');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error('Error loading visited resources:', error);
            return [];
        }
    }

    saveVisitedResources() {
        try {
            localStorage.setItem('ddCoderDojo_visited', JSON.stringify(this.visitedResources));
        } catch (error) {
            console.error('Error saving visited resources:', error);
        }
    }

    loadUserData() {
        // Load any additional user preferences or data
        try {
            const userData = localStorage.getItem('ddCoderDojo_userData');
            if (userData) {
                const parsed = JSON.parse(userData);
                this.userPreferences = parsed.preferences || {};
                this.learningGoals = parsed.learningGoals || [];
            }
        } catch (error) {
            console.error('Error loading user data:', error);
        }
    }

    saveUserData() {
        try {
            const userData = {
                preferences: this.userPreferences || {},
                learningGoals: this.learningGoals || [],
                lastVisit: new Date().toISOString()
            };
            localStorage.setItem('ddCoderDojo_userData', JSON.stringify(userData));
        } catch (error) {
            console.error('Error saving user data:', error);
        }
    }

    // Utility functions
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

    // Advanced features
    addLearningPath() {
        // Create a personalized learning path based on user progress
        const learningPathContainer = document.createElement('div');
        learningPathContainer.className = 'learning-path';
        learningPathContainer.style.cssText = `
            background: var(--surface-color);
            padding: 3rem;
            border-radius: 20px;
            margin: 3rem 0;
            border: 1px solid rgba(255, 255, 255, 0.1);
        `;

        const recommendedResources = this.getRecommendedResources();
        
        learningPathContainer.innerHTML = `
            <h2 style="color: var(--secondary-color); margin-bottom: 1.5rem;">
                <i class="fas fa-route"></i> Your Recommended Learning Path
            </h2>
            <p style="color: var(--text-color); margin-bottom: 2rem;">
                Based on your progress, here are the next resources we recommend:
            </p>
            <div class="recommended-resources" style="
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 1.5rem;
            "></div>
        `;

        const recommendedGrid = learningPathContainer.querySelector('.recommended-resources');
        
        recommendedResources.forEach(resource => {
            const resourceCard = this.createRecommendedResourceCard(resource);
            recommendedGrid.appendChild(resourceCard);
        });

        // Insert after progress container
        const progressContainer = document.querySelector('.learning-progress');
        if (progressContainer) {
            progressContainer.insertAdjacentElement('afterend', learningPathContainer);
        }
    }

    getRecommendedResources() {
        // Simple recommendation algorithm based on visited resources and difficulty progression
        const unvisited = this.resources.filter(r => !this.visitedResources.includes(r.id));
        const visitedCount = this.visitedResources.length;
        
        let recommendedDifficulty;
        if (visitedCount < 3) {
            recommendedDifficulty = 'Beginner';
        } else if (visitedCount < 6) {
            recommendedDifficulty = ['Beginner', 'Intermediate'];
        } else {
            recommendedDifficulty = ['Intermediate', 'Advanced'];
        }

        return unvisited
            .filter(r => {
                if (Array.isArray(recommendedDifficulty)) {
                    return recommendedDifficulty.some(diff => r.difficulty.includes(diff));
                }
                return r.difficulty.includes(recommendedDifficulty);
            })
            .sort((a, b) => b.rating - a.rating)
            .slice(0, 3);
    }

    createRecommendedResourceCard(resource) {
        const card = document.createElement('div');
        card.className = 'recommended-resource-card';
        card.style.cssText = `
            background: rgba(255, 255, 255, 0.05);
            padding: 1.5rem;
            border-radius: 15px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            transition: all 0.3s ease;
        `;

        card.innerHTML = `
            <h4 style="color: var(--light-color); margin-bottom: 0.5rem;">${resource.title}</h4>
            <p style="color: var(--text-color); font-size: 0.9rem; margin-bottom: 1rem;">
                ${resource.description.substring(0, 100)}...
            </p>
            <div style="margin-bottom: 1rem;">
                <span style="font-size: 0.8rem; color: var(--secondary-color);">
                    ${resource.difficulty} • ${resource.estimatedTime}
                </span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <a href="${resource.url}" target="_blank" class="btn btn-secondary" style="font-size: 0.9rem;">
                    Start Learning
                </a>
                <div style="display: flex; align-items: center; gap: 0.5rem; color: var(--accent-color);">
                    <i class="fas fa-star"></i>
                    <span style="font-size: 0.9rem;">${resource.rating}</span>
                </div>
            </div>
        `;

        // Add click tracking
        const startBtn = card.querySelector('a');
        startBtn.addEventListener('click', () => {
            this.markResourceAsVisited(resource.id);
            this.trackResourceVisit(resource.id, resource.url);
        });

        return card;
    }

    addResourceFilters() {
        // Add additional filtering options
        const advancedFilters = document.createElement('div');
        advancedFilters.className = 'advanced-filters';
        advancedFilters.style.cssText = `
            display: flex;
            justify-content: center;
            gap: 1rem;
            margin: 1rem 0;
            flex-wrap: wrap;
        `;

        // Difficulty filter
        const difficultyFilter = this.createDifficultyFilter();
        advancedFilters.appendChild(difficultyFilter);

        // Type filter
        const typeFilter = this.createTypeFilter();
        advancedFilters.appendChild(typeFilter);

        // Age group filter
        const ageFilter = this.createAgeGroupFilter();
        advancedFilters.appendChild(ageFilter);

        const searchContainer = document.querySelector('.resource-search-container');
        if (searchContainer) {
            searchContainer.insertAdjacentElement('afterend', advancedFilters);
        }
    }

    createDifficultyFilter() {
        const difficulties = [...new Set(this.resources.map(r => r.difficulty))];
        
        const select = document.createElement('select');
        select.className = 'difficulty-filter';
        select.style.cssText = `
            padding: 0.5rem 1rem;
            border: 2px solid rgba(255, 255, 255, 0.1);
            border-radius: 15px;
            background: var(--surface-color);
            color: var(--text-color);
            cursor: pointer;
        `;

        select.innerHTML = `
            <option value="">All Difficulties</option>
            ${difficulties.map(diff => `<option value="${diff}">${diff}</option>`).join('')}
        `;

        select.addEventListener('change', (e) => {
            this.filterByDifficulty(e.target.value);
        });

        return select;
    }

    createTypeFilter() {
        const types = [...new Set(this.resources.map(r => r.type))];
        
        const select = document.createElement('select');
        select.className = 'type-filter';
        select.style.cssText = `
            padding: 0.5rem 1rem;
            border: 2px solid rgba(255, 255, 255, 0.1);
            border-radius: 15px;
            background: var(--surface-color);
            color: var(--text-color);
            cursor: pointer;
        `;

        select.innerHTML = `
            <option value="">All Types</option>
            ${types.map(type => `<option value="${type}">${type.charAt(0).toUpperCase() + type.slice(1)}</option>`).join('')}
        `;

        select.addEventListener('change', (e) => {
            this.filterByType(e.target.value);
        });

        return select;
    }

    createAgeGroupFilter() {
        const ageGroups = [...new Set(this.resources.map(r => r.ageGroup).filter(Boolean))];
        
        const select = document.createElement('select');
        select.className = 'age-filter';
        select.style.cssText = `
            padding: 0.5rem 1rem;
            border: 2px solid rgba(255, 255, 255, 0.1);
            border-radius: 15px;
            background: var(--surface-color);
            color: var(--text-color);
            cursor: pointer;
        `;

        select.innerHTML = `
            <option value="">All Ages</option>
            ${ageGroups.map(age => `<option value="${age}">Ages ${age}</option>`).join('')}
        `;

        select.addEventListener('change', (e) => {
            this.filterByAgeGroup(e.target.value);
        });

        return select;
    }

    filterByDifficulty(difficulty) {
        // Implementation for difficulty filtering
        this.currentDifficultyFilter = difficulty;
        this.applyAllFilters();
    }

    filterByType(type) {
        // Implementation for type filtering
        this.currentTypeFilter = type;
        this.applyAllFilters();
    }

    filterByAgeGroup(ageGroup) {
        // Implementation for age group filtering
        this.currentAgeFilter = ageGroup;
        this.applyAllFilters();
    }

    applyAllFilters() {
        const categoryCards = document.querySelectorAll('.category-card');
        
        categoryCards.forEach(card => {
            const shouldShow = this.shouldShowWithAllFilters(card);
            card.style.display = shouldShow ? 'block' : 'none';
            
            if (shouldShow) {
                card.style.animation = 'fadeInUp 0.5s ease';
            }
        });
    }

    shouldShowWithAllFilters(card) {
        // Combine all filter logic
        if (!this.shouldShowCategory(card)) {
            return false;
        }

        // Add additional filter logic here when implemented
        return true;
    }

    // Accessibility enhancements
    addAccessibilityFeatures() {
        // Add keyboard navigation for resource cards
        const resourceItems = document.querySelectorAll('.resource-item');
        
        resourceItems.forEach((item, index) => {
            item.setAttribute('tabindex', '0');
            item.setAttribute('role', 'button');
            item.setAttribute('aria-label', `Resource ${index + 1}: ${item.querySelector('a').textContent}`);
            
            item.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    item.querySelector('a').click();
                }
            });
        });

        // Add screen reader announcements for dynamic content
        this.addAriaLiveRegions();
    }

    addAriaLiveRegions() {
        const announcements = document.createElement('div');
        announcements.setAttribute('aria-live', 'polite');
        announcements.setAttribute('aria-atomic', 'true');
        announcements.style.cssText = `
            position: absolute;
            left: -10000px;
            width: 1px;
            height: 1px;
            overflow: hidden;
        `;
        document.body.appendChild(announcements);
        
        this.announcementsElement = announcements;
    }

    announceToScreenReader(message) {
        if (this.announcementsElement) {
            this.announcementsElement.textContent = message;
        }
    }

    // Error handling and fallbacks
    handleResourceLoadError() {
        const errorContainer = document.createElement('div');
        errorContainer.className = 'resource-error';
        errorContainer.style.cssText = `
            background: rgba(239, 68, 68, 0.1);
            border: 2px solid rgba(239, 68, 68, 0.3);
            color: #ef4444;
            padding: 2rem;
            border-radius: 15px;
            text-align: center;
            margin: 2rem 0;
        `;

        errorContainer.innerHTML = `
            <h3><i class="fas fa-exclamation-triangle"></i> Resources Temporarily Unavailable</h3>
            <p>We're having trouble loading the interactive features. The main resources are still available below.</p>
            <button onclick="location.reload()" class="btn btn-secondary" style="margin-top: 1rem;">
                <i class="fas fa-refresh"></i> Try Again
            </button>
        `;

        const resourcesIntro = document.querySelector('.resources-intro');
        if (resourcesIntro) {
            resourcesIntro.insertAdjacentElement('afterend', errorContainer);
        }
    }

    // Initialize all enhanced features
    initializeEnhancedFeatures() {
        try {
            this.addLearningPath();
            this.addResourceFilters();
            this.addAccessibilityFeatures();
            
            // Add welcome message for first-time users
            if (this.visitedResources.length === 0) {
                this.showWelcomeMessage();
            }
            
            console.log('🎯 Enhanced features initialized');
        } catch (error) {
            console.error('Error initializing enhanced features:', error);
            this.handleResourceLoadError();
        }
    }

    showWelcomeMessage() {
        const welcomeModal = document.createElement('div');
        welcomeModal.className = 'welcome-modal';
        welcomeModal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        `;

        welcomeModal.innerHTML = `
            <div style="
                background: var(--surface-color);
                padding: 3rem;
                border-radius: 20px;
                max-width: 500px;
                text-align: center;
                border: 1px solid rgba(255, 255, 255, 0.1);
            ">
                <h2 style="color: var(--secondary-color); margin-bottom: 1rem;">
                    <i class="fas fa-rocket"></i> Welcome to Code with Ubuntu Resources!
                </h2>
                <p style="color: var(--text-color); margin-bottom: 2rem;">
                    Explore our curated collection of coding resources. We'll track your progress and recommend personalized learning paths as you go!
                </p>
                <button class="btn btn-primary" onclick="this.closest('.welcome-modal').remove()">
                    Start Exploring <i class="fas fa-arrow-right"></i>
                </button>
            </div>
        `;

        document.body.appendChild(welcomeModal);

        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (welcomeModal.parentNode) {
                welcomeModal.remove();
            }
        }, 10000);
    }
}

// Initialize the Enhanced Resources Manager
document.addEventListener('DOMContentLoaded', () => {
    try {
        const resourcesManager = new ResourcesManager();
        
        // Initialize enhanced features after main features are loaded
        setTimeout(() => {
            resourcesManager.initializeEnhancedFeatures();
        }, 1000);
        
        // Export for global access
        window.DDCoderDojoResources = resourcesManager;
        
    } catch (error) {
        console.error('❌ Enhanced Resources Manager initialization failed:', error);
        
        // Fallback: Basic functionality still works
        console.log('📚 Using basic resources functionality');
    }
});

// Export the class for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ResourcesManager;
}