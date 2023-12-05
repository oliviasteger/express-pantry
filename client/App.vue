<script setup lang="ts">
import { useToastStore } from "@/stores/toast";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { computed, onBeforeMount } from "vue";
import { RouterLink, RouterView, useRoute } from "vue-router";

const currentRoute = useRoute();
const currentRouteName = computed(() => currentRoute.name);
const userStore = useUserStore();
const { isLoggedIn } = storeToRefs(userStore);
const { toast } = storeToRefs(useToastStore());

// Make sure to update the session before mounting the app in case the user is already logged in
onBeforeMount(async () => {
  try {
    await userStore.updateSession();
    await userStore.updateType();
  } catch {
    // User is not logged in
  }
});
// 
</script>

<template>
  <header>
    <nav>
      <div class="title" >
        <img src="@/assets/images/betterlogo.svg.svg" />
        <RouterLink :to="{ name: 'Home' }">
          <h2>ExpressPantry</h2>
        </RouterLink>
      </div>
      <ul>
        <li>
          <RouterLink :to="{ name: 'Home' }" :class="{ underline: currentRouteName == 'Home' }"> Home </RouterLink>
        </li>
        <li v-if="isLoggedIn">
          <RouterLink :to="{ name: 'Settings' }" :class="{ underline: currentRouteName == 'Settings' }"> Settings </RouterLink>
          <ul v-if="userStore.userType === 'Administrator'">
            
              <li>
                <RouterLink :to="{ name: 'Profile' }"> Profile </RouterLink>
              </li>
            
            <!-- Add more admin-specific links as needed -->
          </ul>
          <ul v-else-if="userStore.userType === 'Client'">
              <li>
                <RouterLink :to="{ name: 'Account' }"> Dashboard </RouterLink>
              </li>
              <li>
                <RouterLink :to="{ name: 'Map' }"> Map </RouterLink>
              </li>
            
          </ul>
        </li>
        <li v-else>
          <RouterLink :to="{ name: 'Login' }" :class="{ underline: currentRouteName == 'Login' }"> Login </RouterLink>
        </li>
      </ul>
    </nav>
    <hr width="100%" size=".1" id = "color" noshade>
    <article v-if="toast !== null" class="toast" :class="toast.style">
      <p>{{ toast.message }}</p>
    </article>
  </header>
  <RouterView />
</template>

<style scoped>
@import "./assets/toast.css";
#color{
  color: var(--line-color);
  opacity: 25%;
  margin:auto;
}
nav {
  padding: 1em 2em;
  display: flex;
  align-items: center;
}

h1 {
  font-size: 2em;
  margin: 0;
}

.title {
  display: flex;
  align-items: center;
  font-style: italic;
  gap: 0.5em;
}

img {
  height: 2em;
}

a {
  font-size: large;
  color: black;
  text-decoration: none;
}

ul {
  list-style-type: none;
  margin-left: auto;
  display: flex;
  align-items: center;
  flex-direction: row;

  gap: 1em;
}
li{
  display: flex;
  flex-flow: row wrap;
  gap: 1em;
}
.underline {
  text-decoration: underline;
}
</style>
