/* ===== PS5: Electoral Analytics Matrix ===== */
import { Chart, registerables } from 'chart.js';
import { constituencies, defaultWeights } from '../utils/demo-data.js';
import { calculatePoW, calculateFactorComparison, getScoreClass } from '../utils/scoring-engine.js';

Chart.register(...registerables);

let currentConstituency = null;
let weights = {};
let turnoutScenario = 'medium';
let radarChart = null;
let barChart = null;
let powChart = null;

function deepCloneWeights() {
  const clone = {};
  Object.keys(defaultWeights).forEach(k => {
    clone[k] = { ...defaultWeights[k] };
  });
  return clone;
}

function getCandidateGradient(index) {
  const gradients = ['var(--gradient-primary)', 'var(--gradient-purple)', 'var(--gradient-warm)', 'var(--gradient-danger)'];
  return gradients[index % gradients.length];
}

function getCandidateClass(index) {
  return ['candidate-a', 'candidate-b', 'candidate-c', 'candidate-d'][index % 4];
}

function getTypeClass(type) {
  if (type === 'incumbent') return 'type-incumbent';
  if (type === 'independent') return 'type-independent';
  return 'type-challenger';
}

function renderCandidateCards() {
  const grid = document.getElementById('candidates-grid');
  if (!grid || !currentConstituency) return;

  const powResults = calculatePoW(currentConstituency.candidates, weights, turnoutScenario);

  grid.innerHTML = currentConstituency.candidates.map((c, idx) => {
    const pow = powResults.find(r => r.candidateId === c.id);
    const factorKeys = Object.keys(weights);

    return `
      <div class="candidate-card ${getCandidateClass(idx)}">
        <div class="candidate-avatar" style="background:${c.color}33;color:${c.color}">${c.avatar}</div>
        <div class="candidate-name">${c.name}</div>
        <div class="candidate-party">${c.party}</div>
        <span class="candidate-type ${getTypeClass(c.type)}">${c.type.toUpperCase()}</span>
        
        <div class="candidate-scores">
          ${factorKeys.map(key => {
            const score = c.scores[key];
            const barColor = score >= 70 ? 'var(--accent-cyan)' : score >= 40 ? 'var(--accent-orange)' : 'var(--accent-red)';
            return `
              <div class="score-row">
                <span class="score-label">${weights[key].icon} ${weights[key].label.split('/')[0].trim().substring(0, 14)}</span>
                <div class="score-bar-bg">
                  <div class="score-bar-fill" style="width:${score}%;background:${barColor}"></div>
                </div>
                <span class="score-value" style="color:${barColor}">${score}</span>
              </div>
            `;
          }).join('')}
        </div>

        <div class="pow-section">
          <div class="pow-label">Probability of Win</div>
          <div class="pow-value" style="background:linear-gradient(135deg,${c.color},${c.color}99);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text">${pow ? pow.pow.toFixed(1) : 0}%</div>
          <div class="pow-bar">
            <div class="pow-bar-fill" style="width:${pow ? pow.pow : 0}%;background:${c.color}"></div>
          </div>
        </div>

        <div style="margin-top:14px;padding-top:12px;border-top:1px solid var(--border-subtle)">
          <div style="font-size:0.7rem;color:var(--text-muted);margin-bottom:8px;text-transform:uppercase;letter-spacing:1px">Digital Sentiment</div>
          <div style="display:flex;gap:8px;font-size:0.72rem">
            <span style="color:var(--accent-green)">👍 ${c.sentimentBreakdown.positive}%</span>
            <span style="color:var(--text-muted)">😐 ${c.sentimentBreakdown.neutral}%</span>
            <span style="color:var(--accent-red)">👎 ${c.sentimentBreakdown.negative}%</span>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function renderWeightSliders() {
  const container = document.getElementById('weights-grid');
  if (!container) return;

  container.innerHTML = Object.keys(weights).map(key => `
    <div class="weight-item">
      <div class="weight-item-header">
        <span class="weight-item-label">${weights[key].icon} ${weights[key].label}</span>
        <span class="weight-item-value" id="weight-val-${key}">${weights[key].value}</span>
      </div>
      <input type="range" class="weight-slider" id="weight-${key}" min="0" max="100" value="${weights[key].value}" data-key="${key}" />
    </div>
  `).join('');

  // Add event listeners
  container.querySelectorAll('.weight-slider').forEach(slider => {
    slider.addEventListener('input', (e) => {
      const key = e.target.dataset.key;
      weights[key].value = parseInt(e.target.value);
      document.getElementById(`weight-val-${key}`).textContent = e.target.value;
      refreshAllVisualizations();
    });
  });
}

function renderMatrixTable() {
  const wrapper = document.getElementById('matrix-table-body');
  if (!wrapper || !currentConstituency) return;

  const comparison = calculateFactorComparison(currentConstituency.candidates, weights);
  const candidates = currentConstituency.candidates;

  wrapper.innerHTML = comparison.map(factor => `
    <tr>
      <td><span class="matrix-factor-name">${factor.icon} ${factor.label}</span></td>
      <td style="font-family:var(--font-mono);font-size:0.8rem;color:var(--accent-cyan)">${factor.weight}%</td>
      ${factor.scores.map(s => `
        <td class="matrix-score-cell ${getScoreClass(s.score)}" style="${s.isHighest ? 'font-weight:800;' : ''}">
          ${s.score} ${s.isHighest ? '👑' : ''}
        </td>
      `).join('')}
    </tr>
  `).join('');
}

function renderCharts() {
  if (!currentConstituency) return;

  const candidates = currentConstituency.candidates;
  const labels = Object.keys(weights).map(k => weights[k].label.split('/')[0].trim());
  const colors = candidates.map(c => c.color);
  const alphaColors = candidates.map(c => c.color + '33');

  // Radar Chart
  const radarCtx = document.getElementById('radar-chart');
  if (radarCtx) {
    if (radarChart) radarChart.destroy();
    radarChart = new Chart(radarCtx, {
      type: 'radar',
      data: {
        labels,
        datasets: candidates.map((c, i) => ({
          label: c.name,
          data: Object.keys(weights).map(k => c.scores[k]),
          borderColor: colors[i],
          backgroundColor: alphaColors[i],
          borderWidth: 2,
          pointBackgroundColor: colors[i],
          pointRadius: 4,
          pointHoverRadius: 6
        }))
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            beginAtZero: true,
            max: 100,
            ticks: { color: '#64748b', backdropColor: 'transparent', font: { size: 10 } },
            grid: { color: 'rgba(148,163,184,0.1)' },
            pointLabels: { color: '#94a3b8', font: { size: 11, family: 'Inter' } }
          }
        },
        plugins: {
          legend: {
            labels: { color: '#94a3b8', font: { family: 'Inter', size: 12 }, usePointStyle: true, pointStyle: 'circle' }
          }
        }
      }
    });
  }

  // Bar Chart (Factor Comparison)
  const barCtx = document.getElementById('bar-chart');
  if (barCtx) {
    if (barChart) barChart.destroy();
    barChart = new Chart(barCtx, {
      type: 'bar',
      data: {
        labels,
        datasets: candidates.map((c, i) => ({
          label: c.partyShort,
          data: Object.keys(weights).map(k => c.scores[k]),
          backgroundColor: colors[i] + 'aa',
          borderColor: colors[i],
          borderWidth: 1,
          borderRadius: 4
        }))
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { beginAtZero: true, max: 100, ticks: { color: '#64748b' }, grid: { color: 'rgba(148,163,184,0.08)' } },
          x: { ticks: { color: '#94a3b8', font: { size: 10 } }, grid: { display: false } }
        },
        plugins: {
          legend: {
            labels: { color: '#94a3b8', font: { family: 'Inter', size: 12 }, usePointStyle: true, pointStyle: 'rect' }
          }
        }
      }
    });
  }

  // PoW Donut Chart
  renderPoWChart();
}

function renderPoWChart() {
  if (!currentConstituency) return;

  const powResults = calculatePoW(currentConstituency.candidates, weights, turnoutScenario);
  const powCtx = document.getElementById('pow-chart');
  if (powCtx) {
    if (powChart) powChart.destroy();
    powChart = new Chart(powCtx, {
      type: 'doughnut',
      data: {
        labels: powResults.map(r => `${r.name} (${r.party})`),
        datasets: [{
          data: powResults.map(r => parseFloat(r.pow.toFixed(1))),
          backgroundColor: powResults.map(r => r.color + 'cc'),
          borderColor: powResults.map(r => r.color),
          borderWidth: 2,
          hoverBorderWidth: 3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '60%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: '#94a3b8', font: { family: 'Inter', size: 11 }, usePointStyle: true, pointStyle: 'circle', padding: 16 }
          }
        }
      }
    });
  }
}

function renderTurnoutScenarios() {
  if (!currentConstituency) return;

  const scenarios = ['low', 'medium', 'high'];
  const pcts = { low: '45%', medium: '58%', high: '72%' };
  const descs = { low: 'Favors incumbents', medium: 'Baseline projection', high: 'Favors challengers' };

  // Update active state
  document.querySelectorAll('.turnout-scenario').forEach(el => {
    el.classList.toggle('active', el.dataset.scenario === turnoutScenario);
  });

  // Render results
  const resultsContainer = document.getElementById('turnout-results');
  if (!resultsContainer) return;

  const basePow = calculatePoW(currentConstituency.candidates, weights, 'medium');
  const currentPow = calculatePoW(currentConstituency.candidates, weights, turnoutScenario);

  resultsContainer.innerHTML = currentPow.map((result, i) => {
    const base = basePow[i].pow;
    const diff = result.pow - base;
    const changeClass = diff > 0 ? 'change-positive' : diff < 0 ? 'change-negative' : '';
    const changeSign = diff > 0 ? '+' : '';

    return `
      <div class="turnout-result-card">
        <div class="turnout-result-name" style="color:${result.color}">${result.name}</div>
        <div class="turnout-result-pow" style="color:${result.color}">${result.pow.toFixed(1)}%</div>
        <div class="turnout-result-change ${changeClass}">${changeSign}${diff.toFixed(1)}% vs baseline</div>
      </div>
    `;
  }).join('');
}

function refreshAllVisualizations() {
  renderCandidateCards();
  renderMatrixTable();
  renderCharts();
  renderTurnoutScenarios();
}

export function renderElectoralAnalytics(container) {
  // Initialize state
  currentConstituency = constituencies[0];
  weights = deepCloneWeights();
  turnoutScenario = 'medium';

  container.innerHTML = `
    <div class="electoral-page">
      <!-- Header -->
      <div class="electoral-header">
        <h1>🗳️ Electoral Analytics Matrix</h1>
        <p>Predictive political strategy matrix utilizing OSINT and historical data to compare candidates with Probability of Win (PoW) forecasting across multiple turnout scenarios.</p>
      </div>

      <!-- Constituency Selector -->
      <div class="constituency-bar">
        <label>📍 Constituency</label>
        <select class="constituency-select" id="constituency-select">
          ${constituencies.map(c => `<option value="${c.id}">${c.name}, ${c.state}</option>`).join('')}
        </select>
        <div class="constituency-info">
          <div class="constituency-stat">
            <div class="constituency-stat-value" id="stat-voters">${(currentConstituency.totalVoters / 100000).toFixed(1)}L</div>
            <div class="constituency-stat-label">Total Voters</div>
          </div>
          <div class="constituency-stat">
            <div class="constituency-stat-value" id="stat-turnout">${currentConstituency.prevTurnout}%</div>
            <div class="constituency-stat-label">Prev. Turnout</div>
          </div>
          <div class="constituency-stat">
            <div class="constituency-stat-value" id="stat-type">${currentConstituency.type}</div>
            <div class="constituency-stat-label">Type</div>
          </div>
        </div>
      </div>

      <!-- Candidate Cards -->
      <div class="candidates-section">
        <div class="candidates-section-title">👤 Candidate Profiles & Scores</div>
        <div class="candidates-grid" id="candidates-grid"></div>
      </div>

      <!-- Weight Sliders -->
      <div class="weights-section">
        <div class="weights-card">
          <div class="weights-title">⚙️ Factor Weight Configuration</div>
          <div class="weights-subtitle">Adjust weights to recalculate Probability of Win in real-time. Total weight normalization is automatic.</div>
          <div class="weights-grid" id="weights-grid"></div>
        </div>
      </div>

      <!-- Charts -->
      <div class="charts-section">
        <div class="chart-card">
          <div class="chart-title">📊 Candidate Radar Comparison</div>
          <div class="chart-subtitle">Multi-factor performance overlay across all candidates</div>
          <div class="chart-container"><canvas id="radar-chart"></canvas></div>
        </div>
        <div class="chart-card">
          <div class="chart-title">📉 Factor-by-Factor Breakdown</div>
          <div class="chart-subtitle">Side-by-side comparison of each scoring dimension</div>
          <div class="chart-container"><canvas id="bar-chart"></canvas></div>
        </div>
      </div>

      <!-- PoW Donut -->
      <div class="charts-section" style="grid-template-columns:1fr 1fr">
        <div class="chart-card">
          <div class="chart-title">🎯 Probability of Win (PoW)</div>
          <div class="chart-subtitle">Weighted aggregate forecast showing win probability per candidate</div>
          <div class="chart-container"><canvas id="pow-chart"></canvas></div>
        </div>

        <!-- Matrix Table -->
        <div class="chart-card" style="overflow-x:auto">
          <div class="chart-title">📋 Comparison Matrix</div>
          <div class="chart-subtitle">Detailed factor-by-factor scoring with weight-adjusted values</div>
          <div class="matrix-table-wrapper" style="margin-top:16px">
            <table class="matrix-table">
              <thead>
                <tr>
                  <th>Factor</th>
                  <th>Weight</th>
                  ${currentConstituency.candidates.map(c => `<th>${c.partyShort}</th>`).join('')}
                </tr>
              </thead>
              <tbody id="matrix-table-body"></tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Turnout Simulator -->
      <div class="turnout-section">
        <div class="turnout-card">
          <div class="weights-title">🗳️ Turnout Scenario Simulator</div>
          <div class="weights-subtitle">Model how different voter turnout levels impact each candidate's probability of winning.</div>
          <div class="turnout-scenarios">
            <div class="turnout-scenario ${turnoutScenario === 'low' ? 'active' : ''}" data-scenario="low" id="scenario-low">
              <div class="turnout-scenario-label">Low Turnout</div>
              <div class="turnout-scenario-pct">~45%</div>
              <div class="turnout-scenario-desc">Favors incumbents (+5%)</div>
            </div>
            <div class="turnout-scenario ${turnoutScenario === 'medium' ? 'active' : ''}" data-scenario="medium" id="scenario-medium">
              <div class="turnout-scenario-label">Medium Turnout</div>
              <div class="turnout-scenario-pct">~58%</div>
              <div class="turnout-scenario-desc">Baseline projection</div>
            </div>
            <div class="turnout-scenario ${turnoutScenario === 'high' ? 'active' : ''}" data-scenario="high" id="scenario-high">
              <div class="turnout-scenario-label">High Turnout</div>
              <div class="turnout-scenario-pct">~72%</div>
              <div class="turnout-scenario-desc">Favors challengers (+4%)</div>
            </div>
          </div>
          <div class="turnout-results" id="turnout-results"></div>
        </div>
      </div>

      <!-- Algorithm Logic Section -->
      <div class="logic-section">
        <div class="logic-card">
          <div class="weights-title">🧠 Algorithm Logic & Methodology</div>
          <div class="weights-subtitle">Transparent explanation of the scoring and prediction models used.</div>
          <div class="logic-code">
            <span class="comment">// Probability of Win (PoW) Model</span><br>
            <span class="keyword">function</span> <span class="fn">calculatePoW</span>(candidate, weights, turnout) {<br>
            &nbsp;&nbsp;<span class="comment">// Step 1: Weighted Score Calculation</span><br>
            &nbsp;&nbsp;PoW = <span class="fn">Σ</span>(weight_i × score_i) / <span class="fn">Σ</span>(weight_i × 100) × 100<br><br>
            &nbsp;&nbsp;<span class="comment">// Step 2: Turnout Adjustment</span><br>
            &nbsp;&nbsp;<span class="keyword">if</span> (turnout === <span style="color:#06d6a0">'low'</span>)&nbsp;&nbsp;→ incumbent <span class="fn">+5%</span>, challenger <span class="fn">-2%</span><br>
            &nbsp;&nbsp;<span class="keyword">if</span> (turnout === <span style="color:#06d6a0">'high'</span>) → incumbent <span class="fn">-3%</span>, challenger <span class="fn">+4%</span><br><br>
            &nbsp;&nbsp;<span class="comment">// Step 3: Normalization</span><br>
            &nbsp;&nbsp;Final PoW = (adjustedScore / totalAllCandidates) × 100<br>
            &nbsp;&nbsp;<span class="comment">// Sum of all candidates' PoW ≈ 100%</span><br>
            }<br><br>
            <span class="comment">// Factors: Incumbency, Party Strength, Past Work,</span><br>
            <span class="comment">//&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Personal Base, Caste/Religion, Digital Sentiment</span>
          </div>
        </div>
      </div>
    </div>
  `;

  // Initial render
  setTimeout(() => {
    renderCandidateCards();
    renderWeightSliders();
    renderMatrixTable();
    renderCharts();
    renderTurnoutScenarios();
  }, 100);

  // Constituency selector
  const select = document.getElementById('constituency-select');
  if (select) {
    select.addEventListener('change', (e) => {
      currentConstituency = constituencies.find(c => c.id === e.target.value);
      if (currentConstituency) {
        document.getElementById('stat-voters').textContent = (currentConstituency.totalVoters / 100000).toFixed(1) + 'L';
        document.getElementById('stat-turnout').textContent = currentConstituency.prevTurnout + '%';
        document.getElementById('stat-type').textContent = currentConstituency.type;

        // Re-render matrix table header for new candidates
        const thead = container.querySelector('.matrix-table thead tr');
        if (thead) {
          thead.innerHTML = `<th>Factor</th><th>Weight</th>${currentConstituency.candidates.map(c => `<th>${c.partyShort}</th>`).join('')}`;
        }

        refreshAllVisualizations();
      }
    });
  }

  // Turnout scenario buttons
  ['low', 'medium', 'high'].forEach(scenario => {
    const btn = document.getElementById(`scenario-${scenario}`);
    if (btn) {
      btn.addEventListener('click', () => {
        turnoutScenario = scenario;
        document.querySelectorAll('.turnout-scenario').forEach(el => {
          el.classList.toggle('active', el.dataset.scenario === scenario);
        });
        refreshAllVisualizations();
      });
    }
  });
}
