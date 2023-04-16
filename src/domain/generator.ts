import totp from 'totp-generator'
import type { TotpCode } from './totp'

export const DURATION = 30

export const regenerateCode = (secret: string): TotpCode => {
  const issuedAt = Date.now()
  const expiresAt = Math.ceil(issuedAt / 1000 / DURATION) * DURATION * 1000

  const code = totp(secret, {
    digits: 6,
    period: DURATION,
    timestamp: issuedAt,
  })

  return {
    code,
    issuedAt,
    expiresAt,
  }
}

export const getMsLeft = (expiresAt: number): number => {
  return Math.ceil(expiresAt - Date.now())
}
