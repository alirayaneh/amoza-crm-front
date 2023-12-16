import { ref } from 'vue'

import axios from '@/lib/axios'
import type Attachment from '@/types/Attachment'
type AttachmentErrors = {
  attachments?: string[]
}

/* type Atachment = {
  filename: string
  id: number
  description: string | null
  size: number | null
  path: string
} */

type NewAttachment = {
  description?: string | null
  attachments: File[]
}

const attachments = ref([] as Attachment[])
const attachment = ref([] as Attachment[])
const errors = ref([] as AttachmentErrors & any)
const message = ref('')
const isLoading = ref(false)
const isSuccess = ref(false)
const error = ref<boolean>(false)
const save = async (newAttachment: NewAttachment, repo: string, id: number | null = null) => {
  errors.value = [] as AttachmentErrors
  isLoading.value = true

  const headers = { 'Content-Type': 'multipart/form-data' }
  const url = id ? `/attachments/${repo}/${id}` : `/attachments/${repo}`

  await axios
    .post(url, { ...newAttachment }, { headers })
    .then((response) => {
      message.value = response.data.message
      attachment.value = response.data.data
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
const loadAttachments = async (repo: string, id: number) => {
  isLoading.value = true
  await axios
    .get(`/attachments/${repo}/${id}`)
    .then((response) => {
      attachments.value = response.data.data

      isLoading.value = false
    })
    .catch(() => (error.value = true))
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

const useAttachments = () => {
  return {
    errors,
    isLoading,
    isSuccess,
    message,
    save,
    attachment,
    attachments,
    loadAttachments,
    restore,
    destroy
  }
}

export default useAttachments
