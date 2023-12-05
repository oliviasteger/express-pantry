<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { defineProps, ref } from "vue"; // Import defineProps and defineEmits
import { fetchy } from "../../utils/fetchy";

const props = defineProps(["item"]);
const { currentUsername } = storeToRefs(useUserStore());

// const emit = defineEmits(); // Use defineEmits without arguments
const deleting = ref(false); // Track if the item is being deleted

const deleteItem = async () => {
  if (deleting.value) return; // Prevent multiple delete requests
  deleting.value = true;

  try {
    await fetchy(`/api/items/${props.item._id}`, "DELETE");
  } catch (error) {
    console.error("Error deleting item:", error);
  } finally {
    deleting.value = false;
  }
};
</script>

<template>
  <div>
    <p><strong>Barcode</strong> {{ props.item.barcode }}</p>
    <p><strong>Status</strong> {{ props.item.status }}</p>
    <p><strong>Expiration Date</strong> {{ props.item.expirationDate }}</p>
    <p><strong>Drop Date</strong> {{ props.item.dropDate }}</p>
    <li><button class="button-error btn-small pure-button" @click="deleteItem">Delete</button></li>
  </div>
</template>
