<!-- mini and full  -->

<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { defineProps, onBeforeMount, ref } from "vue"; // Import defineProps and defineEmits
import { fetchy } from "../../utils/fetchy";

const props = defineProps(["item"]);
const { currentUsername } = storeToRefs(useUserStore());
const emit = defineEmits(["editItem", "refreshShopItems"]);
const loading = ref(false);
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
  emit("refreshShopItems");
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
      // Process the response data here
      //   let name = data.product.generic_name;
      //   let brand = data.product.brand_owner;
      //   let url = data.product.image_url;
      //   let group = data.product.food_groups;
      //   console.log("food name: ", name);
      //   console.log("food brand: ", brand);
      //   console.log("food image URL: ", url);
      //   console.log("food group: ", group);

      name.value = data.product.generic_name_en;
      brand.value = data.product.brands;
      imageURL.value = data.product.image_url;
      group.value = data.product.food_groups;

      console.log("food name: ", name);
      console.log("food brand: ", brand);
      console.log("DATA", data);
      emit("refreshShopItems");
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
  loading.value = true;
});
</script>

<template>
  
    <v-col> <strong>Barcode:</strong> {{ props.item.barcode }} </v-col>
    <v-col> <strong>Status:</strong> {{ props.item.status }} </v-col>
    <v-col> <strong>Expiration Date:</strong> {{ new Date(props.item.expirationDate).toLocaleString() }} </v-col>
    <v-col> <strong>Drop Date:</strong> {{ new Date(props.item.dropDate).toLocaleString() }} </v-col>
    
    <v-col> <strong>Brand:</strong> {{ brand }} </v-col>
    <v-col>
        <v-img
        aspect-ratio="1/1"
        cover
        :src="imageURL"
        ></v-img>
        <v-row> {{ name }} </v-row>
    </v-col>
    <v-col> <strong>Food Group:</strong> {{ group }} </v-col>

    <v-col>
      <v-btn class="button-error btn-small" @click="deleteItem">Delete</v-btn>
      <v-btn class="btn-small" @click="emit('editItem', props.item._id)">Edit</v-btn>
    </v-col>
</template>
