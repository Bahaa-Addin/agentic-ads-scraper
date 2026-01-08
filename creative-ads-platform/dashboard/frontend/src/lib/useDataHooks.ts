/**
 * Custom Data Hooks
 * 
 * These hooks conditionally use mock data (template mode) or real API calls (live mode).
 * Template mode uses frontend-only mock data.
 * Live mode makes actual API calls to the backend.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useIsTemplateMode } from './useTemplateMode'
import * as api from './api'
import * as mockApi from './mockApi'

// ============================================================================
// Dashboard Hooks
// ============================================================================

export function useDashboardMetrics() {
  const isTemplate = useIsTemplateMode()
  
  return useQuery({
    queryKey: ['dashboardMetrics', isTemplate],
    queryFn: () => isTemplate ? mockApi.mockGetDashboardMetrics() : api.getDashboardMetrics(),
    refetchInterval: isTemplate ? false : 10000,
  })
}

export function useRecentJobs(limit: number = 5) {
  const isTemplate = useIsTemplateMode()
  
  return useQuery({
    queryKey: ['recentJobs', isTemplate, limit],
    queryFn: async () => {
      if (isTemplate) {
        const result = await mockApi.mockGetJobs({ limit })
        return result
      }
      return api.getJobs({ page_size: limit })
    },
    refetchInterval: isTemplate ? false : 15000,
  })
}

export function useIndustryDistribution() {
  const isTemplate = useIsTemplateMode()
  
  return useQuery({
    queryKey: ['industryDistribution', isTemplate],
    queryFn: () => isTemplate ? mockApi.mockGetIndustryDistribution() : api.getIndustryDistribution(),
  })
}

export function useTimeSeries(metric: string, hours: number = 24) {
  const isTemplate = useIsTemplateMode()
  
  return useQuery({
    queryKey: ['timeSeries', metric, hours, isTemplate],
    queryFn: async () => {
      if (isTemplate) {
        const result = await mockApi.mockGetTimeSeries([metric], hours)
        return result[0]
      }
      return api.getTimeSeries(metric, hours)
    },
  })
}

export function useMultiTimeSeries(metrics: string[], hours: number = 24) {
  const isTemplate = useIsTemplateMode()
  
  return useQuery({
    queryKey: ['multiTimeSeries', metrics, hours, isTemplate],
    queryFn: () => isTemplate 
      ? mockApi.mockGetTimeSeries(metrics, hours) 
      : api.getMultiTimeSeries(metrics, hours),
  })
}

export function useQualityDistribution() {
  const isTemplate = useIsTemplateMode()
  
  return useQuery({
    queryKey: ['qualityDistribution', isTemplate],
    queryFn: () => isTemplate ? mockApi.mockGetQualityDistribution() : api.getQualityDistribution(),
  })
}

export function useCtaDistribution() {
  const isTemplate = useIsTemplateMode()
  
  return useQuery({
    queryKey: ['ctaDistribution', isTemplate],
    queryFn: () => isTemplate ? mockApi.mockGetCtaDistribution() : api.getCtaDistribution(),
  })
}

// ============================================================================
// Jobs Hooks
// ============================================================================

interface JobsQueryParams {
  page?: number
  page_size?: number
  status?: string
  job_type?: string
  source?: string
}

export function useJobs(params: JobsQueryParams = {}) {
  const isTemplate = useIsTemplateMode()
  
  return useQuery({
    queryKey: ['jobs', params, isTemplate],
    queryFn: async () => {
      if (isTemplate) {
        const result = await mockApi.mockGetJobs({
          page: params.page,
          limit: params.page_size || 15,
          status: params.status,
          job_type: params.job_type,
          source: params.source,
        })
        return {
          ...result,
          has_more: result.page < result.total_pages,
        }
      }
      return api.getJobs(params)
    },
    refetchInterval: isTemplate ? false : 10000,
  })
}

export function useJobStats() {
  const isTemplate = useIsTemplateMode()
  
  return useQuery({
    queryKey: ['jobStats', isTemplate],
    queryFn: () => isTemplate ? mockApi.mockGetJobStats() : api.getJobStats(),
    refetchInterval: isTemplate ? false : 15000,
  })
}

export function useControlJobs() {
  const isTemplate = useIsTemplateMode()
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ action, jobIds }: { action: string; jobIds: string[] }) => {
      if (isTemplate) {
        // Simulate success in template mode
        await new Promise(resolve => setTimeout(resolve, 300))
        return { success: true, action, jobIds }
      }
      return api.controlJobs(action, jobIds)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] })
      queryClient.invalidateQueries({ queryKey: ['jobStats'] })
    },
  })
}

export function useRetryAllFailedJobs() {
  const isTemplate = useIsTemplateMode()
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (limit: number = 10) => {
      if (isTemplate) {
        await new Promise(resolve => setTimeout(resolve, 300))
        return { success: true, retried: Math.min(limit, 5) }
      }
      return api.retryAllFailedJobs(limit)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] })
      queryClient.invalidateQueries({ queryKey: ['jobStats'] })
    },
  })
}

// ============================================================================
// Assets Hooks
// ============================================================================

interface AssetsQueryParams {
  page?: number
  page_size?: number
  industry?: string
  source?: string
  cta_type?: string
  has_prompt?: boolean
  search?: string
}

export function useAssets(params: AssetsQueryParams = {}) {
  const isTemplate = useIsTemplateMode()
  
  return useQuery({
    queryKey: ['assets', params, isTemplate],
    queryFn: async () => {
      if (isTemplate) {
        const result = await mockApi.mockGetAssets({
          page: params.page,
          limit: params.page_size || 12,
          industry: params.industry,
          source: params.source,
          cta_type: params.cta_type,
          has_prompt: params.has_prompt,
          search: params.search,
        })
        return {
          ...result,
          has_more: result.page < result.total_pages,
        }
      }
      return api.getAssets(params)
    },
  })
}

export function useFilterOptions() {
  const isTemplate = useIsTemplateMode()
  
  return useQuery({
    queryKey: ['filterOptions', isTemplate],
    queryFn: () => isTemplate ? mockApi.mockGetFilterOptions() : api.getFilterOptions(),
  })
}

export function useReprocessAssets() {
  const isTemplate = useIsTemplateMode()
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (assetIds: string[]) => {
      if (isTemplate) {
        await new Promise(resolve => setTimeout(resolve, 500))
        return { success: true, reprocessed: assetIds.length }
      }
      return api.reprocessAssets(assetIds, ['extract_features', 'generate_prompt'])
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] })
    },
  })
}

// ============================================================================
// Scrapers Hooks
// ============================================================================

export function useScraperStatuses() {
  const isTemplate = useIsTemplateMode()
  
  return useQuery({
    queryKey: ['scraperStatuses', isTemplate],
    queryFn: () => isTemplate ? mockApi.mockGetScraperStatuses() : api.getScraperStatuses(),
    refetchInterval: isTemplate ? false : 10000,
  })
}

export function useScraperMetrics() {
  const isTemplate = useIsTemplateMode()
  
  return useQuery({
    queryKey: ['scraperMetrics', isTemplate],
    queryFn: () => isTemplate ? mockApi.mockGetScraperMetrics() : api.getScraperMetrics(),
    refetchInterval: isTemplate ? false : 15000,
  })
}

export function useTriggerScraping() {
  const isTemplate = useIsTemplateMode()
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ sources, options }: { sources: string[]; options?: { query?: string; max_items_per_source?: number } }) => {
      if (isTemplate) {
        await new Promise(resolve => setTimeout(resolve, 500))
        return { success: true, sources, jobs_created: sources.length }
      }
      return api.triggerScraping(sources, options)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scraperStatuses'] })
      queryClient.invalidateQueries({ queryKey: ['jobs'] })
    },
  })
}

export function useTriggerAllScrapers() {
  const isTemplate = useIsTemplateMode()
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (options?: { query?: string; max_items_per_source?: number }) => {
      if (isTemplate) {
        await new Promise(resolve => setTimeout(resolve, 500))
        return { success: true, jobs_created: 4 }
      }
      return api.triggerAllScrapers(options)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scraperStatuses'] })
      queryClient.invalidateQueries({ queryKey: ['jobs'] })
    },
  })
}

// ============================================================================
// Logs Hooks
// ============================================================================

interface LogsQueryParams {
  page?: number
  page_size?: number
  level?: string
  source?: string
  search?: string
  job_id?: string
}

export function useLogs(params: LogsQueryParams = {}, showErrorsOnly: boolean = false) {
  const isTemplate = useIsTemplateMode()
  
  return useQuery({
    queryKey: ['logs', params, showErrorsOnly, isTemplate],
    queryFn: async () => {
      if (isTemplate) {
        const result = await mockApi.mockGetLogs({
          page: params.page,
          limit: params.page_size || 50,
          level: showErrorsOnly ? 'error' : params.level,
          source: params.source,
          search: params.search,
          job_id: params.job_id,
        })
        return {
          ...result,
          has_more: result.page < result.total_pages,
        }
      }
      return showErrorsOnly 
        ? api.getErrorLogs({ page: params.page, page_size: params.page_size })
        : api.getLogs(params)
    },
    refetchInterval: isTemplate ? false : 10000,
  })
}

export function useLogStats() {
  const isTemplate = useIsTemplateMode()
  
  return useQuery({
    queryKey: ['logStats', isTemplate],
    queryFn: () => isTemplate ? mockApi.mockGetLogStats() : api.getLogStats(),
  })
}

// ============================================================================
// Settings Hooks (Template-only for now)
// ============================================================================

export function useSettings() {
  const isTemplate = useIsTemplateMode()
  
  return useQuery({
    queryKey: ['settings', isTemplate],
    queryFn: () => mockApi.mockGetSettings(),
    // Settings are always mock for now since there's no real backend endpoint
  })
}

export function useUpdateSettings() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (settings: Record<string, unknown>) => mockApi.mockUpdateSettings(settings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] })
    },
  })
}

