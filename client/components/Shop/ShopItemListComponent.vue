Set up express pantry

<script setup lang="ts">
import ShopItemComponent from "@/components/Shop/ShopItemComponent.vue";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref, watch } from "vue";
import { useUserStore } from "../../stores/user";
import { fetchy } from "../../utils/fetchy";
import CreateRequestForm from "../Request/CreateRequestForm.vue";
interface Shop {
  administrator: string;
  location: string;
  name: string;
  openHour: number;
  closeHour: number;
  pickupWindowLength: number;
  ordersPerWindow: number;
  rules: string;
}

let orderableBarcodesAndQuantities = ref<{ [key: string]: number }>({});
const loaded = ref(false);
const { currentUsername } = storeToRefs(useUserStore());
const props = defineProps(["shop", "order", "hasOrder"]);
const name = ref();
const emit = defineEmits(["openShop", "leaveShop", "refreshPantryList", "goToCart"]);
const order = ref<Array<string>>([]);

const setUpShop = async (shop: Shop) => {
  try {
    let results;

    console.log(`this is passed in shop ${JSON.stringify(shop)}, and this is the adminstrator ${shop.administrator}`);
    const administrator = shop.administrator;
    // const adminURL = `/api/users/${administrator}/items`;
    const adminURL = "/api/users/" + administrator + "/items";
    try {
      results = await fetchy(adminURL, "GET");
    } catch (error) {
      console.error("There was a problem with the fetch operation in orderableBarcodesAndQuantities:", error);
    } finally {
      console.log("setUpShop completed");
    }

    //const results = await fetchy(adminURL, "GET");

    orderableBarcodesAndQuantities.value = results;
    console.log(results);
  } catch (error) {
    console.error("Failure in setupShop ", error);
    return;
  }
};
const openCart = async () => {
  emit("goToCart", order.value);
  return;
};

const addToCart = async (barcode: string) => {
  //checking if the number is greater than amount of barcode in stock
  // try {
  // if (!number) {
  //   number = 1;
  // }
  console.log(`order ${order.value}`);
  order.value.push(barcode);
  console.log(barcode);
  console.log(order.value);

  //console.log(orderableArray);
  // const matchingBarcodeIndex = orderableArray.findIndex(entry => entry[barcode] !== undefined);

  //   if (orderables[barcode] !== undefined) {
  //     const quantityInStock:number = orderableBarcodesAndQuantities.value[barcode];

  //       //since things are claimable by anyone unless the order is placed
  //       if (quantityInStock >= order.count()) {
  //         order.value[existingOrderIndex][barcode] += number;
  //       } else {
  //         console.error('Insufficient quantity available for this barcode');
  //       }
  //     } else {
  //       if (quantityInStock >= number) {
  //         order.value.push({ [barcode]: number });
  //       } else {
  //         console.error('Insufficient quantity available for this barcode');
  //       }
  //     }
  //   } else {
  //     console.error('Barcode not found in orderableBarcodesAndQuantities');
  //   }
  // } catch (error) {
  //   console.error('Error in addToCart:', error);
  // }
  // else if(barcode in order.value.keys()){
  // }
  // order.value.push({ [barcode]: number });
};
const removeFromCart = (barcode: string, number?: number) => {
  const index = order.value.findIndex((item) => item === barcode);
  order.value.splice(index, 1);
};
watch(
  () => props.shop,
  async (newShop: Shop | null, oldShop) => {
    if (newShop) {
      await setUpShop(newShop);
    }
  },
);
onBeforeMount(async () => {
  if (props.shop) {
    await setUpShop(props.shop);
  }
  if (props.hasOrder) {
    console.log("props has order");
    order.value = props.order;
  } else {
    console.log("this in onBefore", order.value);
  }
  console.log(`in onBeforeMount this is order ${order.value}`);
  // name.value = await props.shop.name;
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
  <v-app class="rounded rounded-md bar" v-if="props.shop">
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
              <strong> {{ order.length }}</strong>
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

    <v-main class="d-flex align-start justify-center" style="min-height: 300px">
      <v-container>
        <v-row> <CreateRequestForm :requestee="props.shop.administrator"></CreateRequestForm> </v-row>
        <v-row>
          <section class="posts" v-if="loaded && orderableBarcodesAndQuantities.length !== 0">
            <article v-for="object of Object.entries(orderableBarcodesAndQuantities)" :key="object[0]">
              <ShopItemComponent :item="object[0]" @refreshShopItems="setUpShop(props.shop)" @addedToCart="addToCart" @removeFromCart="removeFromCart" />
              <!-- <PostComponent v-if="editing !== post._id" :post="post" @refreshPosts="getPosts" @editPost="updateEditing" />
        <EditPostForm v-else :post="post" @refreshPosts="getPosts" @editPost="updateEditing" /> -->
            </article>
          </section>
          <p v-else-if="loaded">No posts found</p>
          <p v-else>Loading...</p>
        </v-row>
      </v-container>
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
