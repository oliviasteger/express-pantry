<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { Ref, onBeforeMount, ref } from "vue";
import { useRoute } from "vue-router";
import CartComponent from "../components/Cart/CartComponent.vue";
import PickupTimeComponent from "../components/Cart/PickupTimeComponent.vue";
import router from "../router";
import { fetchy } from "../utils/fetchy";

const { isLoggedIn } = storeToRefs(useUserStore());

const props = defineProps(["order"]);
const hasOrder = ref(false);
const shop = ref();
const shopId: Ref<string> = ref("");
const loaded = ref(false);

const time = ref<Date>(new Date());

const createOrder = async () => {
  await fetchy("/api/order", "POST", { body: { profileId: shopId.value, barcodes: props.order, pickupTime: time.value?.toISOString() } });
  await router.push({ name: "Client Orders" });
};

function updateTime(newTime: string) {
  time.value = new Date(newTime);
}

async function getProfileById(_id: any) {
  let profile;
  try {
    profile = await fetchy(`/api/profiles/id/${_id}`, "GET");
    console.log(profile, "in get ProfileById");
  } catch (_) {
    console.log("failed");
    return;
  }
  shop.value = profile;
}

onBeforeMount(async () => {
  const route = useRoute();
  console.log(route.params.shopId, "this is shopId");

  // Access route parameter 'id'
  if (route.params.shopId) {
    console.log("in onBeforeMount in CartView");
    shopId.value = route.params.shopId.toString();
  } else {
    console.log("route parameter wasn't passed correctly");
  }
  await getProfileById(route.params.shopId);
  if (props.order) {
    hasOrder.value = true;
  }
  loaded.value = true;
});
</script>

<template>
  <section v-if="isLoggedIn" @submit.prevent="createOrder">
    <h2>Your Current Cart</h2>
    <CartComponent :order="props.order" />
    <PickupTimeComponent :administrator="shop.administrator" @addTime="updateTime" required />
  </section>

  <p v-else-if="loaded">No cart</p>
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
