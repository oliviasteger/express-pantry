<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";
const props = defineProps(["requestee"]);
const barcode = ref("");

const createRequest = async () => {
  console.log(props.requestee);
  try {
    await fetchy("/api/requests", "POST", {
      body: {
        barcode: barcode.value,
        requestee: props.requestee,
      },
    });
  } catch (error) {
    console.error("Error creating request:", error);
  }
};
</script>
<template>
  <v-card min-width="600px">
    <v-card-title>Request an item</v-card-title>
    <v-card-subtitle
      >To request an item, submit the item's barcode below. You can find the barcode using the <a href="https://world.openfoodfacts.org" target="blank">Open Food Facts website</a>.</v-card-subtitle
    >
    <v-container>
      <v-form @submit.prevent="createRequest">
        <v-text-field v-model.trim="barcode" label="Food item barcode" required></v-text-field>
        <v-btn type="submit" color="primary">Request item</v-btn>
      </v-form>
    </v-container>
  </v-card>
</template>
