Set up express pantry

<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const props = defineProps(["administrator"]);
const emit = defineEmits(["addTime"]);
let times = ref<Array<Record<string, string>>>([]);
const selectedTime = ref("");

const getAvailableTime = async (administrator: string) => {
  try {
    const availableTimes = await fetchy(`/api/profiles/${administrator}/availableTimes`, "GET");
    const parsedTimes = availableTimes.map((time: string) => {
      const stringTime = new Date(time);
      return stringTime.toLocaleString();
    });
    times.value = parsedTimes;
  } catch {
    console.log("Error in PickupTime.");
  }
};

onBeforeMount(async () => {
  await getAvailableTime(props.administrator);
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
