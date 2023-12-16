<script setup lang="ts">
import FileUpload from '@/components/Forms/FileUpload.vue'
import FormInput from '@/components/Forms/FormInput.vue'
import Attachments from '@/components/Common/Tickets/Attachments.vue'
import useAttachments from '@/composables/atachments/useAttachments'
import PrimaryButton from '@/components/Forms/PrimaryButton.vue'
import { ref, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
const toast = useToast()

const { save, isLoading, isSuccess, attachments, loadAttachments, errors, message } =
  useAttachments()

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
      description: description.value,
      attachments: files.value
    },
    props.repo_type,
    props.repo_id
  )

  if (isSuccess.value) {
    toast.success(message.value)
    files.value = []
    resetFiles.value = true
    await loadAttachments(props.repo_type, props.repo_id)
  } else {
    toast.error(message.value)
  }
}

onMounted(async () => {
  await loadAttachments(props.repo_type, props.repo_id)
})
</script>
<template>
  <div class="w-full p-4">
    <form @submit.prevent="onSubmit">
      <FormInput
        class="w-full"
        id="description"
        label="توضیحات"
        placeholder="توضیحات فایل پیوستی"
        type="text"
        :value="description"
        @change="(value) => (description = value)"
        :errors="errors.description"
      />
      <FileUpload
        @change="(value) => (files = value)"
        label="Drop attachments here or click to browse"
        :errors="errors.attachments"
        :multiple="true"
        :reset-files="resetFiles"
      />
      <div class="mt-3 flex justify-end border-t bg-gray-50 px-6 py-3">
        <PrimaryButton
          type="submit"
          :text="'آپلود فایل'"
          :loading="isLoading"
          v-if="files?.length"
        />
      </div>
    </form>
    <Attachments class="p-3" :attachments="attachments" />
  </div>
</template>
