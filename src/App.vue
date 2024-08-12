<template>
  <div id="contain" class="cesiumContainer"></div>
</template>
<script setup lang="ts">
import * as Cesium from 'Cesium';
import { onMounted } from 'vue';

// 更改为你的TOKEN
const token = import.meta.env.VITE_API_TOKEN;
Cesium.Ion.defaultAccessToken = token;

onMounted(() => {
  const esri = new Cesium.ArcGisMapServerImageryProvider({
    url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer', // 3D立体图层地址
    enablePickFeatures: false // 无需与服务器通信
  });

  const viewer = new Cesium.Viewer('contain', {
    imageryProvider: esri, // 自定义图层，默认是谷歌的影像图层
    terrainProvider: Cesium.createWorldTerrain({
      requestWaterMask: true, // 水面特效
      requestVertexNormals: true // 顶点法线
    }) // 地形图层
  });

  // 定义相机坐标
  const position = Cesium.Cartesian3.fromDegrees(113.318977, 23.114155, 2000);

  // 设置相机目的地
  viewer.camera.setView({
    destination: position, // 目的地
    // 视角
    orientation: {
      // 默认(0, -90, 0)
      heading: Cesium.Math.toRadians(0), // 左右
      pitch: Cesium.Math.toRadians(-45), // 上下
      roll: Cesium.Math.toRadians(0) // 倾斜
    }
  });

  console.log(viewer);
});
</script>
<style scoped></style>
