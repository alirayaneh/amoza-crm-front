import type Department from './Department'

type User = {
  id: number
  name: string
  role: string
  roles: Department[] | null
  telegram_user_id: any | null
  email: string
  phone: string
  picture: string
  department: Department
  created_at: string
  pivot: {
    created_at: string
    transferred_by_user: User
    is_current: boolean
    transferred_by: number
  }
}

export default User
