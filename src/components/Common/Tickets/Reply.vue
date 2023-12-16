<script setup lang="ts">
import { useRoute } from 'vue-router'
import Attachments from './Attachments.vue'

import type Reply from '@/types/Reply'

import { computed, onMounted, onBeforeUnmount, ref } from 'vue'

import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import getViewed from '@/composables/tickets/getViewed'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'

import ChevronDownIcon from '@heroicons/vue/24/solid/ChevronDownIcon'
const route = useRoute()
const props = defineProps<{ reply: Reply }>()
const emit = defineEmits(['replayToThis'])

const API_URL = import.meta.env.VITE_API_URL

const store = useAuthStore()
const { user } = storeToRefs(store)

const userName = computed(() =>
  props.reply.user.id == user.value.id ? 'You' : props.reply.user.name
)

const isAgentReply = computed(() => props.reply.user.role == 'agent')

const picture = computed(() => API_URL + props.reply.user.picture)
const scrollPosition = ref(window.innerHeight)
const postTag = ref()
const postPostion = ref(0)
const request_log = ref([] as number[])
const viewed = () => {
  return (
    props.reply.logs.filter((viewers) => viewers.user_id === user.value.id).length ||
    request_log.value.indexOf(props.reply.id) !== -1 ||
    props.reply.user.id == user.value.id
  )
}

const postViewe = async (reference = route.params.reference as string) => {
  const viewing = scrollPosition.value - postPostion.value > 100
  if (!viewed() && viewing) {
    // alert('view Post' + props.reply.id)
    request_log.value.push(props.reply.id)
    await getViewed(reference, props.reply.id)
  }
}

const replayToThis = () => {
  emit('replayToThis', props.reply)
}

const scrollActon = () => {
  if (postTag.value) {
    scrollPosition.value = window.innerHeight
    postPostion.value = postTag.value.getBoundingClientRect().top
  }

  postViewe()
}

onMounted(() => {
  window.addEventListener('scroll', scrollActon)

  postPostion.value = postTag.value.getBoundingClientRect().top
  viewed()
  postViewe()
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', scrollActon)
})
</script>

<template>
  <!--   {{ props.reply.logs.filter((viewers) => viewers.user_id === user.id) }}
  {{ scrollPosition }}-{{ postPostion }} ={{ scrollPosition - postPostion }} -->

  <div class="divide-y rounded-lg border shadow" ref="postTag">
    <div class="flex gap-2 p-3">
      <div class="rounded-full">
        <img
          :src="picture"
          alt="Profile Picture"
          class="h-14 w-14 rounded-full border object-cover"
        />
      </div>

      <div>
        <div class="text-sm">{{ userName }}</div>
        <div class="text-xs text-gray-500">
          <div v-if="isAgentReply">{{ reply.user.department?.name }}</div>
          <div>{{ reply.created_at }}</div>
        </div>
      </div>
      <div class="grow"></div>
      <div class="flex justify-end sm:justify-start">
        <Menu as="span" class="relative -ml-px block">
          <MenuButton
            class="hover:teal-700 relative inline-flex items-center rounded-md border border-teal-700 bg-teal-600 px-2 py-2 font-medium text-white focus:z-10 focus:border-teal-700 focus:outline-none focus:ring-1 focus:ring-teal-700"
          >
            <span class="sr-only">Open options</span>
            <ChevronDownIcon class="h-6 w-6" />
          </MenuButton>
          <transition
            enter-active-class="transition ease-out duration-100"
            enter-from-class="transform opacity-0 scale-95"
            enter-to-class="transform opacity-100 scale-100"
            leave-active-class="transition ease-in duration-75"
            leave-from-class="transform opacity-100 scale-100"
            leave-to-class="transform opacity-0 scale-95"
          >
            <MenuItems
              class="absolute left-0 bottom-5 mb-5 -mr-1 w-60 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
            >
              <div class="divide-y">
                <MenuItem class="cursor-pointer" v-slot="{ active }" @click="replayToThis()">
                  <div
                    :class="[
                      active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                      'block px-4 py-3 text-sm'
                    ]"
                  >
                    پاسخ به این پیام
                  </div>
                </MenuItem>

                <MenuItem class="cursor-pointer" v-slot="{ active }">
                  <div
                    :class="[
                      active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                      'block px-4 py-3 text-sm'
                    ]"
                  >
                    فوروارد به دیگران
                  </div>
                </MenuItem>
              </div>
            </MenuItems>
          </transition>
        </Menu>
      </div>
    </div>

    <article
      class="prose max-w-none space-y-0 px-3 py-5 prose-headings:mb-0"
      v-html="reply.content"
    ></article>

    <Attachments v-if="reply.attachments.length" class="p-3" :attachments="reply.attachments" />

    <div class="divide-y rounded-lg border shadow" v-if="props.reply.logs.length">
      <div class="flex gap-1 p-1">
        <div class="my-2 gap-1 text-xs text-gray-500">خوانده شده :</div>
        <div class="my-2 flex items-center gap-1">
          <div
            class="col h-6 w-6 flex-shrink-0"
            v-for="agent in props.reply.logs"
            :key="agent.user.id"
            :title="agent.user.name + ' \n در :' + agent.created_at"
          >
            <img
              class="h-6 w-6 rounded-full"
              :src="API_URL + agent.user?.picture"
              alt="Profile Picture"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
