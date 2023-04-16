import { defineStore } from 'pinia'
import { ref, readonly } from 'vue'

import {
  DEFAULT_NOTIFICATION_DURATION,
  NotificationType,
  type Notification,
} from '@/utils/notifications'

type StoredNotification = Notification & {
  id: number
}

export const useNotificationsStore = defineStore(
  'notifications/notifications',
  () => {
    const currentId = ref(0)

    const getNewId = () => currentId.value++

    const notifications = ref<StoredNotification[]>([])

    const addNotification = (notification: Notification) => {
      const id = getNewId()
      notifications.value.push({
        ...notification,
        id,
      })

      return id
    }

    const removeNotification = (id: number) => {
      notifications.value = notifications.value.filter(v => v.id !== id)
    }

    return {
      notifications: readonly(notifications),
      addNotification,
      removeNotification,
    }
  },
)

export const useNotify = () => {
  const store = useNotificationsStore()

  return (notification: Partial<Notification> & Pick<Notification, 'text'>) => {
    const mapped: Notification = {
      text: notification.text,
      duration: notification.duration ?? DEFAULT_NOTIFICATION_DURATION,
      type: notification.type ?? NotificationType.Info,
    }

    const id = store.addNotification(mapped)

    setTimeout(() => {
      store.removeNotification(id)
    }, mapped.duration)
  }
}
