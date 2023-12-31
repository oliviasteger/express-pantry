<script setup lang="ts">
import CartComponent from "@/components/Cart/CartComponent.vue";
import { Ref, onBeforeMount, ref } from "vue";
import { useRoute } from "vue-router";
import router from "../router";
import { fetchy } from "../utils/fetchy";
const props = defineProps(["order"]);
const hasOrder = ref(false);
const shop = ref();
const shopId: Ref<string> = ref("");
const loaded = ref(false);
const order = ref<Array<string>>([]);

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

const switchToShop = () => {
  console.log(shopId, " switching from cart to shop");
  console.log(`this is the order ${order.value}`);
  if (order.value.length === 0) {
    order.value = props.order;
  }
  console.log(`this is the order after the check ${order.value}`);
  void router.push({ name: "Shop", params: { shopId: shopId.value }, query: { order: JSON.stringify(order.value) } });
};
const updateOrder = (newOrder: Array<string>) => {
  console.log(newOrder, " edited the order in cart");
  order.value = newOrder;
};
const checkout = () => {
  console.log(shopId, " switching from cart to shop");
  console.log(`this is the order ${order.value}`);
  if (order.value.length === 0) {
    order.value = props.order;
  }
  console.log(`this is the order after the check ${order.value}`);
  void router.push({ name: "OrderConfirmation", params: { shopId: shopId.value }, query: { order: JSON.stringify(order.value) } });
};
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
  <v-app class="rounded rounded-md bar" v-if="shop">
    <v-app-bar class="custom-app-bar" :elevation="3" density="compact">
      <template v-slot:prepend>
        <v-icon icon="mdi-chevron-left" @click="switchToShop"></v-icon>
        <v-app-bar-title absolute="false"
          >Shopping At
          <button class="default-disabled">
            <strong text-color="black">{{ shop.name }}</strong>
          </button></v-app-bar-title
        >
      </template>

      <template v-slot:append>
        <v-chip @click="checkout" variant="elevated">
          <strong>Checkout</strong>
        </v-chip>
      </template>
    </v-app-bar>

    <v-main class="d-flex align-start justify-center" style="min-height: 300px">
      <section class="posts" v-if="loaded && hasOrder">
        <CartComponent :order="props.order" @changedOrder="updateOrder" />
      </section>
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
</style>
