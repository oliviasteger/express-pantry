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
      name.value = data.product.generic_name_en ? data.product.generic_name_en : "No name available";
      brand.value = data.product.brands ? data.product.brands.toString().replaceAll(",", ", ") : "No brand available";
      imageURL.value = data.product.image_url ? data.product.image_url : "https://t3.ftcdn.net/jpg/05/03/24/40/360_F_503244059_fRjgerSXBfOYZqTpei4oqyEpQrhbpOML.jpg";
      group.value = data.product.food_groups ? data.product.food_groups.substring(data.product.food_groups.indexOf(":") + 1).replaceAll("-", " ") : data.product.food_groups;

      emit("refreshRequests");
    })
    .catch((error) => {
      // Handle any errors here
      console.error(error); // Example: Logging the error to the console
    });
};

const getRelatedAccounts = async (request: { requestee: string; requester: string }, userType: "Client" | "Administrator") => {
  try {
    requestee.value = (await fetchy(`/api/profiles/admin/${request.requestee}`, "GET"))[0].name;
  } catch (e) {
    console.log("Error fetching requestee profile: ", e);
  }
  try {
    requester.value = (await fetchy(`/api/users/id/${request.requester}`, "GET")).username;
  } catch (e) {
    console.log("Error fetching requester profile: ", e);
  }
};

onBeforeMount(async () => {
  await getItemInfo(props.request.barcode);
  await getRelatedAccounts(props.request, props.userType);
  loaded.value = true;
});
</script>
<template>
  <v-card v-if="loaded">
    <v-img></v-img>
    <v-card-item>
      <v-card-title>Request from {{ requester }} to {{ requestee }}</v-card-title>
      <v-chip class="mt-2" tonal :color="$props.request.status == 'Accepted' ? 'var(--green)' : $props.request.status == 'Pending' ? 'var(--muted-blue)' : 'var(--light-red)'"
        >Request {{ props.request.status.toLowerCase() }}</v-chip
      >
    </v-card-item>
    <v-card-item>
      <v-list>
        <v-list-item :prepend-avatar="imageURL" :title="name + ' - ' + brand" :subtitle="'Barcode: ' + props.request.barcode"></v-list-item>
      </v-list>
    </v-card-item>
    <v-card-actions>
      <v-btn v-if="userType === 'Client'" color="var(--red)" @click="deleteRequest">Delete</v-btn>
      <v-btn @click="emit('editRequest', props.request._id)">Edit</v-btn>
    </v-card-actions>
  </v-card>
</template>

<style scoped>
.v-container {
  height: fit-content;
}
</style>
