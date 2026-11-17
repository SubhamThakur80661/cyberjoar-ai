import { navigateTo } from '../main.js';
import { icon } from '../components/icons.js';

const modules = [
  {
    id: 'ps1',
    page: 'intel-dashboard',
    tag: 'Problem statement 1',
    title: 'Intelligence map',
    iconName: 'map',
    iconClass: 'home-module-icon--intel',
    blurb: 'Reports from open sources, field teams and imagery, plotted on one map. Click a marker to read the full report, or drop in your own CSV, JSON or images to add to it.',
    tags: [
      { label: 'OSINT', cls: 'badge-osint' },
      { label: 'HUMINT', cls: 'badge-humint' },
      { label: 'IMINT', cls: 'badge-imint' },
    ],
    features: ['Geospatial markers', 'Drag & drop upload', 'Report popups'],
    link: 'Open the map',
  },
  {
    id: 'ps5',
    page: 'electoral-analytics',
    tag: 'Problem statement 5',
    title: 'Electoral analytics',
    iconName: 'ballot',
    iconClass: 'home-module-icon--electoral',
    blurb: 'Candidates in a constituency, scored across six factors. Move the weights, pick a turnout scenario, and watch the win probabilities shift.',
    tags: [
      { label: 'OSINT sentiment', cls: 'badge-osint' },
      { label: 'Demographics', cls: 'badge-humint' },
      { label: 'Weighted matrix', cls: 'badge-imint' },
    ],
    features: ['Radar charts', 'Weight tuning', 'Win-probability model'],
    link: 'Open the analytics',
  },
];

const stack = ['Vite', 'Leaflet', 'Chart.js', 'PapaParse', 'OpenStreetMap', 'Vanilla JS', 'CSS'];

export function renderHome(container) {
  container.innerHTML = `
    <div class="home-page">
      <div class="home-hero">
        <div class="home-eyebrow">Cyberjoar AI</div>
        <h1>Two dashboards, one workspace.</h1>
        <p>One pulls intelligence reports onto a map. The other scores election candidates and forecasts who wins. Both run on the same demo data, so you can poke around freely.</p>
      </div>

      <div class="home-modules">
        ${modules.map(m => `
          <div class="glass-card home-module" id="home-${m.id}-card">
            <div class="home-module-head">
              <div class="home-module-icon ${m.iconClass}">${icon(m.iconName)}</div>
              <div>
                <div class="home-module-tag">${m.tag}</div>
                <div class="home-module-title">${m.title}</div>
              </div>
            </div>
            <p>${m.blurb}</p>
            <div class="home-module-tags">
              ${m.tags.map(t => `<span class="badge ${t.cls}">${t.label}</span>`).join('')}
            </div>
            <div class="home-module-foot">
              <span class="home-module-features">${m.features.map(f => `<span>${f}</span>`).join('')}</span>
              <span class="home-module-link">${m.link} &rarr;</span>
            </div>
          </div>
        `).join('')}
      </div>

      <div class="home-stack">
        <div class="home-stack-label">Built with</div>
        <div class="home-stack-list">
          ${stack.map(t => `<span>${t}</span>`).join('')}
        </div>
      </div>

      <div class="home-footnote">Cyberjoar AI &middot; OC.41335.2026.59218</div>
    </div>
  `;

  modules.forEach(m => {
    document.getElementById(`home-${m.id}-card`).addEventListener('click', () => {
      navigateTo(m.page);
    });
  });
}
