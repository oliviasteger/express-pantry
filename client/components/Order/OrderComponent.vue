<!-- same view for user and admin but only admin can update status. Order has:sender: ObjectId;
  recipient: ObjectId;
  items: ObjectId[];
  status: OrderStatus;
  pickup: Date;-->

<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { defineProps, ref } from "vue"; // Import defineProps and defineEmits
import { fetchy } from "../../utils/fetchy";

const props = defineProps(["order"]);
const { currentUsername } = storeToRefs(useUserStore());
const emit = defineEmits(["editOrder", "refreshItems", "refreshOrders"]);

// const emit = defineEmits(); // Use defineEmits without arguments
const deleting = ref(false); // Track if the order is being deleted

const deleteOrder = async () => {
  if (deleting.value) return; // Prevent multiple delete requests
  deleting.value = true;

  try {
    await fetchy("/api/order", "DELETE", {
      body: { orderId: props.order._id },
    });
  } catch (error) {
    console.error("Error deleting item:", error);
  } finally {
    deleting.value = false;
  }
  emit("refreshItems");
  emit("refreshOrders");
};
</script>

<template>
  <v-row>
    <v-col> <strong>Sender:</strong> {{ props.order.sender }} </v-col>
    <v-col> <strong>Recipient:</strong> {{ props.order.recipient }} </v-col>
    <v-col> <strong>Status:</strong> {{ props.order.status }} </v-col>
    <v-col> <strong>pickup Date:</strong> {{ new Date(props.order.pickup).toLocaleString() }} </v-col>

    <v-col>
      <v-btn class="button-error btn-small" @click="deleteOrder">Delete</v-btn>
      <v-btn class="btn-small" @click="emit('editOrder', props.order._id)">Edit</v-btn>
    </v-col>
  </v-row>
</template>
