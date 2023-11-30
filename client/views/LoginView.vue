<script setup lang="ts">
import LoginForm from "@/components/Login/LoginForm.vue";
import RegisterForm from "@/components/Login/RegisterForm.vue";
import UpdateUserForm from "@/components/Setting/UpdateUserForm.vue";
import { ref } from "vue";
const needRegistry = ref(false);
async function switchView() {
  needRegistry.value = !needRegistry.value;
}
</script>

<template>
  <main>
    <UpdateUserForm />
    <div class="column" id="center">
      <div class="column" v-show="!needRegistry">
        <h1>Please login</h1>
        <LoginForm @register="switchView" />
      </div>
      <div v-show="needRegistry">
        <h1>Create your ExpressPantry Account</h1>
        <RegisterForm @submit="switchView" />
      </div>
    </div>
  </main>
</template>
<style>
#center {
  display: flex;
  align-self: center;
}
</style>
