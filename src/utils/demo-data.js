/* ===== Demo Data Generator ===== */

// Intelligence data points across India
export const osintData = [
  {
    id: 'OSN-001', type: 'OSINT', source: 'MongoDB Cluster',
    title: 'Unusual network traffic detected — Lucknow sector',
    lat: 26.8467, lng: 80.9462,
    timestamp: '2026-04-19T14:23:00Z',
    classification: 'RESTRICTED',
    confidence: 92,
    details: 'Anomalous data exfiltration pattern identified from commercial ISP in Lucknow sector. Volume spike of 340% over baseline. Correlates with known C2 infrastructure.',
    meta: { protocol: 'HTTPS/TLS1.3', volume: '2.4 TB', duration: '6h 23m' }
  },
  {
    id: 'OSN-002', type: 'OSINT', source: 'S3 Intelligence Feed',
    title: 'Social media sentiment surge — Delhi NCR',
    lat: 28.6139, lng: 77.2090,
    timestamp: '2026-04-19T18:45:00Z',
    classification: 'UNCLASSIFIED',
    confidence: 78,
    details: 'Coordinated social media campaign detected across 14 platforms targeting political narratives in Delhi NCR region. Bot network involvement suspected.',
    meta: { platforms: '14', accounts: '2,847', reach: '4.2M' }
  },
  {
    id: 'OSN-003', type: 'OSINT', source: 'API Gateway',
    title: 'Financial transaction anomaly — Mumbai',
    lat: 19.0760, lng: 72.8777,
    timestamp: '2026-04-20T02:15:00Z',
    classification: 'CONFIDENTIAL',
    confidence: 85,
    details: 'Series of high-value cryptocurrency transactions traced to known shell companies. Total value exceeds ₹47 Cr in 48-hour window.',
    meta: { txCount: '312', totalValue: '₹47.3 Cr', wallets: '28' }
  },
  {
    id: 'OSN-004', type: 'OSINT', source: 'MongoDB Cluster',
    title: 'Infrastructure mapping — Bangalore IT Corridor',
    lat: 12.9716, lng: 77.5946,
    timestamp: '2026-04-18T09:30:00Z',
    classification: 'UNCLASSIFIED',
    confidence: 95,
    details: 'Open-source satellite imagery analysis reveals new construction at 3 identified sites within Bangalore IT corridor. Cross-referenced with corporate filings.',
    meta: { sites: '3', area: '12 hectares', status: 'Active' }
  },
  {
    id: 'OSN-005', type: 'OSINT', source: 'API Gateway',
    title: 'Maritime vessel tracking — Chennai Port',
    lat: 13.0827, lng: 80.2707,
    timestamp: '2026-04-19T22:10:00Z',
    classification: 'RESTRICTED',
    confidence: 88,
    details: 'AIS signal intermittency detected for 3 cargo vessels in Chennai port approaches. Vessels flagged for secondary inspection based on route anomalies.',
    meta: { vessels: '3', flags: 'Panama, Liberia, Marshall Is.', cargo: 'Mixed' }
  },
  {
    id: 'OSN-006', type: 'OSINT', source: 'S3 Intelligence Feed',
    title: 'Cyber threat intelligence — Hyderabad',
    lat: 17.3850, lng: 78.4867,
    timestamp: '2026-04-20T04:55:00Z',
    classification: 'SECRET',
    confidence: 71,
    details: 'New malware variant identified in honeypot network. Characteristics suggest state-sponsored APT group with South Asian operational focus.',
    meta: { malwareFamily: 'ShadowNet v3.2', iocs: '47', targets: 'Govt/Defense' }
  }
];

