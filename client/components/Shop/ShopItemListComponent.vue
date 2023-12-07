Set up express pantry

<script setup lang="ts">
import ShopItemComponent from "@/components/Shop/ShopItemComponent.vue";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import { useUserStore } from "../../stores/user";
import { fetchy } from "../../utils/fetchy";

let orderableBarcodesAndQuantities = ref<Array<Record<string, string>>>([]);
const loaded = ref(false);
const { currentUsername } = storeToRefs(useUserStore());
const props = defineProps(["shop"]);
const emit = defineEmits(["openShop", "leaveShop", "refreshPantryList"]);
const order = ref<
  Array<{
    [key: string]: number;
  }>
>([]);

const setUpShop = async (shop: any) => {
  try {
    let results;
    const administrator = shop.administrator;
    const adminURL = "/api/users/" + administrator + "/items";
    try {
      results = await fetchy(adminURL, "GET");
    } catch (error) {
      console.error("There was a problem with the fetch operation in orderableBarcodesAndQuantities:", error);
    } finally {
      console.log("go to sleep");
    }

    //const results = await fetchy(adminURL, "GET");

    orderableBarcodesAndQuantities.value = results;
    console.log(results);
  } catch {
    console.log("Failure in setupShop");
    return;
  }
};
const openCart = async (item: any, number?: number) => {
  return;
};
const addToCart = async (barcode: string, number?: number) => {
  if (!number) {
    number = 1;
  }
  order.value.push({ [barcode]: number });
  //do I need to update orderable barcodes and quantities
  // try {
  //   const results = await fetchy(`/users/${props.shop.administrator}/items`, "GET");
  //   orderableBarcodesAndQuantities.value  = results;
  // } catch {
  //   return;
  // }
  // return;
};
onBeforeMount(async () => {
  await setUpShop(props.shop);
  loaded.value = true;
});
</script>

<!-- <template>
  <div class="title">Profile: {{ name }}</div>
  <div class="pure-control-group">City Location: {{ city }}</div>
  <div class="pure-control-group">Open Hours: {{ openHours }} to {{ closeHours }}</div>
  <div class="pure-control-group">Requirements: Maximum Annual Income: {{ rules }}</div>
</template> -->
<template>
  <v-layout class="rounded rounded-md bar">
    <v-app-bar class="custom-app-bar" :elevation="3" density="compact">
      <template v-slot:prepend>
        <v-icon icon="mdi-chevron-left"></v-icon>
        <v-app-bar-title absolute="false"
          >Shopping At
          <button class="default-disabled">
            <strong text-color="black">{{ props.shop.name }}</strong>
          </button></v-app-bar-title
        >
      </template>

      <template v-slot:append>
        <v-text-field clearable hide-details label="Search Inventory" prepend-inner-icon="mdi-magnify" single-line></v-text-field>

        <v-chip variant="elevated" @click="openCart">
          <strong>Cart&nbsp;&nbsp;</strong>
          <template v-slot:append>
            <v-chip size="small" color="white" variant="flat" text-color="black" class="custom-chip">
              <strong>5 items</strong>
            </v-chip>
          </template>
        </v-chip>
        <v-app-bar-nav-icon> </v-app-bar-nav-icon>
        <!-- </div> -->
      </template>
    </v-app-bar>

    <v-navigation-drawer class="custom-navigation-drawer">
      <v-list>
        <v-list-item title="Navigation drawer"></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main class="d-flex align-center justify-center" style="min-height: 300px">
      <section class="posts" v-if="loaded && orderableBarcodesAndQuantities.length !== 0">
        <article v-for="object of Object.entries(orderableBarcodesAndQuantities)" :key="object[0]">
          <ShopItemComponent :item="object[0]" @refreshShopItems="setUpShop" @addedToCart="addToCart" />
          <!-- <PostComponent v-if="editing !== post._id" :post="post" @refreshPosts="getPosts" @editPost="updateEditing" />
        <EditPostForm v-else :post="post" @refreshPosts="getPosts" @editPost="updateEditing" /> -->
        </article>
      </section>
      <p v-else-if="loaded">No posts found</p>
      <p v-else>Loading...</p>
    </v-main>
  </v-layout>
</template>
<style scoped>
.container {
  padding: 0.1em;
  font-size: small;
  font-weight: bold;
  border-radius: 8px;
  border-style: solid;
  border-width: medium;
  background: black;
  color: white;
}
.custom-app-bar {
  position: relative !important;
  top: auto !important;
  height: fit-content !important;
  padding: 0.1em !important;
}
/* .custom-navigation-drawer {
  position: sticky !important; 
  top: auto !important; 
} */

section {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 1em;
}
.side {
  list-style-type: none;
  margin-left: auto;
  display: flex;
  align-items: center;
  flex-direction: row;
  gap: 1em;
}
section,
p,
.row {
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
.profile-button {
  text-align: center;
  padding: 8px 16px;
  background-color: transparent;
  color: #007bff;
  border: 2px solid #007bff;
  border-radius: 4px;
  cursor: pointer;
  transition:
    background-color 0.3s ease-in-out,
    color 0.3s ease-in-out;
}

.profile-button:hover {
  background-color: #007bff;
  color: #fff;
}
.profile-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  text-align: center;
}

.list-title {
  font-size: 1.5em;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
}

.posts {
  display: flex;
  padding: 1em;
  flex-wrap: wrap;
}
/* .row {
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  max-width: 60em;
} */
/* Add more styling as needed */
</style>
