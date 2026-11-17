import L from 'leaflet';
import { osintData, getAllIntelData } from '../utils/demo-data.js';
import { parseFile } from '../utils/data-parser.js';
import { showToast } from '../main.js';
import { icon } from '../components/icons.js';

let map = null;
let markers = [];
let allDataPoints = [];
let filters = { OSINT: true, HUMINT: true, IMINT: true };
let panelCollapsed = false;
let activeTab = 'osint';

const typeColors = { OSINT: '#06d6a0', HUMINT: '#3b82f6', IMINT: '#ef4444' };

function getMarkerColor(type) {
  return typeColors[type] || '#f59e0b';
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
  const color = getMarkerColor(point.type);
  const imageHtml = point.imageUrl
    ? `<img class="popup-image" src="${point.imageUrl}" alt="Imagery attached to this report" />`
    : '';
  const metaHtml = point.meta
    ? Object.entries(point.meta).map(([k, v]) =>
        `<div class="popup-meta-row"><span class="popup-meta-key">${k}</span><span>${v}</span></div>`
      ).join('')
    : '';

  return `
    <div class="intel-popup">
      <div class="popup-header">
        <span class="popup-type" style="background:${color}22;color:${color}">${point.type}</span>
        <span class="popup-title">${point.title}</span>
      </div>
      ${imageHtml}
      <div class="popup-meta">
        <div class="popup-meta-row"><span class="popup-meta-key">ID</span><span>${point.id}</span></div>
        <div class="popup-meta-row"><span class="popup-meta-key">Source</span><span>${point.source}</span></div>
        <div class="popup-meta-row"><span class="popup-meta-key">Time</span><span>${formatTimestamp(point.timestamp)}</span></div>
        <div class="popup-meta-row"><span class="popup-meta-key">Classification</span><span>${point.classification}</span></div>
        ${metaHtml}
      </div>
      <div class="popup-confidence ${getConfidenceClass(point.confidence)}">
        Confidence: ${point.confidence}%
      </div>
      <p class="popup-details">${point.details}</p>
    </div>
  `;
}

