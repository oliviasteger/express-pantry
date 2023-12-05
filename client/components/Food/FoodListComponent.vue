<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import CreateFoodForm from "./CreateFoodForm.vue";
import FoodComponent from "./FoodComponent.vue";

const { isLoggedIn } = storeToRefs(useUserStore());

const loaded = ref(false);
let items = ref<Array<Record<string, string>>>([]);
let editing = ref("");

async function getItems() {
  let postResults;
  try {
    postResults = await fetchy("/api/items", "GET");
  } catch (_) {
    return;
  }
  items.value = postResults;
}

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
    <h2>Add an Item:</h2>
    <CreateFoodForm @refreshPosts="getItems" />
  </section>
  <!-- <div class="row">
    <h2 v-if="!searchAuthor">Posts:</h2>
    <h2 v-else>Posts by {{ searchAuthor }}:</h2>
    <SearchPostForm @getPostsByAuthor="getPosts" />
  </div> -->
  <section class="posts" v-if="loaded && items.length !== 0">
    <h2>Inventory</h2>
    <article v-for="item in items" :key="item._id">
      <FoodComponent v-if="editing !== item._id" :item="item" @refreshPosts="getItems" @editPost="updateEditing" />
      <!-- <EditPostForm v-else :post="post" @refreshPosts="getPosts" @editPost="updateEditing" /> -->
    </article>
  </section>
  <p v-else-if="loaded">No posts found</p>
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
