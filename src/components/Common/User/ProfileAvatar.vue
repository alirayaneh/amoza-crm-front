<script setup lang="ts">
import {  ref } from 'vue'
import Popover from '../Popover.vue'
import type User from '@/types/User'
import { size } from 'lodash'
const API_URL = import.meta.env.VITE_API_URL
const props=defineProps<{ user: User,info?:boolean,sizee?:number}>()
const classs=ref(props.sizee?'h-'+props.sizee+' w-'+props.sizee :'h-8 w-8')
</script>
<template>
<div>
    <div class="my-2 flex items-center gap-1">
              <div
                class="col flex-shrink-0"              
                :class="classs"       
              >
              <Popover :content="user.name">
                <img
                  class="rounded-full"   
                  :class="classs"               
                  :src="API_URL + user?.picture"
                  alt="Profile Picture"
                />
              </Popover>            

              </div>
              <div v-if="info">
                {{ user.name }}
                </div>
            </div>
</div>
</template>