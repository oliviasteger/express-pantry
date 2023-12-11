<script setup lang="ts">
import router from "@/router";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import UpdateUserForm from "../components/Setting/UpdateUserForm.vue";

const { currentUsername } = storeToRefs(useUserStore());
const { logoutUser, deleteUser } = useUserStore();

async function logout() {
  await logoutUser();
  void router.push({ name: "Home" });
}

async function delete_() {
  await deleteUser();
  void router.push({ name: "Home" });
}
</script>

<template>
  <main class="column">
    <v-card elevation="3" class="back">

      <div class = "row">
    <h1>Settings for {{ currentUsername }}</h1>
    
    <button class="pure-button pure-button-primary" @click="logout">Logout</button>
    <button class="button-error pure-button" @click="delete_">Delete User</button>
  </div>
    <UpdateUserForm />
  </v-card>
  </main>
</template>
<style>
.back {
  padding: 1em;
  border-radius: 0.5em;
}
</style>
