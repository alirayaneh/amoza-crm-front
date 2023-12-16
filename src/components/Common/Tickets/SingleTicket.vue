<script setup lang="ts">
import TicketSkeleton from '@/components/Common/Tickets/TicketSkeleton.vue'
import TicketCard from '@/components/Common/Tickets/TicketCard.vue'
import SectionHeader from '@/components/Common/SectionHeader.vue'
import ReplySkeleton from '@/components/Common/Tickets/ReplySkeleton.vue'
import Reply from '@/components/Common/Tickets/Reply.vue'
import NewReply from '@/components/Common/Tickets/NewReply.vue'

import { useHead } from 'unhead'

import { appTitle } from '@/global'

import getTicket from '@/composables/tickets/getTicket'

import { onBeforeRouteUpdate, useRoute, useRouter } from 'vue-router'

import { onMounted, ref } from 'vue'

import type Ticket from '@/types/Ticket'

import notFound from '@/util/notFound'
import { useAuthStore } from '@/stores/auth'

defineProps<{ customClass?: string }>()

const route = useRoute()

const ticket = ref({} as Ticket)
const isLoading = ref(true)

const isNotResolved = ref(false)

const { user, isClient } = useAuthStore()

const isCurrentAgent = ref(false)
const isCurrentClient = ref(false)
const isInAgentsHistory = ref(false)
const isTransfredBy = ref(false)

const router = useRouter()

const fetchTicket = async (afterReply = false, reference = route.params.reference as string) => {
  isLoading.value = true

  const result = await getTicket(reference)

  if (result.error.value) notFound(route)

  ticket.value = result.ticket.value
  isLoading.value = result.isLoading.value

  isCurrentAgent.value = ticket.value.agents?.[0]?.id === user.id
  isCurrentClient.value = ticket.value.client?.id === user.id
  isTransfredBy.value = ticket.value.agents.filter((tic) => tic.pivot.transferred_by === user.id)
    .length
    ? true
    : false

  isInAgentsHistory.value = ticket.value.agents.filter((tic) => tic.id === user.id).length
    ? true
    : false

  isNotResolved.value = ticket.value.status !== 'resolved' && ticket.value.status !== 'closed'

  useHead({ title: `${ticket.value.subject} | ${appTitle}` })

  if (afterReply) {
    router.push({ hash: '#conversation' })
  }
}
/* const scrollPosition = ref(0)
const scrollListner = () => {
  window.addEventListener('scroll', () => {
    scrollPosition.value = window.innerHeight
  })
}
 */

const checkForResponsesTo = (reply: any, ticket: any) => {
  // Extract numbers from reply.content
  const regex = /\{.*?reply_to:(\d+)\}/g
  const matches = reply.content.matchAll(regex)

  // Append extracted numbers to reply.content
  if (matches) {
    const extractedNumbers = []
    for (const match of matches) {
      const targetReply = ticket.replies.find((rep: any) => rep.id == match[1])
      reply.content = reply.content.replace(
        `[{reply_to:${match[1]}}]`,
        ' <div  class="bg-sky-200 mb-50 p-2 w-10%">' +
          '<small class="size-10">نقل قول : </small>' +
          targetReply.content +
          ' </div>'
      )
      extractedNumbers.push(match[1])
    }

    //+= ` response toooooo ${extractedNumbers.join(', ')}`;
  }
  return reply
}

const newRyplayTag = ref()
const newRyplayEditorOpen = ref(false)
const newRyplayContent = ref('')

const replayToThis = (reply: any) => {
  newRyplayTag.value.scrollIntoView({ behavior: 'smooth' })
  newRyplayEditorOpen.value = true
  newRyplayContent.value = `[{reply_to:${reply.id}}]\n\n\n\n پاسخ را در این قسمت بنویسید `
}

onMounted(async () => {
  await fetchTicket(false)
})

onBeforeRouteUpdate(async (to) => {
  await fetchTicket(false, to.params.reference as string)
})
</script>

<template>
  <section :class="customClass" class="space-y-6">
    <div>
      <TicketSkeleton v-if="isLoading" />
      <TicketCard :ticket="ticket" v-else />
    </div>

    <div
      ref="newRyplayTag"
      v-if="
        !isLoading &&
        isNotResolved &&
        (isCurrentAgent || isClient || isCurrentClient || isInAgentsHistory || isTransfredBy)
      "
    >
      <NewReply
        :ticket-id="ticket.id"
        :content="newRyplayContent"
        @reload="fetchTicket(true)"
        :newRyplayEditorOpen="newRyplayEditorOpen"
        @newRyplayEditor="newRyplayEditorOpen = false"
      />
    </div>

    <div id="conversation" v-if="isLoading || ticket.replies?.length">
      <SectionHeader title="Conversation" class="mb-2" />

      <div class="space-y-4">
        <template v-if="isLoading">
          <ReplySkeleton v-for="i in 3" :key="i" />
        </template>

        <Reply
          @replay-to-this="() => replayToThis(reply)"
          :reply="checkForResponsesTo(reply, ticket)"
          v-for="reply in ticket.replies"
          :key="reply.id"
          v-else
        />
      </div>
    </div>
  </section>
</template>
