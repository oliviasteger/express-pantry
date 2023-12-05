<!-- <script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const barcode = ref("");
const dropDate = ref("");
const expirationDate = ref("");
const status = ref("");

import { createVuetify } from "vuetify";
import "vuetify/dist/vuetify.min.css";
const vuetify = createVuetify();

//1. add barcode
//2. fetch the food info from the api
//3. add food item to inventory
//at one point it will be helpful to change the drop date to be inputted using the calendar API

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
  } catch {
    //not sure
  }
};

// onBeforeMount(async () => {
//   await getProfile();
// });
</script>

<template>
  <form class="pure-form pure-form-aligned" @submit.prevent="addFoodItem">
    <h3>Add Food Item</h3>
    <fieldset>
      <div class="pure-control-group">
        <label for="aligned-barcode">Input the barcode of the food item</label>
        <input v-model.trim="barcode" type="text" id="aligned-barcode" placeholder="barcode" required />
      </div>
      <div class="pure-control-group">
        <label for="aligned-dropDate">Choose the drop date of this food item</label>
        <v-date-picker v-model="dropDate" id="aligned-dropDate" required></v-date-picker>
      </div>
      <div class="pure-control-group">
        <label for="aligned-expirationDate">What is the Expiration date of this food item?</label>
        <v-date-picker v-model="expirationDate" id="aligned-expirationDate" required></v-date-picker>
      </div>

      <div class="pure-control-group">
        <label for="aligned-status">Choose the status of this food item</label>
        <select v-model="status" id="aligned-status" required>
          <option value="" disabled>Select Status</option>
          <option value="Unreleased">Unreleased</option>
          <option value="Claimable">Claimable</option>
          <option value="Ordered">Ordered</option>
          <option value="Used">Used</option>
          <option value="Expired">Expired</option>
        </select>
      </div>

      <br />
      <div class="pure-controls">
        <button type="submit" class="pure-button pure-button-primary">Add Item</button>
      </div>
    </fieldset>
  </form>
</template> -->

<script setup lang="ts">
import { ref } from "vue";
import { createVuetify } from "vuetify";
import "vuetify/dist/vuetify.min.css";
import { fetchy } from "../../utils/fetchy";

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
        <!-- 
        <v-row>
          <v-col>
            <v-date-picker v-model="dropDate" label="Choose the drop date of this food item" required></v-date-picker>
          </v-col>
        </v-row>

        

        <v-row>
          <v-col>
            <v-date-picker v-model="expirationDate" @input="dateMenu = false" :min=new Date() :show-current="true"></v-date-picker>
          </v-col>
        </v-row> -->

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
