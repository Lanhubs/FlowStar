'use client'

import Link from 'next/link'
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react'
import { useNow } from '@/hooks/use-now'
import { useWallet } from '@/hooks/use-wallet'
import {
  getStreamProgress,
  getStreamStatus,
  formatTokenAmount,
  shortenAddress,
} from '@/lib/stream-utils'
import { ProgressBar } from '@/components/ui/progress-bar'
import { TokenAmount } from '@/components/ui/token-amount'
import { CountdownTimer } from '@/components/ui/countdown-timer'
import { StreamStatusBadge } from '@/components/streams/stream-status-badge'
import type { StreamData } from '@/types/stream'

export function StreamCard({ stream }: { stream: StreamData }) {
  const now = useNow(1000)
  const { address } = useWallet()
  const status = getStreamStatus(stream, now)
  const progress = getStreamProgress(stream, now)
  const withdrawnFrac =
    stream.depositedAmount > 0n
      ? Number((stream.withdrawnAmount * 10000n) / stream.depositedAmount) / 10000
      : 0

  const isOutgoing = address === stream.sender
  const counterparty = isOutgoing ? stream.recipient : stream.sender
  const direction = isOutgoing ? 'Sending' : 'Receiving'
  const displayAmount = formatTokenAmount(stream.depositedAmount, stream.token.decimals, 2)
  const ariaLabel = `${direction} ${displayAmount} ${stream.token.symbol}, ${status}, ${(progress * 100).toFixed(0)}% unlocked`

  return (
    <Link
      href={`/app/stream/${stream.id}`}
      className="group block rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/40"
      aria-label={ariaLabel}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span
            className={
              'flex size-9 items-center justify-center rounded-lg ' +
              (isOutgoing
                ? 'bg-secondary text-muted-foreground'
                : 'bg-primary/10 text-primary')
            }
          >
            {isOutgoing ? (
              <ArrowUpRight className="size-4.5" />
            ) : (
              <ArrowDownLeft className="size-4.5" />
            )}
          </span>
          <div>
            <p className="text-sm font-medium">
              {isOutgoing ? 'Sending to' : 'Receiving from'}
            </p>
            <p className="font-mono text-xs text-muted-foreground">
              {shortenAddress(counterparty, 5)}
            </p>
          </div>
        </div>
        <StreamStatusBadge status={status} />
      </div>

      <div className="mt-5 flex items-end justify-between">
        <div>
          <p className="text-xs text-muted-foreground">Total</p>
          <TokenAmount
            amount={stream.depositedAmount}
            token={stream.token}
            className="text-lg font-semibold"
            maxFractionDigits={2}
          />
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">
            {status === 'scheduled'
              ? 'Starts in'
              : status === 'completed' || status === 'cancelled'
                ? 'Ended'
                : 'Ends in'}
          </p>
          <p className="text-sm font-medium">
            {status === 'scheduled' ? (
              <CountdownTimer target={stream.startTime} />
            ) : status === 'completed' || status === 'cancelled' ? (
              <span className="text-muted-foreground">—</span>
            ) : (
              <CountdownTimer target={stream.endTime} />
            )}
          </p>
        </div>
      </div>

      <div className="mt-4">
        <ProgressBar
          value={progress}
          marker={withdrawnFrac}
          indeterminateShimmer={status === 'streaming'}
        />
        <div className="mt-2 flex justify-between text-xs text-muted-foreground">
          <span>{(progress * 100).toFixed(1)}% unlocked</span>
          <span>
            <TokenAmount
              amount={stream.withdrawnAmount}
              token={stream.token}
              showSymbol={false}
              maxFractionDigits={2}
            />{' '}
            withdrawn
          </span>
        </div>
      </div>
    </Link>
  )
}
