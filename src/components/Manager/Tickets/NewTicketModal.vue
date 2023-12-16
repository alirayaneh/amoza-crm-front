<script setup lang="ts">
import Modal from '@/components/Common/Modal.vue'
import Autocomplete from '@/components/Forms/Autocomplete.vue'
import FileUpload from '@/components/Forms/FileUpload.vue'
import FormInput from '@/components/Forms/FormInput.vue'
import ListBox from '@/components/Forms/ListBox.vue'
import PrimaryButton from '@/components/Forms/PrimaryButton.vue'
import RichText from '@/components/Forms/RichText.vue'

import useTickets from '@/composables/tickets/useTickets'

import type Category from '@/types/Category'
import type Option from '@/types/Option'

import { ref, onMounted, watch } from 'vue'

import { useToast } from 'vue-toastification'
import getUsers from '@/composables/users/getUsers'
import type UsersFilters from '@/types/UsersFilters'
import getClients from '@/composables/clients/getClients'
import type User from '@/types/User'
import type Client from '@/types/Client'
import type ClientsFilters from '@/types/ClientsFilters'
import { apiURL } from '@/global'

const props = defineProps<{
  open: boolean
  tempCategories: Category[]
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'success'): void
}>()

const priorities = [
  { name: 'اولویت کم', value: 'low' },
  { name: 'اولویت متوسط', value: 'medium' },
  { name: 'اولویت بالا', value: 'high' }
]

const durations = [
  { name: '1 روز' , value: "1"  },
  { name: '2 روز' , value: "2"  },
  { name: '3 روز' , value: "3"  },
  { name: '4 روز' , value: "4"  },
  { name: '5 روز' , value: "5"  },
  { name: '6 روز' , value: "6"  },
  { name: '7 روز' , value: "7"  },
  { name: '8 روز' , value: "8"  },
  { name: '9 روز' , value: "9"  },
  { name: '10 روز', value: "10"  },
  { name: '11 روز', value: "11"  },
  { name: '12 روز', value: "12"  },
  { name: '13 روز', value: "13"  },
  { name: '14 روز', value: "14"  },
  { name: '15 روز', value: "15"  },
  { name: '16 روز', value: "16"  },
  { name: '17 روز', value: "17"  },
  { name: '18 روز', value: "18"  },
 
]

const priority = ref({} as Option)

const duration = ref({} as Option)

const categories = ref([] as Option[] | any[])

const category = ref({} as Option | any)

const agents = ref([] as Option[])

const agent = ref({} as Option)

const agentsFilters = ref({} as UsersFilters)
const { load: fetchAgents, users: tempAgents } = getUsers(agentsFilters)

watch(category, async (newCategory) => {
  agent.value = {} as Option

  agentsFilters.value = {
    role: 'agent',
    // department: +newCategory.departmentId,
    category: newCategory.id
  }

  await fetchAgents()

  agents.value = tempAgents.value.map((agent: User) => ({
    name: agent.name,
    value: agent.id.toString(),
    picture: apiURL + agent.picture,
    email: agent.email,
    department: agent.roles?.map((ro) => ro.name).join(',') ?? agent.department.name
  }))
})

const clients = ref([] as Option[])

const client = ref({} as Option)

const clientsFilters = ref({ paginate: false } as ClientsFilters)
const { load: fetchClients, clients: tempClients } = getClients(clientsFilters)

onMounted(async () => {
  await fetchClients()

  clients.value = tempClients.value.map((client: Client) => ({
    name: client.name,
    value: client.id.toString(),
    picture: apiURL + client.picture,
    email: client.email
  }))
})

watch(
  () => props.tempCategories,
  (newCategories) => {
    categories.value = newCategories.map((category: Category) => ({
      name: category.name,
      value: category.id.toString(),
      id: category.id,
      departmentId: category.departments[0].id
    }))
  }
)

const subject = ref('')

const description = ref('')

const files = ref()

const resetInput = ref(false)

const toast = useToast()

const { create, isLoading, isSuccess, errors, message } = useTickets()

const reset = () => {
  resetInput.value = true
  subject.value = ''
  description.value = ''
  files.value = null
  priority.value = {} as Option
  duration.value = {} as Option
  category.value = {} as Option
}

const onSubmit = async () => {
  if (isLoading.value) return
  await create({
    duration: duration.value?.value,
    priority: priority.value?.value,
    category_id: category.value?.value,
    subject: subject.value,
    description: description.value,
    attachments: files.value,
    agent_id: isNaN(+agent.value?.value) ? null : +agent.value?.value,
    client_id: isNaN(+client.value?.value) ? null : +client.value?.value
  })

  if (isSuccess.value) {
    toast.success(message.value)

    reset()

    emit('success')

    emit('close')
  } else {
    toast.error(message.value)
  }
}
</script>

<template>
  <Modal :open="open" @close="$emit('close')" title="تسک جدید" width-class="max-w-2xl">
    <form @submit.prevent="onSubmit">
      <div class="p-6">
        <div class="space-y-6">
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <ListBox
              @update="(newPriority) => (priority = newPriority)"
              :selected="priority"
              label="اولویت"
              :options="priorities"
              :errors="errors.priority"
              null-text="انتخاب اولویت"
            />

            <Autocomplete
              @update="(newCategory) => (category = newCategory)"
              :selected="category"
              label="دسته بندی"
              :options="categories"
              :errors="errors.category_id"
              null-text="انتخاب دسته بندی"
            />
          </div>

          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <Autocomplete
              @update="(newClient) => (client = newClient)"
              :selected="client"
              label="مشتری"
              :options="clients"
              :errors="errors.client_id"
              null-text="انتخاب مشتری"
            />

            <Autocomplete
              @update="(newAgent) => (agent = newAgent)"
              :selected="agent"
              label="دستیار"
              :options="agents"
              :errors="errors.agent_id"
              null-text="انتخاب اتومات پرسنل مربوطه"
            />
          </div>

          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <ListBox
              @update="(newPriority) => (duration = newPriority)"
              :selected="duration"
              label="تعیین مهلت انجام تسک"
              :options="durations"
              :errors="errors.duration"
              null-text="مهم نیست "
            />
          </div>

          <FormInput
            @change="(value) => (subject = value)"
            id="subject"
            type="text"
            label="موضوع"
            placeholder="موضوع تسک"
            :errors="errors.subject"
          />

          <RichText
            @change="(value) => (description = value)"
            label="شرح"
            placeholder="شرح تسک مورد نظر"
            :errors="errors.description"
          />

          <FileUpload
            @change="(value) => (files = value)"
            label="جهت آپلود فایل ها را به این ناحیه درگ کنید یا اینجا کلیک کنید"
            :errors="errors.attachments"
            :multiple="true"
          />
          <!-- :ref="files" -->
        </div>
      </div>

      <div class="mt-3 flex justify-end border-t bg-gray-50 px-6 py-3">
        <PrimaryButton
          type="submit"
          :text="isLoading ? 'sending ...' : 'ایجاد'"
          :loading="isLoading"
        />
      </div>
    </form>
  </Modal>
</template>
