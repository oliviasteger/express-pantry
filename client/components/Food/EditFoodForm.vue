<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const props = defineProps(["item"]);
const barcode = ref("");
const expirationDate = ref("");
const dropDate = ref("");
const status = ref("");
const emit = defineEmits(["editItem", "refreshItems"]);

const loaded = ref(false);
const cancelEditing = () => {
  emit("editItem"); // This will switch back to displaying the FoodComponent
};

async function updateBarcode() {
  try {
    await fetchy(`/api/items/${props.item._id}`, "PATCH", { body: { update: { barcode: barcode.value } } });
  } catch {
    //womp womp
  }
  emit("editItem");
  emit("refreshItems");
}

async function updateExpirationDate() {
  try {
    await fetchy(`/api/items/${props.item._id}`, "PATCH", { body: { update: { expirationDate: new Date(expirationDate.value).toISOString() } } });
  } catch {
    //womp womp
  }
  emit("editItem");
  emit("refreshItems");
}

async function updateDropDate() {
  try {
    await fetchy(`/api/items/${props.item._id}`, "PATCH", { body: { update: { dropDate: new Date(dropDate.value).toISOString() } } });
  } catch {
    //womp womp
  }
  emit("editItem");
  emit("refreshItems");
}

async function updateStatus() {
  try {
    await fetchy(`/api/items/${props.item._id}`, "PATCH", { body: { update: { status: status.value } } });
  } catch {
    //womp womp
  }
  emit("editItem");
  emit("refreshItems");
}
</script>

<template>
  <v-card>
    <v-card-title>Update Item</v-card-title>
    <v-card-item>
      <v-form validate-on="submit lazy" @submit.prevent="updateBarcode">
        <v-text-field v-model="barcode" label="food item barcode" :persistent-placeholder="true"></v-text-field>
        <v-btn type="submit" block class="mt-2" text="change barcode"></v-btn>
      </v-form>
    </v-card-item>
    <v-card-item>
      <v-form validate-on="submit lazy" @submit.prevent="updateExpirationDate">
        <label for="expirationDate">Expiration Date: &nbsp;</label>
        <input v-model.trim="expirationDate" type="date" id="expirationDate" required />
        <v-btn type="submit" block class="mt-2" text="Change expiration date"></v-btn>
      </v-form>
    </v-card-item>
    <v-card-item>
      <v-form validate-on="submit lazy" @submit.prevent="updateDropDate">
        <label for="dropDate">Drop Date: &nbsp;</label>
        <input v-model.trim="dropDate" type="date" id="dropDate" required />
        <v-btn type="submit" block class="mt-2" text="Change drop date"></v-btn>
      </v-form>
    </v-card-item>
    <v-card-item>
      <v-form validate-on="submit lazy" @submit.prevent="updateStatus">
        <v-select v-model="status" :items="['Unreleased', 'Claimable', 'Ordered', 'Used', 'Expired']" label="Item status" required />
        <v-btn type="submit" block class="mt-2" text="Change status"></v-btn>
      </v-form>
    </v-card-item>

    <v-card-actions>
      <v-btn @click="cancelEditing" block class="mt-2" text="Cancel editing"></v-btn>
    </v-card-actions>
  </v-card>
</template>
