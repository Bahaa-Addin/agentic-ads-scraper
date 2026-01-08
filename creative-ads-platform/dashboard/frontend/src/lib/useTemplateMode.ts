/**
 * Hook to detect if we're in template mode
 * Template mode uses frontend mock data instead of real API calls
 */

import { useLocation } from 'react-router-dom'

export function useIsTemplateMode(): boolean {
  const location = useLocation()
  return location.pathname.startsWith('/template')
}

