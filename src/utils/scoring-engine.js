// Win probability: weighted factor scores, adjusted for turnout, then
// normalised so all candidates add up to 100%.

export function calculatePoW(candidates, weights, turnoutScenario = 'medium') {
  const factorKeys = Object.keys(weights);

  const rawScores = candidates.map(candidate => {
    let weightedSum = 0;
    let maxPossible = 0;

    factorKeys.forEach(key => {
      const weight = weights[key].value;
      const score = candidate.scores[key] || 0;
      weightedSum += weight * score;
      maxPossible += weight * 100;
    });

    return {
      candidateId: candidate.id,
      rawScore: maxPossible > 0 ? (weightedSum / maxPossible) * 100 : 0
    };
  });

  // Low turnout helps incumbents; high turnout helps everyone else.
  const adjustedScores = rawScores.map((entry, idx) => {
    const candidate = candidates[idx];
    let adjustment = 0;

    if (turnoutScenario === 'low') {
      adjustment = candidate.type === 'incumbent' ? 5 : -2;
    } else if (turnoutScenario === 'high') {
      adjustment = candidate.type === 'incumbent' ? -3 : 4;
    }

    return {
      ...entry,
      adjustedScore: Math.max(0, entry.rawScore + adjustment)
    };
  });

  const totalAdjusted = adjustedScores.reduce((sum, e) => sum + e.adjustedScore, 0);

  return adjustedScores.map((entry, idx) => ({
    candidateId: entry.candidateId,
    name: candidates[idx].name,
    party: candidates[idx].partyShort,
    color: candidates[idx].color,
    rawScore: entry.rawScore,
    pow: totalAdjusted > 0 ? (entry.adjustedScore / totalAdjusted) * 100 : 0
  }));
}

export function calculateFactorComparison(candidates, weights) {
  const factorKeys = Object.keys(weights);

  return factorKeys.map(key => {
    const scores = candidates.map(c => ({
      candidateId: c.id,
      name: c.name,
      partyShort: c.partyShort,
      score: c.scores[key] || 0,
      weighted: (c.scores[key] || 0) * weights[key].value / 100
    }));

    const maxScore = Math.max(...scores.map(s => s.score));
    scores.forEach(s => { s.isHighest = s.score === maxScore; });

    return {
      factor: key,
      label: weights[key].label,
      weight: weights[key].value,
      scores
    };
  });
}

export function getScoreClass(score) {
  if (score >= 70) return 'matrix-score-high';
  if (score >= 40) return 'matrix-score-mid';
  return 'matrix-score-low';
}
