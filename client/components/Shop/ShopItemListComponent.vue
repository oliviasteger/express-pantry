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
const emit = defineEmits(["openShop", "leaveShop","refreshPantryList"]);
const order = ref<
  Array<{
    [key: string]: number;
  }>
>([]);


const setUpShop = async (shop: any) => {
  try {
    const administrator = shop.administrator;
    console.log(administrator);
    console.log(`${shop.administrator}`);
    const adminURL = "api/users/" + administrator +"/items";
    console.log(adminURL);
    // const results = await fetchy(`api/users/${shop.adminstrator}/items`, "GET");
    const results = await fetchy(adminURL, "GET");
    console.log("I tried the request")
    orderableBarcodesAndQuantities.value  = results;
    console.log(results);

  } catch {
    console.log("Failure in setupShop")
    return;
  }
};
const openCart = async (item:any, number?:number) => {
  return;
};
const addToCart = async (barcode:string, number?:number) => {
  if (!number){
    number = 1; 
  }
  order.value.push({ [barcode]: number});
  //do I need to update orderable barcodes and quantities
  // try {
  //   const results = await fetchy(`/users/${props.shop.adminstrator}/items`, "GET");
  //   orderableBarcodesAndQuantities.value  = results;
  // } catch {
  //   return;
  // }
  // return;
};
async function getCurrentCity() {
  let user;
  try {
    user = await fetchy(`api/users/${currentUsername.value}`, "GET");
    console.log("city success")
  } catch (_) {
    console.log("city failed")
    return;
  }
  
  selectedCity.value = user.information.city;
}
onBeforeMount(async () => {
    await getCurrentCity(); 
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
  <v-row justify="start">
    <v-col>
    Shopping At 
  </v-col>
  <v-col>
    <button class="default-disabled"> Sally's Food Pantry</button>
  </v-col>
  
</v-row>
<v-row justify="end">
    <v-col>
    <!-- <SearchShopForm @getItemsByFilter="getOrderable" /> -->
  </v-col>
  <div class="container" @click="openCart">

            <v-col>Cart</v-col>
            <v-col cols="2"><v-icon icon = "mdi-circle" color = "white" size= "10px" class="base-icon"></v-icon></v-col>
            <!-- need to get # of items in cart -->

          
        </div>

  
</v-row>
      <ul>
        <li>
          
        </li>
  
        <li>
          
          
        </li>

      </ul>
    
    <div class="row">
      
    </div>
    <section class="posts" v-if="loaded && orderableBarcodesAndQuantities.length !== 0">
      <article v-for="(object, index) of Object.entries(orderableBarcodesAndQuantities)" :key="object.key">
          <ShopItemComponent :item="object[0]" @refreshShopItems="setUpShop" :index="index" @addedToCart="addToCart"/>
        <!-- <PostComponent v-if="editing !== post._id" :post="post" @refreshPosts="getPosts" @editPost="updateEditing" />
        <EditPostForm v-else :post="post" @refreshPosts="getPosts" @editPost="updateEditing" /> -->
      </article>
    </section>
    <p v-else-if="loaded">No posts found</p>
    <p v-else>Loading...</p>
    
    <hr class = "line-full">
    <div class="list-title">Food Pantries Located in {{ selectedCity }}</div>
    <!-- <div class="list-container" v-if = "profiles.length !== 0">
        <button class="profile-button" v-for="profile,index in profiles" :key="profile._id" @click="emit('openShop', profile._id)">
            <h3>{{ profile.name }}</h3>
        </button>
        
    </div> -->
  
</template>
<style scoped>
.container{
  padding: .1em;
  font-size: small;
  font-weight: bold;
  border-radius: 8px;
  border-style: solid;
  border-width: medium;
  background: black;
  color:white;
}



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
