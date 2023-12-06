<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import ClientOrderListComponent from "../components/Order/ClientOrderListComponent.vue";
const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
</script>

<template>
  <main>
    <h1 v-if="isLoggedIn">
      <div></div>
      Your Orders
    </h1>

    <ClientOrderListComponent />
  </main>
</template>
