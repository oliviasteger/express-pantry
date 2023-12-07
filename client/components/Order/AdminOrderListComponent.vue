<!-- to seperate fulfilled and ongoing just sort by fulfilled/unfulfilled and ascending pickup time -->

<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { computed, onBeforeMount, ref } from "vue";
import EditOrderForm from "./EditOrderForm.vue";
import OrderComponent from "./OrderComponent.vue";
const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());

const loaded = ref(false);
let orders = ref<Array<Record<string, string>>>([]);
let editing = ref("");
let items = ref<Array<Record<string, string>>>([]);

async function getItems() {
  let itemResults;
  try {
    itemResults = await fetchy("/api/items", "GET");
  } catch (_) {
    return;
  }
  items.value = itemResults;
}
async function getOrders() {
  let orderResults;
  try {
    const adminId = await fetchy("/api/session", "GET");
    orderResults = await fetchy(`/api/order/admin/${adminId._id}`, "GET");
  } catch (_) {
    return;
  }

  orders.value = orderResults;
}

const pickedUpOrders = computed(() => orders.value.filter((order) => order.status === "picked up"));
const unfulfilledOrders = computed(() => {
  // Filter orders that are not picked up
  const unfulfilled = orders.value.filter((order) => order.status !== "picked up");

  // Sort orders by ascending pickup date
  return unfulfilled.sort((a, b) => new Date(a.pickup).getTime() - new Date(b.pickup).getTime());
});

const cancelEditing = () => {
  editing.value = ""; // Set editing to an empty string to cancel editing
};

function updateEditing(id: string) {
  editing.value = id;
}

onBeforeMount(async () => {
  await getOrders();
  loaded.value = true;
});
</script>

<template>
  <section class="posts" v-if="loaded && orders.length !== 0">
    <h2>Unfulfilled Orders</h2>
    <article v-for="order in unfulfilledOrders" :key="order._id">
      <OrderComponent v-if="editing !== order._id" :order="order" @refreshItems="getItems" @refreshOrders="getOrders" @editOrder="updateEditing" />
      <EditOrderForm v-else :order="order" @refreshItems="getOrders" @refreshOrders="getOrders" @editOrder="updateEditing" @cancelEdit="cancelEditing" />
    </article>

    <h2>Completed Orders</h2>
    <article v-for="order in pickedUpOrders" :key="order._id">
      <OrderComponent v-if="editing !== order._id" :order="order" @refreshItems="getOrders" @refreshOrders="getOrders" @editOrder="updateEditing" />
      <EditOrderForm v-else :order="order" @refreshItems="getOrders" @editOrder="updateEditing" @cancelEdit="cancelEditing" />
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
