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
  <section class="posts" v-if="loaded && items.length !== 0">
    <h2>Inventory</h2>
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
  flex-direction: column;
  gap: 1em;
}

section,
p,
.row {
  margin: 0 auto;
  max-width: 60em;
}

article {
  background-color: var(--base-bg);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
}

.posts {
  padding: 1em;
}

.row {
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  max-width: 60em;
}
</style>
