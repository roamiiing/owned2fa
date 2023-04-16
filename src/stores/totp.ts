import { useLocalStorage } from '@vueuse/core'
import { nanoid } from 'nanoid'
import { readonly, watch } from 'vue'
import type { Totp } from '@/domain/totp'
import { getMsLeft, regenerateCode } from '@/domain/generator'
import { useNotify } from './notifications'
import { NotificationType } from '@/utils/notifications'

export const useTotpStore = () => {
  const notify = useNotify()
  const totpList = useLocalStorage<Totp[]>('totpList', () => [])

  watch(
    totpList,
    (value, _, cleanup) => {
      value.forEach(totp => {
        const msLeft = getMsLeft(totp.code.expiresAt)

        if (msLeft <= 0) {
          totp.code = regenerateCode(totp.secret)
        }

        const timeout = setTimeout(() => {
          totp.code = regenerateCode(totp.secret)
        }, getMsLeft(totp.code.expiresAt))

        cleanup(() => clearTimeout(timeout))
      })
    },
    {
      deep: true,
      immediate: true,
    },
  )

  const addTotp = (totp: Totp) => {
    totpList.value.push(totp)
  }

  const getTotp = (totpId: string) => {
    return totpList.value.find(totp => totp.id === totpId)
  }

  const updateTotpFields = (totpId: string, fields: Partial<Totp>) => {
    const totp = getTotp(totpId)

    if (totp) {
      Object.assign(totp, fields)
    }
  }

  const removeTotp = (totpId: string) => {
    totpList.value = totpList.value.filter(totp => totp.id !== totpId)
  }

  const copyCode = (totpId: string) => {
    const totp = getTotp(totpId)

    if (totp) {
      navigator.clipboard.writeText(totp.code.code)

      notify({
        text: 'Copied to clipboard',
        type: NotificationType.Success,
      })
    }
  }

  return {
    totpList: readonly(totpList),
    addTotp,
    getTotp,
    removeTotp,
    updateTotpFields,
    copyCode,
  }
}
