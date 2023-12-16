import type User from './User'
import type Attachment from './Attachment'

type Tasks = {
  id: number
  repo_id: number
  tickets: {
    id: number
    reference: string
  }
}

type Order = {
  id: number
  subject: string
  description: string
  client_id?: number | null
  marketer_id?: number | null
  searcher_id?: number | null
  pd_id?: number | null
  exchanger_id?: number | null
  logestic_id?: number | null
  discharge_id?: number | null
  task_refrences?: string | null
  checklist?: string | null
  total_amount?: string | null
  commission_amount?: string | null
  my_commissions?: string | null
  tasks?: Tasks[] | null
  attachments: Attachment[] | null
  created_at: string
  updated_at: string
}

export default Order
