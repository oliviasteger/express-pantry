<!--  Set up express pantry-->
<!-- LUCA pantry should be able to input pickup window length (how lohg of a time they need between pickups), 
and # of orders they can serve in that window (default), 
and drop date (week, day, time), 
available pickup time windows,
rules 
    (#max number of orders per user weekly,
    #snap card check needed,
    #location check needed (same city),
    #annual income 
-->

<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import { RouterLink } from "vue-router";
import { fetchy } from "../../utils/fetchy";

const city = ref("");
const name = ref("");
const openHours = ref("");
const closeHours = ref("");
const rules = ref({
  annualIncome: "",
  snapRequired: false,
});

//1. get profile
//2. populate screen with profile
//3. link updateProfile to this

const getProfile = async () => {
  try {
    console.log("HEREEEE");
    const profile = await fetchy("api/profiles/currentUser", "GET");
    city.value = profile.location;
    name.value = profile.name;
    openHours.value = profile.openHour;
    closeHours.value = profile.closeHour;
    rules.value = profile.rules;
    console.log(profile.rules);
    console.log("RULES", rules.value);
  } catch {
    //not sure
  }
};

onBeforeMount(async () => {
  await getProfile();
});
</script>

<!-- <template>
  <div class="title">Profile: {{ name }}</div>
  <div class="pure-control-group">City Location: {{ city }}</div>
  <div class="pure-control-group">Open Hours: {{ openHours }} to {{ closeHours }}</div>
  <div class="pure-control-group">Requirements: Maximum Annual Income: {{ rules }}</div>
</template> -->
<template>
  <div class="profile-container">
    <div class="profile-title">Profile: {{ name }}</div>
    <RouterLink :to="{ name: 'Edit Profile' }">
      <button class="edit-button">Edit Profile</button>
    </RouterLink>
    <br />
    <br />
    <div class="profile-info-box">
      <div class="profile-label">City Location:</div>
      <div class="profile-value">{{ city }}</div>
    </div>
    <div class="profile-info-box">
      <div class="profile-label">Open Hours:</div>
      <div class="profile-value">{{ openHours }} to {{ closeHours }}</div>
    </div>
    <div class="profile-info-box">
      <div class="profile-label">Requirements:</div>
      <div class="profile-message">A user that qualifies to get food from our pantry must satisfy the following requirements:</div>
      <br />
    </div>
    <div class="profile-info-box">
      <ul class="requirements-list">
        <li>Maximum Annual Income: ${{ rules.annualIncome }}</li>
        <li>Snap Required: {{ rules.snapRequired }}</li>
        <!-- Add more requirements as needed -->
      </ul>
    </div>
  </div>
</template>
<style scoped>
.edit-button-container {
  display: flex;
  justify-content: right;
  margin-bottom: 20px;
  text-align: center;
}

.edit-button {
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

.edit-button:hover {
  background-color: #007bff;
  color: #fff;
}
.profile-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.profile-title {
  font-size: 1.5em;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
}

.profile-info-box {
  display: flex;
  margin-bottom: 15px;
}

.profile-label {
  flex: 1;
  font-weight: bold;
}

.profile-value {
  flex: 2;
}

.profile-message {
  font-style: italic;
}

.requirements-list {
  list-style-type: disc;
  padding-left: 20px;
  text-align: center;
}

/* Add more styling as needed */
</style>
