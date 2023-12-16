import axios from '@/lib/axios'

import { ref, type Ref } from 'vue'

//import type TicketsFilters from '@/types/TicketsFilters'
import type Paginated from '@/interfaces/Paginated'
import type OrdersFilters from '@/types/OrdersFilters'
import type Order from '@/types/Order'

const getOrders = (filters = ref({} as OrdersFilters)) => {
  const orders = ref({} as Paginated<Order>)
  const error = ref(false)
  const isLoading = ref(true)

  const load = async () => {
    isLoading.value = true
    error.value = false

    await axios
      .get('/orders', { params: filters.value })
      .then((response) => (orders.value = response.data.data))
      .catch(() => (error.value = true))
      .finally(() => (isLoading.value = false))
  }

  return { load, orders, error, isLoading }
}

export default getOrders
