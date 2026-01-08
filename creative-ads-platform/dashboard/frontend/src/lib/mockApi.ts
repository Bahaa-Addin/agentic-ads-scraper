/**
 * Mock API Functions for Template Dashboard
 * 
 * These functions simulate API responses using frontend-only mock data.
 * Used when the app is in template mode (/template/*).
 */

import {
  getCachedMockJobs,
  getCachedMockAssets,
  getCachedMockLogs,
  generateMockScraperStatuses,
  getMockDashboardMetrics,
  getMockJobStats,
  getMockIndustryDistribution,
  getMockTimeSeries,
  getMockQualityDistribution,
  getMockCtaDistribution,
  getMockFilterOptions,
  getMockLogStats,
  getMockScraperMetrics,
  MockJob,
} from './mockData'

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// ============================================================================
// Dashboard API
// ============================================================================

export async function mockGetDashboardMetrics() {
  await delay(200)
  return getMockDashboardMetrics()
}

export async function mockGetTimeSeries(metrics: string[], hours: number = 24) {
  await delay(150)
  return metrics.map(m => getMockTimeSeries(m, hours))
}

export async function mockGetIndustryDistribution() {
  await delay(100)
  return getMockIndustryDistribution()
}

export async function mockGetQualityDistribution() {
  await delay(100)
  return getMockQualityDistribution()
}

export async function mockGetCtaDistribution() {
  await delay(100)
  return getMockCtaDistribution()
}

// ============================================================================
// Jobs API
// ============================================================================

export interface MockJobsQuery {
  page?: number
  limit?: number
  status?: string
  job_type?: string
  source?: string
}

export async function mockGetJobs(params: MockJobsQuery = {}) {
  await delay(200)
  
  const { page = 1, limit = 20, status, job_type, source } = params
  let jobs = getCachedMockJobs()
  
  // Apply filters
  if (status && status !== 'all') {
    jobs = jobs.filter(j => j.status === status)
  }
  if (job_type && job_type !== 'all') {
    jobs = jobs.filter(j => j.job_type === job_type)
  }
  if (source && source !== 'all') {
    jobs = jobs.filter(j => j.source === source)
  }
  
  const total = jobs.length
  const start = (page - 1) * limit
  const end = start + limit
  const paginatedJobs = jobs.slice(start, end)
  
  return {
    jobs: paginatedJobs,
    total,
    page,
    limit,
    total_pages: Math.ceil(total / limit),
  }
}

export async function mockGetJob(jobId: string) {
  await delay(100)
  const jobs = getCachedMockJobs()
  return jobs.find(j => j.id === jobId) || null
}

export async function mockGetJobStats() {
  await delay(100)
  return getMockJobStats()
}

export async function mockCreateJob(data: Partial<MockJob>) {
  await delay(300)
  const newJob: MockJob = {
    id: `job-new-${Math.random().toString(36).substr(2, 8)}`,
    job_type: data.job_type || 'scrape',
    source: data.source,
    status: 'pending',
    payload: data.payload || {},
    priority: data.priority || 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    retry_count: 0,
    max_retries: 3,
    assets_processed: 0,
  }
  return newJob
}

export async function mockCancelJob(jobId: string) {
  await delay(150)
  return { success: true, job_id: jobId, status: 'cancelled' }
}

export async function mockRetryJob(jobId: string) {
  await delay(150)
  return { success: true, job_id: jobId, status: 'retrying' }
}

export async function mockBulkCancelJobs(jobIds: string[]) {
  await delay(300)
  return { success: true, cancelled: jobIds.length }
}

export async function mockBulkRetryJobs(jobIds: string[]) {
  await delay(300)
  return { success: true, retried: jobIds.length }
}

// ============================================================================
// Assets API
// ============================================================================

export interface MockAssetsQuery {
  page?: number
  limit?: number
  industry?: string
  source?: string
  cta_type?: string
  has_prompt?: boolean
  quality_min?: number
  quality_max?: number
  search?: string
}

export async function mockGetAssets(params: MockAssetsQuery = {}) {
  await delay(250)
  
  const { page = 1, limit = 20, industry, source, cta_type, has_prompt, quality_min, quality_max, search } = params
  let assets = getCachedMockAssets()
  
  // Apply filters
  if (industry && industry !== 'all') {
    assets = assets.filter(a => a.industry === industry)
  }
  if (source && source !== 'all') {
    assets = assets.filter(a => a.source === source)
  }
  if (cta_type && cta_type !== 'all') {
    assets = assets.filter(a => a.features?.cta?.type === cta_type)
  }
  if (has_prompt !== undefined) {
    assets = assets.filter(a => has_prompt ? !!a.reverse_prompt : !a.reverse_prompt)
  }
  if (quality_min !== undefined) {
    assets = assets.filter(a => (a.features?.quality_score || 0) >= quality_min)
  }
  if (quality_max !== undefined) {
    assets = assets.filter(a => (a.features?.quality_score || 1) <= quality_max)
  }
  if (search) {
    const searchLower = search.toLowerCase()
    assets = assets.filter(a => 
      a.title?.toLowerCase().includes(searchLower) ||
      a.advertiser_name?.toLowerCase().includes(searchLower) ||
      a.industry?.toLowerCase().includes(searchLower)
    )
  }
  
  const total = assets.length
  const start = (page - 1) * limit
  const end = start + limit
  const paginatedAssets = assets.slice(start, end)
  
  return {
    assets: paginatedAssets,
    total,
    page,
    limit,
    total_pages: Math.ceil(total / limit),
  }
}

