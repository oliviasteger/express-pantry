<script setup lang="ts">
import PantryListComponent from "@/components/Profile/PantryListComponent.vue";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import router from "../router";
import { useUserStore } from "../stores/user";
import { fetchy } from "../utils/fetchy";

const shop = ref();
const loading = ref(false);
const inShop = ref(false);
const emit = defineEmits(["sendShopProfile"]);
const { currentUsername } = storeToRefs(useUserStore());
const selectedCity = ref("");

const switchToShop = (shop_id: any) => {
  console.log(shop_id, shop_id, " in switch to shop");
  void router.push({ name: "Shop", params: { shopId: shop_id } });
};

async function getCurrentCity() {
  let user;
  try {
    user = await fetchy(`api/users/${currentUsername.value}`, "GET");
  } catch (_) {
    console.log("failed");
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
  <main class="w-screen h-screen" v-show="loading">
    <div class="column" v-show="!inShop">
      <div class="list-title">
        Food Pantries Near&ensp;
        <div class="sub-title">{{ selectedCity }}</div>
      </div>
      <hr width="100%" size=".1" id="color" noshade />
      <div class="row">
        <PantryListComponent :selectedCity="selectedCity" @openShop="switchToShop"></PantryListComponent>
      </div>
    </div>
  </main>
</template>
<style>
#center {
  display: flex;
  align-self: center;
}
.header {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}
.sub-title {
  font-weight: 300;
  margin: 0 auto;
  padding-left: 20px;
  padding-right: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
}
.list-title {
  font-size: 1.5em;
  font-weight: 600;
  display: flex;
  text-align: center;
  padding-top: 0.5em;
}
.row {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  width: 100%;
}
#color {
  color: var(--line-color);
  opacity: 25%;
  margin: auto;
}
</style>
