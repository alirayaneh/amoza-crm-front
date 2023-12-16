<script setup lang="ts">

import Autocomplete from '@/components/Forms/Autocomplete.vue'
import FileUpload from '@/components/Forms/FileUpload.vue'
import FormInput from '@/components/Forms/FormInput.vue'
import PrimaryButton from '@/components/Forms/PrimaryButton.vue'
import RichText from '@/components/Forms/RichText.vue'
import Switch from '@/components/Forms/Switch.vue'
import Attachments from '@/components/Common/Tickets/Attachments.vue'
import Progressbar from '@/components/Common/Progressbar.vue'
import useOrders from '@/composables/orders/useOrders'
//import OrderProgress from './OrderProgress.vue'
import GlobalNotes from '@/components/Common/GlobalNotes.vue'
import Tabs from '@/components/Common/Tabs.vue'
import GlobalAttachment from '@/components/Common/GlobalAttachment.vue'


import type Category from '@/types/Category'
import type Option from '@/types/Option'

import { ref, onMounted, watch, computed } from 'vue'

import { useToast } from 'vue-toastification'
import getUsers from '@/composables/users/getUsers'
import type UsersFilters from '@/types/UsersFilters'
import getClients from '@/composables/clients/getClients'
import type User from '@/types/User'
import type Client from '@/types/Client'
import type ClientsFilters from '@/types/ClientsFilters'
import { apiURL } from '@/global'
import type Order from '@/types/Order'
import type { forEach } from 'lodash'

const props = defineProps<{
  
  orderToEdit: Order
  tempCategories: Category[]
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'success'): void
}>()

const commission_amount = ref('')
const total_amount = ref('')

const categories = ref([] as Option[] | any[])

const agents = ref(
  [] as {
    name: string
    value: string
    picture: string | null
    email: string
    department: string | null
  }[]
)
const agent = ref({} as Option)
const pd = ref({} as Option)
const searcher = ref({} as Option)
const discharge = ref({} as Option)
const logestic = ref({} as Option)
const exchange = ref({} as Option)
const marketer = ref({} as Option)
const task_refrences = ref([] as String[])
const checklist = ref([] as Number[])

const agentsFilters = ref({} as UsersFilters)
const { load: fetchAgents, users: tempAgents } = getUsers(agentsFilters)

agent.value = {} as Option

agentsFilters.value = {
  role: 'agent'
  // department: +newCategory.departmentId,
  //category: newCategory.id
}
const growPercent = computed(() =>
  (
    (getAllSelectedCheckList().length / sorting_cat(categories.value).length) * 100 * 0.8 +
    (parseInt(total_amount.value) ? 5 : 0) +
    (parseInt(commission_amount.value) ? 5 : 0) +
    (pd.value?.value &&
    client.value?.value &&
    searcher.value?.value &&
    discharge.value?.value &&
    logestic.value?.value &&
    exchange.value?.value &&
    marketer.value?.value
      ? 10
      : 0)
  ).toFixed(0)
)
const method = computed(() => (props.orderToEdit.id ? 'put' : 'post'))
const title = computed(() => {
  if (props.orderToEdit.id) {
    return 'ویرایش سفارش شماره :' + props.orderToEdit.id
  } else {
    return 'سفارش جدید'
  }
})
const btnTitle = computed(() => {
  if (props.orderToEdit.id) {
    return 'بروز رسانی'
  } else {
    return 'ایجاد'
  }
})
watch(
  () => props.orderToEdit,
  (orderToEditNewValue) => {
    initForm(orderToEditNewValue)
  }
)

const initForm = (orderToEditNewValue: Order) => {
  categories.value = props.tempCategories
  if (orderToEditNewValue?.id) {
    marketer.value = orderToEditNewValue?.marketer_id
      ? { value: orderToEditNewValue?.marketer_id?.toString() ?? '', name: '' }
      : ({} as Option)
    exchange.value = orderToEditNewValue?.exchanger_id
      ? { value: orderToEditNewValue?.exchanger_id?.toString() ?? '', name: '' }
      : ({} as Option)
    logestic.value = orderToEditNewValue?.logestic_id
      ? { value: orderToEditNewValue?.logestic_id?.toString() ?? '', name: '' }
      : ({} as Option)
    discharge.value = orderToEditNewValue?.discharge_id
      ? { value: orderToEditNewValue?.discharge_id?.toString() ?? '', name: '' }
      : ({} as Option)
    client.value = orderToEditNewValue?.client_id
      ? { value: orderToEditNewValue?.client_id?.toString() ?? '', name: '' }
      : ({} as Option)
    pd.value = orderToEditNewValue?.pd_id
      ? { value: orderToEditNewValue?.pd_id?.toString() ?? '', name: '' }
      : ({} as Option)
    searcher.value = orderToEditNewValue?.searcher_id
      ? { value: orderToEditNewValue?.searcher_id?.toString() ?? '', name: '' }
      : ({} as Option)

    subject.value = orderToEditNewValue.subject
    description.value = orderToEditNewValue.description
    task_refrences.value = orderToEditNewValue.tasks?.map((itm) => itm.tickets.reference) ?? []
    total_amount.value = orderToEditNewValue.total_amount ?? '0'
    commission_amount.value = orderToEditNewValue.commission_amount ?? '0'
    checklist.value = orderToEditNewValue.checklist?.split(',').map((item) => +item) ?? []
    categories.value = categoryTocheckList(props.tempCategories)
  } else {
    reset()
  }
}
const clients = ref([] as Option[])

