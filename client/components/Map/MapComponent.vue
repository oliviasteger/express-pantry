
<script setup lang="ts">

import { Location } from "@/types/location";
import { ref, watch } from "vue";

const mapRef = ref<InstanceType<typeof GMapMap> | null>(null);
const isLocationAvailable = ref<Boolean>(true);
const center = ref<Location | null>( {lat:42.373611, lng: -71.110558}); 
const currentLocation = ref<Location>( {lat:42.373611, lng: -71.110558}); 
const setCenter = (location: Location) => {
center.value = location;
};

const clearCenter = () => {
center.value = null;
};

const mapInitialized = ref(false);

const panTo = (location: Location) => {
  mapRef.value?.map.panTo(location);
};
const setZoom = (zoom: number) => {
  mapRef.value?.map.setZoom(zoom);
};
const initMap = () => {
  if (center.value) {
    panTo(center.value);
    setZoom(17);
    clearCenter();
    mapInitialized.value = true;
  } else if (currentLocation.value) {
    panTo(currentLocation.value);
    mapInitialized.value = true;
  }
};

// useWatchLocation();
// watchEffect(() => {
//   if (mapRef.value?.map) {
//     setMap(mapRef.value.map);
//     loadGeoJson(mapRef.value?.map);
//   }
// });

watch(
  [isLocationAvailable, () => mapRef.value?.map],
  () => {
    if (!mapRef.value?.map || mapInitialized.value) {
      return;
    }
    initMap();
  },
  {
    immediate: true,
  },
);
defineExpose({
  panTo,
  setZoom,
});
</script>

<template>
  <GMapMap
      :center="{lat:42.373611, lng: -71.110558}"
      :zoom="7"
      map-type-id="terrain"
      style="width: 50vw; height: 900px"
  >
  </GMapMap>
  <dialog id="location_permission" class="modal z-30">
    <div class="modal-box">
      <h3 class="font-bold text-lg">Allow Location Access</h3>
      <p class="py-4">Location permission is necessary for MapStory to provide personalized and accurate information based on your current location.</p>
      <div class="modal-action">
        <form method="dialog">
          <button class="btn">Close</button>
        </form>
      </div>
    </div>
  </dialog>
</template>