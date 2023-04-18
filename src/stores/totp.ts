import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { getMsLeft, regenerateCode } from '@/domain/generator'
import type { Totp } from '@/domain/totp'
import { NotificationType } from '@/utils/notifications'
import { useNotify } from './notifications'

const TOTP_LS_KEY = 'totpList'

const setLsTotpList = (list: Totp[]) => {
  const append = list.map(({ code, ...rest }) => ({ ...rest }))
  localStorage.setItem(TOTP_LS_KEY, JSON.stringify(append))
}

const getLsTotpList = () => {
  try {
    return (
      JSON.parse(localStorage.getItem(TOTP_LS_KEY) ?? '[]') as Exclude<
        Totp,
        'code'
      >[]
    ).map(totp => ({
      ...totp,
      code: regenerateCode(totp.secret),
    }))
  } catch {
    setLsTotpList([])
    return []
  }
}

export const useTotpStore = defineStore('totp', () => {
  const notify = useNotify()
  const totpList = ref<Totp[]>(getLsTotpList())

  watch(
    totpList,
    (value, _, cleanup) => {
      setLsTotpList(value)

      value.forEach(totp => {
        const msLeft = getMsLeft(totp.code.expiresAt)

        if (msLeft <= 0) {
          totp.code = regenerateCode(totp.secret)
        }

        const timeout = setTimeout(() => {
          totp.code = regenerateCode(totp.secret)
        }, getMsLeft(totp.code.expiresAt))

        cleanup(() => {
          clearTimeout(timeout)
        })
      })
    },
    { immediate: true, deep: true },
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
    totpList,
    addTotp,
    getTotp,
    removeTotp,
    updateTotpFields,
    copyCode,
  }
})
