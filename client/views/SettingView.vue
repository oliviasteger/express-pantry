<script setup lang="ts">
import router from "@/router";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import UpdateUserForm from "../components/Setting/UpdateUserForm.vue";

const { currentUsername, userType } = storeToRefs(useUserStore());
const { logoutUser, deleteUser } = useUserStore();

let username = ref("");
let password = ref("");

const rules = [
  (value: any) => {
    if (value) return "value";

    return "You must enter a value.";
  },
];

async function logout() {
  await logoutUser();
  void router.push({ name: "Home" });
}

async function delete_() {
  await deleteUser();
  void router.push({ name: "Home" });
}

const { updateUser, updateSession } = useUserStore();

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
</script>

<template>
  <v-container class="mt-5 mb-5" style="margin-left: auto; margin-right: auto">
    <v-card>
      <v-card-title
        ><strong>Settings for {{ currentUsername }}</strong></v-card-title
      >
      <v-card-item>
        <v-form validate-on="submit lazy" @submit.prevent="updateUsername">
          <v-text-field hide-details v-model="username" :placeholder="currentUsername" :persistent-placeholder="true" :rules="rules" label="Username"></v-text-field>
          <v-btn type="submit" id="change" block class="mt-2" text="Change Username"></v-btn>
        </v-form>
      </v-card-item>
      <v-card-item>
        <v-form validate-on="submit lazy" @submit.prevent="updatePassword">
          <v-text-field hide-details v-model="password" label="Password" :rules="rules"></v-text-field>
          <v-btn type="submit" id="change" block class="mt-2" text="Change Password"></v-btn>
        </v-form>
      </v-card-item>
      <UpdateUserForm v-if="userType === 'Client'" />
      <v-card-actions>
        <v-btn color="var(--red)" @click="delete_">Delete Account</v-btn>
        <v-btn color="primary" @click="logout">Logout</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>
