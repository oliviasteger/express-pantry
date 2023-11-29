<script setup lang="ts">
import router from "@/router";
import { useUserStore } from "@/stores/user";
import { ref } from "vue";

const username = ref("");
const password = ref("");
const { loginUser, updateSession } = useUserStore();

async function login() {
  await loginUser(username.value, password.value);
  void updateSession();
  void router.push({ name: "Home" });
}
</script>

<template>
  <form class="pure-form pure-form-aligned" @submit.prevent="login">
    <h3>Login</h3>
    <fieldset>
      <div class="pure-control-group">
        <label for="aligned-name">Username</label>
        <input v-model.trim="username" type="text" id="aligned-name" placeholder="Username" required />
      </div>
      <div class="pure-control-group">
        <label for="aligned-password">Password</label>
        <input type="password" v-model.trim="password" id="aligned-password" placeholder="Password" required />
      </div>
      <div class="pure-controls">
        <button type="submit" class="button default">Submit</button>
      </div>
      <div class = "row">
        <h6> Don't have an account</h6>
      </div>
    </fieldset>
  </form>
</template>

<style scoped>
h3,h6 {
  display: flex;
  justify-content: center;
}
.row {
  margin: 0 auto;
  max-width: 100%;
  justify-content: center;
  display: flex;
  align-items: center;
  flex-direction: row;
  gap: 1em;
}
</style>
