//
// File: home_stats.js
// Purpose: Dynamically loads and animates live statistics from data/statistics.json for the home page.
// Last updated: 2025-05-25
//

document.addEventListener('DOMContentLoaded', async function() {
  try {
    const response = await fetch('data/statistics.json');
    if (!response.ok) throw new Error('Failed to load statistics.json');
    const stats = await response.json();
    // Hero stats
    const heroStats = [
      { selector: '.hero-stats .stat-item:nth-child(1) .stat-number', value: stats.students },
      { selector: '.hero-stats .stat-item:nth-child(2) .stat-number', value: stats.projects },
      { selector: '.hero-stats .stat-item:nth-child(3) .stat-number', value: 3 } // Age groups static
    ];
    heroStats.forEach(stat => {
      const el = document.querySelector(stat.selector);
      if (el) animateNumber(el, stat.value);
    });
    // Showcase stats
    const showcaseStats = [
      { selector: '.showcase-stats .stat-item:nth-child(1) .stat-number', value: stats.projects },
      { selector: '.showcase-stats .stat-item:nth-child(2) .stat-number', value: stats.students },
      { selector: '.showcase-stats .stat-item:nth-child(3) .stat-number', value: stats.mentors } // Success stories as mentors
    ];
    showcaseStats.forEach(stat => {
      const el = document.querySelector(stat.selector);
      if (el) animateNumber(el, stat.value);
    });
    // Live statistics section
    const statCards = [
      { selector: '.stats-grid .stat-card:nth-child(1) .stat-number', value: stats.students },
      { selector: '.stats-grid .stat-card:nth-child(2) .stat-number', value: stats.mentors },
      { selector: '.stats-grid .stat-card:nth-child(3) .stat-number', value: stats.projects },
      { selector: '.stats-grid .stat-card:nth-child(4) .stat-number', value: stats.events }
    ];
    statCards.forEach(stat => {
      const el = document.querySelector(stat.selector);
      if (el) animateNumber(el, stat.value);
    });
  } catch (e) {
    console.warn('Live statistics failed to load:', e);
  }
});

function animateNumber(el, target) {
  let count = 0;
  const step = Math.ceil(target / 60);
  function update() {
    count += step;
    if (count >= target) {
      el.textContent = target;
      return;
    }
    el.textContent = count;
    setTimeout(update, 20);
  }
  update();
}
