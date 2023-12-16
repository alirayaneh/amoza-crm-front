import { ref } from 'vue'

import axios from '@/lib/axios'
import type Note from '@/types/Note'
type NoteErrors = {
  data?: string[]
  data_type?: string[]
  repo_id?: string[]
}

/* type Atachment = {
  filename: string
  id: number
  description: string | null
  size: number | null
  path: string
} */

type NewNote = {
  data: string 
  repo_id:number
  repo_type:string
  data_type?:string
}

const notes = ref([] as Note[])
const errors = ref([] as NoteErrors & any)
const message = ref('')
const isLoading = ref(false)
const isSuccess = ref(false)
const error = ref<boolean>(false)
const save = async (newNote: NewNote, repo: string, id: number | null = null) => {
  errors.value = [] as NoteErrors
  isLoading.value = true

  const headers = { 'Content-Type': 'multipart/form-data' }
  const url = id ? `/notes/${repo}/${id}` : `/notes/${repo}`

  await axios
    .post(url, { ...newNote }, { headers })
    .then((response) => {
      message.value = response.data.message
      //attachment.value = response.data.data
      isSuccess.value = true
    })
    .catch((error) => {
      errors.value = error.response?.data.errors
      isSuccess.value = false
      message.value = 'Please check the errors'
    })
    .then(() => {
      isLoading.value = false
    })
}
const loadNotes = async (repo: string, id: number) => {
  isLoading.value = true
  await axios
    .get(`/notes/${repo}/${id}`)
    .then((response) => {
      notes.value = response.data.data

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

const useNotes = () => {
  return {
    errors,
    isLoading,
    isSuccess,
    message,
    save,    
    notes,
    loadNotes,
    restore,
    destroy
  }
}

export default useNotes
