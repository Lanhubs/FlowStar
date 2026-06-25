'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { formatDateTime, formatTokenAmount, formatRate, shortenAddress } from '@/lib/stream-utils'
import type { TokenInfo } from '@/types/stream'

interface ConfirmationProps {
  open: boolean
  onConfirm: () => void
  onCancel: () => void
  pending: boolean
  feeEstimate?: string | null
  recipient: string
  token: TokenInfo
  totalAmount: bigint
  startTime: bigint
  endTime: bigint
  cliffTime: bigint
  cliffAmount: bigint
  amountPerSecond: bigint
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2 border-b border-border last:border-0">
      <span className="text-sm text-muted-foreground shrink-0">{label}</span>
      <span className="text-sm text-right font-medium">{value}</span>
    </div>
  )
}

export function CreateConfirmation({
  open,
  onConfirm,
  onCancel,
  pending,
  feeEstimate,
  recipient,
  token,
  totalAmount,
  startTime,
  endTime,
  cliffTime,
  cliffAmount,
  amountPerSecond,
}: ConfirmationProps) {
  const rate = formatRate(amountPerSecond, token.decimals, token.symbol)

  return (
    <Dialog open={open} onOpenChange={(o) => !o && !pending && onCancel()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Confirm stream creation</DialogTitle>
          <DialogDescription>
            Review the details below. You&apos;ll sign two transactions: one token approval, then stream creation.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-2">
          <Row label="Recipient" value={<span className="font-mono">{shortenAddress(recipient, 8)}</span>} />
          <Row label="Token" value={token.symbol} />
          <Row
            label="Total amount"
            value={`${formatTokenAmount(totalAmount, token.decimals, 4)} ${token.symbol}`}
          />
          <Row label="Rate" value={rate.perDay} />
          <Row label="Start" value={formatDateTime(startTime)} />
          <Row label="End" value={formatDateTime(endTime)} />
          {cliffTime > startTime && (
            <Row
              label="Cliff"
              value={
                <>
                  {formatDateTime(cliffTime)}
                  {cliffAmount > 0n && (
                    <span className="text-muted-foreground ml-1">
                      (+{formatTokenAmount(cliffAmount, token.decimals, 4)} {token.symbol})
                    </span>
                  )}
                </>
              }
            />
          )}
          {feeEstimate && (
            <Row label="Est. fee" value={`~${feeEstimate} XLM`} />
          )}
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="ghost" onClick={onCancel} disabled={pending}>
            Back
          </Button>
          <Button onClick={onConfirm} disabled={pending}>
            {pending ? 'Creating…' : 'Confirm & sign'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
