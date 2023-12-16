import type User from './User'
type Note = {
  id: number
  created_at: string
  data:string,
  data_type?:string|null
  user?: User
}

export default Note
