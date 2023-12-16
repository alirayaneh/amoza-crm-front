import type User from './User'
type Attachment = {
  id: number
  filename: string
  path: string
  created_at: string
  size?: number | null
  file_type?: string | null
  description?: string | null
  user?: User
}

export default Attachment
