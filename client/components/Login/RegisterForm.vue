<script setup lang="ts">
import router from "@/router";
import { useUserStore } from "@/stores/user";
import { ref } from "vue";

const UserType = ref("");
const { createUser, loginUser, updateSession } = useUserStore();

async function register() {
  void updateSession();
  void router.push({ name: "Home" });
}
</script>

<template>
  <form class="pure-form pure-form-aligned" @submit.prevent="register">
    <h3>Register User</h3>
    <fieldset>
      <div class="pure-control-group">
        <h3 for="UserType">Account Type</h3>
        <div class="radio-container">
          <div>
            <input type="radio" value="Food Pantry Admin" v-model="UserType" id="Food Pantry Admin" />
            <label for="foodPantryAdmin">Food Pantry Admin</label>
          </div>
          <div>
            <input type="radio" value="Client" v-model="UserType" id="Client" />
            <label for="client">Client</label>
          </div>
        </div>
      </div>
      <br />
      <div class="pure-controls">
        <button type="submit" class="pure-button pure-button-primary">Register</button>
      </div>
    </fieldset>
  </form>
</template>

<style scoped>
h3 {
  display: flex;
  justify-content: center;
}
</style>
