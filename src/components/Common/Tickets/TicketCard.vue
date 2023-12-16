<script setup lang="ts">
import {ref,onMounted} from 'vue';
import SectionHeader from '@/components/Common/SectionHeader.vue'
import TicketInfo from '@/components/Common/Tickets/TicketInfo.vue'
import Attachments from './Attachments.vue'
import TaskEvaluationForm from '@/components/Admin/Evaluation/TaskEvaluationForm.vue'
import ListBox from '@/components/Forms/ListBox.vue';

import type Ticket from '@/types/Ticket'
import type User from '@/types/User';
import type Option from '@/types/Option';


const props=defineProps<{ ticket: Ticket }>()


const extractAllUsers = (ticket: Ticket): User[] => {
  let users = [] as User[]
  const transferred_by_user = ticket.agents
    .filter((user) => (user.pivot ? true : false))
    .map((user) => user.pivot.transferred_by_user) as User[]
  users.push(ticket.client)
  users.push(...transferred_by_user)
  users.push(...ticket.agents)
  users = users.reduce((acc: User[], user: User) => {
    // Check if user already exists in acc
    if (!acc.some((u) => u.id === user.id)) {
      acc.push(user)
    }
    return acc
  }, [])
  return users
}


const options=ref([] as Option[])
const selected_user_evaluation=ref('0')
const agents =ref([] as User[])

onMounted(()=>{
  agents.value=extractAllUsers(props.ticket);
  options.value=[{name:'no selected',value:''},...agents.value.map((user)=> {return {name:user.name,value:user.id.toString()}}) ] 
})
</script>

<template>
  <div class="divide-y rounded-lg border shadow">
    <div class="p-3">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div class="overflow-hidden">
          <SectionHeader :title="ticket.subject" />

          <TicketInfo
            class="overflow-x-auto whitespace-nowrap"
            :reference="ticket.reference"
            :priority="ticket.priority"
            :created-at="ticket.created_at"
            :category-name="ticket.category?.name"
            :last-reply-on="ticket.replies?.[0]?.created_at"
          />
        </div>

        <div>
          <span
            class="rounded-full px-3 py-px text-sm"
            :class="{
              'bg-indigo-100 text-indigo-800': ticket.status === 'assigned',
              'bg-gray-100 text-gray-800': ticket.status === 'unassigned',
              'bg-red-100 text-red-800': ticket.status === 'closed',
              'bg-green-100 text-green-800': ticket.status === 'resolved'
            }"
          >
            {{ ticket.status }}
          </span>
        </div>
      </div>
    </div>

    <div class="px-3 py-5">
      <article
        class="prose max-w-none space-y-0 prose-headings:mb-0"
        v-html="ticket.description"
      ></article>
    </div>

    <div class="m-3">
      <ListBox :label="'فرم ارزیابی پرسنل'" :options="options" :selected="options[0]" @update="(s)=>selected_user_evaluation=s.value"></ListBox>
    <template v-for="user in extractAllUsers(ticket)" :key="user.id">
      <TaskEvaluationForm  :user="user" :agents="agents" :repo_type="'ticket'" :repo_id="ticket.id" v-if="user.id.toString()===selected_user_evaluation"></TaskEvaluationForm>    
    </template>

    </div>
    <Attachments v-if="ticket.attachments?.length" class="p-3" :attachments="ticket.attachments" />
  </div>
</template>
