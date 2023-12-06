<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import AdminOrderListComponent from "../components/Order/AdminOrderListComponent.vue";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
</script>

<template>
  <main>
    <h1 v-if="isLoggedIn">
      <div></div>
      Orders
    </h1>

    <AdminOrderListComponent />
  </main>
</template>
