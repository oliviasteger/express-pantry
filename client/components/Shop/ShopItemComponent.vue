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

// const deleteItem = async () => {
//   if (deleting.value) return; // Prevent multiple delete requests
//   deleting.value = true;

//   try {
//     await fetchy(`/api/items/${props.item._id}`, "DELETE");
//   } catch (error) {
//     console.error("Error deleting item:", error);
//   } finally {
//     deleting.value = false;
//   }
//   emit("refreshShopItems");
// };
const viewItem = () => {
  if (viewing.value) return; // Prevent multiple view requests
  viewing.value = true;
  emit("refreshShopItems");
  emit("maximizeItem", props.item);
};
const getName = async (barcode: string) => {
  console.log("barcode: ", barcode);
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
      //   emit("refreshShopItems");
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
  <v-card elevation="3" height="300px">
    <!-- <v-col> <strong>Barcode:</strong> {{ props.item.barcode }} </v-col>
    <v-col> <strong>Status:</strong> {{ props.item.status }} </v-col>
    <v-col> <strong>Expiration Date:</strong> {{ new Date(props.item.expirationDate).toLocaleString() }} </v-col>
    <v-col> <strong>Drop Date:</strong> {{ new Date(props.item.dropDate).toLocaleString() }} </v-col>
             -->

    <v-img aspect-ratio="1/1" height="200" width="200" :src="imageURL"></v-img>
    <v-row>
      <v-card-title class="text-h6">
        <v-row justify="space-between">
          <v-col> {{ name }} </v-col>
          <v-col>
            <div position="relative" class="icon-container" @click="emit('addedToCart', props.item)">
              <v-icon icon="mdi-circle" color="var(--green)" class="base-left-icon"></v-icon>
              <v-icon icon="mdi-plus" color="white" class="overlay-left-icon"></v-icon>
            </div>
          </v-col>
          <v-col>
            <div class="icon-container" @click="emit('removeFromCart', props.item)">
              <v-icon icon="mdi-circle" color="var(--red)" class="base-right-icon"></v-icon>
              <v-icon icon="mdi-minus" color="white" class="overlay-right-icon"></v-icon>
            </div>
          </v-col>
        </v-row>
      </v-card-title>

      <v-col>
        <!-- <v-btn class="button-error btn-small" @click="deleteItem">Delete</v-btn> -->
        <v-btn class="default btn-small" @click="viewItem">View</v-btn>
      </v-col>
    </v-row>
  </v-card>
</template>

<style scoped>
.icon-container {
  /*position: relative;*/
  display: inline-block; /* Ensures icons are in the same line */
}

.base-left-icon {
  position: absolute;
  top: 0;
  left: 0;
}
.base-right-icon {
  position: absolute;
  top: 0;
  right: 0;
}
.overlay-left-icon {
  position: absolute;
  top: 0;
  left: 0;

  /* Adjust z-index if needed */
}
.overlay-right-icon {
  position: absolute;
  top: 0;
  right: 0;

  /* Adjust z-index if needed */
}

.overlay-icon {
  color: red; /* Change the color or styling for the overlay icon */
}
</style>
