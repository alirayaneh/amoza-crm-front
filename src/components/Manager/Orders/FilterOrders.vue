<script setup lang="ts">
import FilterPanel from '@/components/Common/FilterPanel.vue'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'
import Switch from '@/components/Forms/Switch.vue'
import DatesPicker from '@/components/Forms/DatesPicker.vue'
import type Option from '@/types/Option'

import type CategoriesFilters from '@/types/CategoriesFilters'

import { onMounted, ref, watch } from 'vue'
import type OrdersFilters from '@/types/OrdersFilters'

const props = defineProps<{
  open: boolean
  filters: OrdersFilters
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'reset'): void
  (e: 'filter', filters: OrdersFilters): void
}>()

const authStore = useAuthStore()
const { isAdmin } = storeToRefs(authStore)

const role = ref({} as Option)

const trash = ref(false)

onMounted(async () => {
  if (props.filters.trash) {
    trash.value = props.filters.trash.toString() == 'true' ? true : false
  }
  if (props.filters.dates) {
    dates.value = [
      new Date(props.filters.dates?.[0] as string),
      new Date(props.filters.dates?.[1] as string)
    ]
  }
})

const dates = ref([] as Date[])

const filter = () => {
  const filters: OrdersFilters = {
    trash: trash.value,
    dates: [
      dates.value?.[0]?.toISOString().slice(0, 10) ?? null,
      dates.value?.[1]?.toISOString().slice(0, 10) ?? null
    ]
  }

  emit('filter', filters)
}

const reset = () => {
  trash.value = false
  role.value = {} as Option
  dates.value = [] as Date[]

  emit('reset')
}
</script>

<template>
  <FilterPanel :filter="filter" :reset="reset" :open="open" @close="$emit('close')">
    <div class="relative mt-6 flex-1 space-y-6 px-4 sm:px-6">
      <Switch
        label="Trash"
        :value="trash"
        @change="(newValue) => (trash = newValue)"
        v-if="isAdmin"
      />

      <DatesPicker @update="(newDates) => (dates = newDates)" :dates="dates" />
    </div>
  </FilterPanel>
</template>