export const humintData = [
  {
    id: 'HUM-001', type: 'HUMINT', source: 'Field Report CSV',
    title: 'Source meeting — Jaipur, Rajasthan',
    lat: 26.9124, lng: 75.7873,
    timestamp: '2026-04-18T11:00:00Z',
    classification: 'SECRET',
    confidence: 82,
    details: 'Reliable source reports movement of undeclared goods through informal channels in Jaipur district. Corroborates OSINT financial anomalies from previous week.',
    meta: { sourceReliability: 'B', infoCredibility: '2', handler: 'CASE-7742' }
  },
  {
    id: 'HUM-002', type: 'HUMINT', source: 'JSON Intel Package',
    title: 'Asset debrief — Kolkata operations',
    lat: 22.5726, lng: 88.3639,
    timestamp: '2026-04-19T16:30:00Z',
    classification: 'TOP SECRET',
    confidence: 91,
    details: 'Long-term asset provides detailed organizational chart of smuggling network operating through Kolkata port. 12 new identities confirmed.',
    meta: { sourceReliability: 'A', infoCredibility: '1', handler: 'CASE-3318' }
  },
  {
    id: 'HUM-003', type: 'HUMINT', source: 'Field Report CSV',
    title: 'Surveillance report — Pune industrial zone',
    lat: 18.5204, lng: 73.8567,
    timestamp: '2026-04-20T06:15:00Z',
    classification: 'CONFIDENTIAL',
    confidence: 76,
    details: 'Physical surveillance of target facility in Pune reveals increased security measures and personnel changes consistent with pre-operational activity.',
    meta: { sourceReliability: 'B', infoCredibility: '3', handler: 'CASE-5591' }
  },
  {
    id: 'HUM-004', type: 'HUMINT', source: 'Excel Report',
    title: 'Community intel — Ahmedabad sector',
    lat: 23.0225, lng: 72.5714,
    timestamp: '2026-04-17T14:45:00Z',
    classification: 'RESTRICTED',
    confidence: 65,
    details: 'Community liaison reports unusual gathering patterns near sensitive installation. Unverified claims of foreign national presence in area.',
    meta: { sourceReliability: 'C', infoCredibility: '4', handler: 'CASE-9102' }
  }
];

export const imintData = [
  {
    id: 'IMG-001', type: 'IMINT', source: 'Satellite JPG',
    title: 'Satellite capture — Border region, Kashmir',
    lat: 34.0837, lng: 74.7973,
    timestamp: '2026-04-19T08:00:00Z',
    classification: 'SECRET',
    confidence: 94,
    details: 'High-resolution satellite imagery shows new construction activity at 2 forward positions along LoC. Estimated 40-60 personnel observed.',
    meta: { resolution: '0.3m', sensor: 'Electro-Optical', coverage: '12 sq km' },
    imageUrl: 'https://placehold.co/400x250/1a1040/06d6a0?text=SAT+IMG+Kashmir'
  },
  {
    id: 'IMG-002', type: 'IMINT', source: 'Drone Imagery',
    title: 'Aerial survey — Rajasthan border',
    lat: 25.3176, lng: 71.2167,
    timestamp: '2026-04-20T05:30:00Z',
    classification: 'CONFIDENTIAL',
    confidence: 87,
    details: 'Low-altitude drone imagery reveals vehicle tracks and temporary structures consistent with staging area. Activity estimated within last 72 hours.',
    meta: { resolution: '0.1m', sensor: 'Multi-spectral', coverage: '4 sq km' },
    imageUrl: 'https://placehold.co/400x250/1a1040/ef4444?text=DRONE+IMG+Rajasthan'
  },
  {
    id: 'IMG-003', type: 'IMINT', source: 'Satellite JPG',
    title: 'Port facility — Visakhapatnam naval base',
    lat: 17.6868, lng: 83.2185,
    timestamp: '2026-04-18T12:00:00Z',
    classification: 'TOP SECRET',
    confidence: 96,
    details: 'Scheduled satellite pass captures 4 naval vessels in port, including 2 submarines. Deployment pattern analysis suggests upcoming naval exercise.',
    meta: { resolution: '0.5m', sensor: 'SAR + EO', coverage: '8 sq km' },
    imageUrl: 'https://placehold.co/400x250/1a1040/3b82f6?text=SAT+IMG+Naval+Base'
  }
];

export function getAllIntelData() {
  return [...osintData, ...humintData, ...imintData];
}

