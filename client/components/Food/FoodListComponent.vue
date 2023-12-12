<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import CreateFoodForm from "./CreateFoodForm.vue";
import EditFoodForm from "./EditFoodForm.vue";
import FoodComponent from "./FoodComponent.vue";

const { isLoggedIn } = storeToRefs(useUserStore());

const loaded = ref(false);
let items = ref<Array<Record<string, string>>>([]);
let editing = ref("");

async function getItems() {
  let itemResults;
  try {
    itemResults = await fetchy("/api/items", "GET");
  } catch (_) {
    return;
  }
  items.value = itemResults;
}

const cancelEditing = () => {
  editing.value = ""; // Set editing to an empty string to cancel editing
};

function updateEditing(id: string) {
  editing.value = id;
}

onBeforeMount(async () => {
  await getItems();
  loaded.value = true;
});
</script>

<template>
  <section v-if="isLoggedIn">
    <CreateFoodForm @refreshItems="getItems" />
  </section>
  <h2 style="text-align: center">Inventory</h2>
  <section class="posts" v-if="loaded && items.length !== 0">
    <article v-for="item in items" :key="item._id">
      <FoodComponent v-if="editing !== item._id" :item="item" @refreshItems="getItems" @editItem="updateEditing" />
      <EditFoodForm v-else :item="item" @refreshItems="getItems" @editItem="updateEditing" @cancelEdit="cancelEditing" />
    </article>
  </section>
  <p v-else-if="loaded">No Items found</p>
  <p v-else>Loading...</p>
</template>

<style scoped>
section {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 1em;
}
section,
p {
  margin: 0 auto;
  max-width: 100%;
  justify-content: center;
  display: flex;
  align-items: center;
  flex-direction: row;
  gap: 1em;
}

article {
  background-color: #ffffff;
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
}
.posts {
  display: flex;
  padding: 1em;
  flex-wrap: wrap;
}
</style>
