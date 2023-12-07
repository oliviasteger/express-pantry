 Set up express pantry


<script setup lang="ts">
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import { useUserStore } from "../../stores/user";
import { fetchy } from "../../utils/fetchy";

const name = ref("");
let eligibleProfiles = ref<Array<Record<string, string>>>([]);
const openHours = ref("");
const closeHours = ref("");
const rules = ref("");
const loaded = ref(false); 
const hasEligibleProfiles = ref(false);
const props = defineProps(["selectedCity"]);
const emit = defineEmits(["openShop", "refreshPantryList"]);
const {currentUsername} = storeToRefs(useUserStore());
let currentAnnualIncome = ref("");
let currentSnapEligible = ref("");
let currentCity = ref("");


const getEligibleProfiles = async () => {
  try {
    console.log("in get Profile");
    console.log(`this is props.selectedd ${props.selectedCity}`);
    console.log(`this is currentCity ${currentCity}`);
    const results = await fetchy(`api/profiles/location/${props.selectedCity}`, "GET");
    const profiles = [];
    for (let profile of results){
      const id = profile._id;
      console.log(`this is id ${id}`);
      try {
        const eligibilityCheck = await fetchy(`api/profiles/eligibility/${id}/${currentUsername.value}`, "GET");
        console.log(`this is eligibility check ${eligibilityCheck}`);
        console.log(`this is eligibility check msg ${eligibilityCheck.msg}`);
        if (eligibilityCheck.msg === "User is eligible" ){
          profiles.push(profile);
        }
      } catch {
          continue;
      }

    }

    eligibleProfiles.value = profiles;
    
  } catch {
    return;
  }
  
};
async function getInformation() {
  let user;
  try {
    user = await fetchy(`api/users/${currentUsername.value}`, "GET");
  } catch (_) {
    console.log("failed")
    return;
  }
  currentAnnualIncome.value = user.information.annualIncome;
  currentCity.value = user.information.city;
  currentSnapEligible.value = user.information.snapEligible;
};


onBeforeMount(async () => {
    
    await getInformation();
    await getEligibleProfiles();
    loaded.value = true; 
});
</script>
<template>
  <div v-show = "loaded">
    {{ currentCity }}
    {{ props.selectedCity }}
    <button class="default-disabled info ">
      <div class ="side">
        Based on your account information to the right, these are the food pantries within your selected area that you are eligible for

      </div>
       
       <v-card
          class="mx-auto"
          display="flex"
          width="fit-content"
          variant="flat"
        >
          <v-card-item
          class = "inside"
          display="flex"
          width="fit-content">
            <div>
              <div class ="c-row" gap=".1em">
                <div class="text-overline mb-1">
                Your City
                </div>
                <div class="text-caption">{{ currentCity }}</div>
              </div>
              <hr class = "line-indented">
              <div class ="c-row" gap=".1em">
                <div class="text-overline mb-1">
                Your Annual Income
                </div>
                <div class="text-caption">{{ currentAnnualIncome }}</div>
              </div>
              <hr class = "line-indented">
              <div class ="c-row" gap=".1em">
                <div class="text-overline mb-1">
                SNAP Eligibile?
                </div>
                <div class="text-caption">{{ currentSnapEligible }}</div>
              </div>
              
              <!-- <div class="text-h6 mb-1">
                Headline
              </div> -->
              
            </div>
          </v-card-item>

          <!-- <v-card-actions>
            <v-btn>
              Button
            </v-btn>
          </v-card-actions> -->
        </v-card>
    </button>
    <div class="list-title">Your Food Pantries</div>
    <div class="list-container" v-if = "loaded && eligibleProfiles.length !== 0">
        <button class="profile-button" v-for="profile,index in eligibleProfiles" :key="profile._id" @click="emit('openShop', profile._id)">
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
  width:75%;
}
.side{
  flex-grow: 3;
  width:20%;
}
.inside {
  color:var(--dark-grey);
  display: flex;
  width:max-content;
  flex-grow: 1;
  /* background: #ffffff;
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em; */
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
