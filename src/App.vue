<template>
  <div id="cesiumContainer"></div>
</template>
<script setup lang="ts">
import { onMounted } from 'vue';
import * as Cesium from 'Cesium';

// 更改为你的TOKEN
const token = import.meta.env.VITE_API_TOKEN;
Cesium.Ion.defaultAccessToken = token;

onMounted(() => {
  const viewer = new Cesium.Viewer('cesiumContainer', {});
  console.log(viewer);
});
</script>
<style scoped></style>
