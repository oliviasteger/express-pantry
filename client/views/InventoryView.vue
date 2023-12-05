<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import FoodListComponent from "../components/Food/FoodListComponent.vue";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
</script>

<template>
  <main>
    <h1 v-if="isLoggedIn">
      <div></div>
      Your Inventory
    </h1>

    <FoodListComponent />
  </main>
</template>
