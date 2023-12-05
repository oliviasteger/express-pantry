 Set up express pantry


<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const selectedCity = ref("");
const name = ref("");
const profiles = ref();
const openHours = ref("");
const closeHours = ref("");
const rules = ref("");
const loaded = ref(false); 
const hasProfiles = ref(false);
const props = defineProps(["selectedCity"]);
const emit = defineEmits(["openShop", "refreshPantryList"]);



const getProfile = async () => {
  try {
    const results = await fetchy(`api/profiles/location/${props.selectedCity.value}`, "GET");
    console.log(results);
    if(results.length !== 0){
      profiles.value  = results;
      hasProfiles.value = true;
    }else{
      profiles.value = [];
    }
    
  } catch {
    return;
  }
  
};

onBeforeMount(async () => {
    await getProfile();
    loaded.value = true; 
});
</script>
<template>
  <div v-show = "loaded">
    <button class="default-disabled info ">
       Based on your account information to the right, these are the food pantries within your selected area that you are eligible for
       <div class = "vl-indented"></div>
    </button>
    <div class="list-title">Your Food Pantries</div>
    <div class="list-container" v-if = "hasProfiles">
        <button class="profile-button" v-for="profile,index in profiles" :key="profile._id" @click="emit('openShop', profile)">
            {{ profile.name }}
        </button>
        
    </div>
    <div class="list-container" v-else>
      
      <button class="default-disabled" >
            No pantries in {{ props.selectedCity }}
        </button>
       
    </div>

  </div>
</template>
<style scoped>

.info{
  display:flex;
  justify-content: center;
  align-items:center;
  width: 50%;
}
.profile-button {
  text-align: center;
  padding: 8px 16px;
  background-color: transparent;
  color: #007bff;
  border: 2px solid #007bff;
  border-radius: 4px;
  cursor: pointer;
  transition:
    background-color 0.3s ease-in-out,
    color 0.3s ease-in-out;
}

.profile-button:hover {
  background-color: #007bff;
  color: #fff;
}
.list-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  text-align: center;
}

.list-title {
  font-size: 1.5em;
  font-weight: 400;
  text-align: center;
  margin-bottom: 20px;
}

/* Add more styling as needed */
</style>
