<script setup lang="ts">
import LoginForm from "@/components/Login/LoginForm.vue";
import RegisterForm from "@/components/Login/RegisterForm.vue";
import { ref } from "vue";
const needRegistry = ref(false);
async function switchView() {
  needRegistry.value = !needRegistry.value;
}
</script>

<template>
  <main>
    <div>
      <v-sheet v-show="!needRegistry">
        <LoginForm @register="switchView" />
      </v-sheet>

      <v-sheet v-show="needRegistry">
        <RegisterForm @submit="switchView" />
      </v-sheet>
    </div>
  </main>
</template>
<style>
.panel{
  margin-top: 1em;
  width: 40vw;
  gap:10px;
}
#center {
  display: flex;
  align-self: center;
}
</style>
