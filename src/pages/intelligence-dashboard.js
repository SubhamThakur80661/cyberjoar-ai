/* ===== PS1: Intelligence Fusion Dashboard ===== */
import L from 'leaflet';
import { osintData, humintData, imintData, getAllIntelData } from '../utils/demo-data.js';
import { parseFile } from '../utils/data-parser.js';
import { showToast } from '../main.js';

let map = null;
let markers = [];
let allDataPoints = [];
let filters = { OSINT: true, HUMINT: true, IMINT: true };
let panelCollapsed = false;
let activeTab = 'osint';

function getMarkerColor(type) {
  switch (type) {
    case 'OSINT': return '#06d6a0';
    case 'HUMINT': return '#3b82f6';
    case 'IMINT': return '#ef4444';
    default: return '#f59e0b';
  }
}

function getConfidenceClass(conf) {
  if (conf >= 80) return 'confidence-high';
  if (conf >= 50) return 'confidence-medium';
  return 'confidence-low';
}

function formatTimestamp(ts) {
  try {
    const d = new Date(ts);
    return d.toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  } catch { return ts; }
}

function createPopupContent(point) {
  const typeColors = { OSINT: '#06d6a0', HUMINT: '#3b82f6', IMINT: '#ef4444' };
  const bg = typeColors[point.type] || '#f59e0b';

  let imageHtml = '';
  if (point.imageUrl) {
    imageHtml = `<img class="popup-image" src="${point.imageUrl}" alt="Intelligence imagery" />`;
  }

  let metaHtml = '';
  if (point.meta) {
    metaHtml = Object.entries(point.meta).map(([k, v]) =>
      `<div class="popup-meta-row"><span style="font-weight:600">${k}</span><span>${v}</span></div>`
    ).join('');
  }

  return `
    <div class="intel-popup">
      <div class="popup-header">
        <span class="popup-type" style="background:${bg}22;color:${bg}">${point.type}</span>
        <span class="popup-title">${point.title}</span>
      </div>
      ${imageHtml}
      <div class="popup-meta">
        <div class="popup-meta-row"><span style="font-weight:600">ID</span><span>${point.id}</span></div>
        <div class="popup-meta-row"><span style="font-weight:600">Source</span><span>${point.source}</span></div>
        <div class="popup-meta-row"><span style="font-weight:600">Time</span><span>${formatTimestamp(point.timestamp)}</span></div>
        <div class="popup-meta-row"><span style="font-weight:600">Classification</span><span>${point.classification}</span></div>
        ${metaHtml}
      </div>
      <div class="popup-confidence ${getConfidenceClass(point.confidence)}">
        ⚡ Confidence: ${point.confidence}%
      </div>
      <p style="margin-top:10px;font-size:0.78rem;color:#64748b;line-height:1.6">${point.details}</p>
    </div>
  `;
}

