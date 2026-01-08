/**
 * Mock Data Store for Template Dashboard
 * 
 * This file contains all mock/sample data used in the template dashboard.
 * The template mode (/template/*) uses this data instead of real API calls.
 */

// ============================================================================
// Types
// ============================================================================

export interface MockJob {
  id: string
  job_type: string
  source?: string
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'retrying' | 'cancelled'
  payload: Record<string, unknown>
  priority: number
  created_at: string
  updated_at: string
  started_at?: string
  completed_at?: string
  retry_count: number
  max_retries: number
  error_message?: string
  assets_processed: number
}

export interface MockAsset {
  id: string
  source: string
  source_url?: string
  image_url?: string
  asset_type: string
  advertiser_name?: string
  title?: string
  description?: string
  features?: {
    layout_type?: string
    focal_point?: string
    visual_complexity?: string
    tone?: string
    dominant_colors?: Array<{ hex: string; percentage: number }>
    cta?: {
      detected: boolean
      type?: string
      text?: string
      prominence: number
    }
    quality_score?: number
    has_logo?: boolean
    has_human_face?: boolean
    has_product?: boolean
  }
  industry?: string
  reverse_prompt?: string
  negative_prompt?: string
  created_at: string
  updated_at: string
}

export interface MockLogEntry {
  timestamp: string
  level: 'debug' | 'info' | 'warning' | 'error' | 'critical'
  message: string
  source?: string
  job_id?: string
  asset_id?: string
  metadata?: Record<string, unknown>
}

export interface MockScraperStatus {
  source: string
  enabled: boolean
  running: boolean
  last_run?: string
  items_scraped: number
  success_rate: number
  error_count: number
  last_error?: string
}

// ============================================================================
// Constants
// ============================================================================

const JOB_TYPES = ['scrape', 'extract_features', 'generate_prompt', 'classify_industry']
const JOB_STATUSES: MockJob['status'][] = ['completed', 'pending', 'in_progress', 'failed']
const SOURCES = ['meta_ad_library', 'google_ads_transparency', 'internet_archive', 'wikimedia_commons']
const INDUSTRIES = [
  'finance', 'ecommerce', 'saas', 'healthcare', 'education', 
  'entertainment', 'travel', 'food', 'automotive', 'real_estate', 
  'fashion', 'technology'
]
const LAYOUT_TYPES = ['hero', 'grid', 'split', 'minimal', 'carousel', 'overlay']
const FOCAL_POINTS = ['product', 'person', 'text', 'logo', 'scene']
const TONES = ['professional', 'playful', 'urgent', 'friendly', 'luxurious', 'minimalist']
const CTA_TYPES = ['shop_now', 'learn_more', 'sign_up', 'get_started', 'download', 'contact_us']
const CTA_TEXTS = ['Shop Now', 'Learn More', 'Sign Up', 'Get Started', 'Download', 'Contact Us']

const LOG_MESSAGES = {
  debug: [
    'Processing batch of 10 assets',
    'Cache hit for feature extraction',
    'Queue worker started',
    'Database connection pooled',
    'Rate limit check passed',
  ],
  info: [
    'Successfully scraped 25 assets from Meta Ad Library',
    'Feature extraction completed for asset batch',
    'Reverse prompt generated successfully',
    'Job completed in 2.3 seconds',
    'Pipeline stage completed',
  ],
  warning: [
    'Rate limit approaching for Google Ads API',
    'Retry attempt 2 of 3 for failed request',
    'Cache miss, fetching from source',
    'Slow response from external API',
    'Queue backlog detected',
  ],
  error: [
    'Failed to connect to Firestore',
    'Rate limit exceeded for Meta API',
    'Feature extraction model timeout',
    'Invalid response from LLM service',
    'Asset download failed: 404',
  ],
  critical: [
    'Database connection lost',
    'All retries exhausted for critical job',
    'Memory limit exceeded',
  ],
}

// ============================================================================
// Helper Functions
// ============================================================================

function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}


