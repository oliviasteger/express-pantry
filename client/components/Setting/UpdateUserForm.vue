<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { computed, onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";

let username = ref("");
let password = ref("");
let currentAnnualIncome = ref("");
let currentSnapEligible = ref("");
let currentCity = ref("");

const loaded = ref(false);
const information = ref({
  annualIncome: "",
  snapEligible: "",
  city: "",
});
const cities = ref([]);
async function getCities() {
  const response = await fetch("https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/us-cities-demographics/records?group_by=city&limit=3000");
  const data = await response.json();

  cities.value = data.results.map((record: { city: any }) => record.city); // Extracting city names

  return cities;
}
// idk if the emit matters or what to emit neccesarily
const emit = defineEmits(["refreshPage"]);
const updateField = async (type: "annualIncome" | "snapEligible" | "city") => {
  const fieldParsed = () => {
    if (type == "annualIncome") return { annualIncome: information.value.annualIncome };
    else if (type == "snapEligible") return { snapEligible: information.value.snapEligible };
    else if (type == "city") return { city: information.value.city };
    else return {};
  };
  console.log(`this is field parsed ${fieldParsed}`)
  if (fieldParsed) {
    await updateUser(JSON.stringify({ information: fieldParsed }));
  } else {
    console.log("field didnt parse lol");
  }
  await getInformation();
  emptyForm();
};


const emptyForm = () => {
  information.value = {
    annualIncome: "",
    snapEligible: "",
    city: "",
  };
  username.value = "";
  password.value = "";
};
const { currentUsername } = storeToRefs(useUserStore());
const { updateUser, updateSession } = useUserStore();
const rules = [
  (value: any) => {
    if (value) return "value";

    return "You must enter a value.";
  },
];
// const isSubmittable = (value:any) => {
//       // You can set your own validation logic here.
//       if (value.value) return true;
//       return 'You must enter a value.';

// };
// const isUpdatePasswordDisabled = computed(() => {
//       // You can set your own validation logic here.
//       if (password.value) return true;
//       return 'You must enter a value.';
// });
// const isUpdateSnapEligibilityDisabled = computed(() => {
//       // You can set your own validation logic here.
//       if (snapEligi.value) return true;
//       return 'You must enter a value.';
// });
// const isUpdateAnnualIncomeDisabled = computed(() => {
//       // You can set your own validation logic here.
//       return (!information.value.annualIncome);
// });
const isUpdateCityDisabled = computed(() => {
  // You can set your own validation logic here.
  return !information.value.city;
});

async function updateUsername() {
  await updateUser({ username: username.value });
  await updateSession();
  username.value = "";
}

async function updatePassword() {
  await updateUser({ password: password.value });
  await updateSession();
  password.value = "";
}
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
}

onBeforeMount(async () => {
  await getInformation();
  await getCities();
  loaded.value = true;
});
</script>

<template>
  <h2>Update User Profile</h2>
  <div class = "form" id = "back">
    <v-form validate-on="submit lazy" @submit.prevent="updateUsername">
      <v-text-field v-model="username" :placeholder="currentUsername" :persistent-placeholder="true" :rules="rules" label="Username"></v-text-field>

      <v-btn type="submit" id = "change" block class="mt-2" text="Change"></v-btn>
    </v-form>
    <v-form validate-on="submit lazy" @submit.prevent="updatePassword">
      <v-text-field v-model="password" label="Password" :rules="rules"></v-text-field>

      <v-btn type="submit" id = "change" block class="mt-2" text="Change"></v-btn>
    </v-form>
    <v-form validate-on="submit lazy" @submit.prevent="updateField('annualIncome')">
      <v-text-field v-model="information.annualIncome" :placeholder="currentAnnualIncome" label="Current Annual Income" :persistent-placeholder="true" :rules="rules"></v-text-field>

      <v-btn type="submit" block id = "change" class="mt-2" text="Change"></v-btn>
    </v-form>
    <v-form validate-on="submit lazy" @submit.prevent="updateField('city')">
      <!-- <v-text-field
        v-model="information.city"
        :placeholder= "currentCity"
        :persistent-placeholder=true
        label="Current Annual Income"
        :rules="isSubmittable(information.city)"
      ></v-text-field> -->
      <div class="pure-control-group">
        <label for="aligned-location">Choose the city You Live In: </label>
        <select v-model="information.city" id="aligned-location" required>
          <option value="Current location" disabled>{{currentCity }}</option>
          <option v-for="city in cities" :key="city" :value="city">{{ city }}</option>
        </select>
      </div>
      <!-- <v-select v-model="information.city" label="Select City" :placeholder="undefined" :persistent-placeholder="true" :items="cities" return-object></v-select> -->
      <v-btn type="submit" id = "change" block class="mt-2" text="Change"></v-btn>
    </v-form>

    <v-form validate-on="submit lazy" @submit.prevent="updateField('snapEligible')">
      <v-switch color="primary" inset   true-value="Yes" false-value="No" 
      v-model="information.snapEligible" hide-details 
      :label="`Do you recieve SNAP benefits/federal food assistance? ${currentSnapEligible}`"></v-switch>
      <v-btn type="submit" id = "change" block class="mt-2" text="Change"></v-btn>
    </v-form>
  </div>
  
  
</template>
<style>
.form{
  padding-bottom: 50px;
}
#change{
  background-color:var(--lighter-header);
  
}
</style>
