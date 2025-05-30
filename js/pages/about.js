/**
 * Code with Ubuntu - Enhanced About Page
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
    }    async loadTeamData() {
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
                
                // Check if this is a CORS error or file protocol issue
                if (window.location.protocol === 'file:' || 
                    error.name === 'TypeError' || 
                    error.message.includes('Failed to fetch') ||
                    error.message.includes('CORS') ||
                    error.message.includes('not allowed')) {
                    console.info('File protocol or CORS restriction detected. Using fallback team data.');
                    this.loadFallbackTeamData();
                    return;
                }
                
                if (attempts < this.config.maxRetries) {
                    await this.delay(this.config.retryDelay);
                } else {
                    // Use fallback data as last resort
                    console.info('Using fallback team data after failed attempts');
                    this.loadFallbackTeamData();
                    return;
                }
            }
        }
    }

    loadFallbackTeamData() {
        // Fallback team data for when JSON loading fails (e.g., CORS restrictions)
        this.teamData = [
            {
                name: "Ashley Fredericks",
                role: "Founder & Lead Instructor",
                bio: "Passionate educator with 10+ years experience in programming and youth development. Dedicated to making coding accessible to all children.",
                image: "images/team/ashley.jpg",
                social: {
                    email: "ashley@kcasa.org.za",
                    linkedin: "#"
                },
                active: true
            },
            {
                name: "Aaron Smith",
                role: "Technical Coordinator",
                bio: "Full-stack developer with expertise in web technologies and teaching young programmers.",
                image: "images/team/aaron.jpg",
                social: {
                    github: "#",
                    email: "aaron@kcasa.org.za"
                },
                active: true
            },
            {
                name: "Sanele Ndaba",
                role: "Python Instructor",
                bio: "Software engineer passionate about introducing kids to the world of Python programming.",
                image: "images/team/sanele.jpg",
                social: {
                    github: "#"
                },
                active: true
            },
            {
                name: "Mthokozisi Dlamini",
                role: "Web Development Mentor",
                bio: "Frontend developer helping students create amazing web projects and learn modern development practices.",
                image: "images/team/mthokozisi.jpg",
                social: {
                    portfolio: "#"
                },
                active: true
            },
            {
                name: "Sindi Ngcobo",
                role: "Scratch Programming Specialist",
                bio: "Creative educator making programming fun and accessible for younger students through visual programming.",
                image: "images/team/sindi.jpg",
                social: {
                    email: "sindi@kcasa.org.za"
                },
                active: true
            }
        ];
        
        console.log('✅ Fallback team data loaded successfully');
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
        const imageUrl = member.image || 'images/team/placeholder.jpg';
        
        card.innerHTML = `
            <div class="member-img">
                <img src="${imageUrl}" 
                     alt="${member.name}" 
                     loading="lazy"
                     onerror="this.src='images/team/placeholder.jpg'; this.onerror=null;">
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

// === Advanced jQuery Effects & Enhancements ===
// Check if jQuery is loaded before using it
if (typeof $ !== 'undefined') {
  $(function() {
    // 1. Animated Timeline Reveal
    $('.timeline-item').css({opacity:0, transform:'translateY(40px)'});
    function revealTimeline() {
      $('.timeline-item').each(function(i, el) {
        if ($(el).offset().top < $(window).scrollTop() + $(window).height() - 60) {
          $(el).css({opacity:1, transform:'translateY(0)', transition:'all 0.7s cubic-bezier(0.4,0,0.2,1) '+(i*120)+'ms'});
        }
    });
  }
  $(window).on('scroll resize', revealTimeline);
  revealTimeline();
  // 2. Team Member Card Simple Hover Effect (no 3D movement)
  $(document).on('mouseenter', '.team-member', function(e) {
    const $card = $(this);
    // Simple subtle lift effect only
    $card.css('transform', 'translateY(-2px)');
  });
  $(document).on('mouseleave', '.team-member', function() {
    $(this).css('transform', 'translateY(0)');
  });
  // Modal popup for team member
  $(document).on('click', '.team-member', function() {
    const $card = $(this);
    const name = $card.find('h3').text();
    const role = $card.find('.role').text();
    const bio = $card.find('.member-bio').text();
    const img = $card.find('img').attr('src');
    const socials = $card.find('.member-social').html() || '';
    const modal = $(
      `<div class="team-modal-overlay" tabindex="0">
        <div class="team-modal" role="dialog" aria-modal="true">
          <button class="modal-close" aria-label="Close">&times;</button>
          <img src="${img}" alt="${name}" class="modal-img"/>
          <h3>${name}</h3>
          <p class="role">${role}</p>
          <div class="modal-bio">${bio}</div>
          <div class="modal-social">${socials}</div>
        </div>
      </div>`
    );
    $('body').append(modal);
    setTimeout(()=>modal.addClass('active'),10);
    modal.focus();
  });
  $(document).on('click keydown', '.modal-close, .team-modal-overlay', function(e) {
    if (e.type === 'click' || e.key === 'Escape') {
      $('.team-modal-overlay').removeClass('active');
      setTimeout(()=>$('.team-modal-overlay').remove(),300);
    }
  });
  $(document).on('click', '.team-modal', function(e) { e.stopPropagation(); });

  // 3. Special Section Pulse on Hover + Animated Counters
  $('.special-item').hover(
    function() { $(this).css({'box-shadow':'0 0 24px 0 var(--secondary-color)','transform':'scale(1.04)'}); },
    function() { $(this).css({'box-shadow':'','transform':'scale(1)'}); }
  );
  function animateCounters() {
    $('.special-counter').each(function() {
      const $el = $(this);
      if ($el.data('animated')) return;
      if ($el.offset().top < $(window).scrollTop() + $(window).height() - 40) {
        $el.data('animated',true);
        const target = +$el.data('target');
        let count = 0;
        const step = Math.ceil(target/60);
        function update() {
          count += step;
          if (count >= target) { $el.text(target); return; }
          $el.text(count);
          setTimeout(update, 20);
        }
        update();
      }
    });
  }
  $(window).on('scroll resize', animateCounters);
  animateCounters();

  // 4. Smooth Scroll for Anchor Links
  $('a[href^="#"]').on('click', function(e) {
    const target = $(this.getAttribute('href'));
    if (target.length) {
      e.preventDefault();
      $('html, body').animate({scrollTop: target.offset().top - 40}, 700);
      target.addClass('section-in-view');
      setTimeout(()=>target.removeClass('section-in-view'), 1200);
    }
  });

  // 5. Testimonials Carousel
  let tIndex = 0;
  const $testimonials = $('.testimonial');
  function showTestimonial(idx) {
    $testimonials.removeClass('active').eq(idx).addClass('active');
  }
  $('.testimonial-next').on('click', function() {
    tIndex = (tIndex+1)%$testimonials.length;
    showTestimonial(tIndex);
  });
  $('.testimonial-prev').on('click', function() {
    tIndex = (tIndex-1+$testimonials.length)%$testimonials.length;
    showTestimonial(tIndex);
  });
  setInterval(function(){
    tIndex = (tIndex+1)%$testimonials.length;
    showTestimonial(tIndex);
  }, 7000);

  // 6. Parallax About Header
  $(window).on('scroll', function() {
    const scroll = $(window).scrollTop();
    $('.about-header').css('background-position', 'center '+(scroll*0.3)+'px');
  });

  // 7. Accessibility: Focus trap for modal
  $(document).on('keydown', '.team-modal-overlay', function(e) {
    if (e.key === 'Tab') {
      const focusable = $(this).find('button, [tabindex]:not([tabindex="-1"])');
      const first = focusable.first()[0];
      const last = focusable.last()[0];
      if (e.shiftKey ? document.activeElement === first : document.activeElement === last) {
        e.preventDefault();
        (e.shiftKey ? last : first).focus();
      }
    }
  });

  // 8. Lazy-load team images
  $('img[loading="lazy"]').each(function(){
    if (!$(this).attr('src')) $(this).attr('src', $(this).data('src'));
  });

  // 9. Dark mode: smooth transition, remember preference
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const savedTheme = localStorage.getItem('theme');
  if(savedTheme) $('body').toggleClass('dark-mode', savedTheme==='dark');
  $('#darkModeToggle').on('click', function() {
    $('body').toggleClass('dark-mode');
    localStorage.setItem('theme', $('body').hasClass('dark-mode') ? 'dark' : 'light');
  });
  $('body').css('transition','background 0.5s, color 0.5s');

  // 10. Mobile: swipe for testimonials
  let startX = null;
  $('.testimonials-carousel').on('touchstart', function(e){
    startX = e.originalEvent.touches[0].clientX;
  });
  $('.testimonials-carousel').on('touchend', function(e){
    if(startX===null) return;
    let endX = e.originalEvent.changedTouches[0].clientX;
    if(endX-startX > 40) $('.testimonial-prev').click();
    else if(startX-endX > 40) $('.testimonial-next').click();
    startX = null;
  });

  // --- Accessibility: Section skip links (optional, for screen readers) ---
  const skipLinkHtml = `
    <div class="skip-links" style="position:absolute; top:-40px; left:0; width:100%;">
      <a href="#team-grid" class="skip-link" style="
        display:inline-block; 
        margin:0.5rem 0; 
        padding:0.5rem 1rem; 
        background:var(--primary-color); 
        color:white; 
        border-radius:4px;
        text-decoration:none;
        transition: top 0.3s;
      ">
        Skip to Team Section
      </a>
      <a href="#contact" class="skip-link" style="
        display:inline-block; 
        margin:0.5rem 0; 
        padding:0.5rem 1rem; 
        background:var(--primary-color); 
        color:white; 
        border-radius:4px;
        text-decoration:none;
        transition: top 0.3s;
      ">
        Skip to Contact
      </a>
    </div>
  `;
  $('body').prepend(skipLinkHtml);
  $('.skip-link').on('focus', function() {
    $(this).css('top', '0');
  }).on('blur', function() {
    $(this).css('top', '-40px');
  });

  // --- Animate new About page sections on scroll with staggered effect ---
  function revealSoftSections() {
    $('.success-stories-section, .for-parents-section, .learning-outcomes-section').each(function() {
      const section = $(this);
      if (section.offset().top < $(window).scrollTop() + $(window).height() * 0.85 && !section.hasClass('revealed')) {
        section.addClass('revealed');
        
        // First animate the section title with fade and slide
        section.find('h2').css({
          opacity: 0,
          transform: 'translateY(-20px)'
        }).animate({
          opacity: 1,
          transform: 'translateY(0)'
        }, 600);
        
        // Then animate the intro text
        setTimeout(() => {
          section.find('.section-intro').css({
            opacity: 0,
            transform: 'translateY(-15px)'
          }).animate({
            opacity: 1,
            transform: 'translateY(0)'
          }, 600);
        }, 200);
        
        // Then animate each card with staggered delay
        const cards = section.find('.success-story, .outcome-card, .parents-guidance, .parents-faq');
        cards.each(function(i) {
          const card = $(this);
          setTimeout(() => {
            card.css({
              opacity: 0,
              transform: 'translateY(30px)'
            }).animate({
              opacity: 1,
              transform: 'translateY(0)'
            }, 600, 'easeOutQuad');
          }, 400 + (i * 150));
        });
        
        // Finally animate the footer with button
        setTimeout(() => {
          section.find('.section-footer').css({
            opacity: 0,
            transform: 'translateY(20px)'
          }).animate({
            opacity: 1, 
            transform: 'translateY(0)'
          }, 600);
        }, 400 + (cards.length * 150));
      }
    });
  }
  
  // Add easing function if not already available
  if ($.easing.easeOutQuad === undefined) {
    $.easing.easeOutQuad = function(x) {
      return 1 - (1 - x) * (1 - x);
    };
  }

  // Set initial state
  $('.success-stories-section, .for-parents-section, .learning-outcomes-section').css({opacity: 1});
  $('.success-stories-section h2, .success-stories-section .section-intro, .success-stories-section .success-story, .success-stories-section .section-footer').css({opacity: 0});
  $('.for-parents-section h2, .for-parents-section .section-intro, .for-parents-section .parents-guidance, .for-parents-section .parents-faq, .for-parents-section .section-footer').css({opacity: 0});
  $('.learning-outcomes-section h2, .learning-outcomes-section .section-intro, .learning-outcomes-section .outcome-card, .learning-outcomes-section .section-footer').css({opacity: 0});
  
  // Trigger animations on scroll
  $(window).on('scroll resize', revealSoftSections);
  
  // Initial check
  setTimeout(revealSoftSections, 100);
  
  // --- Interactive highlights for program cards ---
  $('.outcome-card').hover(function() {
    $(this).siblings().css('opacity', '0.7');
  }, function() {
    $(this).siblings().css('opacity', '1');
  });
  
  // --- Interactive FAQ expand/collapse ---
  $('.parents-faq dt').on('click', function() {
    const dt = $(this);
    const dd = dt.next('dd');
    
    if (dd.hasClass('expanded')) {
      dd.slideUp(300).removeClass('expanded');
      dt.find('i').removeClass('fa-angle-down').addClass('fa-angle-right');
    } else {
      dd.slideDown(300).addClass('expanded');
      dt.find('i').removeClass('fa-angle-right').addClass('fa-angle-down');
    }
  });
    // Initialize FAQ items (collapsed by default)
  $('.parents-faq dd').hide();
  $('.parents-faq dt').find('i').removeClass('fa-angle-right').addClass('fa-angle-right');
});
} else {
  console.warn('jQuery not loaded, skipping jQuery-dependent features in about.js');
}