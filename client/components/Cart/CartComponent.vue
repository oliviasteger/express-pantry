Set up express pantry

<script setup lang="ts">
import CartItemComponent from "@/components/Cart/CartItemComponent.vue";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import { useUserStore } from "../../stores/user";

const loaded = ref(false);
const { currentUsername } = storeToRefs(useUserStore());
const props = defineProps(["order"]);
const emit = defineEmits(["changedOrder"]);
const order = ref<Array<string>>([]);
const cartCountMap = ref<Map<string, number>>(new Map());

const addToCart = async (barcode: string, number?: number) => {
  //prob emit to ya ya
  emit("changedOrder", order.value);
};
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

const deleteItem = async (barcode: string) => {
  const index = order.value.findIndex((item) => Object.keys(item)[0] === barcode);

  if (index !== -1) {
    order.value.splice(index, 1);
  }
  emit("changedOrder", order.value);
};
const removeFromCart = (barcode: string, number?: number) => {
  //prob emit to ya ya
  emit("changedOrder", order.value);
};

onBeforeMount(async () => {
  try {
    order.value = props.order;
    cartCountMap.value = getItemCounts(order.value);
    loaded.value = true;
  } catch (error) {
    console.error("something went wrong with mounting CartComponent ", error);
  }
});
</script>

<template>
  <v-card>
    <v-card-title>Your Cart</v-card-title>
    <v-list class="container" v-if="loaded && order.length !== 0">
      <v-list-item-group v-for="barcode of cartCountMap.keys()" :key="barcode">
        <CartItemComponent :item="barcode" :quantity="cartCountMap.get(barcode)" @deleteItemFromCart="deleteItem" @addedToCart="addToCart" @removeFromCart="removeFromCart" />
        <v-divider width="90%"></v-divider>
      </v-list-item-group>
    </v-list>
    <v-card-text v-else>No items in cart</v-card-text>
  </v-card>
</template>
<style scoped>
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
.container {
  width: 600px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: var(--light-grey);
}
</style>
