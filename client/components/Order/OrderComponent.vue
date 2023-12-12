<!-- same view for user and admin but only admin can update status. Order has:sender: ObjectId;
  recipient: ObjectId;
  items: ObjectId[];
  status: OrderStatus;
  pickup: Date;-->

<script setup lang="ts">
import { defineProps, onBeforeMount, ref } from "vue"; // Import defineProps and defineEmits
import { fetchy } from "../../utils/fetchy";

const props = defineProps(["order", "userType"]);
const emit = defineEmits(["editOrder", "refreshOrders"]);
const items = ref<{ _id: string; barcode: string; name: string; brand: string; imageURL: string; expirationDate: Date }[]>([]);
const loaded = ref(false);
const show = ref(false);

// const emit = defineEmits(); // Use defineEmits without arguments
const deleting = ref(false); // Track if the order is being deleted

const deleteOrder = async () => {
  if (deleting.value) return; // Prevent multiple delete requests
  deleting.value = true;

  try {
    await fetchy(`/api/order/${props.order._id}`, "DELETE");
  } catch (error) {
    console.error("Error deleting item:", error);
  } finally {
    deleting.value = false;
  }
  emit("refreshOrders");
};
const clientName = ref("");
const profileName = ref("");

const getClientUsername = async () => {
  let check = await fetchy(`/api/users/id/${props.order.sender}`, "GET");
  check = check.username;
  clientName.value = check;
};

const getProfile = async () => {
  //const currentId = await fetchy("/api/profiles", "GET");
  let currentId = await fetchy(`/api/profiles/admin/${props.order.recipient}`, "GET");
  //const currentId = await fetchy(`api/profiles?searchQuery=${JSON.stringify({ administrator: props.order.recipient })}`, "GET");
  currentId = currentId[0].name;
  profileName.value = currentId;
};

const getOrderItems = async () => {
  const itemIds = props.order.items;
  let loadedItems = [];
  for (let itemId of itemIds) {
    try {
      const item = await fetchy(`/api/items/${itemId}`, "GET");
      loadedItems.push(item[0]);
    } catch (e) {
      console.log(e);
    }
  }

  const itemValues: { _id: string; barcode: string; name: string; brand: string; imageURL: string; expirationDate: Date }[] = [];

  for (let item of loadedItems) {
    fetch("https://world.openfoodfacts.org/api/v2/product/" + item.barcode + ".json")
      .then((response) => {
        if (response.ok) {
          return response.json(); // Parse the response data as JSON
        } else {
          throw new Error("API request failed");
        }
      })
      .then((data) => {
        let name = data.product.generic_name_en ? data.product.generic_name_en : "No name available";
        let brand = data.product.brands ? data.product.brands.toString().replaceAll(",", ", ") : "No brand available";
        let imageURL = data.product.image_url ? data.product.image_url : "https://t3.ftcdn.net/jpg/05/03/24/40/360_F_503244059_fRjgerSXBfOYZqTpei4oqyEpQrhbpOML.jpg";

        itemValues.push({ _id: item._id, barcode: item.barcode, name: name, brand: brand, imageURL: imageURL, expirationDate: item.expirationDate });
      })
      .catch((error) => {
        // Handle any errors here
        console.error(error); // Example: Logging the error to the console
      });
  }

  items.value = itemValues;
};

onBeforeMount(async () => {
  try {
    await getProfile();
    await getClientUsername();
    await getOrderItems();
    loaded.value = true;
  } catch (e) {
    console.log(e);
  }
});
</script>

<template>
  <v-card min-width="600px" v-if="loaded">
    <v-card-item>
      <v-card-title>Order from {{ clientName }} at {{ profileName }} </v-card-title>
      <v-card-subtitle>Scheduled for pickup at {{ new Date(props.order.pickup).toLocaleString() }}</v-card-subtitle>
      <v-chip class="mt-2" tonal :color="$props.order.status == 'picked up' ? 'var(--green)' : $props.order.status == 'packed' ? 'var(--muted-blue)' : 'var(--light-red)'"
        >Order {{ props.order.status }}</v-chip
      >
    </v-card-item>

    <v-divider></v-divider>

    <v-card-actions>
      <v-btn>Order contents</v-btn>

      <v-spacer></v-spacer>

      <v-btn :icon="show ? 'mdi-chevron-up' : 'mdi-chevron-down'" @click="show = !show"></v-btn>
    </v-card-actions>

    <v-expand-transition>
      <div v-show="show">
        <v-divider></v-divider>

        <v-list v-if="loaded && items.length !== 0" lines="three">
          <v-list-item v-for="item in items" :key="item._id" :prepend-avatar="item.imageURL" :title="item.name + ' - ' + item.brand" ripple>
            <v-list-item-subtitle
              >Barcode: {{ item.barcode }} <br />
              Expiration date: {{ item.expirationDate.toLocaleString() }}</v-list-item-subtitle
            >
          </v-list-item>
        </v-list>
        <v-card-text v-else>No items in order</v-card-text>
      </div>
    </v-expand-transition>
    <v-divider></v-divider>

    <v-card-actions>
      <v-btn color="var(--red)" @click="deleteOrder">Delete</v-btn>
      <v-btn
        v-if="userType == 'Administrator'"
        @click="
          emit('editOrder', props.order._id);
          show = false;
        "
        >Edit</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<style scoped>
/*article {
  margin: 1em;
}*/
section {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
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
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
}
.posts {
  display: flex;
  flex-wrap: wrap;
}
</style>
