<!-- mini and full  -->

<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { defineProps, onBeforeMount, ref } from "vue"; // Import defineProps and defineEmits

const props = defineProps(["item"]); //{ [""]: -1} key which maps to a quantity
const { currentUsername } = storeToRefs(useUserStore());
const emit = defineEmits(["addedToCart", "removeFromCart", "refreshShopItems", "maximizeItem"]);
const loading = ref(false);
// const emit = defineEmits(); // Use defineEmits without arguments
const deleting = ref(false); // Track if the item is being deleted
const viewing = ref(false); // Track if the item is being deleted
const name = ref("");
const imageURL = ref("");
const brand = ref("");
const group = ref("");
const allergens = ref("");
const labels = ref("");
const show = ref(false);

const viewItem = () => {
  if (viewing.value) return; // Prevent multiple view requests
  viewing.value = true;
  emit("refreshShopItems");
  emit("maximizeItem", props.item);
};
const getName = async (barcode: string) => {
  const barcodeNew = barcode;
  fetch("https://world.openfoodfacts.org/api/v2/product/" + barcodeNew + ".json")
    .then((response) => {
      if (response.ok) {
        return response.json(); // Parse the response data as JSON
      } else {
        throw new Error("API request failed");
      }
    })
    .then((data) => {
      // Process the response data here
      name.value = data.product.generic_name_en ? data.product.generic_name_en : "No name available";
      brand.value = data.product.brands ? data.product.brands.toString().replaceAll(",", ", ") : "No brand available";
      imageURL.value = data.product.image_url ? data.product.image_url : "https://t3.ftcdn.net/jpg/05/03/24/40/360_F_503244059_fRjgerSXBfOYZqTpei4oqyEpQrhbpOML.jpg";
      group.value = data.product.food_groups ? data.product.food_groups.substring(data.product.food_groups.indexOf(":") + 1).replaceAll("-", " ") : "No food groups available";
      allergens.value = data.product.allergens ? data.product.allergens.replaceAll("en:", "").replaceAll(",", ", ") : "No allergen information available";
      labels.value = data.product.ingredients_analysis_tags
        ? data.product.ingredients_analysis_tags.toString().replaceAll("en:", "").replaceAll(",", ", ").replaceAll("-", " ")
        : "No additional information available";
    })
    .catch((error) => {
      // Handle any errors here
      console.error(error); // Example: Logging the error to the console
    });
};

onBeforeMount(async () => {
  try {
    await getName(props.item);
  } catch {
    // User is not logged in
  }
  loading.value = true;
});
</script>

<template>
  <v-card elevation="3" max-width="320">
    <center>
      <v-img class="rounded-lg ma-3" width="200" height="200" :src="imageURL"></v-img>
    </center>

    <v-card-item>
      <v-card-title>{{ name }}</v-card-title>
      <v-card-subtitle> {{ brand }}</v-card-subtitle>
    </v-card-item>

    <v-card-actions>
      <v-btn @click="emit('addedToCart', props.item)" color="var(--green)">Add to cart</v-btn>
      <v-btn @click="emit('removeFromCart', props.item)" color="var(--red)">Remove from cart</v-btn>
    </v-card-actions>

    <v-card-actions>
      <v-btn>More information</v-btn>

      <v-spacer></v-spacer>

      <v-btn :icon="show ? 'mdi-chevron-up' : 'mdi-chevron-down'" @click="show = !show"></v-btn>
    </v-card-actions>

    <v-expand-transition>
      <div v-show="show">
        <v-divider></v-divider>

        <v-card-text>
          <div><strong>Allergens:</strong> {{ allergens }} <br /></div>
          <div><strong>Labels and certifications:</strong> {{ labels }}</div>
        </v-card-text>
      </div>
    </v-expand-transition>
  </v-card>
</template>