function generateTimestamp(minutesAgo: number): string {
  const date = new Date()
  date.setMinutes(date.getMinutes() - minutesAgo)
  return date.toISOString()
}

// ============================================================================
// Mock Data Generators
// ============================================================================

export function generateMockJobs(count: number = 50): MockJob[] {
  const jobs: MockJob[] = []
  
  for (let i = 0; i < count; i++) {
    const status = JOB_STATUSES[i % JOB_STATUSES.length]
    const jobType = JOB_TYPES[i % JOB_TYPES.length]
    const createdAt = generateTimestamp(i * randomInt(1, 10))
    
    jobs.push({
      id: `job-${i.toString().padStart(4, '0')}-${Math.random().toString(36).substr(2, 8)}`,
      job_type: jobType,
      source: jobType === 'scrape' ? randomChoice(SOURCES) : undefined,
      status,
      payload: { query: 'sample query', max_items: 100 },
      priority: i % 3,
      created_at: createdAt,
      updated_at: createdAt,
      started_at: status !== 'pending' ? createdAt : undefined,
      completed_at: status === 'completed' ? generateTimestamp(i * randomInt(1, 5)) : undefined,
      retry_count: status === 'failed' ? randomInt(1, 3) : 0,
      max_retries: 3,
      error_message: status === 'failed' ? 'Rate limit exceeded' : undefined,
      assets_processed: status === 'completed' ? (i + 1) * randomInt(5, 20) : 0,
    })
  }
  
  return jobs
}

export function generateMockAssets(count: number = 100): MockAsset[] {
  const assets: MockAsset[] = []
  
  for (let i = 0; i < count; i++) {
    const hasPrompt = i % 2 === 0
    const industry = INDUSTRIES[i % INDUSTRIES.length]
    const ctaIndex = i % CTA_TYPES.length
    
    assets.push({
      id: `asset-${i.toString().padStart(4, '0')}-${Math.random().toString(36).substr(2, 8)}`,
      source: SOURCES[i % SOURCES.length],
      source_url: `https://example.com/ad/${i}`,
      image_url: `https://picsum.photos/seed/${i + 100}/400/300`,
      asset_type: 'image',
      advertiser_name: `Advertiser ${(i % 20) + 1}`,
      title: `Creative Ad Campaign #${i + 1}`,
      industry,
      features: {
        layout_type: LAYOUT_TYPES[i % LAYOUT_TYPES.length],
        focal_point: FOCAL_POINTS[i % FOCAL_POINTS.length],
        visual_complexity: ['simple', 'moderate', 'complex'][i % 3],
        tone: TONES[i % TONES.length],
        dominant_colors: [
          { hex: '#2980b9', percentage: 0.4 },
          { hex: '#ffffff', percentage: 0.3 },
          { hex: '#e74c3c', percentage: 0.2 },
        ],
        cta: {
          detected: true,
          type: CTA_TYPES[ctaIndex],
          text: CTA_TEXTS[ctaIndex],
          prominence: 0.7 + Math.random() * 0.3,
        },
        quality_score: 0.6 + Math.random() * 0.4,
        has_logo: i % 3 === 0,
        has_human_face: i % 4 === 1,
        has_product: i % 2 === 0,
      },
      reverse_prompt: hasPrompt
        ? `A professional ${industry} advertisement featuring a ${LAYOUT_TYPES[i % LAYOUT_TYPES.length]} layout with ${TONES[i % TONES.length]} tone. The creative shows a ${FOCAL_POINTS[i % FOCAL_POINTS.length]} as the main focus, using a blue and white color palette. Prominent "${CTA_TEXTS[ctaIndex]}" call-to-action button, high quality, clean composition, modern design.`
        : undefined,
      negative_prompt: hasPrompt ? 'blurry, low quality, amateur, cluttered, pixelated' : undefined,
      created_at: generateTimestamp(i * randomInt(5, 30)),
      updated_at: generateTimestamp(i * randomInt(1, 10)),
    })
  }
  
  return assets
}

