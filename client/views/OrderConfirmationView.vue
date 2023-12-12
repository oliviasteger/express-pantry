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

const getItemCounts = (order: Array<string>): Map<string, number> => {
  const itemCountMap = new Map<string, number>();

  for (const barcode of order) {
    if (!itemCountMap.has(barcode)) {
      itemCountMap.set(barcode, 0);
    }
    const currentAmount = itemCountMap.get(barcode);
    if (currentAmount !== undefined) itemCountMap.set(barcode, currentAmount + 1);
  }

  return itemCountMap;
};

const createOrder = async () => {
  try {
    console.log({ body: { profileId: shopId.value, barcodes: props.order, pickupTime: time.value?.toISOString() } });
    await fetchy("/api/order", "POST", { body: { profileId: shopId.value, barcodes: JSON.stringify(Array.from(getItemCounts(props.order).entries())), pickupTime: time.value?.toISOString() } });
    await router.push({ name: "Client Orders" });
  } catch (e) {
    console.log(e);
  }
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
  <v-app class="rounded rounded-md bar" v-if="shop" @submit.prevent="createOrder">
    <v-app-bar class="custom-app-bar" :elevation="3" density="compact">
      <template v-slot:prepend>
        <!-- <v-icon icon="mdi-chevron-left" @click="switchToShop"></v-icon> -->
        <v-app-bar-title absolute="false"
          >Shopping At
          <button class="default-disabled">
            <strong text-color="black">{{ shop.name }}</strong>
          </button></v-app-bar-title
        >
      </template>
    </v-app-bar>

    <v-main class="d-flex align-start justify-center" style="min-height: 300px">
      <v-container v-if="loaded && hasOrder">
        <PickupTimeComponent :administrator="shopId" @addTime="updateTime" required /><br />
        <CartComponent :order="props.order" /><br />
      </v-container>
      <p v-else-if="loaded">No items in cart yet!</p>
      <p v-else>Loading...</p>
    </v-main>
  </v-app>
  <p v-else>
    <v-img
      aspect-ratio="1/1"
      cover
      src="https://media.licdn.com/dms/image/C5612AQEPYce5KpNLyg/article-cover_image-shrink_720_1280/0/1551659700811?e=2147483647&v=beta&t=O9mBMiF-V12jCRJwaBNDWLKNL8cku2QSoCXtKP3vCHg"
    ></v-img>
  </p>
</template>
<style>
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
