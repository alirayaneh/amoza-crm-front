<template>
  <div>
    <nav class="flex justify-start border-b text-sm">
      <!-- active -->
      <a
        v-for="tab in tabs"
        :key="tab.name"
        class="inline-block px-4 py-2 font-semibold"
        :class="tab.name === current ? 'border-b-2 border-indigo-600  text-indigo-600' : ''"
        @click="emit('setCurrent', tab.name)"
        >{{ tab.lable }}</a
      >
    </nav>

    <div v-for="tab in tabs" :key="tab.name" v-show="tab.name === current">
      <slot :name="tab.name"></slot>
    </div>
  </div>
</template>
<script setup lang="ts">
withDefaults(
  defineProps<{
    current: string
    tabs: { name: string; lable: string; id?: number }[]
    widthClass?: string
  }>(),
  {
    widthClass: 'max-w-md'
  }
)
const emit = defineEmits(['setCurrent'])
</script>
<style></style>
