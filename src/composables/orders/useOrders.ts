import { ref } from 'vue'

import axios from '@/lib/axios'

import type Ticket from '@/types/Ticket'
import type NewTicket from '@/types/NewTicket'
import type NewOrder from '@/types/NewOrder'
import type NewReply from '@/types/NewReply'

type TicketErrors = {
  task_refrences?: string[]
  subject?: string[]
  description?: string[]
  client_id?: string[]
  marketer_id?: string[]
  searcher_id?: string[]
  pd_id?: string[]
  exchanger_id?: string[]
  logestic_id?: string[]
  discharge_id?: string[]
  checklist?: string[]
  total_amount?: string[]
  commission_amount?: string[]
  attachments?: string[]
}

type ReplyErrors = {
  content?: string[]
  attachments?: string[]
}

type AssignAgentErrors = {
  agent_id: number
  ticket_id: number
}

type UpdateTicket = {
  category_id?: number | null
  priority?: string
}

const ticket = ref({} as Ticket)
const errors = ref([] as TicketErrors & ReplyErrors & AssignAgentErrors & any)
const message = ref('')
const isLoading = ref(false)
const isSuccess = ref(false)

const save = async (newOrder: NewOrder, method: string, id: number | null = null) => {
  errors.value = [] as TicketErrors
  isLoading.value = true

  const headers = { 'Content-Type': 'multipart/form-data' }
  const url = id ? `/orders/${id}` : '/orders'

  await axios
    .post(url, { ...newOrder, _method: method }, { headers })
    .then((response) => {
      message.value = response.data.message
      ticket.value = response.data.data
      isSuccess.value = true
    })
    .catch((error) => {
      errors.value = error.response?.data.errors
      isSuccess.value = false
      if (errors.value) {
        const attachmentsErrors = Object.keys(error.response?.data.errors)
          .filter((key) => key.startsWith('attachments.'))
          .flatMap((key) => error.response?.data.errors[key])

        errors.value.attachments = attachmentsErrors

        const task_refrencesErrors = Object.keys(error.response?.data.errors)
          .filter((key) => key.startsWith('task_refrences.'))
          .flatMap((key) => error.response?.data.errors[key])

        errors.value.task_refrences = task_refrencesErrors
      }

      message.value = 'Please check the errors'
    })
    .then(() => {
      isLoading.value = false
    })
}

const reply = async (newReply: NewReply) => {
  message.value = ''
  errors.value = [] as ReplyErrors
  isLoading.value = true

  const headers = { 'Content-Type': 'multipart/form-data' }

  await axios
    .post('/ticket-replies', newReply, { headers })
    .then((response) => {
      message.value = response.data.message

      isSuccess.value = true
    })
    .catch((error) => {
      errors.value = error.response?.data.errors

      if (errors.value) {
        const attachmentsErrors = Object.keys(error.response?.data.errors)
          .filter((key) => key.startsWith('attachments.'))
          .flatMap((key) => error.response?.data.errors[key])

        errors.value.attachments = attachmentsErrors

        const task_refrencesErrors = Object.keys(error.response?.data.errors)
          .filter((key) => key.startsWith('task_refrences.'))
          .flatMap((key) => error.response?.data.errors[key])

        errors.value.task_refrences = task_refrencesErrors
      }

      if (error.response.status === 403) message.value = error.response?.data.message
      else message.value = 'Please check the errors'
    })
    .then(() => {
      isLoading.value = false
    })
}

const update = async (ticket: UpdateTicket, id: number) => {
  isLoading.value = true
  isSuccess.value = false

  await axios
    .put(`/tickets/${id}`, ticket)
    .then((response) => {
      message.value = response.data.message

      isSuccess.value = true
    })
    .catch((error) => (message.value = error.response?.data.message))
    .then(() => (isLoading.value = false))
}

const restore = async (id: number) => {
  isLoading.value = true
  isSuccess.value = false

  await axios
    .put(`/tickets/${id}/restore`)
    .then((response) => {
      message.value = response.data.message

      isSuccess.value = true
    })
    .catch((error) => {
      message.value = error.response?.data.message
    })
    .then(() => (isLoading.value = false))
}

const destroy = async (id: number, forceDelete = false) => {
  isLoading.value = true
  isSuccess.value = false

  const url = forceDelete ? `/tickets/${id}/force-delete` : `/tickets/${id}`

  await axios
    .delete(url)
    .then((response) => {
      message.value = response.data.message

      isSuccess.value = true
    })
    .catch((error) => {
      message.value = error.response?.data.message
    })
    .then(() => (isLoading.value = false))
}

const assignAgent = async (ticketId: number, agentId: number, transferTo: 'me' | 'agent') => {
  isLoading.value = true
  isSuccess.value = false

  await axios
    .put(`/assign-agent`, { agent_id: agentId, ticket_id: ticketId, transfer_to: transferTo })
    .then((response) => {
      message.value = response.data.message

      isSuccess.value = true
    })
    .catch((error) => {
      errors.value = error.response?.data.errors

      message.value = error.response?.data.message
    })
    .then(() => (isLoading.value = false))
}

const useOrders = () => {
  return {
    errors,
    isLoading,
    isSuccess,
    message,
    ticket,
    save,
    update,
    reply,
    restore,
    destroy,
    assignAgent
  }
}

export default useOrders
