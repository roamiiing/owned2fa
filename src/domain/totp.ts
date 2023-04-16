import { zodValidator } from '@/utils/validation'
import { nanoid } from 'nanoid'
import { z } from 'zod'
import { regenerateCode } from './generator'

export const TotpId = z.string()
export type TotpId = z.infer<typeof TotpId>

export const TotpName = z.string().min(1).max(100)
export type TotpName = z.infer<typeof TotpName>

export const TotpSecret = z.string().min(8).max(100)
export type TotpSecret = z.infer<typeof TotpSecret>

export const TotpUsername = z.string().max(100).optional()
export type TotpUsername = z.infer<typeof TotpUsername>

export const TotpIssuer = z.string().max(100).optional()
export type TotpIssuer = z.infer<typeof TotpIssuer>

export type Totp = {
  id: TotpId
  name: TotpName
  secret: TotpSecret
  code: TotpCode
  username?: TotpUsername
  issuer?: TotpIssuer
}

export type TotpCode = {
  code: string
  issuedAt: number
  expiresAt: number
}

export const createTotp = (totpInput: Omit<Totp, 'id' | 'code'>) => {
  return {
    ...totpInput,
    id: TotpId.parse(nanoid(10)),
    code: regenerateCode(totpInput.secret),
  }
}

export const TotpNameValidator = zodValidator(TotpName)
export const TotpSecretValidator = zodValidator(TotpSecret)
export const TotpUsernameValidator = zodValidator(TotpUsername)
export const TotpIssuerValidator = zodValidator(TotpIssuer)
