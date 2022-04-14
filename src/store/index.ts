import { defineStore } from "pinia";

// defineStore 调用后返回一个函数，调用该函数获得 Store 实体
export const useStore = defineStore({
  // id: 必须的，在所有 Store 中唯一
  id: "globalState",
  // state: 返回对象的函数
  state: () => ({
    loading: true,
  }),
  actions: {
    toggleLoading(val?: boolean) {
      this.loading = typeof val === "undefined" ? !this.loading : val;
    },
  },
});
