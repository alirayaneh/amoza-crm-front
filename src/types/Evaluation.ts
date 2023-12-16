type Evaluation = {
    
  availability: number;
  availability_count: number;
  availability_voter: number[];
 
  expertise: number;
  expertise_count: number;
  expertise_voter: number[];
  
  engagement: number;
  engagement_count: number;
  engagement_voter: number[];
  
  quality: number;
  quality_count: number;
  quality_voter: number[];
  
  collaboration: number;
  collaboration_count: number;
  collaboration_voter: number[];
 
  delivery: number;
  delivery_count: number;
  delivery_voter: number[];
  
  creativity: number;
  creativity_count: number;
  creativity_voter: number[];
  
  interpersonal_skills: number;
  interpersonal_skills_count: number;
  interpersonal_skills_voter: number[];
  
  responsibility: number;
  responsibility_count: number;
  responsibility_voter: number[];
 
  commitment: number;
  commitment_count: number;
  commitment_voter: number[];
  im_voted:boolean
  teamwork: number;
  teamwork_count: number;
  teamwork_voter: number[];
 
    created_at: string
    updated_at: string
  }
  
  export default Evaluation

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