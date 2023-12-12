<script setup lang="ts">
import { defineProps, onBeforeMount, ref } from "vue"; // Import defineProps and defineEmits

const props = defineProps(["item"]);
const name = ref("");
const imageURL = ref("");
const brand = ref("");
const group = ref("");

const getName = async (barcode: string) => {
  fetch("https://world.openfoodfacts.org/api/v2/product/" + barcode + ".json")
    .then((response) => {
      if (response.ok) {
        return response.json(); // Parse the response data as JSON
      } else {
        throw new Error("API request failed");
      }
    })
    .then((data) => {
      name.value = data.product.generic_name_en ? data.product.generic_name_en : "No name available";
      brand.value = data.product.brands ? data.product.brands : "No brand available";
      imageURL.value = data.product.image_url ? data.product.image_url : "https://t3.ftcdn.net/jpg/05/03/24/40/360_F_503244059_fRjgerSXBfOYZqTpei4oqyEpQrhbpOML.jpg";
      group.value = data.product.food_groups ? data.product.food_groups.substring(data.product.food_groups.indexOf(":") + 1).replaceAll("-", " ") : "No food groups available";
    })
    .catch((error) => {
      // Handle any errors here
      console.error(error); // Example: Logging the error to the console
    });
};

onBeforeMount(async () => {
  try {
    await getName(props.item.barcode);
  } catch {
    // User is not logged in
  }
});
</script>

<template>
  <v-container>
    <v-row align="stretch" class="w-100">
      <h3>{{ name }} - {{ brand }}</h3>
    </v-row>
    <v-row align="stretch" class="w-100">
      <v-col cols="3">
        <v-img :src="imageURL" alt="Input ImageURL" class="h-100" />
      </v-col>
      <v-col cols="9">
        <strong>Barcode:</strong> {{ props.item.barcode }}<br />
        <strong>Status:</strong> {{ props.item.status }} <br />
        <strong>Expiration Date:</strong> {{ new Date(props.item.expirationDate).toLocaleString() }} <br />
        <strong>Drop Date:</strong> {{ new Date(props.item.dropDate).toLocaleString() }} <br />
        <strong>Food Group:</strong> {{ group }}
      </v-col>
    </v-row>
  </v-container>
</template>
