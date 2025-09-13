interface ILoginResponse {
  auth_token: string
}

interface ILoginBody {
  password: string
  username: string
  fcm_token: string | null
  device: Device
}

interface Device {
  info: string
  name: string
  type: 1 | 2 | 3
  imei: string
  app_version: string
}

export type { ILoginResponse, ILoginBody }
