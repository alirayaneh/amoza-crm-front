import type Ticket from './Ticket'

import type User from './User'
import type Attachment from './Attachment'
type Log = {
  user_id: number
  id: number
  user: User
  created_at: string
  ticket_replay_id: number
}
type Reply = {
  id: number
  content: string
  is_client_reply: boolean
  ticket: Ticket
  user: User
  created_at: string
  logs: Log[]
  attachments: Attachment[]
}

export default Reply
