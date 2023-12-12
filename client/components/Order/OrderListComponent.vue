<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { onBeforeMount, ref } from "vue";
import EditOrderForm from "./EditOrderForm.vue";
import OrderComponent from "./OrderComponent.vue";
const loaded = ref(false);
const unfulfilled = ref<Array<Record<string, string>>>([]);
const fulfilled = ref<Array<Record<string, string>>>([]);
const editing = ref("");
const props = defineProps(["userType"]);
const type = ref("");

async function getOrders() {
  loaded.value = false;
  try {
    if (type.value == "Client") {
      const clientId = await fetchy("/api/session", "GET");
      const orders = await fetchy(`/api/order/user/${clientId._id}`, "GET");
      unfulfilled.value = orders.filter((order: { status: "placed" | "packed" | "picked up" }) => order.status != "picked up");
      fulfilled.value = orders.filter((order: { status: "placed" | "packed" | "picked up" }) => order.status == "picked up");
      loaded.value = true;
    } else {
      const adminId = await fetchy("/api/session", "GET");
      const orders = await fetchy(`/api/order/admin/${adminId._id}`, "GET");
      unfulfilled.value = orders.filter((order: { status: "placed" | "packed" | "picked up" }) => order.status != "picked up");
      fulfilled.value = orders.filter((order: { status: "placed" | "packed" | "picked up" }) => order.status == "picked up");
      loaded.value = true;
    }
  } catch (e) {
    console.log(e);
  }
}

const cancelEditing = () => {
  editing.value = ""; // Set editing to an empty string to cancel editing
};

function updateEditing(id: string) {
  editing.value = id;
}

onBeforeMount(async () => {
  type.value = await props.userType;
  await getOrders();
});
</script>

<template>
  <v-container v-if="loaded">
    <h2>Unfulfilled Orders</h2>
    <article v-for="order in unfulfilled" :key="order._id">
      <OrderComponent v-if="editing !== order._id" :userType="userType" :order="order" @refreshOrders="getOrders" @editOrder="updateEditing" />
      <EditOrderForm v-else :order="order" @refreshOrders="getOrders" @editOrder="updateEditing" @cancelEditing="cancelEditing" />
    </article>
    <h2>Fulfilled Orders</h2>
    <article v-for="order in fulfilled" :key="order._id">
      <OrderComponent v-if="editing !== order._id" :userType="userType" :order="order" @refreshOrders="getOrders" @editOrder="updateEditing" />
      <EditOrderForm v-else :order="order" @refreshOrders="getOrders" @editOrder="updateEditing" @cancelEditing="cancelEditing" />
    </article>
  </v-container>
</template>
