<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { defineProps, onBeforeMount, ref } from "vue"; // Import defineProps and defineEmits
import { fetchy } from "../../utils/fetchy";

const props = defineProps(["item"]);
const { currentUsername } = storeToRefs(useUserStore());
const emit = defineEmits(["editItem", "refreshItems"]);

// const emit = defineEmits(); // Use defineEmits without arguments
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
      name.value = data.product.generic_name_en;
      brand.value = data.product.brands;
      imageURL.value = data.product.image_url;
      group.value = data.product.food_groups ? data.product.food_groups.substring(data.product.food_groups.indexOf(":") + 1).replaceAll("-", " ") : data.product.food_groups;

      console.log("food name: ", name);
      console.log("food brand: ", brand);
      console.log("DATA", data);
      emit("refreshItems");
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

    <v-col>
      <v-btn class="button-error btn-small" @click="deleteItem">Delete</v-btn>
      <v-btn class="btn-small" @click="emit('editItem', props.item._id)">Edit</v-btn>
    </v-col>
  </v-row>
</template>
