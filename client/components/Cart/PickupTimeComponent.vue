Set up express pantry

<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const props = defineProps(["shop"]);
const emit = defineEmits(["addTime"]);
let times = ref<Array<Record<string, string>>>([]);
const selectedTime = ref("");

const getAvailableTime = async () => {
  // replace hardcode with props.shop.administrator
  try {
    const availableTimes = await fetchy(`/api/profiles/656ec25d6453c6b495a7ea39/availableTimes`, "GET");
    const parsedTimes = availableTimes.map((time: string) => {
      const stringTime = new Date(time);
      return stringTime.toLocaleString("en-GB", { timeZone: "EST" });
    });
    times.value = parsedTimes;
  } catch {
    console.log("Error in PickupTime.");
  }
};

onBeforeMount(async () => {
  await getAvailableTime();
});
</script>

<template>
  <v-form @submit.prevent="emit('addTime', selectedTime)">
    <v-select :items="times" v-model="selectedTime"></v-select>
    <div>
      <p>Selected time: {{ selectedTime }}</p>
    </div>
    <v-btn type="submit" block class="mt-0 mb-0" text="Select time"></v-btn>
  </v-form>
</template>
