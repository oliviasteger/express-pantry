<!-- to seperate fulfilled and ongoing just sort by fulfilled/unfulfilled and ascending pickup time -->

<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { computed, onBeforeMount, ref } from "vue";
import OrderComponent from "./OrderComponent.vue";

const loaded = ref(false);
let orders = ref<Array<Record<string, string>>>([]);
let editing = ref("");

async function getOrders() {
  let orderResults;
  try {
    const clientId = await fetchy("api/session", "GET");
    orderResults = await fetchy(`/api/order/user/${clientId}`, "GET");
  } catch (_) {
    return;
  }
  orders.value = orderResults;
}

function updateEditing(id: string) {
  editing.value = id;
}

const pickedUpOrders = computed(() => orders.value.filter((order) => order.status === "picked up"));
const unfulfilledOrders = computed(() => {
  // Filter orders that are not picked up
  const unfulfilled = orders.value.filter((order) => order.status !== "picked up");

  // Sort orders by ascending pickup date
  return unfulfilled.sort((a, b) => new Date(a.pickup).getTime() - new Date(b.pickup).getTime());
});

onBeforeMount(async () => {
  await getOrders();
  loaded.value = true;
});
</script>

<template>
  <!-- <section class="posts" v-if="loaded && orders.length !== 0">
    <h2>Orders</h2>
    <article v-for="order in orders" :key="order._id">
      <OrderComponent v-if="editing !== order._id" :item="order" @refreshItems="getOrders" @editOrder="updateEditing" />
    </article>
  </section> -->

  <section class="posts" v-if="loaded && orders.length !== 0">
    <h2>Unfulfilled Orders</h2>
    <article v-for="order in unfulfilledOrders" :key="order._id">
      <OrderComponent v-if="editing !== order._id" :item="order" @refreshItems="getOrders" @editItem="updateEditing" />
      <EditOrderForm v-else :item="order" @refreshItems="getOrders" @editItem="updateEditing" />
    </article>

    <h2>Completed Orders</h2>
    <article v-for="order in pickedUpOrders" :key="order._id">
      <OrderComponent v-if="editing !== order._id" :item="order" @refreshItems="getOrders" @editItem="updateEditing" />
      <EditOrderForm v-else :item="order" @refreshItems="getOrders" @editItem="updateEditing" />
    </article>
  </section>
  <p v-else-if="loaded">No Orders found</p>
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
