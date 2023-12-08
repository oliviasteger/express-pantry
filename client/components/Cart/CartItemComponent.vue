<!-- mini and full  -->

<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { defineProps, onBeforeMount, ref } from "vue"; // Import defineProps and defineEmits

const props = defineProps(["item", "quantity"]); //{ [""]: -1} key which maps to a quantity
const { currentUsername } = storeToRefs(useUserStore());
const emit = defineEmits(["addedToCart", "removeFromCart", "deleteItem"]);
const loading = ref(false);
// const emit = defineEmits(); // Use defineEmits without arguments
const deleting = ref(false); // Track if the item is being deleted

const name = ref("");
const imageURL = ref("");
const brand = ref("");
const group = ref("");

const addToCart = async (barcode: string, number?: number) => {
  //prob emit to ya ya
};
const deleteItem = async (barcode: string) => {
  emit("deleteItem", barcode);
};
const removeFromCart = (barcode: string, number?: number) => {
  //prob emit to ya ya
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
  <v-list-item :prepend-avatar="imageURL" ripple>
    <template v-slot:title>
      <div v-html="name"></div>
    </template>

    <template v-slot:subtitle>
      <div><strong>Quantity:</strong>{{ props.quantity }}</div>
    </template>
    <v-list-item-action>
            <button class="profile-button" @click="emit('removeFromCart',props.item)">Remove From Cart</button>
          </v-list-item-action>
  </v-list-item>
</template>

<style scoped>
.icon-container {
  /*position: relative;*/
  display: inline-block; /* Ensures icons are in the same line */
}
.profile-button {
  text-align: center;
  padding: 8px 16px;
  background-color: transparent;
  color: var(--red);
  border: 2px solid var(--red);
  border-radius: 4px;
  cursor: pointer;
  transition:
    background-color 0.3s ease-in-out,
    color 0.3s ease-in-out;
}

.profile-button:hover {
  background-color: var(--red);
  color: #fff;
}
.base-icon,
.overlay-icon {
  position: absolute;
  top: 0;
  left: 0;
  /* Adjust z-index if needed */
}

.overlay-icon {
  color: red; /* Change the color or styling for the overlay icon */
}
</style>
