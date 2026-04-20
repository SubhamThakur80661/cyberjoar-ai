import { navigateTo } from '../main.js';

export function renderSidebar() {
  const sidebar = document.getElementById('sidebar');
  sidebar.innerHTML = `
    <div class="sidebar-logo">
      <h1>🛡️ CYBERJOAR AI</h1>
      <div class="subtitle">Strategic Intelligence Platform</div>
    </div>
    
    <div class="sidebar-nav">
      <div class="nav-section-label">Overview</div>
      <a class="nav-item active" data-page="home" id="nav-home">
        <span class="nav-icon">🏠</span>
        <span>Command Center</span>
      </a>
      
      <div class="nav-section-label">Problem Statements</div>
      <a class="nav-item" data-page="intel-dashboard" id="nav-intel">
        <span class="nav-icon">🗺️</span>
        <span>Intel Fusion (PS1)</span>
      </a>
      <a class="nav-item" data-page="electoral-analytics" id="nav-electoral">
        <span class="nav-icon">🗳️</span>
        <span>Electoral Matrix (PS5)</span>
      </a>

      <div class="nav-section-label">Resources</div>
      <a class="nav-item" id="nav-docs" style="cursor: pointer;">
        <span class="nav-icon">📄</span>
        <span>Documentation</span>
      </a>
      <a class="nav-item" id="nav-logic" style="cursor: pointer;">
        <span class="nav-icon">🧠</span>
        <span>Algorithm Logic</span>
      </a>
    </div>
    
    <div class="sidebar-footer">
      <div class="status-badge">
        <span class="status-dot"></span>
        <span>System Active — All Modules Online</span>
      </div>
    </div>
  `;

  // Navigation event listeners
  sidebar.querySelectorAll('.nav-item[data-page]').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      navigateTo(item.dataset.page);
    });
  });

  // Documentation link scrolls to logic on electoral page
  document.getElementById('nav-docs').addEventListener('click', () => {
    navigateTo('home');
  });

  document.getElementById('nav-logic').addEventListener('click', () => {
    navigateTo('electoral-analytics');
    setTimeout(() => {
      const el = document.querySelector('.logic-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 500);
  });
}
