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

const turnoutOptions = [
  { id: 'low', label: 'Low turnout', pct: '~45%', note: 'Helps incumbents (+5%)' },
  { id: 'medium', label: 'Medium turnout', pct: '~58%', note: 'Baseline' },
  { id: 'high', label: 'High turnout', pct: '~72%', note: 'Helps challengers (+4%)' },
];

function deepCloneWeights() {
  const clone = {};
  Object.keys(defaultWeights).forEach(k => {
    clone[k] = { ...defaultWeights[k] };
  });
  return clone;
}

function getCandidateClass(index) {
  return ['candidate-a', 'candidate-b', 'candidate-c', 'candidate-d'][index % 4];
}

function getTypeClass(type) {
  if (type === 'incumbent') return 'type-incumbent';
  if (type === 'independent') return 'type-independent';
  return 'type-challenger';
}

function scoreColor(score) {
  if (score >= 70) return 'var(--accent-cyan)';
  if (score >= 40) return 'var(--accent-orange)';
  return 'var(--accent-red)';
}

function renderCandidateCards() {
  const grid = document.getElementById('candidates-grid');
  if (!grid || !currentConstituency) return;

  const powResults = calculatePoW(currentConstituency.candidates, weights, turnoutScenario);
  const factorKeys = Object.keys(weights);

  grid.innerHTML = currentConstituency.candidates.map((c, idx) => {
    const pow = powResults.find(r => r.candidateId === c.id);
    const s = c.sentimentBreakdown;

    return `
      <div class="candidate-card ${getCandidateClass(idx)}">
        <div class="candidate-head">
          <div class="candidate-avatar" style="background:${c.color}26;color:${c.color}">${c.avatar}</div>
          <div>
            <div class="candidate-name">${c.name}</div>
            <div class="candidate-party">${c.party}</div>
            <span class="candidate-type ${getTypeClass(c.type)}">${c.type}</span>
          </div>
        </div>

        <div class="candidate-scores">
          ${factorKeys.map(key => {
            const score = c.scores[key];
            const color = scoreColor(score);
            return `
              <div class="score-row">
                <span class="score-label">${weights[key].label.split('/')[0].trim()}</span>
                <div class="score-bar-bg">
                  <div class="score-bar-fill" style="width:${score}%;background:${color}"></div>
                </div>
                <span class="score-value" style="color:${color}">${score}</span>
              </div>
            `;
          }).join('')}
        </div>

        <div class="pow-section">
          <div class="pow-label">Chance of winning</div>
          <div class="pow-value" style="color:${c.color}">${pow ? pow.pow.toFixed(1) : 0}%</div>
          <div class="pow-bar">
            <div class="pow-bar-fill" style="width:${pow ? pow.pow : 0}%;background:${c.color}"></div>
          </div>
        </div>

        <div class="sentiment-row">
          <div class="sentiment-label">Online sentiment</div>
          <div class="sentiment-chips">
            <span class="sentiment-chip sentiment-positive">Positive ${s.positive}%</span>
            <span class="sentiment-chip sentiment-neutral">Neutral ${s.neutral}%</span>
            <span class="sentiment-chip sentiment-negative">Negative ${s.negative}%</span>
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
        <span class="weight-item-label">${weights[key].label}</span>
        <span class="weight-item-value" id="weight-val-${key}">${weights[key].value}</span>
      </div>
      <input type="range" class="weight-slider" id="weight-${key}" min="0" max="100" value="${weights[key].value}" data-key="${key}" aria-label="${weights[key].label} weight" />
    </div>
  `).join('');

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

  wrapper.innerHTML = comparison.map(factor => `
    <tr>
      <td><span class="matrix-factor-name">${factor.label}</span></td>
      <td class="matrix-weight-cell">${factor.weight}%</td>
      ${factor.scores.map(s => `
        <td class="matrix-score-cell ${getScoreClass(s.score)}" style="${s.isHighest ? 'font-weight:800;' : ''}">
          ${s.score}${s.isHighest ? ' <span class="matrix-top" title="Highest on this factor">top</span>' : ''}
        </td>
      `).join('')}
    </tr>
  `).join('');
}

const chartText = '#94a3b8';
const chartGrid = 'rgba(148,163,184,0.1)';

function renderCharts() {
  if (!currentConstituency) return;

  const candidates = currentConstituency.candidates;
  const labels = Object.keys(weights).map(k => weights[k].label.split('/')[0].trim());
  const colors = candidates.map(c => c.color);
  const alphaColors = candidates.map(c => c.color + '33');

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
            grid: { color: chartGrid },
            pointLabels: { color: chartText, font: { size: 11, family: 'Inter' } }
          }
        },
        plugins: {
          legend: {
            labels: { color: chartText, font: { family: 'Inter', size: 12 }, usePointStyle: true, pointStyle: 'circle' }
          }
        }
      }
    });
  }

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
          x: { ticks: { color: chartText, font: { size: 10 } }, grid: { display: false } }
        },
        plugins: {
          legend: {
            labels: { color: chartText, font: { family: 'Inter', size: 12 }, usePointStyle: true, pointStyle: 'rect' }
          }
        }
      }
    });
  }

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
            labels: { color: chartText, font: { family: 'Inter', size: 11 }, usePointStyle: true, pointStyle: 'circle', padding: 16 }
          }
        }
      }
    });
  }
}

