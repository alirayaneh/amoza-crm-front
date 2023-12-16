<template>
  <div v-if="type && type === 'mini'">
    <div class="h-2.5 w-full w-full rounded-full bg-neutral-200 bg-gray-200">
      <div
        class="h-2.5 rounded-full bg-blue-600 text-center text-xs font-medium leading-none text-white"
        :style="{ width: progress + '%' }"
      >
        {{ progress }}%
      </div>
    </div>
  </div>
  <div v-else>
    <div class="mb-1 flex justify-between">
      <span class="text-base font-medium">پیشرفت</span>
      <span class="text-sm text-base font-medium">{{ progress }}%</span>
    </div>
    <div class="h-2.5 w-full rounded-full bg-gray-200">
      <div class="h-2.5 rounded-full bg-blue-600" :style="{ width: progress + '%' }"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  type?: string
  progress: number
}>()
</script>
