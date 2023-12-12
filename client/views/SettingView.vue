<script setup lang="ts">
import router from "@/router";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import UpdateUserForm from "../components/Setting/UpdateUserForm.vue";

const { currentUsername, userType } = storeToRefs(useUserStore());
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
    <v-card elevation="3" class="panel">
    <v-card-title><strong>Settings for {{ currentUsername }}</strong></v-card-title>
    <v-card-actions>
    <v-row class="m-0">
      <v-col class="d-flex justify-end">
        <v-btn class="button-error btn-small" @click="delete_">Delete Account</v-btn>
        <v-btn class="btn-small" variant="flat" color="primary" @click="logout">Logout</v-btn>
      </v-col>
    </v-row>
    
    </v-card-actions>
    <div v-if="userType === 'Client'">
      <UpdateUserForm />
    </div>
    
    </v-card>
  </main>
</template>
<style>
.panel{
  margin-top: 1em;
  width: 60vw;
}
</style>
