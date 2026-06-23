'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { withdrawFromStream } from '@/lib/contract'
import { getWithdrawableAmount } from '@/lib/stream-utils'
import type { StreamData } from '@/types/stream'

interface AutoWithdrawSettings {
  enabled: boolean
  intervalHours: number
  minAmountRaw: string
}

const DEFAULT_SETTINGS: AutoWithdrawSettings = {
  enabled: false,
  intervalHours: 24,
  minAmountRaw: '0',
}

function storageKey(streamId: string) {
  return `flowstar:auto-withdraw:${streamId}`
}

function loadSettings(streamId: string): AutoWithdrawSettings {
  try {
    const stored = localStorage.getItem(storageKey(streamId))
    if (!stored) return DEFAULT_SETTINGS
    return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) }
  } catch {
    return DEFAULT_SETTINGS
  }
}

function saveSettings(streamId: string, settings: AutoWithdrawSettings) {
  localStorage.setItem(storageKey(streamId), JSON.stringify(settings))
}

export function useAutoWithdraw(stream: StreamData | null) {
  const [settings, setSettings] = useState<AutoWithdrawSettings>(DEFAULT_SETTINGS)
  const [lastAutoWithdraw, setLastAutoWithdraw] = useState<number | null>(null)
  const [autoWithdrawPending, setAutoWithdrawPending] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (stream) setSettings(loadSettings(stream.id))
  }, [stream?.id])

  const updateSettings = useCallback(
    (update: Partial<AutoWithdrawSettings>) => {
      if (!stream) return
      const next = { ...settings, ...update }
      setSettings(next)
      saveSettings(stream.id, next)
    },
    [stream, settings],
  )

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    if (!settings.enabled || !stream || stream.cancelled) return

    const intervalMs = settings.intervalHours * 60 * 60 * 1000
    const minAmount = BigInt(settings.minAmountRaw || '0')

    async function tryWithdraw() {
      if (!stream || autoWithdrawPending) return
      const now = Math.floor(Date.now() / 1000)
      const withdrawable = getWithdrawableAmount(stream, now)

      if (withdrawable <= 0n) return
      if (minAmount > 0n && withdrawable < minAmount) return

      setAutoWithdrawPending(true)
      try {
        await withdrawFromStream(stream.id, withdrawable)
        setLastAutoWithdraw(Date.now())
      } catch {
        // Silently fail — wallet may not be connected or user may reject
      } finally {
        setAutoWithdrawPending(false)
      }
    }

    intervalRef.current = setInterval(tryWithdraw, intervalMs)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [settings.enabled, settings.intervalHours, settings.minAmountRaw, stream, autoWithdrawPending])

  return {
    settings,
    updateSettings,
    lastAutoWithdraw,
    autoWithdrawPending,
  }
}
