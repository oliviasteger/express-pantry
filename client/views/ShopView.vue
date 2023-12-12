<script setup lang="ts">
import ShopItemListComponent from "@/components/Shop/ShopItemListComponent.vue";
import { onBeforeMount, ref } from "vue";
import { useRoute } from "vue-router";
import router from "../router";
import { fetchy } from "../utils/fetchy";
const props = defineProps(["order"]);
const hasOrder = ref(false);
const shop = ref();
const shopId = ref();
const order = ref<Array<string>>([]);
const loading = ref(false);

async function getProfileById(_id: any) {
  let profile;
  try {
    profile = await fetchy(`/api/profiles/id/${_id}`, "GET");
  } catch (_) {
    console.log("failed");
    return;
  }
  shop.value = profile;
}
const switchToMap = () => {
  shop.value = null;
  void router.push({ name: "Map" });
};
const switchToCart = (order: Array<string>) => {
  void router.push({ name: "Cart", params: { shopId: shopId.value }, query: { order: JSON.stringify(order) } });
};

onBeforeMount(async () => {
  const route = useRoute();
  shopId.value = route.params.shopId;
  // Access route parameter 'id'
  if (route.params.shopId) {
    console.log("in onBeforeMount in ShopView");
  } else {
    console.log("route parameter wasn't passed correctly");
  }
  if (props.order.value) {
    hasOrder.value = true;
    order.value = props.order.value;
  }
  await getProfileById(route.params.shopId);
  loading.value = true;
});
</script>

<template>
  <main class="w-screen h-screen" v-show="loading" v-if="hasOrder">
    <ShopItemListComponent :shop="shop" :order="order" :hasOrder="hasOrder" @goToCart="switchToCart" @goToMap="switchToMap"></ShopItemListComponent>
  </main>
  <main class="w-screen h-screen" v-show="loading" v-else>
    <ShopItemListComponent :shop="shop" :hasOrder="hasOrder" @goToCart="switchToCart" @goToMap="switchToMap"></ShopItemListComponent>
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
