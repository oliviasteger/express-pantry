<!-- only admin can view, use to update status -->

<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const props = defineProps(["order"]);
const status = ref("");
const emit = defineEmits(["editOrder", "refreshItems", "refreshOrders", "cancelEditing"]);

async function updateStatus() {
  try {
    await fetchy(`/api/order/status`, "PATCH", { body: { orderId: props.order._id, newStatus: status.value } });
  } catch {
    //womp womp
  }
  emit("refreshItems");
  emit("refreshOrders");
  emit("editOrder");
}
</script>

<template>
  <h2>Update Order</h2>
  <v-form validate-on="submit lazy" @submit.prevent="updateStatus">
    <v-select v-model="status" :items="['placed', 'packed', 'picked up']" label="Choose the status of this order" required></v-select>
    <v-btn type="submit" block class="mt-2" text="Change"></v-btn>
  </v-form>
  <v-btn @click="emit('cancelEditing')" block class="mt-2" text="Go Back To All Orders"></v-btn>
</template>
