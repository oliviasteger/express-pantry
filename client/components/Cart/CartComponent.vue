Set up express pantry

<script setup lang="ts">
import CartItemComponent from "@/components/Cart/CartItemComponent.vue";
import { onBeforeMount, ref } from "vue";

const loaded = ref(false);
const props = defineProps(["order"]);
const emit = defineEmits(["changedOrder"]);
const cartOrder = ref<Array<string>>([]);
const cartCountMap = ref<Map<string, number>>(new Map());

const addToCart = async (barcode: string, number?: number) => {
  //prob emit to ya ya
  emit("changedOrder", cartOrder.value);
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
const removeFromCart = (barcode: string) => {
  // Remove item from showing
  const currentBarcodeValue = cartCountMap.value.get(barcode);
  const currentNumber: number = currentBarcodeValue !== undefined ? currentBarcodeValue : 0;
  cartCountMap.value.set(barcode, currentNumber > 0 ? currentNumber - 1 : 0);

  if (cartCountMap.value.get(barcode) == 0) {
    cartCountMap.value.delete(barcode);
  }

  // Remove item from order
  const index = cartOrder.value.indexOf(barcode);
  if (index != -1) {
    cartOrder.value.splice(index, 1);
  }
  emit("changedOrder", cartOrder.value);
};

onBeforeMount(async () => {
  try {
    cartOrder.value = props.order;
    cartCountMap.value = getItemCounts(cartOrder.value);
    loaded.value = true;
  } catch (error) {
    console.error("something went wrong with mounting CartComponent ", error);
  }
});
</script>

<template>
  <v-card min-width="600px">
    <v-card-title>Your Cart</v-card-title>
    <v-list v-if="loaded && order.length !== 0" lines="three">
      <CartItemComponent
        class="ma-3"
        v-for="barcode of cartCountMap.keys()"
        :key="barcode"
        variant="tonal"
        :item="barcode"
        :quantity="cartCountMap.get(barcode)"
        @addedToCart="addToCart"
        @removeFromCart="removeFromCart"
      />
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
</style>
