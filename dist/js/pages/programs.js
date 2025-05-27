//
// File: programs.js
// Purpose: Dynamically loads and renders program details from data/programs.json for the Programs page.
// Last updated: 2025-05-25
//

document.addEventListener('DOMContentLoaded', async function() {
  const container = document.getElementById('programsGrid');
  if (!container) return;
  try {
    const response = await fetch('data/programs.json');
    if (!response.ok) throw new Error('Failed to load programs.json');
    const programs = await response.json();
    container.innerHTML = programs.map(program => `
      <div class="program-card">
        <div class="program-icon">${program.icon}</div>
        <h3>${program.name}</h3>
        <p>${program.description}</p>
        <ul>
          ${program.details.map(detail => `<li>${detail}</li>`).join('')}
        </ul>
      </div>
    `).join('');
  } catch (e) {
    container.innerHTML = '<p>Failed to load program details.</p>';
  }
});
