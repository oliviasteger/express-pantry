<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";
const props = defineProps(["requestee"]);
const barcode = ref("");

const createRequest = async () => {
  console.log(props.requestee);
  try {
    await fetchy("/api/requests", "POST", {
      body: {
        barcode: barcode.value,
        requestee: props.requestee,
      },
    });
  } catch (error) {
    console.error("Error creating request:", error);
  }
};
</script>
<template>
  <v-app>
    <v-container>
      <v-form @submit.prevent="createRequest">
        <h3>Request a food item</h3>
        <v-row>
          <v-col>
            <v-text-field v-model.trim="barcode" label="Food item barcode" required></v-text-field>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-btn type="submit" color="primary">Request item</v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-container>
  </v-app>
</template>
