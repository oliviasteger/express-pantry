<script setup lang="ts">
import { defineProps, onBeforeMount, ref } from "vue"; // Import defineProps and defineEmits

const props = defineProps(["item"]);
const name = ref("");
const imageURL = ref("");
const brand = ref("");
const group = ref("");

const getName = async (barcode: string) => {
  console.log(barcode);
  fetch("https://world.openfoodfacts.org/api/v2/product/" + barcode + ".json")
    .then((response) => {
      if (response.ok) {
        return response.json(); // Parse the response data as JSON
      } else {
        throw new Error("API request failed");
      }
    })
    .then((data) => {
      console.log(data);
      name.value = data.product.generic_name_en;
      brand.value = data.product.brands;
      imageURL.value = data.product.image_url;
      group.value = data.product.food_groups;
    })
    .catch((error) => {
      // Handle any errors here
      console.error(error); // Example: Logging the error to the console
    });
};

onBeforeMount(async () => {
  try {
    console.log("basicfoodbarcode: ", props.item.barcode);
    await getName(props.item.barcode);
  } catch {
    // User is not logged in
  }
});
</script>

<template>
  <v-row>
    <v-col> <strong>Barcode:</strong> {{ props.item.barcode }} </v-col>
    <v-col> <strong>Status:</strong> {{ props.item.status }} </v-col>
    <v-col> <strong>Expiration Date:</strong> {{ new Date(props.item.expirationDate).toLocaleString() }} </v-col>
    <v-col> <strong>Drop Date:</strong> {{ new Date(props.item.dropDate).toLocaleString() }} </v-col>
    <v-col> <strong>Name:</strong> {{ name }} </v-col>
    <v-col> <strong>Brand:</strong> {{ brand }} </v-col>
    <v-col>
      <img :src="imageURL" alt="Input ImageURL" class="image" width="100" height="100" />
    </v-col>
    <v-col> <strong>Food Group:</strong> {{ group }} </v-col>
  </v-row>
</template>
