import { useLocalStorage } from '@vueuse/core'
import { defineStore } from 'pinia'
import { readonly, watch } from 'vue'
import { getMsLeft, regenerateCode } from '@/domain/generator'
import type { Totp } from '@/domain/totp'
import { NotificationType } from '@/utils/notifications'
import { useNotify } from './notifications'

export const useTotpStore = defineStore('totp', () => {
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
    totpList.value.splice(
      totpList.value.findIndex(totp => totp.id === totpId),
      1,
    )
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
})
