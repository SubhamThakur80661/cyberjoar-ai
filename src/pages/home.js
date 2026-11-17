import { navigateTo } from '../main.js';
import { icon } from '../components/icons.js';

const modules = [
  {
    id: 'ps1',
    num: '01',
    page: 'intel-dashboard',
    tag: 'Problem statement 1',
    title: 'Intelligence map',
    blurb: 'Reports from open sources, field teams and imagery, plotted on one map. Click a marker to read the full report, or drop in your own CSV, JSON or images to add to it.',
    tags: [
      { label: 'OSINT', cls: 'badge-osint' },
      { label: 'HUMINT', cls: 'badge-humint' },
      { label: 'IMINT', cls: 'badge-imint' },
    ],
    meta: '13 reports · India',
    link: 'Open the map',
  },
  {
    id: 'ps5',
    num: '02',
    page: 'electoral-analytics',
    tag: 'Problem statement 5',
    title: 'Electoral analytics',
    blurb: 'Candidates in a constituency, scored across six factors. Move the weights, pick a turnout scenario, and watch the win probabilities shift.',
    tags: [
      { label: 'OSINT sentiment', cls: 'badge-osint' },
      { label: 'Demographics', cls: 'badge-humint' },
      { label: 'Weighted matrix', cls: 'badge-imint' },
    ],
    meta: '2 constituencies · 7 candidates',
    link: 'Open the analytics',
  },
];

const tickerItems = ['OSINT', 'HUMINT', 'IMINT', 'Win probability', 'Turnout', 'Six factors', 'Live map', 'Demo data'];
const stack = ['Vite', 'Leaflet', 'Chart.js', 'GSAP', 'PapaParse', 'OpenStreetMap', 'Vanilla JS', 'CSS'];

export function renderHome(container) {
  container.innerHTML = `
    <div class="home-page">
      <section class="home-hero">
        <div class="home-eyebrow" data-rise><span class="home-eyebrow-dot"></span>Cyberjoar AI · Two dashboards · One workspace</div>
        <h1 class="home-display" aria-label="See the map. Call the race.">
          <span class="line-mask"><span class="line-inner">See the map.</span></span>
          <span class="line-mask"><span class="line-inner">Call the <em>race.</em></span></span>
        </h1>
        <p class="home-lede" data-rise>Intelligence reports plotted across India, and election candidates scored on six factors. Both run on demo data, so poke around freely.</p>
      </section>

      <div class="home-index">
        ${modules.map(m => `
          <article class="home-index-row" id="home-${m.id}-card" data-rise data-spotlight tabindex="0" role="button" aria-label="${m.link}">
            <span class="home-index-num">${m.num}</span>
            <div class="home-index-body">
              <div class="home-index-tag">${m.tag} · ${m.meta}</div>
              <h2 class="home-index-title">${m.title}</h2>
              <p>${m.blurb}</p>
              <div class="home-index-tags">
                ${m.tags.map(t => `<span class="badge ${t.cls}">${t.label}</span>`).join('')}
              </div>
            </div>
            <span class="home-index-arrow" data-magnetic>${icon('arrowUpRight')}</span>
          </article>
        `).join('')}
      </div>

      <div class="ticker" aria-hidden="true">
        <div class="ticker-track">
          ${[0, 1].map(() => `<span class="ticker-set">${tickerItems.map(t => `<span class="ticker-item">${t}</span>`).join('<span class="ticker-star">·</span>')}</span>`).join('')}
        </div>
      </div>

      <div class="home-stack" data-rise>
        <div class="home-stack-label">Built with</div>
        <div class="home-stack-list">
          ${stack.map(t => `<span>${t}</span>`).join('')}
        </div>
      </div>

      <div class="home-footnote">Cyberjoar AI · OC.41335.2026.59218</div>
    </div>
  `;

  modules.forEach(m => {
    const row = document.getElementById(`home-${m.id}-card`);
    row.addEventListener('click', () => navigateTo(m.page));
    row.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        navigateTo(m.page);
      }
    });
  });
}
