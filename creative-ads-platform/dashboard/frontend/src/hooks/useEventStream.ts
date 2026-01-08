import { useState, useEffect, useCallback, useRef } from 'react'

export interface PipelineEvent {
  type: string
  data: Record<string, unknown>
  timestamp: string
  job_id?: string
}

interface UseEventStreamOptions {
  autoReconnect?: boolean
  reconnectDelay?: number
  maxReconnectAttempts?: number
}

interface UseEventStreamReturn {
  events: PipelineEvent[]
  connected: boolean
  paused: boolean
  setPaused: (paused: boolean) => void
  clearEvents: () => void
  reconnect: () => void
}

export function useEventStream(
  url: string,
  options: UseEventStreamOptions = {}
): UseEventStreamReturn {
  const {
    autoReconnect = true,
    reconnectDelay = 3000,
    maxReconnectAttempts = 5,
  } = options

  const [events, setEvents] = useState<PipelineEvent[]>([])
  const [connected, setConnected] = useState(false)
  const [paused, setPaused] = useState(false)
  const eventSourceRef = useRef<EventSource | null>(null)
  const reconnectAttemptsRef = useRef(0)
  const pausedRef = useRef(paused)

  // Keep pausedRef in sync
  useEffect(() => {
    pausedRef.current = paused
  }, [paused])

  const connect = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close()
    }

    const eventSource = new EventSource(url)
    eventSourceRef.current = eventSource

    eventSource.onopen = () => {
      setConnected(true)
      reconnectAttemptsRef.current = 0
    }

    eventSource.onmessage = (e) => {
      if (pausedRef.current) return

      try {
        const event = JSON.parse(e.data) as PipelineEvent
        // Skip heartbeat events
        if (event.type === 'heartbeat') return
        
        setEvents((prev) => [...prev, event])
      } catch (err) {
        console.error('Failed to parse SSE event:', err)
      }
    }

    eventSource.onerror = () => {
      setConnected(false)
      eventSource.close()

      if (autoReconnect && reconnectAttemptsRef.current < maxReconnectAttempts) {
        reconnectAttemptsRef.current += 1
        setTimeout(() => {
          connect()
        }, reconnectDelay)
      }
    }
  }, [url, autoReconnect, reconnectDelay, maxReconnectAttempts])

  const reconnect = useCallback(() => {
    reconnectAttemptsRef.current = 0
    connect()
  }, [connect])

  const clearEvents = useCallback(() => {
    setEvents([])
  }, [])

  useEffect(() => {
    connect()

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close()
      }
    }
  }, [connect])

  return {
    events,
    connected,
    paused,
    setPaused,
    clearEvents,
    reconnect,
  }
}