export async function mockGetAsset(assetId: string) {
  await delay(100)
  const assets = getCachedMockAssets()
  return assets.find(a => a.id === assetId) || null
}

export async function mockGetFilterOptions() {
  await delay(50)
  return getMockFilterOptions()
}

export async function mockRegeneratePrompt(assetId: string) {
  await delay(500)
  return {
    asset_id: assetId,
    reverse_prompt: 'A newly generated professional advertisement prompt with modern design elements, clean composition, and engaging call-to-action.',
    negative_prompt: 'blurry, low quality, amateur, cluttered, pixelated',
  }
}

export async function mockBulkExport(assetIds: string[]) {
  await delay(300)
  const assets = getCachedMockAssets().filter(a => assetIds.includes(a.id))
  return {
    success: true,
    assets: assets.map(a => ({
      id: a.id,
      image_url: a.image_url,
      reverse_prompt: a.reverse_prompt,
    })),
  }
}

// ============================================================================
// Scrapers API
// ============================================================================

export async function mockGetScraperStatuses() {
  await delay(200)
  return generateMockScraperStatuses()
}

export async function mockGetScraperMetrics() {
  await delay(150)
  return getMockScraperMetrics()
}

export async function mockStartScraper(source: string) {
  await delay(300)
  return { success: true, source, status: 'running' }
}

export async function mockStopScraper(source: string) {
  await delay(150)
  return { success: true, source, status: 'stopped' }
}

export async function mockUpdateScraperConfig(source: string, config: Record<string, unknown>) {
  await delay(200)
  return { success: true, source, config }
}

// ============================================================================
// Logs API
// ============================================================================

export interface MockLogsQuery {
  page?: number
  limit?: number
  level?: string
  source?: string
  job_id?: string
  asset_id?: string
  search?: string
  start_time?: string
  end_time?: string
}

export async function mockGetLogs(params: MockLogsQuery = {}) {
  await delay(200)
  
  const { page = 1, limit = 50, level, source, job_id, asset_id, search, start_time, end_time } = params
  let logs = getCachedMockLogs()
  
  // Apply filters
  if (level && level !== 'all') {
    logs = logs.filter(l => l.level === level)
  }
  if (source && source !== 'all') {
    logs = logs.filter(l => l.source === source)
  }
  if (job_id) {
    logs = logs.filter(l => l.job_id === job_id)
  }
  if (asset_id) {
    logs = logs.filter(l => l.asset_id === asset_id)
  }
  if (search) {
    const searchLower = search.toLowerCase()
    logs = logs.filter(l => l.message.toLowerCase().includes(searchLower))
  }
  if (start_time) {
    logs = logs.filter(l => new Date(l.timestamp) >= new Date(start_time))
  }
  if (end_time) {
    logs = logs.filter(l => new Date(l.timestamp) <= new Date(end_time))
  }
  
  const total = logs.length
  const start = (page - 1) * limit
  const end = start + limit
  const paginatedLogs = logs.slice(start, end)
  
  return {
    logs: paginatedLogs,
    total,
    page,
    limit,
    total_pages: Math.ceil(total / limit),
  }
}

export async function mockGetLogStats() {
  await delay(100)
  return getMockLogStats()
}

// ============================================================================
// Analytics API
// ============================================================================

export async function mockGetAnalyticsOverview() {
  await delay(200)
  const metrics = getMockDashboardMetrics()
  return {
    total_assets: metrics.pipeline.assets_scraped,
    total_prompts: metrics.pipeline.prompts_generated,
    total_jobs: metrics.queue.total_jobs,
    processing_rate: metrics.system.scraper_throughput_per_minute,
    avg_quality: 0.78,
    top_industries: getMockIndustryDistribution().slice(0, 5),
  }
}

export async function mockGetTrendData(metric: string, days: number = 7) {
  await delay(150)
  return getMockTimeSeries(metric, days * 24)
}

export async function mockGetSourceBreakdown() {
  await delay(100)
  const metrics = getMockDashboardMetrics()
  return Object.entries(metrics.pipeline.by_source).map(([source, count]) => ({
    source,
    count,
    percentage: (count as number) / metrics.pipeline.assets_scraped * 100,
  }))
}

// ============================================================================
// Settings API (Mock only - no real backend equivalent)
// ============================================================================

export async function mockGetSettings() {
  await delay(100)
  return {
    notifications: {
      email: true,
      slack: false,
      discord: false,
    },
    scraping: {
      rate_limit_per_minute: 60,
      max_concurrent_jobs: 5,
      retry_attempts: 3,
    },
    storage: {
      auto_cleanup: true,
      retention_days: 90,
    },
    feature_extraction: {
      model: 'gpt-4o-mini',
      batch_size: 10,
    },
  }
}

export async function mockUpdateSettings(settings: Record<string, unknown>) {
  await delay(200)
  return { success: true, settings }
}