// Electoral Demo Data — Lucknow constituency
export const constituencies = [
  {
    id: 'lucknow',
    name: 'Lucknow',
    state: 'Uttar Pradesh',
    totalVoters: 1842000,
    prevTurnout: 57.4,
    type: 'Urban',
    candidates: [
      {
        id: 'c1', name: 'Rajesh Sharma', party: 'Bharatiya Janata Party',
        partyShort: 'BJP', type: 'incumbent',
        avatar: '🏛️', color: '#f59e0b',
        scores: {
          incumbency: 82, partyStrength: 88, pastWork: 75,
          personalBase: 70, casteReligion: 72, sentiment: 68
        },
        sentimentBreakdown: { positive: 52, neutral: 28, negative: 20 }
      },
      {
        id: 'c2', name: 'Priya Verma', party: 'Indian National Congress',
        partyShort: 'INC', type: 'challenger',
        avatar: '✊', color: '#3b82f6',
        scores: {
          incumbency: 30, partyStrength: 55, pastWork: 60,
          personalBase: 65, casteReligion: 58, sentiment: 74
        },
        sentimentBreakdown: { positive: 48, neutral: 32, negative: 20 }
      },
      {
        id: 'c3', name: 'Akhilesh Yadav Jr.', party: 'Samajwadi Party',
        partyShort: 'SP', type: 'challenger',
        avatar: '🚲', color: '#ef4444',
        scores: {
          incumbency: 20, partyStrength: 62, pastWork: 45,
          personalBase: 78, casteReligion: 85, sentiment: 58
        },
        sentimentBreakdown: { positive: 38, neutral: 30, negative: 32 }
      },
      {
        id: 'c4', name: 'Dr. Meera Singh', party: 'Independent',
        partyShort: 'IND', type: 'independent',
        avatar: '⚖️', color: '#8b5cf6',
        scores: {
          incumbency: 10, partyStrength: 15, pastWork: 80,
          personalBase: 55, casteReligion: 30, sentiment: 82
        },
        sentimentBreakdown: { positive: 60, neutral: 22, negative: 18 }
      }
    ]
  },
  {
    id: 'varanasi',
    name: 'Varanasi',
    state: 'Uttar Pradesh',
    totalVoters: 1956000,
    prevTurnout: 61.2,
    type: 'Urban-Semi Urban',
    candidates: [
      {
        id: 'v1', name: 'Vikram Singh', party: 'Bharatiya Janata Party',
        partyShort: 'BJP', type: 'incumbent',
        avatar: '🏛️', color: '#f59e0b',
        scores: {
          incumbency: 90, partyStrength: 92, pastWork: 80,
          personalBase: 85, casteReligion: 75, sentiment: 72
        },
        sentimentBreakdown: { positive: 55, neutral: 25, negative: 20 }
      },
      {
        id: 'v2', name: 'Sunita Devi', party: 'Indian National Congress',
        partyShort: 'INC', type: 'challenger',
        avatar: '✊', color: '#3b82f6',
        scores: {
          incumbency: 25, partyStrength: 48, pastWork: 55,
          personalBase: 50, casteReligion: 52, sentiment: 65
        },
        sentimentBreakdown: { positive: 40, neutral: 35, negative: 25 }
      },
      {
        id: 'v3', name: 'Ram Prasad', party: 'Bahujan Samaj Party',
        partyShort: 'BSP', type: 'challenger',
        avatar: '🐘', color: '#06d6a0',
        scores: {
          incumbency: 15, partyStrength: 35, pastWork: 40,
          personalBase: 60, casteReligion: 90, sentiment: 45
        },
        sentimentBreakdown: { positive: 30, neutral: 28, negative: 42 }
      }
    ]
  }
];

export const defaultWeights = {
  incumbency: { label: 'Incumbency Effect', value: 15, icon: '🏛️' },
  partyStrength: { label: 'Party Strength', value: 25, icon: '🏴' },
  pastWork: { label: 'Past Work / OSINT Record', value: 20, icon: '📋' },
  personalBase: { label: 'Personal Base', value: 15, icon: '👥' },
  casteReligion: { label: 'Caste/Religious Base', value: 15, icon: '🕉️' },
  sentiment: { label: 'Digital Sentiment', value: 10, icon: '📱' }
};
