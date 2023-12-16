<script setup lang="ts">
import PaperClipIcon from '@heroicons/vue/24/outline/PaperClipIcon'
import Popover from '../Popover.vue'

import type Attachment from '@/types/Attachment'
import { round } from 'lodash'

defineProps<{ attachments: Attachment[] }>()

const API_URL = import.meta.env.VITE_API_URL

const getFileType = (fileName: string): string => {
  // Split the filename by the dot
  const [name, extension] = fileName.split('.')

  // Return the extension
  return extension
}
const getFileCategory = (fileName: string): string => {
  // Check the file extension
  const fileType: string = getFileType(fileName)
  switch (fileType) {
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
      return 'image'
    case 'mp4':
    case 'mov':
    case 'avi':
      return 'video'
    case 'mp3':
    case 'wav':
    case 'ogg':
      return 'audio'
    case 'pdf':
    case 'pptx':
    case 'xlsx':
    case 'docx':
      return 'document'
    default:
      return 'other'
  }
}

const popOverContent = (attachment: Attachment): string => {
  let content = ''
  content += 'تاریخ آپلود:' + attachment.created_at + '\n'
  if (attachment.user) content += 'آپلود توسط:' + attachment.user.name + '\n'
  if (attachment.description) content += 'توضیحات:' + attachment.description + '\n'
  if (attachment.size) content += 'حجم:' + round(attachment.size / (1024 * 1024), 2) + 'MB\n'
  if (attachment.file_type) content += 'فرمت:' + attachment.file_type + '\n'

  return content
}
</script>

<template>
  <div>
    <div class="flex items-center gap-1 font-semibold text-gray-500">
      <PaperClipIcon class="h-4 w-4" />
      <h2>Attachments</h2>
    </div>

    <div class="mt-3 flex flex-wrap gap-3">
      <a
        v-for="attachment in attachments"
        :key="attachment.id"
        :href="API_URL + attachment.path"
        target="_blank"
      >
        <Popover :content="popOverContent(attachment)">
          <img
            v-if="getFileCategory(attachment.path) === 'image'"
            :src="API_URL + attachment.path"
            :alt="attachment.filename"
            class="h-20 w-20 rounded-lg border object-cover"
          />
          <div
            class="flex-direction-column pointer-events-auto flex rounded-md bg-indigo-600 px-3 py-2 text-[0.8125rem] font-semibold leading-5 text-white hover:bg-indigo-500"
            v-else
          >
            {{ attachment.filename + '.' + getFileType(attachment.path) }}
            <i v-if="getFileCategory(attachment.path) === 'document'">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor "
                class="h-10 w-10 text-white"
              >
                <path
                  d="M3 3.5A1.5 1.5 0 014.5 2h6.879a1.5 1.5 0 011.06.44l4.122 4.12A1.5 1.5 0 0117 7.622V16.5a1.5 1.5 0 01-1.5 1.5h-11A1.5 1.5 0 013 16.5v-13z"
                />
              </svg>
            </i>
            <i v-else-if="getFileCategory(attachment.path) === 'audio'">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                class="h-5 w-5"
              >
                <path
                  fill-rule="evenodd"
                  d="M17.721 1.599a.75.75 0 01.279.584v11.29a2.25 2.25 0 01-1.774 2.198l-2.041.442a2.216 2.216 0 01-.938-4.333l2.662-.576a.75.75 0 00.591-.734V6.112l-8 1.73v7.684a2.25 2.25 0 01-1.774 2.2l-2.042.44a2.216 2.216 0 11-.935-4.33l2.659-.574A.75.75 0 007 12.53V4.237a.75.75 0 01.591-.733l9.5-2.054a.75.75 0 01.63.149z"
                  clip-rule="evenodd"
                />
              </svg>
            </i>
            <i v-else-if="getFileCategory(attachment.path) === 'video'">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                class="h-5 w-5"
              >
                <path
                  fill-rule="evenodd"
                  d="M1 4.75C1 3.784 1.784 3 2.75 3h14.5c.966 0 1.75.784 1.75 1.75v10.515a1.75 1.75 0 01-1.75 1.75h-1.5c-.078 0-.155-.005-.23-.015H4.48c-.075.01-.152.015-.23.015h-1.5A1.75 1.75 0 011 15.265V4.75zm16.5 7.385V11.01a.25.25 0 00-.25-.25h-1.5a.25.25 0 00-.25.25v1.125c0 .138.112.25.25.25h1.5a.25.25 0 00.25-.25zm0 2.005a.25.25 0 00-.25-.25h-1.5a.25.25 0 00-.25.25v1.125c0 .108.069.2.165.235h1.585a.25.25 0 00.25-.25v-1.11zm-15 1.11v-1.11a.25.25 0 01.25-.25h1.5a.25.25 0 01.25.25v1.125a.25.25 0 01-.164.235H2.75a.25.25 0 01-.25-.25zm2-4.24v1.125a.25.25 0 01-.25.25h-1.5a.25.25 0 01-.25-.25V11.01a.25.25 0 01.25-.25h1.5a.25.25 0 01.25.25zm13-2.005V7.88a.25.25 0 00-.25-.25h-1.5a.25.25 0 00-.25.25v1.125c0 .138.112.25.25.25h1.5a.25.25 0 00.25-.25zM4.25 7.63a.25.25 0 01.25.25v1.125a.25.25 0 01-.25.25h-1.5a.25.25 0 01-.25-.25V7.88a.25.25 0 01.25-.25h1.5zm0-3.13a.25.25 0 01.25.25v1.125a.25.25 0 01-.25.25h-1.5a.25.25 0 01-.25-.25V4.75a.25.25 0 01.25-.25h1.5zm11.5 1.625a.25.25 0 01-.25-.25V4.75a.25.25 0 01.25-.25h1.5a.25.25 0 01.25.25v1.125a.25.25 0 01-.25.25h-1.5zm-9 3.125a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5z"
                  clip-rule="evenodd"
                />
              </svg>
            </i>
          </div>
        </Popover>
      </a>
    </div>
  </div>
</template>