function createPulseIcon(type) {
  const color = getMarkerColor(type);
  return L.divIcon({
    className: '',
    html: `<div class="pulse-marker" style="background:${color}">
             <div class="pulse-ring" style="border-color:${color}"></div>
           </div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
    popupAnchor: [0, -10]
  });
}

function renderMarkers() {
  markers.forEach(m => map.removeLayer(m));
  markers = [];

  allDataPoints
    .filter(p => filters[p.type])
    .forEach(point => {
      const marker = L.marker([point.lat, point.lng], { icon: createPulseIcon(point.type) })
        .addTo(map)
        .bindPopup(createPopupContent(point), { maxWidth: 320, className: 'intel-popup-wrapper' });
      markers.push(marker);
    });

  updateStats();
}

function updateStats() {
  const statsEl = document.getElementById('map-stats');
  if (!statsEl) return;

  const counts = ['OSINT', 'HUMINT', 'IMINT'].map(type =>
    allDataPoints.filter(p => p.type === type).length
  );

  statsEl.innerHTML = `
    ${['OSINT', 'HUMINT', 'IMINT'].map((type, i) => `
      <div class="map-stat"><span class="map-stat-dot" style="background:${typeColors[type]}"></span> ${type} <span class="map-stat-count">${counts[i]}</span></div>
    `).join('')}
    <div class="map-stat">Total <span class="map-stat-count">${allDataPoints.length}</span></div>
  `;
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
    for (const file of Array.from(e.dataTransfer.files)) {
      await handleFileUpload(file);
    }
  });

  dropzone.addEventListener('click', () => fileInput?.click());

  if (fileInput) {
    fileInput.addEventListener('change', async (e) => {
      for (const file of Array.from(e.target.files)) {
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
    const noun = newPoints.length === 1 ? 'point' : 'points';
    showToast(`Added ${newPoints.length} ${noun} from ${file.name}`);

    if (newPoints.length > 0) {
      map.flyTo([newPoints[0].lat, newPoints[0].lng], 8, { duration: 1.5 });
    }
  } catch (err) {
    showToast(`Could not read ${file.name}: ${err.message}`, 'error');
  }
}

function addFileToList(file, pointCount) {
  const list = document.getElementById('file-list');
  if (!list) return;

  const ext = file.name.split('.').pop().toLowerCase();
  const noun = pointCount === 1 ? 'point' : 'points';

  const item = document.createElement('div');
  item.className = 'file-item';
  item.innerHTML = `
    <span class="file-item-ext">${ext}</span>
    <div class="file-item-info">
      <div class="file-item-name">${file.name}</div>
      <div class="file-item-meta">${(file.size / 1024).toFixed(1)} KB &middot; ${pointCount} ${noun}</div>
    </div>
    <button class="file-item-remove" title="Remove from list" aria-label="Remove ${file.name} from list">&times;</button>
  `;
  item.querySelector('.file-item-remove').addEventListener('click', () => item.remove());
  list.appendChild(item);
}

const osintSources = [
  { id: 'mongo', name: 'MongoDB Atlas', iconName: 'database', value: 'mongodb+srv://cyberjoar-cluster.aws.mongodb.net/osint_db', label: 'MongoDB' },
  { id: 's3', name: 'AWS S3 bucket', iconName: 'cloud', value: 's3://cyberjoar-intel-feeds/osint-2026/', label: 'S3' },
  { id: 'api', name: 'REST API', iconName: 'plug', value: 'https://api.cyberjoar.ai/v2/osint/live-feed', label: 'API' },
];

function renderOsintTab(body) {
  body.innerHTML = `
    <p class="ingestion-note">These are simulated connections. Fetching pulls one fresh demo report onto the map.</p>
    <div class="connect-section">
      ${osintSources.map(s => `
        <div class="connect-card">
          <div class="connect-card-header">
            <span class="connect-card-name"><span class="connect-card-icon">${icon(s.iconName)}</span>${s.name}</span>
            <span class="badge badge-osint">Demo</span>
          </div>
          <input class="connect-input" value="${s.value}" readonly aria-label="${s.name} connection string" />
          <button class="btn btn-primary btn-sm" id="connect-${s.id}">Connect &amp; fetch</button>
        </div>
      `).join('')}
    </div>
  `;

  osintSources.forEach(source => {
    const btn = document.getElementById(`connect-${source.id}`);
    if (!btn) return;

    btn.addEventListener('click', () => {
      btn.textContent = 'Connecting…';
      btn.disabled = true;
      setTimeout(() => {
        const loaded = allDataPoints.filter(p => p.type === 'OSINT').length;
        if (loaded < osintData.length + 3) {
          const newPoint = {
            id: `OSN-LIVE-${Date.now()}`,
            type: 'OSINT',
            source: source.name === 'REST API' ? 'REST API' : source.name,
            title: `Live OSINT fetch — ${new Date().toLocaleTimeString()}`,
            lat: 18 + Math.random() * 16,
            lng: 72 + Math.random() * 14,
            timestamp: new Date().toISOString(),
            classification: 'UNCLASSIFIED',
            confidence: Math.floor(60 + Math.random() * 35),
            details: 'Fresh report from the connected source, classified and plotted automatically.',
            meta: { fetchTime: new Date().toLocaleTimeString(), records: Math.floor(10 + Math.random() * 50) }
          };
          allDataPoints.push(newPoint);
          renderMarkers();
          map.flyTo([newPoint.lat, newPoint.lng], 7, { duration: 1.2 });
        }
        btn.textContent = 'Connected';
        btn.classList.add('btn-connected');
        showToast(`Connected to ${source.label} — new report added`);
      }, 1200);
    });
  });
}

function renderIngestionTabContent(tab) {
  const body = document.getElementById('ingestion-body');
  if (!body) return;

  if (tab === 'osint') {
    renderOsintTab(body);
    return;
  }

  if (tab === 'humint') {
    body.innerHTML = `
      <div class="dropzone" id="humint-dropzone">
        <div class="dropzone-icon">${icon('upload')}</div>
        <div class="dropzone-text">Drop CSV or JSON files here</div>
        <div class="dropzone-hint">Or click to browse</div>
      </div>
      <input type="file" id="humint-file-input" accept=".csv,.json,.xlsx,.xls" multiple style="display:none" />
      <div class="file-list" id="file-list"></div>
      <div class="ingestion-hint">
        <div class="ingestion-hint-title">What the file should have</div>
        <div class="ingestion-hint-body">
          Columns <code>lat</code>, <code>lng</code>, <code>title</code>, <code>confidence</code>, <code>classification</code>.
          Rows without coordinates get placed somewhere in India so they still show up.
        </div>
      </div>
    `;
    setupDropzone(
      document.getElementById('humint-dropzone'),
      document.getElementById('humint-file-input')
    );
    return;
  }

  body.innerHTML = `
    <div class="dropzone" id="imint-dropzone">
      <div class="dropzone-icon">${icon('image')}</div>
      <div class="dropzone-text">Drop satellite or aerial imagery here</div>
      <div class="dropzone-hint">JPG, PNG or WebP</div>
    </div>
    <input type="file" id="imint-file-input" accept="image/*" multiple style="display:none" />
    <div class="file-list" id="file-list"></div>
    <div class="ingestion-hint">
      <div class="ingestion-hint-title">How images are placed</div>
      <div class="ingestion-hint-body">
        Location is read from the photo when it has one. Otherwise the image is placed at a random spot in India for the demo.
      </div>
    </div>
  `;
  setupDropzone(
    document.getElementById('imint-dropzone'),
    document.getElementById('imint-file-input')
  );
}

export function renderIntelDashboard(container) {
  allDataPoints = getAllIntelData();
  markers = [];
  filters = { OSINT: true, HUMINT: true, IMINT: true };

  container.innerHTML = `
    <div class="intel-dashboard">
      <div class="intel-topbar">
        <div class="intel-topbar-left">
          <h2>Intelligence map</h2>
          <span class="badge badge-osint">PS1</span>
          <span class="intel-topbar-sub">Reports from three sources, plotted across India</span>
        </div>
        <div class="intel-topbar-right">
          <div class="source-filter" role="group" aria-label="Filter by source">
            <button class="source-filter-btn active-osint" data-type="OSINT" id="filter-osint" aria-pressed="true">
              <span class="dot" style="background:var(--osint-color)"></span> OSINT
            </button>
            <button class="source-filter-btn active-humint" data-type="HUMINT" id="filter-humint" aria-pressed="true">
              <span class="dot" style="background:var(--humint-color)"></span> HUMINT
            </button>
            <button class="source-filter-btn active-imint" data-type="IMINT" id="filter-imint" aria-pressed="true">
              <span class="dot" style="background:var(--imint-color)"></span> IMINT
            </button>
          </div>
        </div>
      </div>

      <div class="map-wrapper">
        <div id="intel-map"></div>

        <div class="map-stats-overlay" id="map-stats"></div>

        <div class="map-legend">
          <h4>Sources</h4>
          <div class="legend-item"><span class="legend-dot" style="background:var(--osint-color)"></span> OSINT — open sources</div>
          <div class="legend-item"><span class="legend-dot" style="background:var(--humint-color)"></span> HUMINT — field reports</div>
          <div class="legend-item"><span class="legend-dot" style="background:var(--imint-color)"></span> IMINT — imagery</div>
        </div>

        <div class="ingestion-panel" id="ingestion-panel">
          <button class="ingestion-panel-toggle" id="panel-toggle" aria-label="Collapse data panel">${icon('chevronRight')}</button>

          <div class="ingestion-header">
            <h3>Add data</h3>
            <span class="ingestion-count">${allDataPoints.length} reports loaded</span>
          </div>

          <div class="ingestion-tabs" role="tablist">
            <button class="ingestion-tab active" data-tab="osint" id="tab-osint" role="tab"><span class="tab-dot" style="background:var(--osint-color)"></span>OSINT</button>
            <button class="ingestion-tab" data-tab="humint" id="tab-humint" role="tab"><span class="tab-dot" style="background:var(--humint-color)"></span>HUMINT</button>
            <button class="ingestion-tab" data-tab="imint" id="tab-imint" role="tab"><span class="tab-dot" style="background:var(--imint-color)"></span>IMINT</button>
          </div>

          <div class="ingestion-body" id="ingestion-body"></div>
        </div>
      </div>
    </div>
  `;

  setTimeout(() => {
    map = L.map('intel-map', {
      zoomControl: false,
      attributionControl: true
    }).setView([22.5, 78.5], 5);

    L.control.zoom({ position: 'topright' }).addTo(map);

    // OpenStreetMap standard tiles — no API key needed. Do not swap in a
    // key-gated layer (CARTO now requires one and shows a watermark).
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19
    }).addTo(map);

    renderMarkers();
    renderIngestionTabContent('osint');
  }, 100);

  ['OSINT', 'HUMINT', 'IMINT'].forEach(type => {
    const btn = document.getElementById(`filter-${type.toLowerCase()}`);
    if (btn) {
      btn.addEventListener('click', () => {
        filters[type] = !filters[type];
        btn.classList.toggle(`active-${type.toLowerCase()}`, filters[type]);
        btn.setAttribute('aria-pressed', String(filters[type]));
        btn.style.opacity = filters[type] ? '1' : '0.45';
        renderMarkers();
      });
    }
  });

  document.querySelectorAll('.ingestion-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.ingestion-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeTab = tab.dataset.tab;
      renderIngestionTabContent(activeTab);
    });
  });

  const panelToggle = document.getElementById('panel-toggle');
  const panel = document.getElementById('ingestion-panel');
  if (panelToggle && panel) {
    panelToggle.addEventListener('click', () => {
      panelCollapsed = !panelCollapsed;
      panel.classList.toggle('collapsed', panelCollapsed);
      panelToggle.innerHTML = icon(panelCollapsed ? 'chevronLeft' : 'chevronRight');
      panelToggle.setAttribute('aria-label', panelCollapsed ? 'Expand data panel' : 'Collapse data panel');
    });
  }
}
