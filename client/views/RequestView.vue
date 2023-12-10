<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import EditRequestForm from "../components/Request/EditRequestForm.vue";
import RequestComponent from "../components/Request/RequestComponent.vue";
import { fetchy } from "../utils/fetchy";
const { isLoggedIn } = storeToRefs(useUserStore());
const requests = ref<{ _id: string; barcode: string; requester: string; requestee: string; status: "Pending" | "Accepted" | "Rejected" }[]>([]);
const loaded = ref(false);
const editing = ref("");
const userStore = useUserStore();

const getRequests = async () => {
  try {
    requests.value = await fetchy("/api/requests", "GET");
  } catch (e) {
    console.log("Error fetching requests: ", e);
  }
};

const cancelEditing = () => {
  editing.value = "";
};

function updateEditing(id: string) {
  editing.value = id;
}

onBeforeMount(async () => {
  await getRequests();
  loaded.value = true;
});
</script>

<template>
  <main v-if="isLoggedIn && loaded">
    <h1>Requests</h1>

    <article v-for="request in requests" v-bind:key="request.barcode">
      <RequestComponent v-if="editing !== request._id" :request="request" :userType="userStore.userType" @refreshRequests="getRequests" @editRequest="updateEditing"></RequestComponent>
      <EditRequestForm v-else :request="request" :userType="userStore.userType" @refreshRequests="getRequests" @editRequest="updateEditing" @cancelEdit="cancelEditing"></EditRequestForm>
    </article>
  </main>
</template>
