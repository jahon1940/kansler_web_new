type IOrganization = {
  id: number
  name: string
  image_url: string
  children: IOrganization[] | null
}

export type { IOrganization }
