Set up express pantry


<script setup lang="ts">
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import { useUserStore } from "../../stores/user";
import { fetchy } from "../../utils/fetchy";
import ShopItemComponent from "./ShopItemComponent.vue";

const selectedCity = ref("");
const name = ref("");
let orderableBarcodesAndQuantities = ref<Array<Record<string, string>>>([]);
const loaded = ref(false);
const openHours = ref("");
const closeHours = ref("");
const rules = ref("");
const { currentUsername } = storeToRefs(useUserStore());
const props = defineProps(["shop"]);
const emit = defineEmits(["openShop", "refreshPantryList"]);


const setUpShop = async () => {
  try {
    const results = await fetchy(`/users/${props.shop.adminstrator}/items`, "GET");
    orderableBarcodesAndQuantities.value  = results;
  } catch {
    return;
  }
};
const addToCart = async (barcode:string, quantity:number) => {
  // to do 
  return;
};
async function getCurrentCity() {
  let user;
  try {
    user = await fetchy(`api/users/${currentUsername.value}`, "GET");
  } catch (_) {
    console.log("failed")
    return;
  }
  
  selectedCity.value = user.information.city;
}
onBeforeMount(async () => {
    await getCurrentCity(); 
    await setUpShop();
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
    <div class="row">
      
    </div>
    <section class="posts" v-if="loaded && orderableBarcodesAndQuantities.length !== 0">
      <article v-for="(object,index) in orderableBarcodesAndQuantities" :key="object.key">
          <ShopItemComponent :item="object" @refreshShopItems="setUpShop" :index="index" @addedToCart="addToCart"/>
        <!-- <PostComponent v-if="editing !== post._id" :post="post" @refreshPosts="getPosts" @editPost="updateEditing" />
        <EditPostForm v-else :post="post" @refreshPosts="getPosts" @editPost="updateEditing" /> -->
      </article>
    </section>
    <p v-else-if="loaded">No posts found</p>
    <p v-else>Loading...</p>
    <div class = "row">Shopping At <button class="default-disabled"> Sally's Food Pantry</button>
      <ul>
        <li>
          <!-- <SearchShopForm @getItemsByFilter="getOrderable" /> -->
        </li>
        <li>
          <div class="container">
            
            <h3>Cart</h3>
            <!-- need to get # of items in cart -->
          </div>
          
        </li>

      </ul>
    </div>
    <hr class = "line-full">
    <div class="list-title">Food Pantries Located in {{ selectedCity }}</div>
    <!-- <div class="list-container" v-if = "profiles.length !== 0">
        <button class="profile-button" v-for="profile,index in profiles" :key="profile._id" @click="emit('openShop', profile._id)">
            <h3>{{ profile.name }}</h3>
        </button>
        
    </div> -->
  
</template>
<style scoped>




section {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 1em;
}
.side{
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

/* Add more styling as needed */
</style>
