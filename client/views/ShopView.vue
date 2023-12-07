<script setup lang="ts">

import ShopItemListComponent from "@/components/Shop/ShopItemListComponent.vue";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import { useRoute } from "vue-router";
import { useUserStore } from "../stores/user";
import { fetchy } from "../utils/fetchy";

const shop = ref();
const shopId = ref();
const loading = ref(false);
const { currentUsername } = storeToRefs(useUserStore());

async function getProfileById(_id:any) {
  let profile;
  try {
    profile = await fetchy(`/api/profiles/id/${_id}`, "GET");
    console.log(profile, "in get ProfileById");
  } catch (_) {
    console.log("failed")
    return;
  }
  shop.value = profile;
};
const switchFromShop = () => {
  shop.value = null;

};

onBeforeMount(async () => {
    const route = useRoute();
    console.log(route.params.shopId, "this is shopId");
    shopId.value = route.params.shopId;
     // Access route parameter 'id'
      if (route.params.shopId) {
        console.log("in onBeforeMount in ShopView");
      } else {
        console.log("route parameter wasn't passed correctly");
       
      }
    await getProfileById(route.params.shopId);
    loading.value = true;
    
    
});

</script>

<template>
  <main class="w-screen h-screen" v-show = "loading">
    
    <ShopItemListComponent :shop="shop" @leaveShop="switchFromShop"></ShopItemListComponent>
    
    
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
