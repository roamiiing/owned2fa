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
}

export const DEFAULT_NOTIFICATION_DURATION = 5000
