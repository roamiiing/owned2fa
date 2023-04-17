export enum NotificationType {
  Info = 'info',
  Warning = 'warning',
  Success = 'success',
  Error = 'error',
}

export type Notification = {
  duration: number
  type: NotificationType
  text: string
  actions?: NotificationAction[]
}

export type NotificationAction = {
  key: string
  text: string
  callback: () => void
}

export const DEFAULT_NOTIFICATION_DURATION = 5000
