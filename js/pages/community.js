//
// File: community.js
// Purpose: Loads and displays events and fundraisers for the Community page.
// Last updated: 2025-05-25
//

document.addEventListener('DOMContentLoaded', async function() {
  try {
    const response = await fetch('data/events.json');
    if (!response.ok) throw new Error('Failed to load events.json');
    const events = await response.json();
    const eventsGrid = document.getElementById('eventsGrid');
    const fundraisersGrid = document.getElementById('fundraisersGrid');
    if (eventsGrid) {
      eventsGrid.innerHTML = events.filter(ev => ev.type === 'event').map(ev => `
        <div class="event-card">
          <img src="${ev.image}" alt="${ev.title}" class="event-img" style="width:100%;border-radius:12px 12px 0 0;max-height:160px;object-fit:cover;"/>
          <div class="event-date">${ev.date}</div>
          <h3>${ev.title}</h3>
          <p>${ev.description}</p>
        </div>
      `).join('');
    }
    if (fundraisersGrid) {
      fundraisersGrid.innerHTML = events.filter(ev => ev.type === 'fundraiser').map(f => `
        <div class="fundraiser-card">
          <img src="${f.image}" alt="${f.title}" class="event-img" style="width:100%;border-radius:12px 12px 0 0;max-height:160px;object-fit:cover;"/>
          <h3>${f.title}</h3>
          <p>${f.description}</p>
        </div>
      `).join('');
    }
  } catch (e) {
    // fallback to static if needed
  }

  // Load past events
  try {
    const response = await fetch('data/past_events.json');
    if (!response.ok) throw new Error('Failed to load past_events.json');
    const pastEvents = await response.json();
    const pastEventsGrid = document.getElementById('pastEventsGrid');
    if (pastEventsGrid) {
      pastEventsGrid.innerHTML = pastEvents.map(ev => `
        <div class="past-event-card">
          <img src="${ev.image}" alt="${ev.title}" class="event-img" style="width:100%;border-radius:12px 12px 0 0;max-height:160px;object-fit:cover;"/>
          <div class="event-date">${ev.date}</div>
          <h3>${ev.title}</h3>
          <p>${ev.description}</p>
          ${ev.gallery && ev.gallery.length ? `<div class='event-gallery'>${ev.gallery.map(img => `<img src='${img}' alt='Event photo' style='width:60px;height:60px;border-radius:8px;margin:2px;'/>`).join('')}</div>` : ''}
        </div>
      `).join('');
    }
  } catch (e) {}
});
