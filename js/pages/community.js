//
// File: community.js
// Purpose: Interactive calendar and events display for the Community page.
// Last updated: 2025-01-20
//

class EventCalendar {
  constructor() {
    this.currentDate = new Date();
    this.events = [];
    this.classSchedule = [];
    this.allYearEvents = [];
    this.currentView = 'calendar';
    this.isMobile = window.innerWidth <= 768;
    this.monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    this.dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    this.init();
  }  async init() {
    console.log('🚀 EventCalendar initializing...');
    await this.loadEvents();
    console.log('📅 Events loaded:', this.events.length);
    await this.loadClassSchedule();
    console.log('📚 Class schedule loaded:', this.classSchedule.length);
    this.generateYearlyClassEvents();
    console.log('🔄 Yearly events generated, total events now:', this.events.length);
    this.setupEventListeners();
    this.renderCalendar();
    this.renderEventsGrid();
    this.renderQuickSchedule();
    this.setupMobileOptimizations();
  }  async loadEvents() {
    try {
      const response = await fetch('data/events.json');
      if (!response.ok) throw new Error('Failed to load events.json');
      this.events = await response.json();
    } catch (error) {
      console.error('Error loading events:', error);
      this.events = [];
    }
  }  async loadClassSchedule() {
    try {
      const response = await fetch('data/class-schedule.json');
      if (!response.ok) throw new Error('Failed to load class-schedule.json');
      this.classSchedule = await response.json();
    } catch (error) {
      console.error('Error loading class schedule:', error);
      this.classSchedule = [];
    }
  }

  generateYearlyClassEvents() {
    const currentYear = new Date().getFullYear();
    const startDate = new Date(currentYear, 0, 1); // January 1st
    const endDate = new Date(currentYear, 11, 31); // December 31st    console.log('Generating yearly class events for', currentYear);
    console.log('Class schedule loaded:', this.classSchedule.length, 'classes');
    
    // School holiday periods (approximate South African school holidays)
    // Fixed dates to not exclude current period (May 26, 2025)
    const holidays = [
      { start: new Date(currentYear, 2, 25), end: new Date(currentYear, 3, 8) }, // March 25 - April 8
      { start: new Date(currentYear, 5, 28), end: new Date(currentYear, 6, 18) }, // June 28 - July 18
      { start: new Date(currentYear, 8, 20), end: new Date(currentYear, 9, 5) }, // Sept 20 - Oct 5
      { start: new Date(currentYear, 11, 8), end: new Date(currentYear + 1, 0, 15) } // Dec 8 - Jan 15
    ];
    
    this.classSchedule.forEach(classItem => {
      const dayIndex = this.getDayIndex(classItem.day);
      let currentDate = new Date(startDate);
      
      // Find first occurrence of the day
      while (currentDate.getDay() !== dayIndex) {
        currentDate.setDate(currentDate.getDate() + 1);
      }
      
      console.log(`Processing ${classItem.title} on ${classItem.day} (index: ${dayIndex})`);
      let classCount = 0;
        // Generate weekly recurring events for the year
      while (currentDate <= endDate) {
        // Check if date is not during holidays
        const isHoliday = holidays.some(holiday => 
          currentDate >= holiday.start && currentDate <= holiday.end
        );        if (!isHoliday) {
          const eventDate = this.formatDate(currentDate);
          this.allYearEvents.push({
            ...classItem,
            date: eventDate,
            type: 'class',
            isRecurring: true
          });
          classCount++;
          console.log(`✅ Added class event: ${classItem.title} on ${eventDate} (${classItem.day})`);          // Special debug for today's date
          if (eventDate === '2025-05-26') {
            console.log(`🎯 FOUND TODAY'S CLASS: ${classItem.title} on ${eventDate}`);
          }
        } else {
          console.log(`❌ Skipped holiday date: ${this.formatDate(currentDate)}`);
        }
        
        // Move to next week
        currentDate.setDate(currentDate.getDate() + 7);
      }
      
      console.log(`Generated ${classCount} events for ${classItem.title}`);
    });
    
    console.log('Total class events generated:', this.allYearEvents.length);    // Combine with existing events
    this.events = [...this.events, ...this.allYearEvents];
    console.log('Total events after combining:', this.events.length);
  }

