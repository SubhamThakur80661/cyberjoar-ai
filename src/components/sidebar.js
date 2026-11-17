import { navigateTo } from '../main.js';
import { icon } from './icons.js';

export function renderSidebar() {
  const sidebar = document.getElementById('sidebar');
  sidebar.innerHTML = `
    <div class="sidebar-logo">
      <div class="sidebar-mark">${icon('shield')}</div>
      <div>
        <h1>Cyberjoar AI</h1>
        <div class="subtitle">Intelligence platform</div>
      </div>
    </div>

    <div class="sidebar-nav">
      <div class="nav-section-label">Overview</div>
      <a class="nav-item active" data-page="home" id="nav-home">
        <span class="nav-icon">${icon('home')}</span>
        <span>Home</span>
      </a>

      <div class="nav-section-label">Dashboards</div>
      <a class="nav-item" data-page="intel-dashboard" id="nav-intel">
        <span class="nav-icon">${icon('map')}</span>
        <span>Intelligence map</span>
      </a>
      <a class="nav-item" data-page="electoral-analytics" id="nav-electoral">
        <span class="nav-icon">${icon('ballot')}</span>
        <span>Electoral analytics</span>
      </a>

      <div class="nav-section-label">Reference</div>
      <a class="nav-item" id="nav-docs" style="cursor: pointer;">
        <span class="nav-icon">${icon('doc')}</span>
        <span>Overview</span>
      </a>
      <a class="nav-item" id="nav-logic" style="cursor: pointer;">
        <span class="nav-icon">${icon('cpu')}</span>
        <span>How the forecast works</span>
      </a>
    </div>

    <div class="sidebar-footer">
      <div class="status-badge">
        <span class="status-dot"></span>
        <span>Demo data loaded</span>
      </div>
    </div>
  `;

  sidebar.querySelectorAll('.nav-item[data-page]').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      navigateTo(item.dataset.page);
    });
  });

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
