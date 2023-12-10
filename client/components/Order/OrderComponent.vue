<!-- same view for user and admin but only admin can update status. Order has:sender: ObjectId;
  recipient: ObjectId;
  items: ObjectId[];
  status: OrderStatus;
  pickup: Date;-->

<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { defineProps, onBeforeMount, ref } from "vue"; // Import defineProps and defineEmits
import { fetchy } from "../../utils/fetchy";
import BasicFoodComponent from "../Food/BasicFoodComponent.vue";

const props = defineProps(["order"]);
const { currentUsername } = storeToRefs(useUserStore());
const emit = defineEmits(["editOrder", "refreshItems", "refreshOrders"]);
const items = ref<{ _id: string; sender: string; recipient: string; items: string[]; status: "placed" | "packed" | "picked up"; pickup: Date }[][]>([]);
const loaded = ref(false);

// const emit = defineEmits(); // Use defineEmits without arguments
const deleting = ref(false); // Track if the order is being deleted

const deleteOrder = async () => {
  if (deleting.value) return; // Prevent multiple delete requests
  deleting.value = true;

  try {
    await fetchy(`/api/order/${props.order._id}`, "DELETE");
  } catch (error) {
    console.error("Error deleting item:", error);
  } finally {
    deleting.value = false;
  }
  emit("refreshItems");
  emit("refreshOrders");
};
const clientName = ref("");
const profileName = ref("");

const getClientUsername = async () => {
  let check = await fetchy(`/api/users/id/${props.order.sender}`, "GET");
  check = check.username;
  clientName.value = check;
};

const getProfile = async () => {
  console.log("HELLO");
  //const currentId = await fetchy("/api/profiles", "GET");
  let currentId = await fetchy(`/api/profiles/admin/${props.order.recipient}`, "GET");
  //const currentId = await fetchy(`api/profiles?searchQuery=${JSON.stringify({ administrator: props.order.recipient })}`, "GET");
  console.log("CHECK", currentId);
  currentId = currentId[0].name;
  profileName.value = currentId;
};

const getOrderItems = async () => {
  const itemIds = props.order.items;
  const loadedItems = [];
  for (let itemId of itemIds) {
    const item = await fetchy(`/api/items/${itemId}`, "GET");
    loadedItems.push(item);
  }

  items.value = loadedItems;
};

onBeforeMount(async () => {
  try {
    console.log(props.order);
    await getProfile();
    await getClientUsername();
    await getOrderItems();
    loaded.value = true;
  } catch {
    // User is not logged in
  }
});
</script>

<template>
  <v-row>
    <v-col> <strong>Sender:</strong> {{ clientName }} </v-col>
    <v-col> <strong>Recipient:</strong> {{ profileName }} </v-col>
    <v-col> <strong>Status:</strong> {{ props.order.status }} </v-col>
    <v-col> <strong>pickup Date:</strong> {{ new Date(props.order.pickup).toLocaleString() }} </v-col>

    <v-col>
      <v-btn class="button-error btn-small" @click="deleteOrder">Delete</v-btn>
      <v-btn class="btn-small" @click="emit('editOrder', props.order._id)">Edit</v-btn>
    </v-col>
  </v-row>
  <h3 v-if="loaded && items.length !== 0">Order Items</h3>
  <v-container v-if="loaded && items.length !== 0">
    <article v-for="item in items" :key="item[0]._id">
      <BasicFoodComponent :item="item[0]" />
    </article>
  </v-container>
</template>

<style scoped>
article {
  margin: 1em;
}
</style>
