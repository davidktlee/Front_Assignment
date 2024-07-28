export interface ItemType {
  id: string
  content: string
  isGhosting?: boolean
}

export interface ItemsType {
  id: string
  name: string
  contents: ItemType[]
}
