interface IPoster {
  id: number
  title: string
  description: string
  img_mobile: string
  img_web: string
  notification: Notification
}

interface Notification {
  body: string
  title: string
}

export type { IPoster }
