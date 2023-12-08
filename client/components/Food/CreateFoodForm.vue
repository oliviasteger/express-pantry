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
  <v-app>
    <v-container>
      <v-form @submit.prevent="addFoodItem">
        <h3>Add Food Item</h3>
        <v-row>
          <v-col>
            <v-text-field v-model.trim="barcode" label="Input the barcode of the food item" required></v-text-field>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <!-- Use native date input for expiration date -->
            <label for="expirationDate">Expiration Date:</label>
            <input v-model.trim="expirationDate" type="date" id="expirationDate" required />
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <!-- Use native date input for expiration date -->
            <label for="dropDate">Drop Date For Item:</label>
            <input v-model.trim="dropDate" type="date" id="dropDate" required />
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-select v-model="status" :items="['Unreleased', 'Claimable', 'Ordered', 'Used', 'Expired']" label="Choose the status of this food item" required></v-select>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-btn type="submit" color="primary">Add Item</v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-container>
  </v-app>
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
