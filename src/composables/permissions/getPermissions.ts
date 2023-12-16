import axios from '@/lib/axios'

import { ref } from 'vue'

const getPermissions = () => {
  const permissions = ref([])
  const error = ref(false)
  const isLoading = ref(false)

  const permissionsload = async () => {
    isLoading.value = true

    await axios
      .get('/permissions')
      .then((response) => {
        permissions.value = response.data.data
      })
      .catch(() => (error.value = true))
      .then(() => (isLoading.value = false))
  }

  return { permissionsload, permissions, error, isLoading }
}
export default getPermissions
