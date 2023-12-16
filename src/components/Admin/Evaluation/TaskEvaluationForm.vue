<script setup lang="ts">
import Modal from '@/components/Common/Modal.vue'
import useEvaluation from '@/composables/evalution/useEvaluation';
import RateStar from '@/components/Common/RateStar.vue'
import ProfileAvatar from '@/components/Common/User/ProfileAvatar.vue'
import {  ref,onMounted ,computed} from 'vue'
import { useToast } from 'vue-toastification'
import type User from '@/types/User';
const props =defineProps<{ user: User,repo_type?:string ,repo_id?:number,agents?:User[],open: boolean}>()
const {load,create,update,evaluation,isLoading,isSuccess,message} = useEvaluation();
import PrimaryButton from '@/components/Forms/PrimaryButton.vue';
/* const availability=computed(()=>{
    if(evaluation && evaluation.value.availability) return   evaluation.value.availability;
    return 0;
})
const expertise=computed(()=>{
    if(evaluation && evaluation.value.expertise) return   evaluation.value.expertise;
    return 0;
})
const engagement=computed(()=>{
    if(evaluation && evaluation.value.engagement) return   evaluation.value.engagement;
    return 0;
})
const quality=computed(()=>{
    if(evaluation && evaluation.value.quality) return   evaluation.value.quality;
    return 0;
})
const collaboration=computed(()=>{
    if(evaluation && evaluation.value.collaboration) return   evaluation.value.collaboration;
    return 0;
})
const delivery=computed(()=>{
    if(evaluation && evaluation.value.delivery) return   evaluation.value.delivery;
    return 0;
})
const creativity=computed(()=>{
    if(evaluation && evaluation.value.creativity) return   evaluation.value.creativity;
    return 0;
})


 */
/* 
        در دسترس بودن	availability
میزان تخصص	expertise
تعامل	engagement
کیفیت حاصل کار	quality
میزان همکاری	collaboration
تحویل به موقع	delivery
خلاقیت و نوآوری	creativity
مهارت های بین فردی	interpersonal skills
مسئولیت پذیری	responsibility
تعهد به کار	commitment
روحیه کار تیمی	teamwork   
*/

const toast = useToast()
const availability = ref(0);
const availabilityCount = ref(0);
const availabilityVoter = ref([] as number[]);

const expertise = ref(0);
const expertiseCount = ref(0);
const expertiseVoter =  ref([] as number[]);

const engagement = ref(0);
const engagementCount = ref(0);
const engagementVoter =  ref([] as number[]);

const quality = ref(0);
const qualityCount = ref(0);
const qualityVoter =  ref([] as number[]);

const collaboration = ref(0);
const collaborationCount = ref(0);
const collaborationVoter =  ref([] as number[]);

const delivery = ref(0);
const deliveryCount = ref(0);
const deliveryVoter =  ref([] as number[]);

const creativity = ref(0);
const creativityCount = ref(0);
const creativityVoter =  ref([] as number[]);

const interpersonalSkills = ref(0);
const interpersonalSkillsCount = ref(0);
const interpersonalSkillsVoter =  ref([] as number[]);

const checkValues = () => {
    availability.value = evaluation.value.availability ?? 0;
    expertise.value = evaluation.value.expertise ?? 0;
    engagement.value = evaluation.value.engagement ?? 0;
    quality.value = evaluation.value.quality ?? 0;
    collaboration.value = evaluation.value.collaboration ?? 0;
    delivery.value = evaluation.value.delivery ?? 0;
    creativity.value = evaluation.value.creativity ?? 0;
    interpersonalSkills.value = evaluation.value.interpersonal_skills ?? 0;

    availabilityCount.value = evaluation.value.availability_count ?? 0;
    expertiseCount.value = evaluation.value.expertise_count ?? 0;
    engagementCount.value = evaluation.value.engagement_count ?? 0;
    qualityCount.value = evaluation.value.quality_count ?? 0;
    collaborationCount.value = evaluation.value.collaboration_count ?? 0;
    deliveryCount.value = evaluation.value.delivery_count ?? 0;
    creativityCount.value = evaluation.value.creativity_count ?? 0;
    interpersonalSkillsCount.value = evaluation.value.interpersonal_skills_count ?? 0;

    availabilityVoter.value = evaluation.value.availability_voter ?? [];
    expertiseVoter.value = evaluation.value.expertise_voter ?? [];
    engagementVoter.value = evaluation.value.engagement_voter ?? [];
    qualityVoter.value = evaluation.value.quality_voter ?? [];
    collaborationVoter.value = evaluation.value.collaboration_voter ?? [];
    deliveryVoter.value = evaluation.value.delivery_voter ?? [];
    creativityVoter.value = evaluation.value.creativity_voter ?? [];
    interpersonalSkillsVoter.value = evaluation.value.interpersonal_skills_voter ?? [];
};

const title='فرم ارزیابی';
onMounted(async ()=>{
await load(props.user.id,props.repo_id,props.repo_type);
if(evaluation.value && evaluation.value.im_voted)
    checkValues()
})




const onSubmit =async  (type:string,amount:number)=>{
    if (isLoading.value || !props.repo_id || !props.repo_type) return
    await create({
        user_id:props.user.id,
        repo_id:props.repo_id,
        repo_type:props.repo_type,
        vote_type:type,
        vote_amount:amount
    });
    if(isSuccess.value){
        toast.success(message.value)    
        await load(props.user.id,props.repo_id,props.repo_type);
    }


}
</script>
<template> 

<Modal :open="open" @close="$emit('close')" :title="title" width-class="max-w-12xl">
 <div class="m-2">
فرم ازیابی 
    <ProfileAvatar  :user="props.user" :info="true"/>
 </div>  

<RateStar :selected_rate="availability" @input="async (s)=>{availability=s;await onSubmit('availability',s)}" :name="'availability'" :vote_count="availabilityCount" :voters="agents?.filter(v=>availabilityVoter.includes(v.id))" ></RateStar>
<RateStar :selected_rate="expertise" @input="async (s)=>{expertise=s;await onSubmit('expertise',s)}" :name="'expertise'" :vote_count="expertiseCount" :voters="agents?.filter(v=>expertiseVoter.includes(v.id))" ></RateStar>
<RateStar :selected_rate="engagement" @input="async (s)=>{engagement=s;await onSubmit('engagement',s)}" :name="'engagement'" :vote_count="engagementCount" :voters="agents?.filter(v=>engagementVoter.includes(v.id))" ></RateStar>
<RateStar :selected_rate="quality" @input="async (s)=>{quality=s;await onSubmit('quality',s)}" :name="'quality'" :vote_count="qualityCount" :voters="agents?.filter(v=>qualityVoter.includes(v.id))" ></RateStar>
<RateStar :selected_rate="collaboration" @input="async (s)=>{collaboration=s;await onSubmit('collaboration',s)}" :name="'collaboration'" :vote_count="collaborationCount" :voters="agents?.filter(v=>collaborationVoter.includes(v.id))" > </RateStar>
</Modal>

</template>