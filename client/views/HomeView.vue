<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

const { currentUsername, isLoggedIn, userType } = storeToRefs(useUserStore());

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
    <div class="pure-control-group">
      <!-- <label for="aligned-expirationDate">What is the Expiration date of this food item?</label> -->

      <!-- <v-date-picker
    @update:model-value="printr"
    id="aligned-expirationDate"
    required></v-date-picker> -->
    </div>
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
