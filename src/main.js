import './styles/globals.css';
import './styles/home.css';
import './styles/ps1-dashboard.css';
import './styles/ps5-electoral.css';
import { renderSidebar } from './components/sidebar.js';
import { icon } from './components/icons.js';
import { renderHome } from './pages/home.js';
import { renderIntelDashboard } from './pages/intelligence-dashboard.js';
import { renderElectoralAnalytics } from './pages/electoral-analytics.js';

// Build marker — the deploy check greps the live bundle for this string.
window.__CYBERJOAR_BUILD__ = 'cyberjoar-redesign-2026-11-17';

const routes = {
  'home': renderHome,
  'intel-dashboard': renderIntelDashboard,
  'electoral-analytics': renderElectoralAnalytics,
};

let currentPage = 'home';

export function navigateTo(page) {
  currentPage = page;
  const main = document.getElementById('main-content');
  main.innerHTML = '';
  main.scrollTop = 0;

  document.querySelectorAll('.nav-item[data-page]').forEach(item => {
    item.classList.toggle('active', item.dataset.page === page);
  });
  document.querySelectorAll('.mobile-nav-item').forEach(item => {
    item.classList.toggle('active', item.dataset.page === page);
  });

  if (routes[page]) {
    routes[page](main);
  }
}

const toastIcons = { success: 'check', error: 'x', info: 'info' };

export function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.setAttribute('role', 'status');
  toast.innerHTML = `
    <span class="toast-icon">${icon(toastIcons[type] || 'info')}</span>
    <span>${message}</span>
  `;
  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('toast-leaving');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

document.addEventListener('DOMContentLoaded', () => {
  renderSidebar();
  document.querySelectorAll('.mobile-nav-item').forEach(item => {
    item.addEventListener('click', () => navigateTo(item.dataset.page));
  });
  navigateTo('home');
});