export function generateMockLogs(count: number = 500): MockLogEntry[] {
  const logs: MockLogEntry[] = []
  const levels: MockLogEntry['level'][] = ['debug', 'info', 'warning', 'error', 'critical']
  const sources = ['agent', 'scraper', 'feature_extractor', 'prompt_generator', 'queue', 'storage']
  
  for (let i = 0; i < count; i++) {
    // Weight towards info logs
    const levelWeights = [0.1, 0.5, 0.2, 0.15, 0.05]
    const random = Math.random()
    let cumulative = 0
    let levelIndex = 0
    for (let j = 0; j < levelWeights.length; j++) {
      cumulative += levelWeights[j]
      if (random <= cumulative) {
        levelIndex = j
        break
      }
    }
    const level = levels[levelIndex]
    
    logs.push({
      timestamp: generateTimestamp(i * randomInt(1, 5)),
      level,
      message: randomChoice(LOG_MESSAGES[level]),
      source: randomChoice(sources),
      job_id: Math.random() > 0.3 ? `job-${randomInt(1, 50)}` : undefined,
      asset_id: Math.random() > 0.5 ? `asset-${randomInt(1, 100)}` : undefined,
      metadata: Math.random() > 0.7 ? {
        duration_ms: randomInt(100, 5000),
        worker_id: `worker-${randomInt(0, 9)}`,
      } : undefined,
    })
  }
  
  return logs
}

export function generateMockScraperStatuses(): MockScraperStatus[] {
  return SOURCES.map((source, i) => ({
    source,
    enabled: true,
    running: i % 3 === 0, // Some running
    last_run: generateTimestamp(randomInt(5, 180)),
    items_scraped: randomInt(1000, 10000),
    success_rate: 0.92 + Math.random() * 0.07,
    error_count: randomInt(0, 15),
    last_error: Math.random() > 0.7 ? 'Rate limit exceeded' : undefined,
  }))
}

// ============================================================================
// Mock API Response Generators
// ============================================================================

export function getMockDashboardMetrics() {
  const assets = generateMockAssets(100)
  const totalAssets = assets.length
  
  return {
    pipeline: {
      assets_scraped: totalAssets,
      features_extracted: Math.floor(totalAssets * 0.95),
      prompts_generated: Math.floor(totalAssets * 0.85),
      assets_stored: totalAssets,
      errors: Math.floor(totalAssets * 0.02),
      by_source: SOURCES.reduce((acc, s, i) => ({ ...acc, [s]: Math.floor(totalAssets / SOURCES.length) + i }), {}),
      by_industry: INDUSTRIES.reduce((acc, ind, i) => ({ ...acc, [ind]: Math.floor(totalAssets / INDUSTRIES.length) + (i % 5) }), {}),
    },
    queue: {
      total_jobs: 50,
      pending_jobs: 15,
      in_progress_jobs: 3,
      completed_jobs: 542,
      failed_jobs: 5,
      dead_letter_jobs: 2,
      avg_processing_time_seconds: 5.2,
      jobs_per_minute: 12.5,
    },
    system: {
      scraper_throughput_per_minute: 45.5,
      feature_extraction_latency_ms: 1250.0,
      prompt_generation_latency_ms: 2800.0,
      pubsub_queue_length: 15,
      cloud_run_utilization: {
        agent: 0.35,
        scraper: 0.55,
        dashboard: 0.20,
      },
      error_rate_percent: 2.3,
    },
    timestamp: new Date().toISOString(),
  }
}

export function getMockJobStats() {
  return {
    pending: 15,
    in_progress: 3,
    completed: 542,
    failed: 5,
    retrying: 2,
    cancelled: 0,
  }
}

export function getMockIndustryDistribution() {
  const totalAssets = 100
  return INDUSTRIES.map((industry, i) => ({
    industry,
    count: Math.floor(totalAssets / INDUSTRIES.length) + (i % 5),
    percentage: (100 / INDUSTRIES.length) + (i % 3),
  }))
}

