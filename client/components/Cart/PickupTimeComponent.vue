Set up express pantry

<script setup lang="ts">
import { computed, onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const props = defineProps(["shop"]);
const emit = defineEmits(["openShop", "refreshPantryList"]);
let times = ref<Array<Record<string, string>>>([]);
const selectedMonth = ref("");
const selectedDay = ref("");
const selectedTime = ref("");
const uniqueDays = ref<Array<Record<string, string>>>([]);

const getAvailableTime = async () => {
  try {
    times.value = await fetchy(`api/profiles/${props.shop.adminstrator}/availableTimes`, "GET");
  } catch {
    //welp
  }
};

const months = computed(() => {
  // Extract unique months from the available dates
  return [...new Set(times.value.map((item) => new Date(item.date).toLocaleString("default", { month: "long" })))];
});

const days = computed(() => {
  // Extract unique days based on the selected month
  if (selectedMonth.value) {
    const daysInMonth = times.value.filter((item) => new Date(item.date).toLocaleString("default", { month: "long" }) === selectedMonth.value).map((item) => new Date(item.date).getDate().toString());

    // Remove duplicate days
    return [...new Set(daysInMonth)];
  }

  return [];
});

const updateDays = () => {
  // Extract unique days based on the selected month
  const daysInMonth = times.value.filter((item) => new Date(item.date).toLocaleString("default", { month: "long" }) === selectedMonth.value).map((item) => new Date(item.date).getDate().toString());

  // Remove duplicate days
  const uniqueDays = [...new Set(daysInMonth)];
  selectedDay.value = uniqueDays.length > 0 ? uniqueDays[0] : "";
};

const updateTimes = () => {
  // Extract times based on the selected day
  const timesForDay = times.value
    .filter((item) => {
      const date = new Date(item.date);
      return date.toLocaleString("default", { month: "long" }) === selectedMonth.value && date.getDate() === Number(selectedDay);
    })
    .map((item) => item.time);

  selectedTime.value = timesForDay.length > 0 ? timesForDay[0] : "";
};

const filteredTimes = computed(() => {
  // Extract times based on the selected day
  if (selectedMonth.value && selectedDay) {
    return times.value
      .filter((item) => {
        const date = new Date(item.date);
        return date.toLocaleString("default", { month: "long" }) === selectedMonth.value && date.getDate() === Number(selectedDay);
      })
      .map((item) => item.time);
  }

  return [];
});

onBeforeMount(async () => {
  await getAvailableTime();
});
</script>

<template>
  <div>
    <label for="month">Month:</label>
    <select id="month" v-model="selectedMonth" @change="updateDays">
      <option v-for="month in months" :key="month" :value="month">{{ month }}</option>
    </select>

    <label for="day">Day:</label>
    <select id="day" v-model="selectedDay" @change="updateTimes">
      <option v-for="day in days" :key="day" :value="day">{{ day }}</option>
    </select>

    <label for="time">Time:</label>
    <select id="time" v-model="selectedTime">
      <option v-for="time in filteredTimes" :key="time" :value="time">{{ time }}</option>
    </select>
  </div>
</template>
