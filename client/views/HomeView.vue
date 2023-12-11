<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { ref } from "vue";

const { currentUsername, isLoggedIn, userType } = storeToRefs(useUserStore());
const show = ref(false);
// const adapter = useDate();
// const date = "2023-11-30";
// const expirationDate = ref("");
// console.log("TYPE:", userType.value);
// const printr = (model: any) => {
//   // console.log(model);
//   // console.log(model.toString());
//   const part = model.toString();
//   const end = part.search(":");
//   expirationDate.value = part.slice(0, end - 3);
//   // console.log(expirationDate);
// };
</script>

<template>
  <main>
    <!-- {{ expirationDate }} -->

    <!-- <div class="icon-container">
      <v-icon icon="mdi-circle" color="var(--green)" class="base-icon"></v-icon>
      <v-icon icon="mdi-plus" color="white" class="overlay-icon"></v-icon>
    </div> -->
    <!-- <v-icon icon = "mdi-circle" color = "var(--green)">
      <v-icon icon = "mdi-plus" color ="var(--white)">
      
    </v-icon>
    </v-icon> -->
    <h1>Home Page</h1>

    <section>
      <h1 v-if="isLoggedIn">Welcome {{ currentUsername }}!</h1>
      <h1 v-else>Please login!</h1>
    </section>
    <v-container
    fluid
    class="text-center"
  >
    <v-row
      class="flex"
      justify="space-between"
    >
      <v-col cols="12">
        <v-btn @click="show = !show">
          What is This?
        </v-btn>
      </v-col>

      <v-col
        cols="12"
        class="mt-12"
      >
        <v-tooltip
          v-model="show"
          location="bottom"
        >
          <!-- <template v-slot:activator="{ props }">
            <v-btn
              icon
              v-bind="props"
            >Start ExpressPantry Now
              <v-icon color="grey-lighten-1">
                mdi-cart
              </v-icon>
            </v-btn>
          </template> -->
          <div v-if="userType === 'Client'">
            <span>To <strong>place an order</strong>, navigate to the <strong>Map</strong> tab and choose a pantry near you. 
              <br><br>
              <strong>Add items</strong> to/change your cart using the green add button and the red remove button. 
              <br><br>
              If there is an item you wish the pantry had, you can fill out the <strong>request form </strong> at the top of the cart using the desired item’s barcode. 
              <br><br>
              Once you have all of the items you would like, you can click the cart item at the top of the screen to view a summary of your order and select a pickup slot. Once you have selected a pickup slot, you can place the order. 
              <br><br>
              You can view <strong>placed orders and their statuses under the Orders tab</strong>, and any previously placed Requests for item restocks under the Requests tag. 
              <br><br>
              To update any personal information, open the settings tab.
          </span>

          </div>
          <div v-if="userType === 'Admin'">
            <span>
              To <strong>add items to the inventory</strong> or <strong>update existing items</strong>, <strong>navigate to the Inventory tab</strong> and use the <strong>Add Item form</strong>, or scroll down to see existing items and available actions. 
              <br><br>
              You can view <strong>unfulfilled and fulfilled orders under the Orders tab</strong>. Please note that item statuses are automatically updated when the order is marked as <strong>Packed or Picked Up</strong>. 
              <br><br>
              Users can also submit <strong>requests</strong> for items they would like the pantry to supply. You can view these requests under the Requests tab, and mark them as Accepted or Rejected, based on whether you will plan to start providing the items.
              <br><br>
              To update any <strong>pantry-specific information</strong>, such as client eligibility requirements and open hours, use the <strong>Profile tab</strong>.


          </span>

          </div>
          
        </v-tooltip>
      </v-col>
    </v-row>
  </v-container>
      <!-- <label for="aligned-expirationDate">What is the Expiration date of this food item?</label> -->

      <!-- <v-date-picker
    @update:model-value="printr"
    id="aligned-expirationDate"
    required></v-date-picker> -->
    
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
}
.icon-container {
  position: relative;
  display: inline-block; /* Ensures icons are in the same line */
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