export function getMockTimeSeries(metricName: string, hours: number = 24) {
  const points = []
  const now = new Date()
  const intervalMinutes = 60
  const numPoints = (hours * 60) / intervalMinutes
  
  for (let i = numPoints - 1; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * intervalMinutes * 60 * 1000)
    
    // Generate realistic values based on metric name
    let baseValue: number
    if (metricName === 'assets_scraped') {
      baseValue = 50 + Math.random() * 30
    } else if (metricName === 'features_extracted') {
      baseValue = 45 + Math.random() * 25
    } else if (metricName === 'prompts_generated') {
      baseValue = 40 + Math.random() * 20
    } else if (metricName === 'error_rate') {
      baseValue = 1.5 + Math.random() * 3
    } else {
      baseValue = Math.random() * 100
    }
    
    // Add time-of-day variation
    const hour = timestamp.getHours()
    if (hour >= 9 && hour <= 17) {
      baseValue *= 1.3 // Business hours boost
    } else if (hour >= 0 && hour <= 6) {
      baseValue *= 0.6 // Night reduction
    }
    
    points.push({
      timestamp: timestamp.toISOString(),
      value: Math.round(baseValue * 100) / 100,
    })
  }
  
  const colors: Record<string, string> = {
    assets_scraped: '#3B82F6',
    features_extracted: '#10B981',
    prompts_generated: '#8B5CF6',
    error_rate: '#EF4444',
  }
  
  return {
    name: metricName,
    data: points,
    color: colors[metricName] || '#6B7280',
  }
}

export function getMockQualityDistribution() {
  return {
    '0.0-0.5': randomInt(5, 15),
    '0.5-0.7': randomInt(15, 25),
    '0.7-0.8': randomInt(20, 35),
    '0.8-0.9': randomInt(25, 40),
    '0.9-1.0': randomInt(15, 30),
  }
}

export function getMockCtaDistribution() {
  return CTA_TYPES.reduce((acc, cta, i) => ({
    ...acc,
    [cta]: randomInt(10, 50) - i * 3,
  }), {})
}

export function getMockFilterOptions() {
  return {
    industries: INDUSTRIES.map(ind => ({ 
      value: ind, 
      label: ind.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) 
    })),
    sources: SOURCES.map(src => ({ 
      value: src, 
      label: src.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) 
    })),
    cta_types: CTA_TYPES.map(cta => ({ 
      value: cta, 
      label: cta.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) 
    })),
  }
}

export function getMockLogStats() {
  const logs = generateMockLogs(500)
  const byLevel: Record<string, number> = { debug: 0, info: 0, warning: 0, error: 0, critical: 0 }
  const bySource: Record<string, number> = {}
  
  logs.forEach(log => {
    byLevel[log.level] = (byLevel[log.level] || 0) + 1
    if (log.source) {
      bySource[log.source] = (bySource[log.source] || 0) + 1
    }
  })
  
  return {
    total_logs: logs.length,
    by_level: byLevel,
    by_source: bySource,
  }
}

export function getMockScraperMetrics() {
  return SOURCES.map(source => ({
    source,
    total_items: randomInt(1000, 10000),
    successful_items: randomInt(900, 9800),
    failed_items: randomInt(10, 200),
    avg_scrape_time_ms: 1500 + Math.random() * 1000,
    rate_limit_hits: randomInt(0, 10),
  }))
}

// ============================================================================
// Cached Mock Data (initialized once)
// ============================================================================

let _cachedJobs: MockJob[] | null = null
let _cachedAssets: MockAsset[] | null = null
let _cachedLogs: MockLogEntry[] | null = null

export function getCachedMockJobs(): MockJob[] {
  if (!_cachedJobs) {
    _cachedJobs = generateMockJobs(50)
  }
  return _cachedJobs
}

export function getCachedMockAssets(): MockAsset[] {
  if (!_cachedAssets) {
    _cachedAssets = generateMockAssets(100)
  }
  return _cachedAssets
}

export function getCachedMockLogs(): MockLogEntry[] {
  if (!_cachedLogs) {
    _cachedLogs = generateMockLogs(500)
  }
  return _cachedLogs
}

