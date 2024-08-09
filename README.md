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

![Default Token](/src/assets/images/tokendemo.jpeg)

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

- [Cesium 速通](https://blog.csdn.net/weixin_64684095/article/details/139727206)
