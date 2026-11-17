import { navigateTo } from '../main.js';
import { icon } from './icons.js';

export function renderSidebar() {
  const sidebar = document.getElementById('sidebar');
  sidebar.innerHTML = `
    <div class="topbar-inner">
      <button class="brand" id="brand-home" aria-label="Cyberjoar AI home">
        <span class="brand-mark">${icon('shield')}</span>
        <span class="brand-word">Cyberjoar <span>AI</span></span>
        <span class="brand-tag">Intelligence platform</span>
      </button>

      <div class="topbar-nav" role="navigation" aria-label="Dashboards">
        <a class="nav-item active" data-page="home" id="nav-home" data-magnetic>
          <span class="nav-num">01</span><span>Home</span>
        </a>
        <a class="nav-item" data-page="intel-dashboard" id="nav-intel" data-magnetic>
          <span class="nav-num">02</span><span>Map</span>
        </a>
        <a class="nav-item" data-page="electoral-analytics" id="nav-electoral" data-magnetic>
          <span class="nav-num">03</span><span>Elections</span>
        </a>
        <span class="topbar-sep" aria-hidden="true"></span>
        <a class="nav-item nav-item--ref" id="nav-docs">Overview</a>
        <a class="nav-item nav-item--ref" id="nav-logic">How the forecast works</a>
      </div>

      <div class="topbar-status">
        <span class="status-dot"></span>
        <span>Demo data</span>
      </div>
    </div>
  `;

  document.getElementById('brand-home').addEventListener('click', () => {
    navigateTo('home');
  });

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
