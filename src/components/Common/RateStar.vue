<script setup lang="ts">
import type User from '@/types/User';
import {  ref,computed } from 'vue'
import ProfileAvatar from './User/ProfileAvatar.vue';
const props=defineProps<{ selected_rate?: number,name?:string,vote_count?:number,voters?:User[] }>()

const rate =ref(props.selected_rate??0)

const lable = computed(() => {
if(props.name)
{
  switch(props.name)
  {
    case 'availability':
      return 'در دسترس بودن';
    break;  
    case 'expertise':  
      return 'میزان تخصص';
    break;  
    case 'engagement':
      return 'تعامل';
    break;  
    case 'quality':
      return 'کیفیت حاصل کار';
    break;  
    case 'collaboration':
      return 'میزان همکاری';
    break;  
    case 'delivery':
      return 'تحویل به موقع';
    break;  
    case 'creativity':
      return 'خلاقیت و نوآوری';
    break;  
    case 'interpersonal_skills':
      return 'مهارت های بین فردی';
    break;  
    case 'responsibility':
      return 'مسئولیت پذیری';
    break;  
    case 'commitment':
      return 'تعهد به کار';
    break;  
    case 'teamwork':
      return 'روحیه کار تیمی';
    break; 
    default:
      return  props.name;
      break;

      
  }
}
return '';
});

</script>
<template>
    <div>
<div class="flex gap-0.5 " >
    <span class="mr-2 ml-2"> {{ lable }}</span>
    <template v-for="i in 5"  :key="i">
    <svg
      class="h-8 w-8 shrink-0"
      :class="{ 'fill-amber-400': i <= rate,'fill-amber-500': i <= (props.selected_rate??0),'fill-gray-300':i>rate && i >(props.selected_rate??0)}"

      viewBox="0 0 256 256"     
      @mouseover="rate = i"
      @mouseleave="rate = 0"
      @click="$emit('input',i)"
    >
      <path
        d="M239.2 97.4A16.4 16.4.0 00224.6 86l-59.4-4.1-22-55.5A16.4 16.4.0 00128 16h0a16.4 16.4.0 00-15.2 10.4L90.4 82.2 31.4 86A16.5 16.5.0 0016.8 97.4 16.8 16.8.0 0022 115.5l45.4 38.4L53.9 207a18.5 18.5.0 007 19.6 18 18 0 0020.1.6l46.9-29.7h.2l50.5 31.9a16.1 16.1.0 008.7 2.6 16.5 16.5.0 0015.8-20.8l-14.3-58.1L234 115.5A16.8 16.8.0 00239.2 97.4z"
      ></path>
    </svg>
  </template>   {{ selected_rate }}/5
  <template v-if="voters"><ProfileAvatar  v-for="user in voters" :key="user.id" :user="user" :sizee="6"></ProfileAvatar></template>
  
</div>
    </div>
</template>