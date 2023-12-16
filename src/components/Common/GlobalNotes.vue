<script setup lang="ts">
import FileUpload from '@/components/Forms/FileUpload.vue'
import FormInput from '@/components/Forms/FormInput.vue'
import Attachments from '@/components/Common/Tickets/Attachments.vue'
import useAttachments from '@/composables/atachments/useAttachments'
import useNotes from '@/composables/notes/useNotes'
import PrimaryButton from '@/components/Forms/PrimaryButton.vue'
import { ref, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
const toast = useToast()

const { save, isLoading, isSuccess, notes, loadNotes, errors, message } =
useNotes()

const props = defineProps<{
  repo_id: number
  repo_type: string
}>()
const files = ref()
const description = ref('')
const resetFiles = ref(false)
const onSubmit = async () => {
  resetFiles.value = false
  await save(
    {
      data: description.value,
      repo_id:props.repo_id,
      repo_type:props.repo_type
    },
    props.repo_type,    
  )

  if (isSuccess.value) {
    toast.success(message.value)
    description.value = '';
    resetFiles.value = true
    await loadNotes(props.repo_type, props.repo_id)
  } else {
    toast.error(message.value)
  }
}

onMounted(async () => {
  await loadNotes(props.repo_type, props.repo_id)
})
</script>
<template>
  <div class="w-full p-4">
    <form @submit.prevent="onSubmit">
      <FormInput
        class="w-full"
        id="description"
        label="توضیحات"
        placeholder="جهت پیوست یاداشت متن یاداشت خود را درج نمایید"
        type="text"
        :value="description"
        @change="(value) => (description = value)"
        :errors="errors.description"
        :reset="resetFiles"
        @reset="()=>description=''"
        
      />
      <div class="mt-3 flex justify-end border-t bg-gray-50 px-6 py-3">
        <PrimaryButton
          type="submit"
          :text="'ثبت یاداشت'"
          :loading="isLoading"
          v-if="description"
        />
      </div>
    </form>
   
 <div class="bg-teal-100 border-t-4 border-teal-500 rounded-b text-teal-900 px-4 py-3 shadow-md mb-2" role="alert" v-for="note in notes" :key="note.id">
  <div class="flex">
    <div class="py-1"><svg class="fill-current h-6 w-6 text-teal-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/></svg></div>
    <div>
      <p class="font-bold" v-html="note.data"></p>
      <p class="text-sm">  
        <div>ثبت در تاریخ :{{ note.created_at }}</div>
        <div v-if="note.user">ثبت توسط:{{ note.user.name }}</div>
      </p>
    </div>
  </div>
</div>
  </div>
</template>
