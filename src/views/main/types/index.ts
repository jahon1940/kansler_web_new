interface IPoster {
  id: number
  poster_type: string
  img_mobile: string
  img_web: string
  notification: Notification
}

interface Notification {
  body: string
  title: string
}

interface IAdminStory {
  id: number
  name: string
  username: string
  image_url: string
  stories: IStory[]
}

interface IStory {
  id: number
  video_url: string
  thumbnail_url: string
  comment: string
  duration: number
  created_at: string
  watched: boolean
}

export type { IPoster, IAdminStory, IStory }
