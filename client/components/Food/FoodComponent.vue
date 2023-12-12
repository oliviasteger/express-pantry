<script setup lang="ts">
import { defineProps, onBeforeMount, ref } from "vue"; // Import defineProps and defineEmits
import { fetchy } from "../../utils/fetchy";

const props = defineProps(["item"]);
const emit = defineEmits(["editItem", "refreshItems"]);

const deleting = ref(false); // Track if the item is being deleted
const name = ref("");
const imageURL = ref("");
const brand = ref("");
const group = ref("");

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
  emit("refreshItems");
};

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
      brand.value = data.product.brands ? data.product.brands.toString().replaceAll(",", ", ") : "No brand available";
      imageURL.value = data.product.image_url ? data.product.image_url : "https://t3.ftcdn.net/jpg/05/03/24/40/360_F_503244059_fRjgerSXBfOYZqTpei4oqyEpQrhbpOML.jpg";
      group.value = data.product.food_groups ? data.product.food_groups.substring(data.product.food_groups.indexOf(":") + 1).replaceAll("-", " ") : data.product.food_groups;
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
  <v-card>
    <div>
      <v-img class="rounded-lg ma-3 mx-auto" width="200" height="200" :src="imageURL"></v-img>
    </div>

    <v-card-title> {{ name }} </v-card-title>
    <v-card-subtitle> {{ brand }}</v-card-subtitle>

    <v-card-text>
      <div><strong>Barcode: </strong> {{ props.item.barcode }}</div>
      <div><strong>Status: </strong> {{ props.item.status }}</div>
      <div><strong>Drop Date: </strong> {{ new Date(props.item.dropDate).toLocaleString() }}</div>
      <div><strong>Expiration Date: </strong> {{ new Date(props.item.expirationDate).toLocaleString() }}</div>
      <div><strong>Food Group:</strong> {{ group }}</div>
    </v-card-text>

    <v-card-actions> <v-btn @click="emit('editItem', props.item._id)">Edit</v-btn><v-btn color="var(--red)" @click="deleteItem">Delete</v-btn></v-card-actions>
  </v-card>
</template>
