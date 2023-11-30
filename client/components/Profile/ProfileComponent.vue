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
import router from "@/router";
import { useUserStore } from "@/stores/user";
import { onBeforeMount } from "vue";
import { fetchy } from "../../utils/fetchy";

const { updateSession } = useUserStore();

//1. get profile
//2. populate screen with profile
//3. link updateProfile to this

async function connect() {
  matchingUsers.value = (await getUserMatches(genderPref.value, sportsPref.value, skillPref.value, goal.value)).users;
  void updateSession();
  await router.push({ name: "Connect" });
}
onBeforeMount(async () => {
  await connect();
});

const sendRequest = async () => {
  try {
    await fetchy(`/api/friend/requests/${matchingUsers.value[0].username}`, "POST");
    await nextUser();
  } catch {
    return;
  }
  // emit("refreshMatchingUsers");
};

const getUniqueProfile = async (from: string) => {
  console.log("USERFROM", from);
  const results = await fetchy(`/api/users/profileUnique/${from}`, "GET");
  console.log("RESULTS", results);
  fromGender.value = results.gender;
  fromSports.value = results.sports;
  fromSkill.value = results.skill;
  fromGoal.value = results.goal;
  fromNum.value = results.phoneNum;
};

const acceptRequest = async () => {
  try {
    await fetchy(`/api/friend/accept/${friendRequests.value[0].from}`, "PUT");
    friendRequests.value = friendRequests.value.slice(1);
  } catch {
    return;
  }
};

const rejectRequest = async () => {
  try {
    await fetchy(`/api/friend/reject/${friendRequests.value[0].from}`, "PUT");
    friendRequests.value = friendRequests.value.slice(1);
  } catch {
    return;
  }
};

const getRequests = async () => {
  try {
    friendRequests.value = await fetchy("/api/friend/requests", "GET");
  } catch {
    return;
  }
};
const nextUser = async () => {
  matchingUsers.value = matchingUsers.value.slice(1);
};

onBeforeMount(async () => {
  try {
    await getRequests();
  } catch {
    // User is not logged in
  }
});
</script>

<template>
  <div>
    <!-- Display the list of matching users here -->
    <div v-if="matchingUsers.length > 0" class="connect-card">
      <div class="connect-header">
        This user matches all of your preferences!<br />User: {{ matchingUsers[0].username }} <br />
        <!-- Can  I link this to that user's profile?-->

        Gender: {{ matchingUsers[0].gender }} <br />Sports: {{ matchingUsers[0].sports }} <br />
      </div>
      <div class="connect-buttons">
        Would you like to connect? <br />

        <button class="connect-yes" @click="sendRequest()">Yes</button>
        <button class="connect-no" @click="nextUser">No</button>
      </div>
    </div>

    <h3 v-else>No users on our platform match all of your preferences..</h3>
  </div>

  <div class="friend-requests">
    <h3>Friend Requests</h3>
    <!-- <button @click="getRequests">Incoming Friend Requests</button> -->

    <div v-if="friendRequests.length > 0" class="request-card">
      <!-- {{ friendRequests }} -->

      <strong>Username: {{ friendRequests[0].from }}</strong> <br />
      Click the button to fill in the info below about this user!
      <button @click="getUniqueProfile(friendRequests[0].from)">Info about {{ friendRequests[0].from }}</button>
      <p>Gender: {{ fromGender }}</p>
      <p>Sports: {{ fromSports }}</p>
      <p>Skill: {{ fromSkill }}</p>
      <p>Goals: {{ fromGoal }}</p>
      <p>Phone Number: {{ fromNum }}</p>
      <div class="request-buttons">
        <button class="accept-button" @click="acceptRequest">Accept</button>
        <button class="reject-button" @click="rejectRequest">Reject</button>
      </div>
    </div>
  </div>
</template>