const client = ref({} as Option)

const clientsFilters = ref({ paginate: false } as ClientsFilters)
const { load: fetchClients, clients: tempClients } = getClients(clientsFilters)

onMounted(async () => {
  await fetchClients()
  await fetchAgents()
  clients.value = tempClients.value.map((client: Client) => ({
    name: client.name,
    value: client.id.toString(),
    picture: apiURL + client.picture,
    email: client.email
  }))

  agents.value = tempAgents.value.map((agent: User) => ({
    name: agent.name,
    value: agent.id.toString(),
    picture: apiURL + agent.picture,
    email: agent.email,
    department: agent.roles?.map((ro) => ro.name).join(',') ?? agent.department.name
  }))
  initForm(props.orderToEdit)
  categories.value = categoryTocheckList(props.tempCategories)
})

const categoryTocheckList = (newCategories: Category[]) => {
  return newCategories.map((category: Category) => ({
    name: category.name,
    value: category.id.toString(),
    id: category.id,
    slug: category.slug,
    departmentId: category.departments[0].id,
    passed: isSelectedCheckList(category.id)
  }))
}

watch(
  () => props.tempCategories,
  (newCategories) => {
    categories.value = categoryTocheckList(newCategories)
  }
)

const subject = ref('')

const description = ref('')

const files = ref()

const resetInput = ref(false)

const toast = useToast()

const { save, isLoading, isSuccess, errors, message } = useOrders()

const reset = () => {
  resetInput.value = true

  subject.value = ''
  description.value = ''
  total_amount.value = '0'
  commission_amount.value = '0'
  files.value = null
  pd.value = {} as Option
  client.value = {} as Option
  marketer.value = {} as Option
  searcher.value = {} as Option
  pd.value = {} as Option
  exchange.value = {} as Option
  logestic.value = {} as Option
  discharge.value = {} as Option
  task_refrences.value = [] as String[]
  checklist.value = [] as Number[]
}

const onSubmit = async () => {
  if (isLoading.value) return
  await save(
    {
      subject: subject.value,
      description: description.value,
      pd_id: isNaN(+pd.value?.value) ? null : +pd.value?.value,
      marketer_id: isNaN(+marketer.value?.value) ? null : +marketer.value?.value,
      searcher_id: isNaN(+searcher.value?.value) ? null : +searcher.value?.value,
      exchanger_id: isNaN(+exchange.value?.value) ? null : +exchange.value?.value,
      logestic_id: isNaN(+logestic.value?.value) ? null : +logestic.value?.value,
      discharge_id: isNaN(+discharge.value?.value) ? null : +discharge.value?.value,
      total_amount: total_amount.value,
      commission_amount: commission_amount.value,
      task_refrences:
        task_refrences.value?.filter((itm) => itm != '').map((itm) => itm.toString()) ?? null,
      client_id: isNaN(+client.value?.value) ? null : +client.value?.value,
      checklist: getAllSelectedCheckList(),
      attachments: files.value
    },
    method.value,
    props.orderToEdit.id ?? null
  )

  if (isSuccess.value) {
    toast.success(message.value)
    reset()
    emit('success')
    emit('close')
  } else {
    toast.error(message.value)
  }
}

const isSelectedCheckList = (itm: number) => {
  return checklist.value.filter((item) => item === itm).length > 0
}
const getAllSelectedCheckList = (): number[] => {
  return categories.value?.filter((cat) => cat.passed).map((cat) => cat.id)
}
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

const currentTab = ref('details')
const tabs = computed(() => {
  if (props.orderToEdit && props.orderToEdit.id) {
    return [
    { name: 'details', lable: 'مشخصات سفارش', id: 1 },
  { name: 'notes', lable: 'یاداشت ها', id: 2 },
  { name: 'files', lable: 'فایل ها', id: 3 }
]
  } else {
    return [
        { name: 'details', lable: 'مشخصات سفارش', id: 1 }
    ]
  }
})
</script>

