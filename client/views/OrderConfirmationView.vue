<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import CartComponent from "../components/Cart/CartComponent.vue";
import PickupTimeComponent from "../components/Cart/PickupTimeComponent.vue";
import router from "../router";
import { fetchy } from "../utils/fetchy";

const { isLoggedIn } = storeToRefs(useUserStore());

const loaded = ref(false);

const time = ref<Date>(new Date());
const barcodes = ref("");
const shopId = ref("");

const createOrder = async () => {
  await fetchy("/api/order", "POST", { body: { profileId: "", barcodes: [], pickupTime: time.value?.toISOString() } });
  await router.push({ name: "Client Orders" });
};

function updateCart(sender: string, recipient: string, items: string[]) {}

function updateTime(newTime: string) {
  time.value = new Date(newTime);
}
</script>

<template>
  <section v-if="isLoggedIn" @submit.prevent="createOrder">
    <h2>Your Current Cart</h2>
    <CartComponent />
    <PickupTimeComponent @addTime="updateTime" required />
  </section>

  <p v-else-if="loaded">No cart</p>
  <p v-else>Loading...</p>
</template>

<style scoped>
section {
  display: flex;
  flex-direction: column;
  gap: 1em;
}

section,
p,
.row {
  margin: 0 auto;
  max-width: 60em;
}

article {
  background-color: var(--base-bg);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
}

.posts {
  padding: 1em;
}

.row {
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  max-width: 60em;
}
</style>
