<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { computed, onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";

let username = ref("");
let password = ref("");
const loaded = ref(false);
const information = ref({
  annualIncome: "",
  snapEligible: false,
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
  console.log(`this is field parsed ${fieldParsed}`);
  if (fieldParsed) {
    await updateUser(JSON.stringify({ information: fieldParsed }));
  } else {
    console.log("field didnt parse lol");
  }
  await getInformation();
  emptyForm();
};
const cityModel = ref<any>(null);
const emptyForm = () => {
  information.value = {
    annualIncome: "",
    snapEligible: false,
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
const currentAnnualIncome = ref("");
const currentCity = ref("");
const currentSnapEligible = ref(false);
const validationErrors = ref<Array<string>>([]);

const isUpdateCityDisabled = computed(() => {
  // You can set your own validation logic here.
  return !information.value.city;
});
function validate() {
      validationErrors.value = [];
      if (!cityModel) {
        validationErrors.value.push('Please select a city');
      }
      // Other validation rules as needed
    }

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
async function updateIncome() {
  information.value.city = currentCity.value;
  information.value.snapEligible = currentSnapEligible.value;
  await fetchy("/api/users", "PATCH", { body: { update: { information: JSON.stringify(information.value) } } });
  const user = await fetchy(`/api/users/${currentUsername.value}`, "GET");
  currentAnnualIncome.value = user.information.annualIncome;
  currentCity.value = user.information.city;
  currentSnapEligible.value = user.information.snapEligible;
}

async function updateSnap() {
  information.value.city = currentCity.value;
  information.value.annualIncome = currentAnnualIncome.value;
  await fetchy("/api/users", "PATCH", { body: { update: { information: JSON.stringify(information.value) } } });
  console.log(await fetchy(`/api/users/${currentUsername.value}`, "GET"));
  const user = await fetchy(`/api/users/${currentUsername.value}`, "GET");
  currentAnnualIncome.value = user.information.annualIncome;
  currentCity.value = user.information.city;
  currentSnapEligible.value = user.information.snapEligible;
}

async function updateLocation() {
  console.log('this is currentCity', currentCity, ' and this is new location ', cityModel)
  validate();
      if (validationErrors.value.length === 0) {
        information.value.city = cityModel.value;
        information.value.snapEligible = currentSnapEligible.value;
        information.value.annualIncome = currentAnnualIncome.value;
        await fetchy("/api/users", "PATCH", { body: { update: { information: JSON.stringify(information.value) } } });
        console.log(await fetchy(`/api/users/${currentUsername.value}`, "GET"));
        const user = await fetchy(`/api/users/${currentUsername.value}`, "GET");
        currentAnnualIncome.value = user.information.annualIncome;
        currentCity.value = user.information.city;
        currentSnapEligible.value = user.information.snapEligible;
      }
    
  
}

async function getInformation() {
  let user;
  try {
    user = await fetchy(`/api/users/${currentUsername.value}`, "GET");
  } catch (_) {
    console.log("failed");
    return;
  }
  currentAnnualIncome.value = user.information.annualIncome;
  currentCity.value = user.information.city;
  currentSnapEligible.value = user.information.snapEligible;
}

onBeforeMount(async () => {
  await getInformation();
  await getCities();
  console.log('this is cities', cities, 'and value', cities.value);
  loaded.value = true;
});
</script>

<template>
  <strong style="margin:16px;">UPDATE USER PROFILE</strong>
  <div class="d-flex flex-column" id="back">
    <v-form validate-on="submit lazy" @submit.prevent="updateUsername">
      <v-text-field hide-details v-model="username" :placeholder="currentUsername" :persistent-placeholder="true" :rules="rules" label="Username"></v-text-field>

      <v-btn type="submit" id="change" block class="mt-2" text="Change Username"></v-btn>
    </v-form>
    <br />
    <v-divider class ="div"></v-divider>
    <v-form validate-on="submit lazy" @submit.prevent="updatePassword">
      <v-text-field hide-details v-model="password" label="Password" :rules="rules"></v-text-field>

      <v-btn type="submit" id="change" block class="mt-2" text="Change Password"></v-btn>
    </v-form>
    <br />
    <v-divider class ="div"></v-divider>
    <br />
    <v-form validate-on="submit lazy" @submit.prevent="updateIncome">
      <v-text-field hide-details v-model="information.annualIncome" :placeholder="currentAnnualIncome" label="Current Annual Income" :persistent-placeholder="true" :rules="rules"></v-text-field>

      <v-btn type="submit" block id="change" class="mt-2" text="Change Income Amount"></v-btn>
    </v-form>
    <br />
    <v-divider class ="div"></v-divider>
    <br />
    <v-form validate-on="submit lazy" @submit.prevent="updateLocation">
      
      <v-select v-model="cityModel" :hint="`Your currently located in ${currentCity}`" :items="cities" :error-messages="validationErrors" chips label="City"></v-select>
      
      
    
      <!-- <div class="pure-control-group">
        <label for="aligned-location">Choose the city You Live In: </label>
        <select v-model="information.city" id="aligned-location" required>
          <option value="Current location" disabled>{{ currentCity }}</option>
          <option v-for="city in cities" :key="city" :value="city">{{ city }}</option>
        </select>
      </div> -->
      <!-- <v-select v-model="information.city" label="Select City" :placeholder="undefined" :persistent-placeholder="true" :items="cities" return-object></v-select> -->
      <v-btn hide-details type="submit" id="change" block class="mt-2" text="Change Location"></v-btn>
    </v-form>
    <br />
    <v-divider class ="div"></v-divider>
    <br />
    <v-form validate-on="submit lazy" @submit.prevent="updateSnap">
      <v-switch
        color="primary"
        inset
        true-value="Yes"
        false-value="No"
        v-model="information.snapEligible"
        hide-details
        :label="`Do you recieve SNAP benefits/federal food assistance? ${currentSnapEligible}`"
      ></v-switch>
      <v-btn type="submit" id="change" block class="mt-2" text="Change"></v-btn>
    </v-form>
    <br />
  </div>
</template>
<style>

.form {
  padding-bottom: 0px;
}
#back{
  border: 1px black;
  padding:1em;
}
#change {
  background-color: var(--lighter-header);
  color:white;
}
#change:hover {
  background-color: white;
  color:var(--lighter-header);
  border-color: var(--lighter-header);
  border-width: 2px;
}
</style>
