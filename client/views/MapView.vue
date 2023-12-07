<script setup lang="ts">

import MapComponent from "@/components/Map/MapComponent.vue";
import MyMarker from "@/components/Map/MyMarker.vue";
import PantryListComponent from "@/components/Profile/PantryListComponent.vue";
import ShopItemListComponent from "@/components/Shop/ShopItemListComponent.vue";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import { useUserStore } from "../stores/user";
import { fetchy } from "../utils/fetchy";

const shop = ref();
const loading = ref(false);
const inShop = ref(false);
const { currentUsername } = storeToRefs(useUserStore());
const selectedCity = ref("");
const switchToShop = (shop_profile:any) => {
  shop.value = shop_profile;
  inShop.value = true; 
};
const switchFromShop = () => {
  shop.value = null;
  inShop.value = false; 
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
    loading.value = true;
    
});

</script>

<template>
  <main class="w-screen h-screen" v-show = "loading">
    <div class ="column" v-show = "!inShop">
      <div class="list-title">Food Pantries Near&ensp;  <div class="sub-title">{{ selectedCity }}</div></div>  
      <hr width="100%" size=".1" id = "color" noshade>
      <div class ="row">
        <PantryListComponent :selectedCity="selectedCity" @openShop="switchToShop"></PantryListComponent>
        <MapComponent>
          <MyMarker />
        </MapComponent>
      </div>
    </div>
    <div v-if="inShop">
      <ShopItemListComponent :shop="shop" @leaveShop="switchFromShop"></ShopItemListComponent>
    </div>
    
    
  </main>
</template>
<style>
#center {
  display: flex;
  align-self: center;
}
.header{
  width: 100%;
  display:flex;
  flex-direction:row;
  align-items:center;
  justify-content: space-between;
  
}
.sub-title {
  font-weight: 300;
  margin: 0 auto;
  padding-left: 20px;
  padding-right:20px;
  border: 1px solid #ccc;
  border-radius: 8px;
}
.list-title {
  font-size: 1.5em;
  font-weight: 600;
  display:flex;
  text-align: center;
  padding-top:.5em;
}
.row{
  display:flex;
  flex-direction: row;
  justify-content: space-evenly;
  width: 100%;
}
#color{
  color: var(--line-color);
  opacity: 25%;
  margin:auto;
}
</style>
