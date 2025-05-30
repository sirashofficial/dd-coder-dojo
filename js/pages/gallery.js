/**
 * Code with Ubuntu - Enhanced Gallery Page Functionality
 * Interactive project gallery with filtering, search, and detailed views
 */

class ProjectGallery {
    constructor() {
        this.currentFilter = 'all';
        this.projects = [];
        this.displayedProjects = 0;
        this.projectsPerPage = 9;
        this.searchQuery = '';
        this.sortBy = 'date';
        this.sortOrder = 'desc';
        this.isLoading = false;
        
        this.config = {
            animationDelay: 100,
            loadMoreDelay: 500,
            searchDelay: 300
        };

        this.init();
    }

    async init() {
        try {
            console.log('🖼️ Initializing gallery page...');
            
            await this.waitForMainApp();
            await this.loadProjects();
            this.setupGalleryGrid();
            this.setupFilters();
            this.setupSearch();
            this.setupSorting();
            this.setupLoadMore();
            this.setupProjectModals();
            this.setupKeyboardNavigation();
            this.renderProjects();
            
            console.log('✅ Gallery page initialized successfully!');
            
        } catch (error) {
            console.error('❌ Gallery initialization failed:', error);
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

    async loadProjects() {
        // Load projects from data/projects.json
        try {
            const response = await fetch('data/projects.json');
            if (!response.ok) throw new Error('Failed to load projects.json');
            this.projects = await response.json();
        } catch (e) {
            console.warn('Falling back to static projects:', e);
            // Static fallback data
            this.projects = [
                {
                    id: 1,
                    title: "Space Adventure Game",
                    student: "Amara K.",
                    age: 12,
                    program: "intermediate",
                    description: "An exciting space exploration game built with Scratch featuring multiple levels, power-ups, and challenging enemies. Players navigate through asteroid fields while collecting resources.",
                    tech: ["Scratch", "Game Design", "Animation"],
                    category: "scratch",
                    image: "/images/projects/space-game.jpg",
                    difficulty: "Intermediate",
                    likes: 23,
                    views: 156,
                    date: "2025-01-15",
                    featured: true,
                    completed: true,
                    projectUrl: "https://scratch.mit.edu/projects/12345",
                    screenshots: [
                        "/images/projects/space-game-1.jpg",
                        "/images/projects/space-game-2.jpg"
                    ]
                },
                {
                    id: 2,
                    title: "Weather Dashboard",
                    student: "Sipho M.",
                    age: 15,
                    program: "senior",
                    description: "A responsive web dashboard showing real-time weather data with beautiful charts, animations, and location-based forecasting capabilities.",
                    tech: ["HTML", "CSS", "JavaScript", "API"],
                    category: "web",
                    image: "/images/projects/weather-dashboard.jpg",
                    difficulty: "Advanced",
                    likes: 31,
                    views: 203,
                    date: "2025-01-12",
                    featured: true,
                    completed: true,
                    projectUrl: "https://github.com/student/weather-app",
                    screenshots: [
                        "/images/projects/weather-1.jpg",
                        "/images/projects/weather-2.jpg"
                    ]
                },
                {
                    id: 3,
                    title: "Digital Pet Care",
                    student: "Zanele N.",
                    age: 9,
                    program: "junior",
                    description: "A fun virtual pet game where you feed, play with, and take care of your digital companion. Features day/night cycles and pet emotions.",
                    tech: ["Scratch", "Animation", "Logic"],
                    category: "scratch",
                    image: "/images/projects/pet-care.jpg",
                    difficulty: "Beginner",
                    likes: 18,
                    views: 89,
                    date: "2025-01-10",
                    featured: false,
                    completed: true,
                    projectUrl: "https://scratch.mit.edu/projects/67890",
                    screenshots: [
                        "/images/projects/pet-1.jpg",
                        "/images/projects/pet-2.jpg"
                    ]
                },
                {
                    id: 4,
                    title: "Smart Home Prototype",
                    student: "Thabo L.",
                    age: 16,
                    program: "senior",
                    description: "A micro:bit-powered smart home system with sensors for temperature, light, and security. Includes mobile app control and data logging.",
                    tech: ["micro:bit", "Python", "IoT", "Mobile"],
                    category: "microbit",
                    image: "/images/projects/smart-home.jpg",
                    difficulty: "Advanced",
                    likes: 27,
                    views: 134,
                    date: "2025-01-08",
                    featured: true,
                    completed: true,
                    projectUrl: "https://github.com/student/smart-home",
                    screenshots: [
                        "/images/projects/smart-home-1.jpg",
                        "/images/projects/smart-home-2.jpg"
                    ]
                },
                {
                    id: 5,
                    title: "Math Quiz Master",
                    student: "Lerato P.",
                    age: 11,
                    program: "intermediate",
                    description: "An interactive math quiz game with different difficulty levels, score tracking, and adaptive learning that adjusts to student performance.",
                    tech: ["Scratch", "Logic", "Math", "Education"],
                    category: "scratch",
                    image: "/images/projects/math-quiz.jpg",
                    difficulty: "Intermediate",
                    likes: 15,
                    views: 78,
                    date: "2025-01-05",
                    featured: false,
                    completed: true,
                    projectUrl: "https://scratch.mit.edu/projects/11111",
                    screenshots: [
                        "/images/projects/math-quiz-1.jpg"
                    ]
                },
                {
                    id: 6,
                    title: "Portfolio Website",
                    student: "Nomsa D.",
                    age: 14,
                    program: "senior",
                    description: "A personal portfolio website showcasing coding projects with responsive design, smooth animations, and contact form integration.",
                    tech: ["HTML", "CSS", "JavaScript", "Responsive"],
                    category: "web",
                    image: "/images/projects/portfolio.jpg",
                    difficulty: "Intermediate",
                    likes: 22,
                    views: 167,
                    date: "2025-01-03",
                    featured: false,
                    completed: true,
                    projectUrl: "https://student-portfolio.netlify.app",
                    screenshots: [
                        "/images/projects/portfolio-1.jpg",
                        "/images/projects/portfolio-2.jpg"
                    ]
                },
                {
                    id: 7,
                    title: "Team Calculator App",
                    student: "Junior Ninjas Group",
                    age: null,
                    program: "junior",
                    description: "A collaborative calculator app built by our Junior Ninjas team, featuring colorful interface and fun sound effects for math operations.",
                    tech: ["Scratch", "Teamwork", "Math"],
                    category: "team",
                    image: "/images/projects/team-calculator.jpg",
                    difficulty: "Beginner",
                    likes: 35,
                    views: 201,
                    date: "2025-01-01",
                    featured: true,
                    completed: true,
                    projectUrl: "https://scratch.mit.edu/projects/22222",
                    screenshots: [
                        "/images/projects/team-calc-1.jpg",
                        "/images/projects/team-calc-2.jpg"
                    ]
                },
                {
                    id: 8,
                    title: "Motion Sensor Game",
                    student: "Kabelo R.",
                    age: 13,
                    program: "intermediate",
                    description: "An innovative game that uses micro:bit's accelerometer for motion-controlled gameplay. Tilt to navigate obstacles and collect points.",
                    tech: ["micro:bit", "Python", "Sensors"],
                    category: "microbit",
                    image: "/images/projects/motion-game.jpg",
                    difficulty: "Intermediate",
                    likes: 19,
                    views: 93,
                    date: "2024-12-28",
                    featured: false,
                    completed: true,
                    projectUrl: "https://github.com/student/motion-game",
                    screenshots: [
                        "/images/projects/motion-1.jpg"
                    ]
                },
                {
                    id: 9,
                    title: "Recipe Finder App",
                    student: "Ayanda M.",
                    age: 17,
                    program: "senior",
                    description: "A Python application that helps users find recipes based on available ingredients, with nutritional information and cooking time estimates.",
                    tech: ["Python", "API", "Database", "GUI"],
                    category: "python",
                    image: "/images/projects/recipe-app.jpg",
                    difficulty: "Advanced",
                    likes: 24,
                    views: 142,
                    date: "2024-12-25",
                    featured: false,
                    completed: true,
                    projectUrl: "https://github.com/student/recipe-finder",
                    screenshots: [
                        "/images/projects/recipe-1.jpg",
                        "/images/projects/recipe-2.jpg"
                    ]
                }
            ];
        }
    }

    setupGalleryGrid() {
        this.galleryGrid = document.getElementById('galleryGrid');
        if (!this.galleryGrid) {
            console.warn('Gallery grid not found');
            return;
        }

        // Add loading state
        this.galleryGrid.classList.add('loading');
    }

    setupFilters() {
        this.filterButtons = document.querySelectorAll('.filter-btn');
        
        this.filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.dataset.filter;
                this.setFilter(filter);
                this.updateFilterButtons(button);
            });
        });
    }

    setupSearch() {
        // Create search input if it doesn't exist
        let searchInput = document.querySelector('.gallery-search');
        if (!searchInput) {
            searchInput = this.createSearchInput();
        }

        if (searchInput) {
            const debouncedSearch = this.debounce((query) => {
                this.setSearch(query);
            }, this.config.searchDelay);

            searchInput.addEventListener('input', (e) => {
                debouncedSearch(e.target.value);
            });
        }
    }

    createSearchInput() {
        const searchContainer = document.createElement('div');
        searchContainer.className = 'gallery-search-container';
        searchContainer.style.cssText = `
            margin: 2rem 0;
            max-width: 400px;
            margin-left: auto;
            margin-right: auto;
            position: relative;
        `;

        searchContainer.innerHTML = `
            <input type="text" 
                   class="gallery-search" 
                   placeholder="Search projects by title, student, or technology..."
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

        const filtersContainer = document.querySelector('.gallery-filters');
        if (filtersContainer) {
            filtersContainer.insertAdjacentElement('afterend', searchContainer);
        }

        return searchContainer.querySelector('.gallery-search');
    }

    setupSorting() {
        // Create sort dropdown
        const sortContainer = this.createSortDropdown();
        
        const filtersContainer = document.querySelector('.gallery-filters');
        if (filtersContainer && sortContainer) {
            filtersContainer.appendChild(sortContainer);
        }
    }

    createSortDropdown() {
        const sortContainer = document.createElement('div');
        sortContainer.className = 'gallery-sort';
        sortContainer.style.cssText = `
            margin-left: auto;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        `;

        sortContainer.innerHTML = `
            <label for="sortSelect" style="color: var(--text-color); font-size: 0.9rem;">Sort by:</label>
            <select id="sortSelect" class="sort-select" style="
                padding: 0.5rem;
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 8px;
                background: var(--surface-color);
                color: var(--text-color);
                font-size: 0.9rem;
            ">
                <option value="date-desc">Newest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="likes-desc">Most Liked</option>
                <option value="views-desc">Most Viewed</option>
                <option value="title-asc">Title A-Z</option>
                <option value="student-asc">Student A-Z</option>
            </select>
        `;

        const sortSelect = sortContainer.querySelector('.sort-select');
        sortSelect.addEventListener('change', (e) => {
            const [sortBy, sortOrder] = e.target.value.split('-');
            this.setSorting(sortBy, sortOrder);
        });

        return sortContainer;
    }

    setupLoadMore() {
        this.loadMoreBtn = document.getElementById('loadMoreBtn');
        
        if (this.loadMoreBtn) {
            this.loadMoreBtn.addEventListener('click', () => {
                this.loadMoreProjects();
            });
        }
    }

    setupProjectModals() {
        // Setup modal for detailed project view
        this.createProjectModal();
        
        // Close modal on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isModalOpen()) {
                this.closeProjectModal();
            }
        });
    }

    createProjectModal() {
        const modal = document.createElement('div');
        modal.className = 'project-modal';
        modal.id = 'projectModal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: none;
            z-index: 10000;
            overflow-y: auto;
        `;

        modal.innerHTML = `
            <div class="modal-content" style="
                max-width: 900px;
                margin: 2rem auto;
                background: var(--surface-color);
                border-radius: 20px;
                position: relative;
                animation: modalSlideIn 0.3s ease-out;
            ">
                <button class="modal-close" style="
                    position: absolute;
                    top: 1rem;
                    right: 1rem;
                    background: rgba(255, 255, 255, 0.1);
                    border: none;
                    color: var(--text-color);
                    font-size: 1.5rem;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    cursor: pointer;
                    z-index: 10001;
                ">
                    <i class="fas fa-times"></i>
                </button>
                <div class="modal-body"></div>
            </div>
        `;

        document.body.appendChild(modal);
        this.projectModal = modal;

        // Setup close button
        const closeBtn = modal.querySelector('.modal-close');
        closeBtn.addEventListener('click', () => this.closeProjectModal());

        // Close on backdrop click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeProjectModal();
            }
        });
    }

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (!this.isGalleryInFocus()) return;

            switch (e.key) {
                case 'ArrowRight':
                    this.navigateToNextProject();
                    break;
                case 'ArrowLeft':
                    this.navigateToPrevProject();
                    break;
                case 'Enter':
                    if (document.activeElement.classList.contains('project-card')) {
                        this.openProjectModal(document.activeElement.dataset.projectId);
                    }
                    break;
            }
        });
    }

    setFilter(filter) {
        this.currentFilter = filter;
        this.displayedProjects = 0;
        this.renderProjects();
        this.announceFilterChange(filter);
    }

    setSearch(query) {
        this.searchQuery = query.toLowerCase();
        this.displayedProjects = 0;
        this.renderProjects();
        this.announceSearchChange(query);
    }

    setSorting(sortBy, sortOrder) {
        this.sortBy = sortBy;
        this.sortOrder = sortOrder;
        this.displayedProjects = 0;
        this.renderProjects();
    }

    updateFilterButtons(activeButton) {
        this.filterButtons.forEach(btn => btn.classList.remove('active'));
        activeButton.classList.add('active');
    }

    getFilteredProjects() {
        let filtered = [...this.projects];

        // Apply category filter
        if (this.currentFilter !== 'all') {
            filtered = filtered.filter(project => project.category === this.currentFilter);
        }

        // Apply search filter
        if (this.searchQuery) {
            filtered = filtered.filter(project => 
                project.title.toLowerCase().includes(this.searchQuery) ||
                project.student.toLowerCase().includes(this.searchQuery) ||
                project.description.toLowerCase().includes(this.searchQuery) ||
                project.tech.some(tech => tech.toLowerCase().includes(this.searchQuery))
            );
        }

        // Apply sorting
        filtered.sort((a, b) => {
            let aValue = a[this.sortBy];
            let bValue = b[this.sortBy];

            if (this.sortBy === 'date') {
                aValue = new Date(aValue);
                bValue = new Date(bValue);
            }

            if (typeof aValue === 'string') {
                aValue = aValue.toLowerCase();
                bValue = bValue.toLowerCase();
            }

            if (this.sortOrder === 'asc') {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });

        return filtered;
    }

    renderProjects() {
        const filteredProjects = this.getFilteredProjects();
        const projectsToShow = filteredProjects.slice(0, this.displayedProjects + this.projectsPerPage);
        
        this.galleryGrid.innerHTML = '';
        this.galleryGrid.classList.remove('loading');

        if (projectsToShow.length === 0) {
            this.showNoResults();
            return;
        }

        projectsToShow.forEach((project, index) => {
            const projectCard = this.createProjectCard(project, index);
            this.galleryGrid.appendChild(projectCard);
        });

        this.displayedProjects = projectsToShow.length;
        this.updateLoadMoreButton(filteredProjects.length);
        this.animateCards();
    }

    createProjectCard(project, index) {
        const card = document.createElement('div');
        card.className = 'project-card';
        card.dataset.projectId = project.id;
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', `View ${project.title} by ${project.student}`);
        
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';

        card.innerHTML = `
            <div class="project-image">
                <img src="${project.image}" alt="${project.title}" loading="lazy" 
                     onerror="this.src='/images/placeholder-project.jpg'">
                <div class="project-overlay">
                    <button class="view-project-btn" aria-label="View project details">
                        <i class="fas fa-eye"></i> View Project
                    </button>
                    ${project.featured ? '<div class="featured-badge"><i class="fas fa-star"></i> Featured</div>' : ''}
                </div>
            </div>
            <div class="project-info">
                <div class="student-meta">
                    <div class="student-avatar">
                        ${this.getStudentInitials(project.student)}
                    </div>
                    <div class="student-details">
                        <h4>${project.student}</h4>
                        <span class="age-program">${project.age ? `Age ${project.age}` : 'Team Project'} • ${this.getProgramName(project.program)}</span>
                    </div>
                </div>
                <h3>${project.title}</h3>
                <p class="project-description">${this.truncateDescription(project.description, 100)}</p>
                <div class="project-tech">
                    ${project.tech.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                </div>
                <div class="project-stats">
                    <div class="stat-group">
                        <span class="project-likes">
                            <i class="fas fa-heart"></i> ${project.likes}
                        </span>
                        <span class="project-views">
                            <i class="fas fa-eye"></i> ${project.views}
                        </span>
                    </div>
                    <span class="project-date">${this.formatDate(project.date)}</span>
                </div>
            </div>
        `;

        // Add click handlers
        card.addEventListener('click', () => this.openProjectModal(project.id));
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.openProjectModal(project.id);
            }
        });

        return card;
    }

    showNoResults() {
        this.galleryGrid.innerHTML = `
            <div class="no-results" style="
                grid-column: 1 / -1;
                text-align: center;
                padding: 4rem 2rem;
                color: var(--text-color);
            ">
                <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                <h3>No projects found</h3>
                <p>Try adjusting your search or filter criteria.</p>
                <button class="btn btn-secondary" onclick="window.location.reload()" style="margin-top: 1rem;">
                    Reset Filters
                </button>
            </div>
        `;
    }

    animateCards() {
        const cards = this.galleryGrid.querySelectorAll('.project-card');
        
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
                card.style.transition = 'all 0.6s ease';
            }, index * this.config.animationDelay);
        });
    }

    loadMoreProjects() {
        if (this.isLoading) return;

        this.isLoading = true;
        this.loadMoreBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
        this.loadMoreBtn.disabled = true;

        setTimeout(() => {
            this.renderProjects();
            this.isLoading = false;
            this.loadMoreBtn.innerHTML = '<i class="fas fa-plus-circle"></i> Load More Projects';
            this.loadMoreBtn.disabled = false;
        }, this.config.loadMoreDelay);
    }

    updateLoadMoreButton(totalFiltered) {
        if (!this.loadMoreBtn) return;

        if (this.displayedProjects >= totalFiltered) {
            this.loadMoreBtn.style.display = 'none';
        } else {
            this.loadMoreBtn.style.display = 'inline-flex';
        }
    }

    openProjectModal(projectId) {
        const project = this.projects.find(p => p.id == projectId);
        if (!project) return;

        this.renderProjectModal(project);
        this.projectModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Focus management
        setTimeout(() => {
            const closeBtn = this.projectModal.querySelector('.modal-close');
            closeBtn.focus();
        }, 100);

        this.trackProjectView(project);
    }

    renderProjectModal(project) {
        const modalBody = this.projectModal.querySelector('.modal-body');
        
        modalBody.innerHTML = `
            <div class="project-hero" style="
                height: 400px;
                background: url('${project.image}') center/cover;
                position: relative;
                border-radius: 20px 20px 0 0;
            ">
                <div class="project-hero-overlay" style="
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    background: linear-gradient(transparent, rgba(0,0,0,0.8));
                    padding: 2rem;
                    color: white;
                ">
                    <h1>${project.title}</h1>
                    <p>by ${project.student} ${project.age ? `(Age ${project.age})` : ''}</p>
                </div>
            </div>
            
            <div class="project-details" style="padding: 2rem;">
                <div class="project-meta" style="
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 1rem;
                    margin-bottom: 2rem;
                ">
                    <div class="meta-item">
                        <strong>Program:</strong> ${this.getProgramName(project.program)}
                    </div>
                    <div class="meta-item">
                        <strong>Difficulty:</strong> ${project.difficulty}
                    </div>
                    <div class="meta-item">
                        <strong>Completed:</strong> ${this.formatDate(project.date)}
                    </div>
                    <div class="meta-item">
                        <strong>Views:</strong> ${project.views}
                    </div>
                </div>
                
                <div class="project-description" style="margin-bottom: 2rem;">
                    <h3>About This Project</h3>
                    <p style="line-height: 1.6; margin-top: 1rem;">${project.description}</p>
                </div>
                
                <div class="project-technologies" style="margin-bottom: 2rem;">
                    <h3>Technologies Used</h3>
                    <div class="tech-list" style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 1rem;">
                        ${project.tech.map(tech => `
                            <span class="tech-tag-large" style="
                                background: linear-gradient(45deg, var(--primary-color), var(--secondary-color));
                                color: white;
                                padding: 0.5rem 1rem;
                                border-radius: 20px;
                                font-size: 0.9rem;
                                font-weight: 500;
                            ">${tech}</span>
                        `).join('')}
                    </div>
                </div>
                
                ${project.screenshots && project.screenshots.length > 0 ? `
                    <div class="project-screenshots" style="margin-bottom: 2rem;">
                        <h3>Screenshots</h3>
                        <div class="screenshot-gallery" style="
                            display: grid;
                            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                            gap: 1rem;
                            margin-top: 1rem;
                        ">
                            ${project.screenshots.map(screenshot => `
                                <img src="${screenshot}" alt="Project screenshot" style="
                                    width: 100%;
                                    border-radius: 10px;
                                    cursor: pointer;
                                " onclick="window.open('${screenshot}', '_blank')">
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
                
                <div class="project-actions" style="
                    display: flex;
                    gap: 1rem;
                    justify-content: center;
                    flex-wrap: wrap;
                    margin-top: 2rem;
                ">
                    ${project.projectUrl ? `
                        <a href="${project.projectUrl}" target="_blank" class="btn btn-primary" style="
                            display: inline-flex;
                            align-items: center;
                            gap: 0.5rem;
                            text-decoration: none;
                        ">
                            <i class="fas fa-external-link-alt"></i>
                            View Live Project
                        </a>
                    ` : ''}
                    
                    <button class="btn btn-secondary like-btn" data-project-id="${project.id}" style="
                        display: inline-flex;
                        align-items: center;
                        gap: 0.5rem;
                    ">
                        <i class="fas fa-heart"></i>
                        Like (${project.likes})
                    </button>
                    
                    <button class="btn btn-secondary share-btn" onclick="navigator.share ? navigator.share({title: '${project.title}', url: window.location.href}) : alert('Link copied!')" style="
                        display: inline-flex;
                        align-items: center;
                        gap: 0.5rem;
                    ">
                        <i class="fas fa-share"></i>
                        Share
                    </button>
                </div>
            </div>
        `;

        // Setup like button
        const likeBtn = modalBody.querySelector('.like-btn');
        if (likeBtn) {
            likeBtn.addEventListener('click', () => this.toggleLike(project.id));
        }
    }

    closeProjectModal() {
        this.projectModal.style.display = 'none';
        document.body.style.overflow = '';
        
        // Return focus to the project card
        const projectCard = document.querySelector(`[data-project-id="${this.currentProjectId}"]`);
        if (projectCard) {
            projectCard.focus();
        }
    }

    isModalOpen() {
        return this.projectModal.style.display === 'block';
    }

    isGalleryInFocus() {
        const activeElement = document.activeElement;
        return this.galleryGrid.contains(activeElement) || this.projectModal.contains(activeElement);
    }

    navigateToNextProject() {
        const currentIndex = this.getCurrentProjectIndex();
        const nextProject = this.getFilteredProjects()[currentIndex + 1];
        
        if (nextProject) {
            this.openProjectModal(nextProject.id);
        }
    }

    navigateToPrevProject() {
        const currentIndex = this.getCurrentProjectIndex();
        const prevProject = this.getFilteredProjects()[currentIndex - 1];
        
        if (prevProject) {
            this.openProjectModal(prevProject.id);
        }
    }

    getCurrentProjectIndex() {
        const activeElement = document.activeElement;
        if (!activeElement || !activeElement.classList.contains('project-card')) {
            return -1;
        }

        return Array.from(this.galleryGrid.querySelectorAll('.project-card')).indexOf(activeElement);
    }

    debounce(func, delay) {
        let timeout;
        return function(...args) {
            const context = this;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), delay);
        };
    }

    truncateDescription(description, maxLength) {
        if (description.length <= maxLength) return description;
        const truncated = description.slice(0, maxLength - 3) + '...';
        return truncated;
    }

    formatDate(dateString) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    }

    getProgramName(programCode) {
        const programNames = {
            junior: 'Junior Coders',
            intermediate: 'Intermediate Coders',
            senior: 'Senior Coders'
        };
        return programNames[programCode] || programCode;
    }

    getStudentInitials(studentName) {
        return studentName.split(' ').map(name => name.charAt(0).toUpperCase()).join('');
    }

    trackProjectView(project) {
        // Placeholder for analytics or tracking code
        console.log(`Project viewed: ${project.title} by ${project.student}`);
    }

    toggleLike(projectId) {
        const project = this.projects.find(p => p.id == projectId);
        if (!project) return;

        // Toggle like status (naive implementation)
        project.likes = project.likes ? project.likes + 1 : 1;

        // Update UI
        const likeBtn = this.projectModal.querySelector('.like-btn');
        if (likeBtn) {
            likeBtn.innerHTML = `<i class="fas fa-heart"></i> Liked (${project.likes})`;
        }

        // Optionally, send like action to server
        console.log(`Project liked: ${project.title} by ${project.student}`);
    }
}

// Initialize the gallery when the document is ready
document.addEventListener('DOMContentLoaded', () => {
    new ProjectGallery();
});