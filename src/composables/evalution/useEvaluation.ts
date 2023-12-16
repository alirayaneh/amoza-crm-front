import { ref } from 'vue'

import axios from '@/lib/axios'

import type NewEvaluation from '@/types/NewEvaluation'
import type Evaluation from '@/types/Evaluation'
type TicketErrors = {
  subject?: string[]
  description?: string[]
  category_id?: string[]
  priority?: string[]
  duration?: string[]
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
  duration?: string
}

const evaluation = ref({} as Evaluation)
const errors = ref([] as TicketErrors & ReplyErrors & AssignAgentErrors & any)
const message = ref('')
const isLoading = ref(false)
const isSuccess = ref(false)
const error = ref(false)
const load = async (user:number,repo_id?:number,repo_type?:string) => {
  isLoading.value = true
  error.value = false

  await axios
    .get('/evaluation', { params:{user_id:user,repo_id:repo_id??null,repo_type:repo_type??null}  })
    .then((response) => (evaluation.value = response.data.data))
    .catch(() => (error.value = true))
    .finally(() => (isLoading.value = false))
}


const create = async (newEvaluation: NewEvaluation) => {
  errors.value = [] as TicketErrors
  isLoading.value = true

 // const headers = { 'Content-Type': 'multipart/form-data' }

  await axios
    .post('/evaluation', newEvaluation)
    .then((response) => {
      message.value = response.data.message

      evaluation.value = response.data.data

      isSuccess.value = true
    })
    .catch((error) => {
      errors.value = error.response?.data.errors

      if (errors.value) {
        const attachmentsErrors = Object.keys(error.response?.data.errors)
          .filter((key) => key.startsWith('attachments.'))
          .flatMap((key) => error.response?.data.errors[key])

        errors.value.attachments = attachmentsErrors
      }

      message.value = 'Please check the errors'
    })
    .then(() => {
      isLoading.value = false
    })
}


const update = async (newEvaluation: NewEvaluation, id: number) => {
  isLoading.value = true
  isSuccess.value = false

  await axios
    .put(`/evaluation/${id}`, newEvaluation)
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
    .put(`/evaluation/${id}/restore`)
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

  const url = forceDelete ? `/evaluation/${id}/force-delete` : `/evaluation/${id}`

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



const useEvaluation  = () => {
  return {
    errors,
    isLoading,
    isSuccess,
    message,
    evaluation ,
    load,
    create,
    update,
    restore,
    destroy,

  }
}

export default useEvaluation
