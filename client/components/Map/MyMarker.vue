<script setup lang="ts">
import { storeToRefs } from "pinia";
import { Location } from "@/types/location";

const markers = ref<Array<Location>>( [{lat:42.373611, lng: -71.110558}]); 
</script>
<template>
    <GMapMap
    ref="myMarker"
  >
    <GMapMarker
      :key="index"
      v-for="(m, index) in markers.value"
      :position="m.position"
      :clickable="true"
      :draggable="true"
    />
  </GMapMap>
  <!-- <CustomMarker :options="{ position: currentLocation, zIndex: 1000 }">
    <div class="flex justify-center items-center bg-base-100 w-6 h-6 rounded-xl shadow-[0px_4px_6px_#999999]">
      <div class="bg-info w-4 h-4 rounded-xl"></div>
    </div>
  </CustomMarker> -->
</template>