  getDayIndex(dayName) {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return days.indexOf(dayName.toLowerCase());
  }
  setupEventListeners() {
    // Calendar navigation
    document.getElementById('prevMonth')?.addEventListener('click', () => {
      this.currentDate.setMonth(this.currentDate.getMonth() - 1);
      this.renderCalendar();
    });

    document.getElementById('nextMonth')?.addEventListener('click', () => {
      this.currentDate.setMonth(this.currentDate.getMonth() + 1);
      this.renderCalendar();
    });

    // View toggle
    document.getElementById('calendarViewBtn')?.addEventListener('click', () => {
      this.switchView('calendar');
    });

    document.getElementById('listViewBtn')?.addEventListener('click', () => {
      this.switchView('list');
    });

    // Modal close
    document.getElementById('modalClose')?.addEventListener('click', () => {
      this.closeModal();
    });

    document.getElementById('eventModal')?.addEventListener('click', (e) => {
      if (e.target.id === 'eventModal') {
        this.closeModal();
      }
    });

    // Escape key to close modal
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeModal();
      }
    });

    // Mobile optimizations
    window.addEventListener('resize', () => {
      this.isMobile = window.innerWidth <= 768;
      this.setupMobileOptimizations();
    });

    // Touch support for mobile
    this.setupTouchSupport();
    
    // Setup mobile FAB
    this.setupMobileFAB();
  }

  setupMobileOptimizations() {
    const calendarContainer = document.querySelector('.calendar-container');
    const calendarGrid = document.getElementById('calendarGrid');
    
    if (this.isMobile && calendarContainer) {
      calendarContainer.classList.add('mobile-optimized');
      
      // Add swipe gesture support
      let startX = 0;
      let currentX = 0;
      let isSwipping = false;
      
      calendarGrid?.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isSwipping = true;
      });
      
      calendarGrid?.addEventListener('touchmove', (e) => {
        if (!isSwipping) return;
        currentX = e.touches[0].clientX;
      });
      
      calendarGrid?.addEventListener('touchend', () => {
        if (!isSwipping) return;
        isSwipping = false;
        
        const difference = startX - currentX;
        const threshold = 50;
        
        if (Math.abs(difference) > threshold) {
          if (difference > 0) {
            // Swipe left - next month
            this.currentDate.setMonth(this.currentDate.getMonth() + 1);
          } else {
            // Swipe right - previous month
            this.currentDate.setMonth(this.currentDate.getMonth() - 1);
          }
          this.renderCalendar();
        }
      });
    } else if (calendarContainer) {
      calendarContainer.classList.remove('mobile-optimized');
    }
  }

  setupTouchSupport() {
    // Add haptic feedback for mobile devices
    if ('vibrate' in navigator && this.isMobile) {
      document.addEventListener('click', (e) => {
        if (e.target.closest('.calendar-day') || e.target.closest('.event-indicator')) {
          navigator.vibrate(10); // Light haptic feedback
        }
      });
    }
  }

  setupMobileFAB() {
    const mobileFab = document.getElementById('mobileFab');
    const fabMenu = document.getElementById('fabMenu');
    
    if (!mobileFab || !fabMenu) return;
    
    let isMenuOpen = false;
    
    mobileFab.addEventListener('click', () => {
      isMenuOpen = !isMenuOpen;
      mobileFab.classList.toggle('active', isMenuOpen);
      fabMenu.classList.toggle('active', isMenuOpen);
      
      // Haptic feedback for mobile
      if ('vibrate' in navigator) {
        navigator.vibrate(10);
      }
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.mobile-fab-container') && isMenuOpen) {
        isMenuOpen = false;
        mobileFab.classList.remove('active');
        fabMenu.classList.remove('active');
      }
    });
    
    // Close menu on scroll
    window.addEventListener('scroll', () => {
      if (isMenuOpen) {
        isMenuOpen = false;
        mobileFab.classList.remove('active');
        fabMenu.classList.remove('active');
      }
    });
  }

  // Export calendar functionality for mobile users
  exportCalendar() {
    const classEvents = this.events.filter(event => event.type === 'class');
    let icalContent = 'BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//DD Coder Dojo//Class Schedule//EN\n';
    
    classEvents.forEach(event => {
      const startDate = new Date(event.date + 'T' + event.time.split('-')[0] + ':00');
      const endDate = new Date(event.date + 'T' + event.time.split('-')[1] + ':00');
      
      icalContent += `BEGIN:VEVENT\n`;
      icalContent += `UID:${event.id}@ddcoderdojo.org\n`;
      icalContent += `DTSTART:${this.formatICalDate(startDate)}\n`;
      icalContent += `DTEND:${this.formatICalDate(endDate)}\n`;
      icalContent += `SUMMARY:${event.title}\n`;
      icalContent += `DESCRIPTION:${event.description}\\nInstructor: ${event.teacher.name}\\nAge Group: ${event.ageGroup}\n`;
      icalContent += `LOCATION:${event.location}\n`;
      icalContent += `RRULE:FREQ=WEEKLY\n`;
      icalContent += `END:VEVENT\n`;
    });
    
    icalContent += 'END:VCALENDAR';
    
    // Create and download file
    const blob = new Blob([icalContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dd-coder-dojo-schedule.ics';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    // Show success message
    this.showNotification('Calendar exported successfully! Check your downloads folder.', 'success');
  }

  // Format date for iCal
  formatICalDate(date) {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  }

  // Show notification for mobile feedback
  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `mobile-notification ${type}`;
    notification.innerHTML = `
      <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
      <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => document.body.removeChild(notification), 300);
    }, 3000);
  }

  switchView(view) {
    this.currentView = view;
    const calendarContainer = document.querySelector('.calendar-container');
    const calendarNav = document.querySelector('.calendar-navigation');
    const eventsGrid = document.getElementById('eventsGrid');
    const calendarViewBtn = document.getElementById('calendarViewBtn');
    const listViewBtn = document.getElementById('listViewBtn');

    if (view === 'calendar') {
      calendarContainer?.classList.remove('hidden');
      calendarNav?.classList.remove('hidden');
      eventsGrid?.classList.add('hidden');
      calendarViewBtn?.classList.add('active');
      listViewBtn?.classList.remove('active');
    } else {
      calendarContainer?.classList.add('hidden');
      calendarNav?.classList.add('hidden');
      eventsGrid?.classList.remove('hidden');
      calendarViewBtn?.classList.remove('active');
      listViewBtn?.classList.add('active');
    }
  }

  renderCalendar() {
    const calendarGrid = document.getElementById('calendarGrid');
    const currentMonthElement = document.getElementById('currentMonth');
    
    if (!calendarGrid || !currentMonthElement) return;

    // Update month display
    currentMonthElement.textContent = `${this.monthNames[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`;

    // Clear previous calendar
    calendarGrid.innerHTML = '';

    // Get first day of month and number of days
    const firstDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
    const lastDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    // Generate 42 days (6 weeks)
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      const dayElement = this.createDayElement(date);
      calendarGrid.appendChild(dayElement);
    }
  }
  createDayElement(date) {
    const dayElement = document.createElement('div');
    dayElement.className = 'calendar-day';
    
    const isCurrentMonth = date.getMonth() === this.currentDate.getMonth();
    const isToday = this.isToday(date);
    const dayEvents = this.getEventsForDate(date);
    const classEvents = dayEvents.filter(event => event.type === 'class');
    const regularEvents = dayEvents.filter(event => event.type !== 'class');

    if (!isCurrentMonth) {
      dayElement.classList.add('other-month');
    }
    
    if (isToday) {
      dayElement.classList.add('today');
    }
    
    if (dayEvents.length > 0) {
      dayElement.classList.add('has-events');
    }

    // Day number
    const dayNumber = document.createElement('div');
    dayNumber.className = 'day-number';
    dayNumber.textContent = date.getDate();
    dayElement.appendChild(dayNumber);

    // Class indicators (show first)
    classEvents.slice(0, 2).forEach(classEvent => {
      const classIndicator = document.createElement('div');
      classIndicator.className = `event-indicator class-indicator`;
      classIndicator.style.backgroundColor = classEvent.color;
      classIndicator.textContent = this.isMobile ? classEvent.title.substring(0, 8) + '...' : classEvent.title;
      
      // Add teacher hover tooltip
      this.addTeacherTooltip(classIndicator, classEvent);
      
      classIndicator.addEventListener('click', (e) => {
        e.stopPropagation();
        this.showClassModal(classEvent);
      });
      dayElement.appendChild(classIndicator);
    });

    // Regular event indicators
    const remainingSlots = this.isMobile ? 1 : 2;
    regularEvents.slice(0, remainingSlots).forEach(event => {
      const eventIndicator = document.createElement('div');
      eventIndicator.className = `event-indicator ${event.type}`;
      eventIndicator.textContent = this.isMobile ? event.title.substring(0, 8) + '...' : event.title;
      eventIndicator.addEventListener('click', (e) => {
        e.stopPropagation();
        this.showEventModal(event);
      });
      dayElement.appendChild(eventIndicator);
    });

    // More events indicator
    const totalVisible = (this.isMobile ? 3 : 4);
    if (dayEvents.length > totalVisible) {
      const moreIndicator = document.createElement('div');
      moreIndicator.className = 'event-indicator more-events';
      moreIndicator.textContent = `+${dayEvents.length - totalVisible}`;
      moreIndicator.addEventListener('click', (e) => {
        e.stopPropagation();
        this.showDayEvents(date, dayEvents);
      });
      dayElement.appendChild(moreIndicator);
    }

    // Click handler for day
    dayElement.addEventListener('click', () => {
      if (dayEvents.length === 1) {
        if (dayEvents[0].type === 'class') {
          this.showClassModal(dayEvents[0]);
        } else {
          this.showEventModal(dayEvents[0]);
        }
      } else if (dayEvents.length > 1) {
        this.showDayEvents(date, dayEvents);
      }
    });

    return dayElement;
  }

  addTeacherTooltip(element, classEvent) {
    if (!classEvent.teacher) return;
    
    const tooltip = document.createElement('div');
    tooltip.className = 'teacher-tooltip';
    tooltip.innerHTML = `
      <div class="teacher-info">
        <img src="${classEvent.teacher.avatar}" alt="${classEvent.teacher.name}" class="teacher-avatar" onerror="this.src='images/team/default-avatar.jpg'">
        <div class="teacher-details">
          <h4>${classEvent.teacher.name}</h4>
          <p class="teacher-specialty">${classEvent.teacher.specialties.slice(0, 2).join(', ')}</p>
          <p class="class-time">${classEvent.time}</p>
          <p class="enrollment-info">${classEvent.enrolled}/${classEvent.capacity} enrolled</p>
        </div>
      </div>
    `;
    
    element.appendChild(tooltip);
    
    // Position tooltip on hover
    element.addEventListener('mouseenter', (e) => {
      if (!this.isMobile) {
        const rect = element.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();
        
        // Position tooltip above the element
        tooltip.style.bottom = '100%';
        tooltip.style.left = '50%';
        tooltip.style.transform = 'translateX(-50%)';
        tooltip.style.marginBottom = '8px';
        
        // Adjust if tooltip goes off screen
        if (rect.left + tooltipRect.width / 2 > window.innerWidth) {
          tooltip.style.left = 'auto';
          tooltip.style.right = '0';
          tooltip.style.transform = 'none';
        } else if (rect.left - tooltipRect.width / 2 < 0) {
          tooltip.style.left = '0';
          tooltip.style.transform = 'none';
        }
        
        tooltip.classList.add('visible');
      }
    });
      element.addEventListener('mouseleave', () => {
      if (!this.isMobile) {
        tooltip.classList.remove('visible');
      }
    });
  }  getEventsForDate(date) {
    const dateString = this.formatDate(date);
    const events = this.events.filter(event => event.date === dateString);
    console.log(`📊 Events for ${dateString}:`, events.length, events.map(e => e.title));
    return events;
  }

  formatDate(date) {
    return date.toISOString().split('T')[0];
  }

  isToday(date) {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  }
  showClassModal(classEvent) {
    const modal = document.getElementById('eventModal');
    const modalBody = document.getElementById('modalBody');
    
    if (!modal || !modalBody) return;

    const enrollmentPercentage = Math.round((classEvent.enrolled / classEvent.capacity) * 100);
    const availableSpots = classEvent.capacity - classEvent.enrolled;

    modalBody.innerHTML = `
      <div class="class-modal-content">
        <div class="class-header">
          <h3 class="modal-event-title">${classEvent.title}</h3>
          <span class="class-level ${classEvent.level.toLowerCase()}">${classEvent.level}</span>
        </div>
        
        <div class="class-schedule-info">
          <div class="schedule-item">
            <i class="fas fa-calendar"></i>
            <span>Every ${classEvent.day.charAt(0).toUpperCase() + classEvent.day.slice(1)}</span>
          </div>
          <div class="schedule-item">
            <i class="fas fa-clock"></i>
            <span>${classEvent.time}</span>
          </div>
          <div class="schedule-item">
            <i class="fas fa-users"></i>
            <span>Ages ${classEvent.ageGroup}</span>
          </div>
          <div class="schedule-item">
            <i class="fas fa-map-marker-alt"></i>
            <span>${classEvent.location}</span>
          </div>
        </div>

        <div class="teacher-section">
          <h4>Your Instructor</h4>
          <div class="teacher-profile">
            <img src="${classEvent.teacher.avatar}" alt="${classEvent.teacher.name}" class="teacher-profile-image" onerror="this.src='images/team/default-avatar.jpg'">
            <div class="teacher-info-detailed">
              <h5>${classEvent.teacher.name}</h5>
              <p class="teacher-bio">${classEvent.teacher.bio}</p>
              <div class="teacher-specialties">
                <strong>Specialties:</strong>
                ${classEvent.teacher.specialties.map(specialty => `<span class="specialty-tag">${specialty}</span>`).join('')}
              </div>
              <div class="teacher-contact">
                <a href="mailto:${classEvent.teacher.email}" class="contact-link">
                  <i class="fas fa-envelope"></i> ${classEvent.teacher.email}
                </a>
                <a href="tel:${classEvent.teacher.phone}" class="contact-link">
                  <i class="fas fa-phone"></i> ${classEvent.teacher.phone}
                </a>
              </div>
            </div>
          </div>
        </div>

        <div class="class-details">
          <h4>What You'll Learn</h4>
          <p class="class-description">${classEvent.description}</p>
          <div class="technologies">
            <strong>Technologies:</strong>
            ${classEvent.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
          </div>
        </div>

        <div class="enrollment-info">
          <div class="enrollment-stats">
            <div class="stat-item">
              <span class="stat-number">${classEvent.enrolled}</span>
              <span class="stat-label">Enrolled</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">${availableSpots}</span>
              <span class="stat-label">Available</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">${classEvent.capacity}</span>
              <span class="stat-label">Capacity</span>
            </div>
          </div>
          <div class="enrollment-bar">
            <div class="enrollment-progress" style="width: ${enrollmentPercentage}%; background-color: ${classEvent.color}"></div>
          </div>
          <p class="enrollment-text">${enrollmentPercentage}% full</p>
        </div>

        <div class="class-actions">
          ${availableSpots > 0 ? 
            `<button class="btn btn-primary" onclick="window.location.href='contact.html?enroll=${classEvent.id}'">
              <i class="fas fa-user-plus"></i> Enroll Now
            </button>` :
            `<button class="btn btn-secondary" disabled>
              <i class="fas fa-users"></i> Class Full
            </button>`
          }
          <button class="btn btn-outline" onclick="window.location.href='programs.html'">
            <i class="fas fa-info-circle"></i> Learn More
          </button>
        </div>
      </div>
    `;

    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  showEventModal(event) {
    const modal = document.getElementById('eventModal');
    const modalBody = document.getElementById('modalBody');
    
    if (!modal || !modalBody) return;

    modalBody.innerHTML = `
      <img src="${event.image}" alt="${event.title}" class="modal-event-image" onerror="this.style.display='none'">
      <h3 class="modal-event-title">${event.title}</h3>
      <div class="modal-event-date">${this.formatDisplayDate(event.date)}</div>
      <div class="modal-event-description">${event.description}</div>
      <span class="modal-event-type ${event.type}">${event.type}</span>
    `;

    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  renderEventsGrid() {
    const eventsGrid = document.getElementById('eventsGrid');
    const fundraisersGrid = document.getElementById('fundraisersGrid');
    
    if (eventsGrid) {
      // Filter out class events for the events grid
      const regularEvents = this.events.filter(ev => ev.type === 'event');
      const eventItems = regularEvents.map(ev => `
        <div class="event-card">
          <img src="${ev.image}" alt="${ev.title}" class="event-img" style="width:100%;border-radius:12px 12px 0 0;max-height:160px;object-fit:cover;" onerror="this.style.display='none'"/>
          <div class="event-date">${this.formatDisplayDate(ev.date)}</div>
          <h3>${ev.title}</h3>
          <p>${ev.description}</p>
        </div>
      `).join('');
      
      eventsGrid.innerHTML = eventItems || '<p style="text-align: center; color: var(--text-secondary);">No upcoming events found.</p>';
    }
    
    if (fundraisersGrid) {
      const fundraiserItems = this.events.filter(ev => ev.type === 'fundraiser').map(f => `
        <div class="fundraiser-card">
          <img src="${f.image}" alt="${f.title}" class="event-img" style="width:100%;border-radius:12px 12px 0 0;max-height:160px;object-fit:cover;" onerror="this.style.display='none'"/>
          <h3>${f.title}</h3>
          <p>${f.description}</p>
        </div>
      `).join('');
      
      fundraisersGrid.innerHTML = fundraiserItems || '<p style="text-align: center; color: var(--text-secondary);">No fundraisers found.</p>';
    }
  }

  // Add method to filter and display class schedules
  renderClassScheduleView() {
    const classEvents = this.events.filter(event => event.type === 'class');
    const today = new Date();
    const nextWeekClasses = [];
    
    // Get next 7 days of classes
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dayClasses = this.getEventsForDate(date).filter(event => event.type === 'class');
      if (dayClasses.length > 0) {
        nextWeekClasses.push({
          date: date,
          classes: dayClasses
        });
      }
    }
    
    return nextWeekClasses;
  }

  // Enhanced method to show day events with class/event separation
  showDayEvents(date, events) {
    const modal = document.getElementById('eventModal');
    const modalBody = document.getElementById('modalBody');
    
    if (!modal || !modalBody) return;

    const classEvents = events.filter(event => event.type === 'class');
    const regularEvents = events.filter(event => event.type !== 'class');

    let classesHtml = '';
    if (classEvents.length > 0) {
      classesHtml = `
        <div class="day-events-section">
          <h4 style="color: var(--primary-color); margin-bottom: 1rem;">
            <i class="fas fa-chalkboard-teacher"></i> Classes
          </h4>
          ${classEvents.map(event => `
            <div class="day-event-item class-event" style="margin-bottom: 1rem; padding: 1rem; border-radius: 8px; background: rgba(${this.hexToRgb(event.color)}, 0.1); border-left: 4px solid ${event.color};">
              <div style="display: flex; align-items: center; gap: 1rem;">
                <img src="${event.teacher.avatar}" alt="${event.teacher.name}" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;" onerror="this.src='images/team/default-avatar.jpg'">
                <div style="flex: 1;">
                  <h5 style="margin: 0 0 0.25rem 0; color: var(--text-primary);">${event.title}</h5>
                  <p style="margin: 0; color: var(--text-secondary); font-size: 0.9rem;">${event.time} • ${event.teacher.name}</p>
                  <p style="margin: 0.25rem 0 0 0; color: var(--text-secondary); font-size: 0.8rem;">Ages ${event.ageGroup} • ${event.enrolled}/${event.capacity} enrolled</p>
                </div>
                <button class="btn btn-sm btn-primary" onclick="document.querySelector('.event-modal').style.display='none'; setTimeout(() => { document.querySelector('[data-class-id=\\'${event.id}\\']')?.click(); }, 100);" style="font-size: 0.8rem; padding: 0.25rem 0.5rem;">
                  View Details
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }

    let eventsHtml = '';
    if (regularEvents.length > 0) {
      eventsHtml = `
        <div class="day-events-section">
          <h4 style="color: var(--secondary-color); margin-bottom: 1rem; ${classEvents.length > 0 ? 'margin-top: 2rem;' : ''}">
            <i class="fas fa-calendar-star"></i> Events
          </h4>
          ${regularEvents.map(event => `
            <div class="day-event-item" style="margin-bottom: 1rem; padding: 1rem; border-radius: 8px; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(0, 217, 255, 0.1);">
              <img src="${event.image}" alt="${event.title}" style="width: 100%; height: 120px; object-fit: cover; border-radius: 6px; margin-bottom: 0.5rem;" onerror="this.style.display='none'">
              <h5 style="margin: 0.5rem 0; color: var(--text-primary);">${event.title}</h5>
              <p style="color: var(--text-secondary); margin: 0.5rem 0; font-size: 0.9rem;">${event.description}</p>
              <span class="modal-event-type ${event.type}" style="font-size: 0.8rem;">${event.type}</span>
            </div>
          `).join('')}
        </div>
      `;
    }

    modalBody.innerHTML = `
      <h3 class="modal-event-title">${this.formatDisplayDate(this.formatDate(date))}</h3>
      ${classesHtml}
      ${eventsHtml}
    `;

    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    
    // Add click handlers for class detail buttons
    classEvents.forEach(classEvent => {
      const button = modalBody.querySelector(`[data-class-id="${classEvent.id}"]`);      if (button) {
        button.addEventListener('click', () => {
          this.closeModal();
          setTimeout(() => this.showClassModal(classEvent), 100);
        });
      }
    });
  }
  
  // Render quick schedule section for mobile-friendly access
  renderQuickSchedule() {
    const quickScheduleGrid = document.getElementById('quickScheduleGrid');
    if (!quickScheduleGrid) return;

    const today = new Date();
    const thisWeekClasses = [];
      console.log('Rendering quick schedule for today:', today.toDateString());
    console.log('Total events available:', this.events.length);
    
    // Get next 7 days starting from today
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dayClasses = this.getEventsForDate(date).filter(event => event.type === 'class');
      
      console.log(`Day ${i} (${date.toDateString()}):`, dayClasses.length, 'classes found');
      
      dayClasses.forEach(classEvent => {
        thisWeekClasses.push({
          ...classEvent,
          displayDate: date,
          isToday: this.isToday(date),
          dayName: this.dayNames[date.getDay()]
        });
      });
    }

    console.log('This week classes total:', thisWeekClasses.length);
    debugInfo.innerHTML += `<br><strong>Total this week: ${thisWeekClasses.length}</strong>`;

    // Sort by date and time
    thisWeekClasses.sort((a, b) => {
      const dateCompare = a.displayDate - b.displayDate;
      if (dateCompare !== 0) return dateCompare;
      return a.time.localeCompare(b.time);
    });

    if (thisWeekClasses.length === 0) {
      quickScheduleGrid.innerHTML = `
        <div class="no-classes-message" style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: var(--text-secondary);">
             }

    console.log('This week classes total:', thisWeekClasses.length);
      return;
    }

    const quickClassCards = thisWeekClasses.map(classEvent => {
      const enrollmentPercentage = (classEvent.enrolled / classEvent.capacity) * 100;
      let enrollmentStatus = 'low';
      if (enrollmentPercentage >= 80) enrollmentStatus = 'high';
      else if (enrollmentPercentage >= 60) enrollmentStatus = 'medium';

      return `
        <div class="quick-class-card" 
             style="--class-color: ${classEvent.color}" 
             onclick="window.communityCalendar.showClassModal(${JSON.stringify(classEvent).replace(/"/g, '&quot;')})"
             ${classEvent.isToday ? 'data-today="true"' : ''}>
          <div class="quick-class-header">
            <h4 class="quick-class-title">${classEvent.title}</h4>
            <span class="quick-class-day ${classEvent.isToday ? 'today' : ''}">${classEvent.isToday ? 'Today' : classEvent.dayName}</span>
          </div>
          
          <div class="quick-class-time">
            <i class="fas fa-clock"></i>
            ${classEvent.time}
          </div>
          
          <div class="quick-teacher-info">
            <img src="${classEvent.teacher.avatar}" alt="${classEvent.teacher.name}" class="quick-teacher-avatar" onerror="this.src='images/team/default-avatar.jpg'">
            <span class="quick-teacher-name">${classEvent.teacher.name}</span>
          </div>
          
          <div class="quick-class-meta">
            <span class="quick-age-group">
              <i class="fas fa-users"></i> Ages ${classEvent.ageGroup}
            </span>
            <span class="quick-enrollment">
              <span class="enrollment-indicator ${enrollmentStatus}"></span>
              ${classEvent.enrolled}/${classEvent.capacity} enrolled
            </span>
          </div>
        </div>
      `;
    }).join('');

    quickScheduleGrid.innerHTML = quickClassCards;
    
    // Add global reference for click handlers
    window.communityCalendar = this;
  }
}

// Past events functionality
async function loadPastEvents() {
  try {
    const response = await fetch('data/past_events.json');
    if (!response.ok) throw new Error('Failed to load past_events.json');
    const pastEvents = await response.json();
    const pastEventsGrid = document.getElementById('pastEventsGrid');
    
    if (pastEventsGrid) {
      const pastEventItems = pastEvents.map(ev => `
        <div class="past-event-card">
          <img src="${ev.image}" alt="${ev.title}" class="event-img" style="width:100%;border-radius:12px 12px 0 0;max-height:160px;object-fit:cover;" onerror="this.style.display='none'"/>
          <div class="event-date">${new Date(ev.date + 'T00:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
          <h3>${ev.title}</h3>
          <p>${ev.description}</p>
          ${ev.gallery && ev.gallery.length ? `<div class='event-gallery'>${ev.gallery.map(img => `<img src='${img}' alt='Event photo' style='width:60px;height:60px;border-radius:8px;margin:2px;object-fit:cover;'/>`).join('')}</div>` : ''}
        </div>
      `).join('');
      
      pastEventsGrid.innerHTML = pastEventItems || '<p style="text-align: center; color: var(--text-secondary);">No past events found.</p>';
    }
  } catch (error) {
    console.error('Error loading past events:', error);
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  new EventCalendar();
  loadPastEvents();
});
