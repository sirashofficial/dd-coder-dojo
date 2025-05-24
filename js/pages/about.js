/**
 * DD Coder Dojo - Enhanced About Page
 * Dynamic team loading with error handling and animations
 */

class AboutPageManager {
    constructor() {
        this.teamData = [];
        this.config = {
            teamDataFile: 'data/team.json',
            animationDelay: 200,
            maxRetries: 3,
            retryDelay: 1000
        };
        
        this.init();
    }

    async init() {
        try {
            console.log('📋 Loading about page content...');
            
            await this.waitForMainApp();
            await this.loadTeamData();
            this.renderTeamSection();
            this.setupAnimations();
            
            console.log('✅ About page loaded successfully!');
            
        } catch (error) {
            console.error('❌ About page initialization failed:', error);
            this.showFallbackContent();
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

    async loadTeamData() {
        let attempts = 0;
        
        while (attempts < this.config.maxRetries) {
            try {
                const response = await fetch(this.config.teamDataFile);
                
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                
                this.teamData = await response.json();
                
                // Validate and filter active team members
                this.teamData = this.teamData.filter(member => 
                    member.active !== false && member.name && member.role
                );
                
                return; // Success!
                
            } catch (error) {
                attempts++;
                console.warn(`Team data load attempt ${attempts} failed:`, error);
                
                if (attempts < this.config.maxRetries) {
                    await this.delay(this.config.retryDelay);
                } else {
                    throw new Error(`Failed to load team data after ${this.config.maxRetries} attempts`);
                }
            }
        }
    }

    renderTeamSection() {
        const teamGrid = document.getElementById('team-grid');
        const loadingIndicator = document.getElementById('team-loading');
        
        if (!teamGrid) {
            console.warn('Team grid container not found');
            return;
        }

        // Hide loading indicator
        if (loadingIndicator) {
            loadingIndicator.style.display = 'none';
        }

        // Clear existing content
        teamGrid.innerHTML = '';

        // Create team member cards
        this.teamData.forEach((member, index) => {
            const memberCard = this.createMemberCard(member, index);
            teamGrid.appendChild(memberCard);
        });

        console.log(`✅ Rendered ${this.teamData.length} team members`);
    }

    createMemberCard(member, index) {
        const card = document.createElement('div');
        card.className = 'team-member';
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease';
        card.style.animationDelay = `${index * this.config.animationDelay}ms`;

        // Handle missing images gracefully
        const imageUrl = member.image || 'images/mentors/placeholder.jpg';
        
        card.innerHTML = `
            <div class="member-img">
                <img src="${imageUrl}" 
                     alt="${member.name}" 
                     loading="lazy"
                     onerror="this.src='images/mentors/placeholder.jpg'; this.onerror=null;">
            </div>
            <div class="member-info">
                <h3>${member.name}</h3>
                <p class="role">${member.role}</p>
                <div class="member-bio">
                    <p>${member.bio || 'Team member biography coming soon.'}</p>
                </div>
                ${this.createSocialLinks(member.social || {})}
            </div>
        `;

        return card;
    }

    createSocialLinks(social) {
        const socialLinks = [];
        
        // Only include links that aren't just "#" placeholders
        if (social.linkedin && social.linkedin !== '#') {
            socialLinks.push(`
                <a href="${social.linkedin}" 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   aria-label="${social.linkedin.includes('linkedin') ? 'LinkedIn' : 'Professional Profile'}">
                    <i class="fab fa-linkedin"></i>
                </a>
            `);
        }
        
        if (social.github && social.github !== '#') {
            socialLinks.push(`
                <a href="${social.github}" 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   aria-label="GitHub Profile">
                    <i class="fab fa-github"></i>
                </a>
            `);
        }
        
        if (social.twitter && social.twitter !== '#') {
            socialLinks.push(`
                <a href="${social.twitter}" 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   aria-label="Twitter Profile">
                    <i class="fab fa-twitter"></i>
                </a>
            `);
        }

        return socialLinks.length > 0 ? 
            `<div class="member-social">${socialLinks.join('')}</div>` : 
            '';
    }

    setupAnimations() {
        // Use Intersection Observer for scroll-triggered animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observe all team member cards
        const teamCards = document.querySelectorAll('.team-member');
        teamCards.forEach(card => observer.observe(card));

        // Also setup other page animations
        this.setupSectionAnimations();
    }

    setupSectionAnimations() {
        const sections = document.querySelectorAll('.mission-vision-box, .timeline-item');
        
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    sectionObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        sections.forEach(section => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(30px)';
            section.style.transition = 'all 0.6s ease';
            sectionObserver.observe(section);
        });
    }

    showFallbackContent() {
        const teamGrid = document.getElementById('team-grid');
        const loadingIndicator = document.getElementById('team-loading');
        
        if (loadingIndicator) {
            loadingIndicator.style.display = 'none';
        }

        if (teamGrid) {
            teamGrid.innerHTML = `
                <div class="fallback-message" style="
                    grid-column: 1 / -1;
                    text-align: center;
                    padding: 3rem;
                    background: var(--surface-color);
                    border-radius: 15px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                ">
                    <h3 style="color: var(--secondary-color); margin-bottom: 1rem;">
                        <i class="fas fa-users"></i> Meet Our Team
                    </h3>
                    <p style="color: var(--text-color); margin-bottom: 2rem;">
                        Our dedicated peer mentors guide students through their coding journey. 
                        Contact us to learn more about our amazing team!
                    </p>
                    <a href="contact.html" class="btn btn-secondary">Get In Touch</a>
                </div>
            `;
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    new AboutPageManager();
});

// Export for testing/debugging
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AboutPageManager;
}