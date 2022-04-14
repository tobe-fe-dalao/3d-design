declare global {
  interface ImportMeta {
    globEager<T = unknown>(globPath: string): Record<string, T>;
    glob<T = unknown>(globPath: string): Record<string, T>;
  }
}

import { createApp } from "vue";
import App from "./App.vue";
import { router } from "./route";
import { createPinia } from "pinia";

import "highlight.js/styles/atom-one-dark.css";
import "highlight.js/lib/common";

import Antd from "ant-design-vue";
import "ant-design-vue/dist/antd.css";
// 设置为暗黑主题
import "ant-design-vue/dist/antd.dark.less";

import "./index.css";

const app = createApp(App);
app.use(Antd);
app.use(router);
app.use(createPinia());
app.mount("#app");
