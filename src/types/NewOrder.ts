type NewOrder = {
  subject: string
  description: string
  client_id?: number | null
  marketer_id?: number | null
  searcher_id?: number | null
  pd_id?: number | null
  exchanger_id?: number | null
  logestic_id?: number | null
  discharge_id?: number | null
  task_refrences?: string[] | null
  checklist?: number[] | null
  attachments?: File[]
  total_amount?: string | null
  commission_amount?: string | null
}

export default NewOrder
