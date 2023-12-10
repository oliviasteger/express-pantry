<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const emit = defineEmits(["editRequest", "refreshRequests"]);
const props = defineProps(["request", "userType"]);
const loaded = ref(false);
const deleted = ref(false);
const name = ref("");
const imageURL = ref("");
const brand = ref("");
const group = ref("");
const requester = ref("");
const requestee = ref("");

const deleteRequest = async () => {
  if (deleted.value) {
    return;
  }
  deleted.value = false;

  try {
    await fetchy(`/api/requests/${props.request._id}`, "DELETE");
  } catch (error) {
    console.error("Error deleting item:", error);
  } finally {
    deleted.value = false;
  }

  emit("refreshRequests");
};

const getItemInfo = async (barcode: string) => {
  fetch("https://world.openfoodfacts.org/api/v2/product/" + barcode + ".json")
    .then((response) => {
      if (response.ok) {
        return response.json(); // Parse the response data as JSON
      } else {
        throw new Error("API request failed");
      }
    })
    .then((data) => {
      name.value = data.product.generic_name_en;
      brand.value = data.product.brands;
      imageURL.value = data.product.image_url;
      group.value = data.product.food_groups;

      emit("refreshRequests");
    })
    .catch((error) => {
      // Handle any errors here
      console.error(error); // Example: Logging the error to the console
    });
};

const getRelatedAccounts = async (request: { requestee: string; requester: string }, userType: "Client" | "Administrator") => {
  if (userType == "Client") {
    try {
      requestee.value = (await fetchy(`/api/users/id/${request.requestee}`, "GET")).username;
    } catch (e) {
      console.log("Error fetching requestee profile: ", e);
    }
  } else {
    try {
      requester.value = (await fetchy(`/api/users/id/${request.requester}`, "GET")).username;
    } catch (e) {
      console.log("Error fetching requester profile: ", e);
    }
  }
};

onBeforeMount(async () => {
  await getItemInfo(props.request.barcode);
  await getRelatedAccounts(props.request, props.userType);
  loaded.value = true;
});
</script>
<template>
  <v-container v-if="loaded">
    <v-row>
      <v-col> <strong>Barcode:</strong> {{ props.request.barcode }} </v-col>
      <v-col v-if="userType === 'Administrator'"><strong>Requester:</strong> {{ requester }} </v-col>
      <v-col v-if="userType === 'Client'"><strong>Pantry:</strong> {{ requestee }} </v-col>
      <v-col> <strong>Status:</strong> {{ props.request.status }} </v-col>
      <v-col> <strong>Name:</strong> {{ name }} </v-col>
      <v-col> <strong>Brand:</strong> {{ brand }} </v-col>
      <v-col>
        <img :src="imageURL" alt="Input ImageURL" class="image" width="100" height="100" />
      </v-col>
      <v-col> <strong>Food Group:</strong> {{ group }} </v-col>

      <v-col>
        <v-btn v-if="userType === 'Client'" class="button-error btn-small" @click="deleteRequest">Delete</v-btn>
        <v-btn class="btn-small" @click="emit('editRequest', props.request._id)">Edit</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.v-container {
  height: fit-content;
}
</style>
