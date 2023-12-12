<!-- admin only can view -->
<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const props = defineProps(["request", "userType"]);
const barcode = ref("");
const status = ref("");
const emit = defineEmits(["editRequest", "refreshRequests", "cancelEdit"]);
const id = ref("");

const cancelEditing = () => {
  emit("cancelEdit"); // This will switch back to displaying the FoodComponent
};

async function updateBarcode() {
  try {
    await fetchy(`/api/requests/${id.value}`, "PATCH", { body: { update: { barcode: barcode.value } } });
  } catch (e) {
    console.log("Error updating request: ", e);
  }
  emit("editRequest");
  emit("refreshRequests");
}

async function updateStatus() {
  try {
    await fetchy(`/api/requests/${id.value}`, "PATCH", { body: { update: { status: status.value } } });
  } catch (e) {
    console.log("Error updating request: ", e);
  }
  emit("editRequest");
  emit("refreshRequests");
}

onBeforeMount(async () => {
  id.value = props.request._id;
});
</script>

<template>
  <v-card>
    <v-card-title>Update Request</v-card-title>
    <v-card-item>
      <v-form v-if="userType == 'Client'" validate-on="submit lazy" @submit.prevent="updateBarcode">
        <v-text-field v-model="barcode" label="Request barcode" :persistent-placeholder="true"></v-text-field>
        <v-btn type="submit" block class="mt-2" text="Change"></v-btn>
      </v-form>
      <v-form v-if="userType == 'Administrator'" validate-on="submit lazy" @submit.prevent="updateStatus">
        <v-select v-model="status" :items="['Pending', 'Accepted', 'Rejected']" label="Choose request status" required></v-select>
        <v-btn type="submit" block class="mt-2" text="Change"></v-btn>
      </v-form>
    </v-card-item>
    <v-card-actions>
      <v-btn @click="cancelEditing" block class="mt-2" text="Return to all requests"></v-btn>
    </v-card-actions>
  </v-card>
</template>
