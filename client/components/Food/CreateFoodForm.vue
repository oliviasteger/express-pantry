<script setup lang="ts">
import { ref } from "vue";
import { createVuetify } from "vuetify";
import "vuetify/dist/vuetify.min.css";
import { fetchy } from "../../utils/fetchy";
const emit = defineEmits(["editItem", "refreshItems"]);
const barcode = ref("");
const dropDate = ref("");
const expirationDate = ref("");
const status = ref("");

const vuetify = createVuetify();

const addFoodItem = async () => {
  try {
    await fetchy("api/items", "POST", {
      body: {
        barcode: barcode.value,
        dropDate: dropDate.value,
        expirationDate: expirationDate.value,
        status: status.value,
      },
    });
    emit("refreshItems");
  } catch (error) {
    console.error("Error adding food item:", error);
  }
};
</script>

<template>
  <v-card min-width="600px" class="ma-5">
    <v-card-title>Add inventory item</v-card-title>
    <v-card-item>
      <v-form @submit.prevent="addFoodItem">
        <v-container>
          <v-text-field v-model.trim="barcode" label="Food item barcode" required></v-text-field>
        </v-container>

        <!-- Use native date input for expiration date -->
        <v-container>
          <label for="expirationDate">Expiration Date: &nbsp;</label>
          <input v-model.trim="expirationDate" type="date" id="expirationDate" required />
        </v-container>

        <!-- Use native date input for expiration date -->
        <v-container>
          <label for="dropDate">Drop/Release Date: &nbsp;</label>
          <input v-model.trim="dropDate" type="date" id="dropDate" required />
        </v-container>

        <v-container>
          <v-select v-model="status" :items="['Unreleased', 'Claimable', 'Ordered', 'Used', 'Expired']" label="Food item status" required></v-select>
        </v-container>

        <div class="d-flex flex-column">
          <v-btn type="submit" color="primary">Add Item</v-btn>
        </div>
      </v-form>
    </v-card-item>
  </v-card>
</template>

<style>
#dropDate,
#expirationDate {
  background-color: #f5f5f5;
  color: black;
  padding: 4px;
  border-radius: 2px;
  border-bottom: 1px solid #bdbdbd;
}
</style>