function renderTurnoutScenarios() {
  if (!currentConstituency) return;

  document.querySelectorAll('.turnout-scenario').forEach(el => {
    el.classList.toggle('active', el.dataset.scenario === turnoutScenario);
  });

  const resultsContainer = document.getElementById('turnout-results');
  if (!resultsContainer) return;

  const basePow = calculatePoW(currentConstituency.candidates, weights, 'medium');
  const currentPow = calculatePoW(currentConstituency.candidates, weights, turnoutScenario);

  resultsContainer.innerHTML = currentPow.map((result, i) => {
    const diff = result.pow - basePow[i].pow;
    const changeClass = diff > 0 ? 'change-positive' : diff < 0 ? 'change-negative' : '';
    const changeSign = diff > 0 ? '+' : '';

    return `
      <div class="turnout-result-card">
        <div class="turnout-result-name" style="color:${result.color}">${result.name}</div>
        <div class="turnout-result-pow" style="color:${result.color}">${result.pow.toFixed(1)}%</div>
        <div class="turnout-result-change ${changeClass}">${changeSign}${diff.toFixed(1)}% vs medium turnout</div>
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
  currentConstituency = constituencies[0];
  weights = deepCloneWeights();
  turnoutScenario = 'medium';

  container.innerHTML = `
    <div class="electoral-page">
      <div class="electoral-header">
        <h1>Electoral analytics</h1>
        <p>Pick a constituency, compare its candidates across six factors, and see how the forecast changes when you move the weights or change turnout. All numbers here are demo data.</p>
      </div>

      <div class="constituency-bar">
        <label for="constituency-select">Constituency</label>
        <select class="constituency-select" id="constituency-select">
          ${constituencies.map(c => `<option value="${c.id}">${c.name}, ${c.state}</option>`).join('')}
        </select>
        <div class="constituency-info">
          <div class="constituency-stat">
            <div class="constituency-stat-value" id="stat-voters">${(currentConstituency.totalVoters / 100000).toFixed(1)}L</div>
            <div class="constituency-stat-label">Voters</div>
          </div>
          <div class="constituency-stat">
            <div class="constituency-stat-value" id="stat-turnout">${currentConstituency.prevTurnout}%</div>
            <div class="constituency-stat-label">Last turnout</div>
          </div>
          <div class="constituency-stat">
            <div class="constituency-stat-value" id="stat-type">${currentConstituency.type}</div>
            <div class="constituency-stat-label">Type</div>
          </div>
        </div>
      </div>

      <div class="candidates-section">
        <div class="section-heading">Candidates</div>
        <div class="candidates-grid" id="candidates-grid"></div>
      </div>

      <div class="weights-section">
        <div class="weights-card">
          <div class="weights-title">What matters most</div>
          <div class="weights-subtitle">Drag a slider and every chart and forecast updates. Weights are normalised automatically, so they don't need to add up to 100.</div>
          <div class="weights-grid" id="weights-grid"></div>
        </div>
      </div>

      <div class="charts-section">
        <div class="chart-card">
          <div class="chart-title">Side by side</div>
          <div class="chart-subtitle">Each candidate's shape across all six factors</div>
          <div class="chart-container"><canvas id="radar-chart"></canvas></div>
        </div>
        <div class="chart-card">
          <div class="chart-title">Factor by factor</div>
          <div class="chart-subtitle">Who leads on each scoring dimension</div>
          <div class="chart-container"><canvas id="bar-chart"></canvas></div>
        </div>
      </div>

      <div class="charts-section">
        <div class="chart-card">
          <div class="chart-title">Who's ahead</div>
          <div class="chart-subtitle">Win probability per candidate, from the weighted scores</div>
          <div class="chart-container"><canvas id="pow-chart"></canvas></div>
        </div>

        <div class="chart-card chart-card--table">
          <div class="chart-title">The full table</div>
          <div class="chart-subtitle">Every factor score, with the leader on each row marked</div>
          <div class="matrix-table-wrapper">
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

      <div class="turnout-section">
        <div class="turnout-card">
          <div class="weights-title">What if turnout changes?</div>
          <div class="weights-subtitle">Low turnout tends to help incumbents; high turnout tends to help challengers. Pick a scenario to see the shift.</div>
          <div class="turnout-scenarios">
            ${turnoutOptions.map(o => `
              <div class="turnout-scenario ${turnoutScenario === o.id ? 'active' : ''}" data-scenario="${o.id}" id="scenario-${o.id}" role="button" tabindex="0">
                <div class="turnout-scenario-label">${o.label}</div>
                <div class="turnout-scenario-pct">${o.pct}</div>
                <div class="turnout-scenario-desc">${o.note}</div>
              </div>
            `).join('')}
          </div>
          <div class="turnout-results" id="turnout-results"></div>
        </div>
      </div>

      <div class="logic-section">
        <div class="logic-card">
          <div class="weights-title">How the forecast works</div>
          <div class="weights-subtitle">Nothing hidden — this is the whole model, in three steps.</div>
          <div class="logic-code">
            <span class="comment">// 1. Weighted score, per candidate</span><br>
            score = &Sigma;(weight &times; factor score) / &Sigma;(weight &times; 100) &times; 100<br><br>
            <span class="comment">// 2. Turnout adjustment</span><br>
            low turnout:&nbsp;&nbsp; incumbent <span class="fn">+5</span>, everyone else <span class="fn">&minus;2</span><br>
            high turnout: incumbent <span class="fn">&minus;3</span>, everyone else <span class="fn">+4</span><br><br>
            <span class="comment">// 3. Normalise so all candidates add up to 100%</span><br>
            win probability = adjusted score / total of all adjusted scores &times; 100<br><br>
            <span class="comment">// Factors: incumbency, party strength, past work,</span><br>
            <span class="comment">// personal base, caste/religious base, digital sentiment</span>
          </div>
        </div>
      </div>
    </div>
  `;

  setTimeout(() => {
    renderCandidateCards();
    renderWeightSliders();
    renderMatrixTable();
    renderCharts();
    renderTurnoutScenarios();
  }, 100);

  const select = document.getElementById('constituency-select');
  if (select) {
    select.addEventListener('change', (e) => {
      currentConstituency = constituencies.find(c => c.id === e.target.value);
      if (currentConstituency) {
        document.getElementById('stat-voters').textContent = (currentConstituency.totalVoters / 100000).toFixed(1) + 'L';
        document.getElementById('stat-turnout').textContent = currentConstituency.prevTurnout + '%';
        document.getElementById('stat-type').textContent = currentConstituency.type;

        const thead = container.querySelector('.matrix-table thead tr');
        if (thead) {
          thead.innerHTML = `<th>Factor</th><th>Weight</th>${currentConstituency.candidates.map(c => `<th>${c.partyShort}</th>`).join('')}`;
        }

        refreshAllVisualizations();
      }
    });
  }

  function pickScenario(scenario) {
    turnoutScenario = scenario;
    document.querySelectorAll('.turnout-scenario').forEach(el => {
      el.classList.toggle('active', el.dataset.scenario === scenario);
    });
    refreshAllVisualizations();
  }

  turnoutOptions.forEach(({ id }) => {
    const btn = document.getElementById(`scenario-${id}`);
    if (!btn) return;
    btn.addEventListener('click', () => pickScenario(id));
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        pickScenario(id);
      }
    });
  });
}