function createPulseIcon(type) {
  const color = getMarkerColor(type);
  return L.divIcon({
    className: '',
    html: `<div class="pulse-marker" style="background:${color}">
             <div style="position:absolute;top:-4px;left:-4px;width:22px;height:22px;border-radius:50%;border:2px solid ${color};opacity:0;animation:marker-pulse 2s infinite"></div>
           </div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
    popupAnchor: [0, -10]
  });
}

function renderMarkers() {
  markers.forEach(m => map.removeLayer(m));
  markers = [];

  const filteredData = allDataPoints.filter(p => filters[p.type]);

  filteredData.forEach(point => {
    const marker = L.marker([point.lat, point.lng], { icon: createPulseIcon(point.type) })
      .addTo(map)
      .bindPopup(createPopupContent(point), { maxWidth: 320, className: 'intel-popup-wrapper' });
    markers.push(marker);
  });

  updateStats();
}

function updateStats() {
  const osintCount = allDataPoints.filter(p => p.type === 'OSINT').length;
  const humintCount = allDataPoints.filter(p => p.type === 'HUMINT').length;
  const imintCount = allDataPoints.filter(p => p.type === 'IMINT').length;
  const total = allDataPoints.length;

  const statsEl = document.getElementById('map-stats');
  if (statsEl) {
    statsEl.innerHTML = `
      <div class="map-stat"><span style="color:var(--osint-color)">●</span> OSINT <span class="map-stat-count count-animated">${osintCount}</span></div>
      <div class="map-stat"><span style="color:var(--humint-color)">●</span> HUMINT <span class="map-stat-count count-animated">${humintCount}</span></div>
      <div class="map-stat"><span style="color:var(--imint-color)">●</span> IMINT <span class="map-stat-count count-animated">${imintCount}</span></div>
      <div class="map-stat">📍 Total <span class="map-stat-count count-animated">${total}</span></div>
    `;
  }
}

function setupDropzone(dropzone, fileInput) {
  if (!dropzone) return;
  
  dropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzone.classList.add('dragover');
  });

  dropzone.addEventListener('dragleave', () => {
    dropzone.classList.remove('dragover');
  });

  dropzone.addEventListener('drop', async (e) => {
    e.preventDefault();
    dropzone.classList.remove('dragover');
    const files = Array.from(e.dataTransfer.files);
    for (const file of files) {
      await handleFileUpload(file);
    }
  });

  dropzone.addEventListener('click', () => fileInput?.click());

  if (fileInput) {
    fileInput.addEventListener('change', async (e) => {
      const files = Array.from(e.target.files);
      for (const file of files) {
        await handleFileUpload(file);
      }
      e.target.value = '';
    });
  }
}

async function handleFileUpload(file) {
  try {
    const newPoints = await parseFile(file);
    allDataPoints.push(...newPoints);
    renderMarkers();
    addFileToList(file, newPoints.length);
    showToast(`Ingested ${newPoints.length} data point(s) from ${file.name}`);
    
    // Fly to first new marker
    if (newPoints.length > 0) {
      map.flyTo([newPoints[0].lat, newPoints[0].lng], 8, { duration: 1.5 });
    }
  } catch (err) {
    showToast(`Error parsing ${file.name}: ${err.message}`, 'error');
  }
}

function addFileToList(file, pointCount) {
  const list = document.getElementById('file-list');
  if (!list) return;

  const icons = { csv: '📊', json: '📋', jpg: '🖼️', jpeg: '🖼️', png: '🖼️', webp: '🖼️' };
  const ext = file.name.split('.').pop().toLowerCase();

  const item = document.createElement('div');
  item.className = 'file-item';
  item.innerHTML = `
    <span class="file-item-icon">${icons[ext] || '📄'}</span>
    <div class="file-item-info">
      <div class="file-item-name">${file.name}</div>
      <div class="file-item-meta">${(file.size / 1024).toFixed(1)} KB · ${pointCount} point(s)</div>
    </div>
    <button class="file-item-remove" title="Remove">×</button>
  `;
  list.appendChild(item);
}

function renderIngestionTabContent(tab) {
  const body = document.getElementById('ingestion-body');
  if (!body) return;

  if (tab === 'osint') {
    body.innerHTML = `
      <div class="connect-section">
        <div class="connect-card">
          <div class="connect-card-header">
            <span>🗄️ MongoDB Atlas</span>
            <span class="badge badge-osint">Demo</span>
          </div>
          <input class="connect-input" placeholder="mongodb+srv://cluster.example.net/intel" value="mongodb+srv://cyberjoar-cluster.aws.mongodb.net/osint_db" readonly />
          <button class="btn btn-primary btn-sm" id="connect-mongo">Connect & Fetch →</button>
        </div>
        <div class="connect-card">
          <div class="connect-card-header">
            <span>☁️ AWS S3 Bucket</span>
            <span class="badge badge-osint">Demo</span>
          </div>
          <input class="connect-input" placeholder="s3://bucket-name/intel-feed/" value="s3://cyberjoar-intel-feeds/osint-2026/" readonly />
          <button class="btn btn-primary btn-sm" id="connect-s3">Connect & Fetch →</button>
        </div>
        <div class="connect-card">
          <div class="connect-card-header">
            <span>🔌 REST API</span>
            <span class="badge badge-osint">Demo</span>
          </div>
          <input class="connect-input" placeholder="https://api.example.com/feed" value="https://api.cyberjoar.ai/v2/osint/live-feed" readonly />
          <button class="btn btn-primary btn-sm" id="connect-api">Connect & Fetch →</button>
        </div>
      </div>
    `;

    // Simulate OSINT connection
    ['connect-mongo', 'connect-s3', 'connect-api'].forEach(id => {
      const btn = document.getElementById(id);
      if (btn) {
        btn.addEventListener('click', () => {
          btn.textContent = 'Connecting...';
          btn.disabled = true;
          setTimeout(() => {
            const alreadyLoaded = allDataPoints.filter(p => p.type === 'OSINT').length;
            if (alreadyLoaded < osintData.length + 3) {
              // Add some new random OSINT points to simulate fresh fetch
              const newPoint = {
                id: `OSN-LIVE-${Date.now()}`,
                type: 'OSINT',
                source: btn.id.includes('mongo') ? 'MongoDB Cluster' : btn.id.includes('s3') ? 'S3 Intel Feed' : 'REST API',
                title: `Live OSINT fetch — ${new Date().toLocaleTimeString()}`,
                lat: 18 + Math.random() * 16,
                lng: 72 + Math.random() * 14,
                timestamp: new Date().toISOString(),
                classification: 'UNCLASSIFIED',
                confidence: Math.floor(60 + Math.random() * 35),
                details: 'Real-time data fetched from connected intelligence source. Auto-classified and geo-tagged.',
                meta: { fetchTime: new Date().toLocaleTimeString(), records: Math.floor(10 + Math.random() * 50) }
              };
              allDataPoints.push(newPoint);
              renderMarkers();
              map.flyTo([newPoint.lat, newPoint.lng], 7, { duration: 1.2 });
            }
            btn.textContent = '✓ Connected';
            btn.style.background = 'rgba(6,214,160,0.2)';
            btn.style.color = '#06d6a0';
            showToast(`Connected to ${btn.id.includes('mongo') ? 'MongoDB' : btn.id.includes('s3') ? 'S3' : 'API'} — data ingested`);
          }, 1200);
        });
      }
    });

  } else if (tab === 'humint') {
    body.innerHTML = `
      <div class="dropzone" id="humint-dropzone">
        <div class="dropzone-icon">📁</div>
        <div class="dropzone-text">Drop CSV, JSON, or Excel files here</div>
        <div class="dropzone-hint">Or click to browse · Supports .csv, .json</div>
      </div>
      <input type="file" id="humint-file-input" accept=".csv,.json,.xlsx,.xls" multiple style="display:none" />
      <div class="file-list" id="file-list"></div>
      <div style="margin-top:16px;padding:12px;background:rgba(59,130,246,0.08);border-radius:var(--radius-md);border:1px solid rgba(59,130,246,0.15)">
        <div style="font-size:0.78rem;font-weight:600;color:var(--humint-color);margin-bottom:6px">📋 Expected Format</div>
        <div style="font-size:0.72rem;color:var(--text-muted);line-height:1.6">
          CSV/JSON should include: <code>lat</code>, <code>lng</code>, <code>title</code>, <code>confidence</code>, <code>classification</code><br>
          Missing coordinates will be auto-estimated within the India region.
        </div>
      </div>
    `;

    const dropzone = document.getElementById('humint-dropzone');
    const fileInput = document.getElementById('humint-file-input');
    setupDropzone(dropzone, fileInput);

  } else if (tab === 'imint') {
    body.innerHTML = `
      <div class="dropzone" id="imint-dropzone">
        <div class="dropzone-icon">🛰️</div>
        <div class="dropzone-text">Drop satellite / aerial imagery here</div>
        <div class="dropzone-hint">Supports .jpg, .jpeg, .png, .webp</div>
      </div>
      <input type="file" id="imint-file-input" accept="image/*" multiple style="display:none" />
      <div class="file-list" id="file-list"></div>
      <div style="margin-top:16px;padding:12px;background:rgba(239,68,68,0.08);border-radius:var(--radius-md);border:1px solid rgba(239,68,68,0.15)">
        <div style="font-size:0.78rem;font-weight:600;color:var(--imint-color);margin-bottom:6px">📷 IMINT Processing</div>
        <div style="font-size:0.72rem;color:var(--text-muted);line-height:1.6">
          Uploaded images will be geotagged. If EXIF location data is available, it will be extracted automatically.<br>
          Otherwise, a random India-region coordinate is assigned for demo purposes.
        </div>
      </div>
    `;

    const dropzone = document.getElementById('imint-dropzone');
    const fileInput = document.getElementById('imint-file-input');
    setupDropzone(dropzone, fileInput);
  }
}

export function renderIntelDashboard(container) {
  // Reset state
  allDataPoints = getAllIntelData();
  markers = [];
  filters = { OSINT: true, HUMINT: true, IMINT: true };

  container.innerHTML = `
    <div class="intel-dashboard">
      <!-- Top Bar -->
      <div class="intel-topbar">
        <div class="intel-topbar-left">
          <h2>🗺️ Intelligence Fusion Dashboard</h2>
          <span class="badge badge-osint">PS1</span>
        </div>
        <div class="intel-topbar-right">
          <div class="source-filter">
            <button class="source-filter-btn active-osint" data-type="OSINT" id="filter-osint">
              <span class="dot" style="background:var(--osint-color)"></span> OSINT
            </button>
            <button class="source-filter-btn active-humint" data-type="HUMINT" id="filter-humint">
              <span class="dot" style="background:var(--humint-color)"></span> HUMINT
            </button>
            <button class="source-filter-btn active-imint" data-type="IMINT" id="filter-imint">
              <span class="dot" style="background:var(--imint-color)"></span> IMINT
            </button>
          </div>
        </div>
      </div>

      <!-- Map + Panels -->
      <div class="map-wrapper">
        <div id="intel-map"></div>

        <!-- Stats Overlay -->
        <div class="map-stats-overlay" id="map-stats"></div>

        <!-- Legend -->
        <div class="map-legend">
          <h4>Intelligence Layers</h4>
          <div class="legend-item"><span class="legend-dot" style="background:var(--osint-color)"></span> OSINT — Open Source</div>
          <div class="legend-item"><span class="legend-dot" style="background:var(--humint-color)"></span> HUMINT — Human Intel</div>
          <div class="legend-item"><span class="legend-dot" style="background:var(--imint-color)"></span> IMINT — Imagery Intel</div>
        </div>

        <!-- Ingestion Panel -->
        <div class="ingestion-panel" id="ingestion-panel">
          <button class="ingestion-panel-toggle" id="panel-toggle">◀</button>
          
          <div class="ingestion-header">
            <h3>📡 Data Ingestion</h3>
            <span style="font-size:0.72rem;color:var(--text-muted)">${allDataPoints.length} sources loaded</span>
          </div>

          <div class="ingestion-tabs">
            <button class="ingestion-tab active" data-tab="osint" id="tab-osint">🟢 OSINT</button>
            <button class="ingestion-tab" data-tab="humint" id="tab-humint">🔵 HUMINT</button>
            <button class="ingestion-tab" data-tab="imint" id="tab-imint">🔴 IMINT</button>
          </div>

          <div class="ingestion-body" id="ingestion-body"></div>
        </div>
      </div>
    </div>
  `;

  // Initialize Leaflet Map
  setTimeout(() => {
    map = L.map('intel-map', {
      zoomControl: false,
      attributionControl: true
    }).setView([22.5, 78.5], 5);

    // Add zoom control to top-right
    L.control.zoom({ position: 'topright' }).addTo(map);

    // Terrain tile layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://carto.com/">CARTO</a> | CYBERJOAR AI',
      maxZoom: 19
    }).addTo(map);

    // Render initial markers
    renderMarkers();

    // Render first tab content
    renderIngestionTabContent('osint');
  }, 100);

  // Filter buttons
  ['OSINT', 'HUMINT', 'IMINT'].forEach(type => {
    const btn = document.getElementById(`filter-${type.toLowerCase()}`);
    if (btn) {
      btn.addEventListener('click', () => {
        filters[type] = !filters[type];
        const activeClass = `active-${type.toLowerCase()}`;
        btn.classList.toggle(activeClass, filters[type]);
        if (!filters[type]) {
          btn.style.opacity = '0.4';
        } else {
          btn.style.opacity = '1';
        }
        renderMarkers();
      });
    }
  });

  // Ingestion tabs
  document.querySelectorAll('.ingestion-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.ingestion-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeTab = tab.dataset.tab;
      renderIngestionTabContent(activeTab);
    });
  });

  // Panel toggle
  const panelToggle = document.getElementById('panel-toggle');
  const panel = document.getElementById('ingestion-panel');
  if (panelToggle && panel) {
    panelToggle.addEventListener('click', () => {
      panelCollapsed = !panelCollapsed;
      panel.classList.toggle('collapsed', panelCollapsed);
      panelToggle.textContent = panelCollapsed ? '▶' : '◀';
    });
  }
}
