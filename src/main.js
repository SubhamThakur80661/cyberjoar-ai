/* ===== Main Entry Point ===== */
import './styles/globals.css';
import './styles/ps1-dashboard.css';
import './styles/ps5-electoral.css';
import { renderSidebar } from './components/sidebar.js';
import { renderHome } from './pages/home.js';
import { renderIntelDashboard } from './pages/intelligence-dashboard.js';
import { renderElectoralAnalytics } from './pages/electoral-analytics.js';

// Simple client-side router
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
  
  // Update sidebar active state
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.toggle('active', item.dataset.page === page);
  });

  if (routes[page]) {
    routes[page](main);
  }
}

export function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span>${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}</span>
    <span>${message}</span>
  `;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  renderSidebar();
  navigateTo('home');
});
