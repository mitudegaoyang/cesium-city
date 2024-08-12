# 3D City Vue 3 + Cesium

## 初始化项目

### pnpm 创建项目

```shell
pnpm creat vite 项目名
```

### 选择框架

```shell
> vue
```

### 进入项目并安装依赖

```shell
cd 项目名
pnpm i
```

### 安装 cesium

```shell
npm i cesium@1.99 vite-plugin-cesium
# or
pnpm i cesium@1.99 vite-plugin-cesium
# or
yarn i cesium@1.99 vite-plugin-cesium
```

### 使用编辑器打开项目

```shell
code .
```

### 修改 vite.config.js 文件 引入 cesium

```js
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import cesium from 'vite-plugin-cesium';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), cesium()]
});
```

### 在 app.vue 中引入 Cesium 并打印

```js
import * as Cesium from 'cesium';
console.log(Cesium);
```

### 运行项目

```shell
yarn dev
```

## 使用

### 注册 cesium

要使用 cesium API 就需要 cesium Token，[点击注册](https://cesium.com/)，可以使用谷歌或者 github 的账号注册。注册后到 Access Tokens 目录下，复制 token 备用。

![cesium官网](/src/assets/images/cesium.jpeg)

![Default Token](/src/assets/images/token.jpeg)

### Hello Cesium

编写 App.vue 默认是谷歌的影像图层。

```js
<script setup>
  import { onMounted } from "vue";
  import * as Cesium from "cesium";

  let token = "your token";

  onMounted(() => {
    Cesium.Ion.defaultAccessToken = token;
    new Cesium.Viewer("contain");
  });
</script>

<template>
  <div id="contain"></div>

</template>

<style>
  body {
    margin: 0;
    padding: 0;
  }
  #contain {
    width: 100vw;
    height: 100vh;
  }
</style>
```

![效果](/src/assets/images/demo.jpeg)

### 自定义影像图层

自定义 ArcGIS 影像图层

```js
onMounted(() => {
  const esri = new Cesium.ArcGisMapServerImageryProvider({
    url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer', // 3D立体图层地址
    enablePickFeatures: false // 无需与服务器通信
  });

  const viewer = new Cesium.Viewer('contain', {
    imageryProvider: esri, // 自定义图层，默认是谷歌的影像图层
    infoBox: false, // 右侧信息框
    selectionIndicator: false // 选中状态隐藏
  });
});
```

![自定义影像图层](/src/assets/images/imageryProvider.jpeg)

### 地形图层

默认地图是平面的，没有地形图层。可以通过如下配置打开地图和水面特效。但是一般没必要可以不开，因为会损耗我们电脑 GPU，就像打游戏特效开满一样。

```js
onMounted(() => {
  const viewer = new Cesium.Viewer('contain', {
    terrainProvider: Cesium.createWorldTerrain({
      requestWaterMask: true, // 水面特效
      requestVertexNormals: true // 顶点法线
    }) // 地形图层
  });
});
```

![地形图层](/src/assets/images/terrainProvider.jpeg)
![顶点法线](/src/assets/images/requestVertexNormals.jpeg)

### 隐藏控件

隐藏界面的控件，使界面看着干净整洁，因为我们交付给客户的时候，也不会让客户看到这些控件。

```js
onMounted(() => {
  const viewer = new Cesium.Viewer('contain', {
    timeline: false, // 时间轴控件
    animation: false, // 动画控件
    geocoder: false, // 搜索按钮
    homeButton: false, // 主页按钮
    sceneModePicker: false, // 投影方式按钮
    baseLayerPicker: false, // 图层选择按钮
    navigationHelpButton: false, // 帮助手势按钮
    fullscreenButton: false // 全屏按钮
  });
});
```

```css
<style scoped>
/* 隐藏左下角logo */
:deep(.cesium-viewer-bottom) {
  display: none;
}
</style>
```

![控件](/src/assets/images/control.jpeg)

### 相机

相当于我们视线的位置

#### 设置目的地

视觉角度也就是相机位置

```js
onMounted(() => {
  const viewer = new Cesium.Viewer('contain', {});

  // 定义相机坐标
  const position = Cesium.Cartesian3.fromDegrees(113.318977, 23.114155, 2000); // 广州塔坐标

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
});
```

![相机](/src/assets/images/camera.jpeg)

### 3D 瓦片加载

去资源库添加资源，在已添加资源处，可以查看用法。

![添加 3D 瓦片](/src/assets/images/cesium3DTileset.jpeg)

加载 New York City 3D Buildings

```js
onMounted(() => {
  const viewer = new Cesium.Viewer('contain', {});

  const city = viewer.scene.primitives.add(
    new Cesium.Cesium3DTileset({
      url: Cesium.IonResource.fromAssetId(75343)
    })
  );
  viewer.flyTo(city);

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
});
```

![定义3D样式](/src/assets/images/heightStyle.jpeg)

## 参考文档

- [Cesium 速通](https://blog.csdn.net/weixin_64684095/article/details/139727206)
- [2024 年 Cesium 入门保姆级教程](https://www.bilibili.com/video/BV1BM4m1Q7id)
- [Cesium 打造数字城市快速上手课程](https://www.bilibili.com/video/BV1X44y1x7J2)
- [Cesium 中文文档](http://cesium.xin/cesium/cn/Documentation1.62/index.html)
- [Cesium 官网](https://cesium.com/)
