import axios from '@/lib/axios'
import type Reply from '@/types/Reply'

import { ref } from 'vue'

const getViewed = async (reference: string, id: number) => {
  const replay = ref<Reply>({} as Reply)
  const error = ref<boolean>(false)
  const isLoading = ref<boolean>(false)

  await axios
    .get(`/tickets/viewed/${reference}/${id}`)
    .then((response) => {
      replay.value = response.data.data

      isLoading.value = false
    })
    .catch(() => (error.value = true))

  return { replay, error, isLoading }
}

export default getViewed
