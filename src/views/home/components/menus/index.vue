<template>
  <div class="menus">
    <div class="menus-left">
      <div
        class="menus-btn"
        v-for="(item, index) in menus"
        :key="index"
        :class="{ active: activeIndex === index }"
        @click="onClick(index)"
      >
        <appstore-outlined
          v-if="item == '部件'"
          :strokeWidth="3"
          style="font-size: 26px"
        />
        <inbox-outlined
          v-if="item == '模型'"
          :strokeWidth="3"
          style="font-size: 26px"
        />
        <upload-outlined
          v-if="item == '上传'"
          :strokeWidth="3"
          style="font-size: 26px"
        />
        <span class="menus-btn-text">{{ item }}</span>
      </div>
    </div>
    <div class="menus-right">
      <transition name="fade-bottom" mode="out-in">
        <component
          :is="showConfig"
          :selectedModelPath="selectedModel.path"
          :selectedPartIndex="selectedPartIndex"
          @clickModel="onclickModel"
          @selectPart="onselectPart"
          @upload="onclickModel"
        />
      </transition>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { GameManager } from "@/oasis";
import {
  AppstoreOutlined,
  InboxOutlined,
  UploadOutlined,
} from "@ant-design/icons-vue";
import { IO } from "@/oasis/utils/io";
import { ref, defineAsyncComponent, computed, reactive, onMounted } from "vue";
import {
  LocalModelType,
  ModelAssetsManager,
} from "@/manager/ModelAssetsManager";
import { useStore } from "@/store";

const store = useStore();

const props = defineProps<{ selectedModel: LocalModelType }>();

GameManager.ins.engine.on(
  IO.PICK_PART,
  (e: { name: string; index: number }) => {
    onselectPart(e.index);
  }
);
GameManager.ins.engine.on(IO.REFRESH_MODEL, loadModel);

// 声明对外抛出的事件
const emit = defineEmits(["loadModel", "selectPart", "menuClick"]);

let menus = ref(["模型", "部件", "上传"]);
// let menus = ref(["模型", "部件"]);
let activeIndex = ref(0);
function onClick(index: number) {
  emit("menuClick", activeIndex.value == index);
  activeIndex.value = index;
}

// 动态加载导航按钮对应的组件
const controlList = ["models", "partsTree", "upload"];
// const controlList = ["models", "partsTree"];
const list = controlList.map((m) => {
  return defineAsyncComponent(() => import(`./${m}/index.vue`));
});
let showConfig = computed(() => list[activeIndex.value]);

/**更换模型 */
async function onclickModel(modelPath: string) {
  await loadModel(modelPath);

  // 重置选择第一个部件
  onselectPart(0);
  activeIndex.value = 1;
}

const selectedPartIndex = ref(0);
/** 选择部件的回调 */
function onselectPart(partIndex: number) {
  selectedPartIndex.value = partIndex;
  emit("selectPart", partIndex);
}

async function loadModel(path?: string) {
  if (!path) {
    path = props.selectedModel.path;
  }
  await GameManager.ins.loadModel(path);

  emit("loadModel", path);
}

onMounted(async () => {
  await onclickModel(props.selectedModel.path);

  store.toggleLoading(false);
});
</script>

<style scoped lang="scss">
.fade-bottom-enter-active,
.fade-bottom-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-bottom-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.fade-bottom-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
.menus {
  display: flex;
  height: 100%;
  &-left {
    width: 68px;
    border-right: 1px solid var(--border-black-1);
  }
  &-btn {
    width: 68px;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    cursor: pointer;
    &.active {
      color: var(--primary-color);
    }
    &-text {
      margin-top: 10px;
    }
  }
  &-right {
    flex: 1;
    padding: 20px;
    height: 100%;
  }
}
</style>
