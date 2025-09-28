type IOrganization = {
  id: number
  name: string
  image_url: string
  parent?: number
  children: IOrganization[] | null
}

export type { IOrganization }
