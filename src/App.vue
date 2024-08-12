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
    infoBox: false, // 右侧信息框
    selectionIndicator: false, // 选中状态隐藏
    timeline: false, // 时间轴控件
    animation: false, // 动画控件
    geocoder: false, // 搜索按钮
    homeButton: false, // 主页按钮
    sceneModePicker: false, // 投影方式按钮
    baseLayerPicker: false, // 图层选择按钮
    navigationHelpButton: false, // 帮助手势按钮
    fullscreenButton: false, // 全屏按钮
    imageryProvider: esri // 自定义图层，默认是谷歌的影像图层
    // terrainProvider: Cesium.createWorldTerrain({
    //   requestWaterMask: true, // 水面特效
    //   requestVertexNormals: true // 顶点法线
    // }) // 地形图层
  });

  // 定义相机坐标
  const position = Cesium.Cartesian3.fromDegrees(-74.008813, 40.679506, 3000);

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

  const city = viewer.scene.primitives.add(
    new Cesium.Cesium3DTileset({
      url: Cesium.IonResource.fromAssetId(75343)
    })
  );
  // viewer.flyTo(city);

  // 定义3D样式
  let heightStyle = new Cesium.Cesium3DTileStyle({
    color: {
      // 根据条件判断具体的颜色
      conditions: [
        ['${Height} >= 300', 'rgba(45,0,75,0.4)'],
        ['${Height} >= 200', 'rgb(102,71,151)'],
        ['${Height} >= 100', 'rgba(170,162,204,0.5)'],
        ['${Height} >= 50', 'rgba(224,226,238,0.6)'],
        ['${Height} >= 25', 'rgba(252,230,200,0.7)'],
        ['${Height} >= 10', 'rgba(248,176,87,0.8)'],
        ['${Height} >= 5', 'rgba(198,106,11,0.9)'],
        ['true', 'rgb(127,59,8)']
      ]
    }
  });

  city.style = heightStyle;

  // Geojson文件加载
  let neighborHoodsPromise = Cesium.GeoJsonDataSource.load(
    './assets/SampleData/sampleNeighborhoods.geojson'
  );
  let neighborHoods;

  neighborHoodsPromise.then((data: any) => {
    // 将数据添加到查看器
    viewer.dataSources.add(data);
    neighborHoods = data.entities;
    let neighborHoodsEntities = data.entities.values;
    neighborHoodsEntities.map((item: any) => {
      let entity = item;
      if (Cesium.defined(entity.polygon)) {
        entity.name = entity.properties.neighborhood;
        entity.polygon.material = Cesium.Color.fromRandom({
          red: 0.1,
          maximumGreen: 0.5,
          minimumBlue: 0.5,
          alpha: 0.6
        });

        entity.polygon.classificationType = Cesium.ClassificationType.TERRAIN;

        let polyPositions = entity.polygon.hierarchy.getValue(Cesium.JulianDate.now()).positions;

        let polyCenter = Cesium.BoundingSphere.fromPoints(polyPositions).center;
        polyCenter = Cesium.Ellipsoid.WGS84.scaleToGeocentricSurface(polyCenter);
        entity.position = polyCenter;

        // 生成标签
        entity.label = {
          text: entity.name, // 内容
          showBackground: true, // 是否有背景颜色
          scale: 0.6, // 透明度
          fillColor: Cesium.Color.YELLOWGREEN, // 字体颜色
          backgroundColor: new Cesium.Color(255, 255, 0, 0.5), // 背景颜色
          horizontalOrigin: Cesium.HorizontalOrigin.CENTER, // 相对于对象的原点的水平位置 原点位于对象的水平中心
          verticalOrigin: Cesium.VerticalOrigin.BOTTON, // 相对于对象的原点的垂直位置 原点位于对象的底部
          distanceDisplayCondition: new Cesium.DistanceDisplayCondition(10, 8000), // 展示范围条件
          disableDepthTestDistance: 100, // 禁用距离
          pixelOffset: new Cesium.Cartesian2(0, -10) // 水平/垂直 偏移量
        };
      }
    });
  });
  // viewer.add(neighborHoodsPromise);

  console.log(viewer);
});
</script>
<style scoped>
/* 隐藏左下角logo */
:deep(.cesium-viewer-bottom) {
  display: none;
}
</style>