<template>

    <Tabs
      v-if="open"
      :tabs="tabs"
      :current="currentTab"
      @set-current="
        (cur) => {
          currentTab = cur
        }
      "
    >
    <template v-slot:details>
    <form @submit.prevent="onSubmit">
      <div class="p-6">
        <div class="space-y-6">
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <h5>مشخصات سفارش</h5>
              <FormInput
                @change="(value) => (subject = value)"
                :value="subject"
                id="subject"
                type="text"
                label="عنوان"
                placeholder="عنوان سفارش"
                :errors="errors.subject"
              />

              <Autocomplete
                @update="(newClient) => (client = newClient)"
                :selected="client"
                label="مشتری"
                :options="clients"
                :errors="errors.client_id"
                null-text="یک مشتری انتخاب کنید "
              />
              <Autocomplete
                id="marketer_id"
                @update="(newAgent) => (marketer = newAgent)"
                :selected="marketer"
                label="بازاریاب"
                :options="agents.filter((a) => a.department?.indexOf('Marketer') !== -1)"
                :errors="errors.marketer_id"
                null-text="لطفا بازاریاب این سفارش را انتخاب کنید"
              />

              <Autocomplete
                @update="(newAgent) => (searcher = newAgent)"
                :selected="searcher"
                id="searcher_id"
                label="سورس"
                :options="agents.filter((a) => a.department?.indexOf('SearchTeam') !== -1)"
                :errors="errors.searcher_id"
                null-text="لطفا سرچر را انتخاب کنید"
              />

              <Autocomplete
                @update="(newAgent) => (pd = newAgent)"
                :selected="pd"
                id="pd_id"
                label="pd"
                :options="agents.filter((a) => a.department?.indexOf('NegotiationTeam') !== -1)"
                :errors="errors.pd_id"
                null-text="لطفا pd را انتخاب کنید"
              />

              <Autocomplete
                @update="(newAgent) => (exchange = newAgent)"
                id="exchanger_id"
                :selected="exchange"
                label="صراف"
                :options="agents.filter((a) => a.department?.indexOf('Exchange') !== -1)"
                :errors="errors.exchanger_id"
                null-text="لطفا صراف را انتخاب کنید"
              />

              <Autocomplete
                @update="(newAgent) => (logestic = newAgent)"
                :selected="logestic"
                id="logestic_id"
                label="لجستیک"
                :options="agents.filter((a) => a.department?.indexOf('Logistic') !== -1)"
                :errors="errors.logestic_id"
                null-text="لطفا پرسنل لجستیک را انتخاب کنید"
              />

              <Autocomplete
                @update="(newAgent) => (discharge = newAgent)"
                :selected="discharge"
                id="discharge_id"
                label="ترخیص کار"
                :options="agents.filter((a) => a.department?.indexOf('Discharge') !== -1)"
                :errors="errors.discharge_id"
                null-text="لطفا پرسنل ترخیص را انتخاب کنید"
              />

              <FormInput
                @change="(value) => (total_amount = value.toString())"
                id="total_amount"
                :value="total_amount.toString()"
                type="text"
                label="مبلغ کل سفارش"
                placeholder="کل مبلغ سفارش به تومان"
                :errors="errors.total_amount"
              />

              <FormInput
                @change="(value) => (commission_amount = value.toString())"
                :value="commission_amount.toString()"
                id="commission_amount"
                type="text"
                label="مبلغ سود قابل تقسیم سفارش"
                placeholder="مبلغ سود قابل تقسیم  به تومان"
                :errors="errors.commission_amount"
              />

              <FormInput
                @change="(value) => (task_refrences = value?.split(',') ?? null)"
                id="task_refrences"
                :value="task_refrences?.join(',') ?? null"
                type="text"
                label="لینک تسک مربوطه"
                placeholder="آدرس تسک مربوط به این سفارش"
                :errors="errors.task_refrences"
                :helper="'id تسک های  مورد نظر را با کاما از هم جدا کنید به شکل : QZ7KKNR1,OGWIGA92'"
              />

              <RichText
                id="description"
                @change="(value) => (description = value)"
                label="Description"
                :value="description"
                placeholder="Describe your issue..."
                :errors="errors.description"
              />

              <FileUpload
                @change="(value) => (files = value)"
                label="Drop attachments here or click to browse"
                :errors="errors.attachments"
                :multiple="true"
              />
              <!-- :ref="files" -->
            </div>
            <div>
              <h5 class="mb-5">چک لیست مراحل سفارش</h5>

              <Switch
                class=""
                v-for="cat in sorting_cat(categories)"
                :label="cat.name"
                :value="cat.passed"
                @change="
                  (newValue) => {
                    cat.passed = newValue
                    getAllSelectedCheckList()
                  }
                "
                :key="cat.id"
              />

              <Progressbar :progress="parseInt(growPercent)" />
            </div>
          </div>

          <div class="grid grid-cols-1 gap-6 sm:grid-cols-1">
            <Attachments
              v-if="props.orderToEdit.attachments?.length"
              class="p-3"
              :attachments="props.orderToEdit.attachments"
            />
          </div>
        </div>
      </div>

      <div class="mt-3 flex justify-end border-t bg-gray-50 px-6 py-3">
        <PrimaryButton
          type="submit"
          :text="isLoading ? 'sending ...' : btnTitle"
          :loading="isLoading"
        />
      </div>
    </form>
    </template>
    <template v-slot:notes>
          <GlobalNotes v-if="orderToEdit" :repo_id="orderToEdit.id" :repo_type="'orders'"></GlobalNotes>
      </template>
      <template v-slot:files>
        <GlobalAttachment  v-if="orderToEdit"  :repo_id="orderToEdit.id" :repo_type="'orders'"></GlobalAttachment>
      </template>
    </Tabs>  
</template>
