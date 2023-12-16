<template>
  <div class="group relative">
    <slot></slot>
    <div
      class="absolute top-0 opacity-[0] transition-all duration-500 ease-in-out disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none group-hover:-top-[3rem] group-hover:z-10 group-hover:opacity-[0.95]"
    >
      <div
        class="border-blue-gray-50 text-blue-gray-500 shadow-blue-gray-500/10 w-max break-normal rounded-lg border bg-white shadow-lg focus:outline-none"
      >
        <div
          v-for="cc in content.split('\n')"
          :key="cc"
          class="py-2 px-5 font-sans text-sm font-normal"
          v-html="cc"
        ></div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
defineProps<{ content: string }>()
</script>
