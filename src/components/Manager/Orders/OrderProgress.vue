<template>
  <Progressbar class="mt-3" :progress="parseInt(growPercent)" :type="'mini'" />
</template>
<script setup lang="ts">
import type Order from '@/types/Order'
import type Category from '@/types/Category'
import Progressbar from '@/components/Common/Progressbar.vue'

import { ref, onMounted, watch, computed } from 'vue'
const props = defineProps<{
  orderToEdit: Order
  tempCategories: Category[]
}>()

const growPercent = computed(() =>
  (
    ((props.orderToEdit.checklist?.split(',').length ?? 0) /
      sorting_cat(props.tempCategories).length) *
      100 *
      0.8 +
    ((parseInt(props.orderToEdit?.total_amount ?? '0') ? 5 : 0) +
      (parseInt(props.orderToEdit?.commission_amount ?? '0') ? 5 : 0) +
      (props.orderToEdit?.pd_id &&
      props.orderToEdit?.client_id &&
      props.orderToEdit?.searcher_id &&
      props.orderToEdit?.discharge_id &&
      props.orderToEdit?.logestic_id &&
      props.orderToEdit?.exchanger_id &&
      props.orderToEdit?.marketer_id
        ? 10
        : 0))
  ).toFixed(0)
)

const sorting_cat = (cats: any[]) => {
  cats.forEach((cat) => {
    switch (cat.slug) {
      case 'waitting-for-search-result':
        cat.sort = 1
        break
      case 'pass-search-result':
        cat.sort = 2
        break
      case 'give-pi-from-factory':
        cat.sort = 3
        break
      case 'pass-first-pament-to-factory':
        cat.sort = 4
        break
      case 'continer-reserve':
        cat.sort = 5
        break
      case 'give-container-docs':
        cat.sort = 6
        break
      case 'discharge-pass-waiting-for-ship-defined':
        cat.sort = 7
        break
      case 'delivery-to-ship':
        cat.sort = 8
        break
      case 'final-pass':
        cat.sort = 9
        break
      default:
        // حذف ویژگی‌ها (properties) در کیس دیفالت
        // delete cat.sort
        break
    }
  })

  return cats.filter((cat) => 'sort' in cat).sort((a, b) => a.sort - b.sort)
}
</script>
