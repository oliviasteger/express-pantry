<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import OrderListComponent from "../components/Order/OrderListComponent.vue";
const { isLoggedIn } = storeToRefs(useUserStore());
const userStore = useUserStore();
</script>

<template>
  <v-container v-if="isLoggedIn">
    <h1>
      <div></div>
      Your Orders
    </h1>

    <OrderListComponent :userType="userStore.userType" />
  </v-container>
</template>
