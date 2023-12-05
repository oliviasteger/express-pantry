<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import { useDate } from 'vuetify';

const { currentUsername, isLoggedIn, userType } = storeToRefs(useUserStore());


const adapter = useDate();
const date = '2023-11-30'
const expirationDate = ref("");
// console.log("TYPE:", userType.value);
const printr = (model:any) => {
  // console.log(model);
  // console.log(model.toString());
  const part = model.toString();
  const end = part.search(":");
  expirationDate.value = part.slice(0,end-3);
  // console.log(expirationDate);
};
</script>

<template>
  <main>
    {{ expirationDate }}
    <h1>Home Page</h1>
    <section>
      <h1 v-if="isLoggedIn">Welcome {{ currentUsername }}!</h1>
      <h1 v-else>Please login!</h1>
    </section>
    <div
    class="pure-control-group">

    <label
    for="aligned-expirationDate">What is the Expiration date of this food item?</label>

    <v-date-picker
    @update:model-value="printr"
    id="aligned-expirationDate"
    required></v-date-picker>

    </div>

  </main>
</template>

<style scoped>
h1 {
  text-align: center;
}
</style>
