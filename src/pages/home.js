import { navigateTo } from '../main.js';

export function renderHome(container) {
  container.innerHTML = `
    <div class="page-container" style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;text-align:center;">
      
      <!-- Hero -->
      <div class="home-hero" style="margin-bottom:48px;animation:fadeInUp 0.6s ease;">
        <div style="font-size:4rem;margin-bottom:16px;">🛡️</div>
        <h1 style="font-size:3rem;font-weight:900;letter-spacing:-2px;margin-bottom:12px;">
          <span style="background:var(--gradient-primary);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">CYBERJOAR AI</span>
        </h1>
        <p style="color:var(--text-secondary);font-size:1.1rem;max-width:600px;line-height:1.7;margin:0 auto;">
          Strategic Intelligence & Predictive Analytics Platform — Unified multi-source data fusion, 
          geospatial visualization, and electoral forecasting engine.
        </p>
      </div>

      <!-- Module Cards -->
      <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:24px;max-width:900px;width:100%;animation:fadeInUp 0.8s ease;">
        
        <!-- PS1 Card -->
        <div class="glass-card" id="home-ps1-card" style="cursor:pointer;text-align:left;position:relative;overflow:hidden;">
          <div style="position:absolute;top:0;left:0;right:0;height:3px;background:var(--gradient-primary);"></div>
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">
            <div style="width:48px;height:48px;border-radius:12px;background:rgba(6,214,160,0.1);display:flex;align-items:center;justify-content:center;font-size:1.5rem;">🗺️</div>
            <div>
              <div style="font-size:0.65rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:2px;">Problem Statement 1</div>
              <div style="font-size:1.1rem;font-weight:700;">Intelligence Fusion Dashboard</div>
            </div>
          </div>
          <p style="font-size:0.85rem;color:var(--text-secondary);line-height:1.7;margin-bottom:20px;">
            Multi-source intelligence ingestion (OSINT, HUMINT, IMINT) with interactive geospatial visualization on a terrain map. 
            Hover-and-view functionality for instant visual confirmation.
          </p>
          <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:20px;">
            <span class="badge badge-osint">OSINT</span>
            <span class="badge badge-humint">HUMINT</span>
            <span class="badge badge-imint">IMINT</span>
            <span class="badge" style="background:rgba(139,92,246,0.15);color:var(--accent-purple);">Leaflet.js</span>
          </div>
          <div style="display:flex;gap:24px;font-size:0.78rem;color:var(--text-muted);">
            <span>📍 Geospatial Markers</span>
            <span>📁 Drag & Drop</span>
            <span>🔍 Hover Popups</span>
          </div>
          <div style="margin-top:20px;">
            <button class="btn btn-primary btn-sm" id="home-goto-ps1">Launch Dashboard →</button>
          </div>
        </div>

        <!-- PS5 Card -->
        <div class="glass-card" id="home-ps5-card" style="cursor:pointer;text-align:left;position:relative;overflow:hidden;">
          <div style="position:absolute;top:0;left:0;right:0;height:3px;background:var(--gradient-purple);"></div>
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">
            <div style="width:48px;height:48px;border-radius:12px;background:rgba(139,92,246,0.1);display:flex;align-items:center;justify-content:center;font-size:1.5rem;">🗳️</div>
            <div>
              <div style="font-size:0.65rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:2px;">Problem Statement 5</div>
              <div style="font-size:1.1rem;font-weight:700;">Electoral Analytics Matrix</div>
            </div>
          </div>
          <p style="font-size:0.85rem;color:var(--text-secondary);line-height:1.7;margin-bottom:20px;">
            Predictive political strategy matrix utilizing OSINT and historical data to compare candidates 
            with Probability of Win (PoW) forecasting across multiple turnout scenarios.
          </p>
          <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:20px;">
            <span class="badge badge-osint">OSINT Sentiment</span>
            <span class="badge badge-humint">Demographics</span>
            <span class="badge badge-imint">Weighted Matrix</span>
            <span class="badge" style="background:rgba(245,158,11,0.15);color:var(--accent-orange);">Chart.js</span>
          </div>
          <div style="display:flex;gap:24px;font-size:0.78rem;color:var(--text-muted);">
            <span>📊 Radar Charts</span>
            <span>⚖️ Weight Tuning</span>
            <span>🎯 PoW Model</span>
          </div>
          <div style="margin-top:20px;">
            <button class="btn btn-primary btn-sm" id="home-goto-ps5" style="background:var(--gradient-purple);">Launch Analytics →</button>
          </div>
        </div>
      </div>

      <!-- Tech Stack -->
      <div style="margin-top:48px;animation:fadeInUp 1s ease;max-width:900px;width:100%;">
        <div style="font-size:0.7rem;text-transform:uppercase;letter-spacing:2px;color:var(--text-muted);margin-bottom:16px;">Technology Stack</div>
        <div style="display:flex;flex-wrap:wrap;justify-content:center;gap:12px;">
          ${['Vite', 'Leaflet.js', 'Chart.js', 'PapaParse', 'OpenStreetMap', 'Vanilla JS', 'CSS3 Glass UI'].map(t => `
            <span style="padding:6px 16px;background:var(--bg-glass);border:1px solid var(--border-subtle);border-radius:20px;font-size:0.78rem;color:var(--text-secondary);">${t}</span>
          `).join('')}
        </div>
      </div>

      <!-- Footer -->
      <div style="margin-top:60px;animation:fadeInUp 1.2s ease;font-size:0.75rem;color:var(--text-muted);">
        CYBERJOAR AI OC.41335.2026.59218 — Strategic Intelligence Platform
      </div>
    </div>
  `;

  document.getElementById('home-goto-ps1').addEventListener('click', () => navigateTo('intel-dashboard'));
  document.getElementById('home-goto-ps5').addEventListener('click', () => navigateTo('electoral-analytics'));
  document.getElementById('home-ps1-card').addEventListener('click', (e) => {
    if (e.target.tagName !== 'BUTTON') navigateTo('intel-dashboard');
  });
  document.getElementById('home-ps5-card').addEventListener('click', (e) => {
    if (e.target.tagName !== 'BUTTON') navigateTo('electoral-analytics');
  });
}
