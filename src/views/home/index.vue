<template>
  <a-layout class="home">
    <a-layout-sider hide-trigger style="overflow: hidden;" :width="430" :collapsed-width="68" :collapsed="collapsed">
      <div class="logo" :class="{ collapsed }" :style="{ height: `${headerHeight}px` }">
        <div class="logo-content">
          <div v-if="collapsed" style="text-align: center">
            <div class="overflow-hidden">
              <div class="overflow-hidden">
                <a-image :src="Logo" :preview="false" />
              </div>
            </div>
          </div>
          <a-image v-else :height="24" :src="Logo" style="width: 160px" />
        </div>
      </div>
      <div class="home-menus" :style="{ height: `calc(100% - ${headerHeight}px)` }">
        <Menus v-if="showConfig" ref="MenusRef" :selectedModel="selectedModel" @loadModel="onloadModel"
          @selectPart="onselectPart" @menuClick="onClickMenu"></Menus>
      </div>
    </a-layout-sider>
    <a-layout>
      <a-layout-header class="home-header" style="padding: 0 16px" :style="{ height: `${headerHeight}px` }">
        <a-space align="center">
          <a-tooltip title="重置相机">
            <img class="cursor-pointer" src="../../assets/img/camera.svg" style="width: 23px; height: 23px"
              @click="onclickResetCamera" />
          </a-tooltip>
          <a-upload action="/" :beforeUpload="() => false" :showUploadList="false" @change="onuploadAllConfigChange">
            <a-tooltip title="加载配置">
              <img src="../../assets/img/icon-02.svg" style="width: 23px; height: 23px" />
            </a-tooltip>
          </a-upload>
        </a-space>

        <a-space>
          <a-tooltip title="业务案例">
            <div class="flex justify-center align:center"
              style="background:rgb(46,46,46);border-radius: 5px;width:36px;height:36px;">
              <img class="cursor-pointer" style="width: 18px;" src="../../assets/img/link.svg" @click="goBusiness" />
            </div>
          </a-tooltip>
          <a-tooltip title="模型预览">
            <img class="cursor-pointer" src="../../assets/img/icon-head-01.svg" @click="showModelPreview" />
          </a-tooltip>
          <a-tooltip title="导出所有配置">
            <img class="cursor-pointer" src="../../assets/img/icon-head-02.svg" @click="exportAll" />
          </a-tooltip>
          <a-tooltip title="代码">
            <img class="cursor-pointer" src="../../assets/img/icon-head-03.svg" @click="showCode" />
          </a-tooltip>
          <a-button type="primary" @click="exportImg">导出图片</a-button>
        </a-space>
      </a-layout-header>
      <a-layout :style="{ height: `calc(100% - ${headerHeight}px)` }">
        <a-layout-content style="position: relative">
          <div class="cursor-pointer icon-left" @click="onCollapse">
            <right-outlined v-if="collapsed" />
            <left-outlined v-else />
          </div>
          <CanvasArea @engineInited="onengineInited"></CanvasArea>
        </a-layout-content>
        <a-layout-sider v-if="showConfig" :width="300" class="overflow-auto beauty-scroll home-sider-config">
          <MaterialConfig ref="MaterialConfigRef" />
        </a-layout-sider>
      </a-layout>
    </a-layout>
  </a-layout>

  <!-- 导出图片 -->
  <a-modal v-model:visible="visible" :footer="false">
    <template #title>导出图片</template>
    <div>
      <ExportImg />
    </div>
  </a-modal>

  <ModelPreview ref="ModelPreviewRef" />
</template>

<script lang="ts" setup>
import { ref, onMounted, reactive, computed, provide } from "vue";
import { useRouter } from "vue-router";
import { CodeOutlined } from '@ant-design/icons-vue';
import Menus from "./components/menus/index.vue";
import CanvasArea from "./components/canvasArea/index.vue";
import MaterialConfig from "./components/materialConfig/index.vue";
import ModelPreview from '@/components/ModelPreview/index.vue'
import { IO } from '@/oasis/utils/io';
import { ModelConfigJsonType } from '@/common/interface'

import Logo from "@/assets/img/logo.png";

import { UploadOutlined, RightOutlined, LeftOutlined } from '@ant-design/icons-vue';

import { LocalModelType, ModelAssetsManager } from "@/manager/ModelAssetsManager";
import { exportToFile } from "@/utils/utils";

import ExportImg from "@/components/ExportImg/index.vue";
import { GameManager } from "@/oasis";
import { cloneDeep } from "lodash-es";
import { OnePart } from "@/common/OnePart";
import { MeshRenderer } from "oasis-engine";

const router = useRouter()

let headerHeight = 70;

const collapsed = ref(false);
const onCollapse = () => {
  collapsed.value = !collapsed.value;
};

const showConfig = ref(false);

/**引擎初始化完毕回调 */
function onengineInited() {
  showConfig.value = true;

  /** 监听保存当前模型所有配置数据 */
  GameManager.ins.engine.on(IO.SAVE_ALL_CONFIG, (e: any) => {

    const modelAllConfig = generateAllConfig()
    if (modelAllConfig) {
      localStorage.setItem(`modelConfig:${modelAllConfig.model.url}`, JSON.stringify(modelAllConfig))
    }
  });
}

const MaterialConfigRef = ref<InstanceType<typeof MaterialConfig>>();
const ModelList = cloneDeep(ModelAssetsManager.ModelList)
const selectedModelPath = ref(ModelList[0].path);
let selectedModel = computed(() => ModelAssetsManager.getModelInfoByPath(selectedModelPath.value) || ModelAssetsManager.ModelList[0]);

/**点击更换模型回调 */
function onloadModel(modelPath: string) {

  selectedModelPath.value = modelPath
  refreshModel();

  // 检查本地是否有该模型的配置缓存
  let configCache: string | ModelConfigJsonType | null = localStorage.getItem(`modelConfig:${selectedModel.value.path}`);
  if (configCache) {
    // 本地有缓存
    try {
      configCache = JSON.parse(configCache) as ModelConfigJsonType
      MaterialConfigRef.value?.loadAllConfig(configCache);
    } catch (err) {
      console.error(err)
    }
  } else if (selectedModel.value.defaultConfig) {
    // 本地没有配置缓存 检查模型是否有默认配置
    MaterialConfigRef.value?.loadAllConfig(selectedModel.value.defaultConfig);
  }
}
/** 选择部件的回调 */
function onselectPart(partIndex: number) {
  MaterialConfigRef.value?.changeSelectedPart(partIndex);
}

const MenusRef = ref<typeof Menus>(Menus);
/**
 * 导出所有配置 为一个json文件
 */
function exportAll() {
  exportToFile(
    generateAllConfig(),
    `all-config-${selectedModel.value.name}.json`
  );
}
/**加载包含所有配置的json文件 */
function onuploadAllConfigChange(res: any) {
  var reader = new FileReader();
  reader.readAsText(res.file);
  reader.onload = function () {
    //当读取完成之后会回调这个函数，然后此时文件的内容存储到了result中。直接操作即可。
    let json: ModelConfigJsonType = JSON.parse(this.result as string);
    MaterialConfigRef.value?.loadAllConfig(json);
  };
}
/** 生成包含所有信息的配置 */
function generateAllConfig() {
  return MaterialConfigRef.value?.getAllConfig()
}

// 导出图片
const visible = ref(false);
const exportImg = () => {
  visible.value = true;
};

/**重置相机 */
function onclickResetCamera() {
  GameManager.ins.resetCamera();
}


// 预览模型
const ModelPreviewRef = ref(ModelPreview)
function showModelPreview() {
  ModelPreviewRef.value.showModal(generateAllConfig())
}
function showCode() {
  ModelPreviewRef.value.showCode(generateAllConfig())
}

// 点击菜单
const onClickMenu = (isSame: boolean) => {
  if (isSame) {
    onCollapse()
  } else {
    collapsed.value = false
  }
}

/**打开业务demo链接 */
function goBusiness() {
  localStorage.setItem('businessAllData', JSON.stringify(generateAllConfig()))
  window.open(router.resolve('/business').href)
}

/**模型的部件列表 */
const partsList = ref<Array<OnePart>>([]);
provide('partsList', partsList)
/** 刷新模型部件列表 */
function refreshModel() {
  partsList.value = Array.from(GameManager.ins.renderers_in_modelGltf, (item: MeshRenderer) => new OnePart(item))
}


</script>

<style lang="scss" scoped>
.home {
  height: 100vh;
  background: var(--bg-black-1);
  color: white;

  &-header {
    border-bottom: 1px solid var(--border-black-1);
    height: 70px;
    background: transparent;
    line-height: 70px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    & :deep() .ant-upload {
      display: block;
    }
  }

  &-sider-config {
    :deep() .ant-card {
      color: rgba(255, 255, 255, 0.7);
    }
  }
}

.home :deep(.ant-layout-sider) .logo {
  height: 70px;
  border-bottom: 1px solid var(--border-black-1);
  display: flex;
  align-items: center;
  padding-left: 21px;

  &.collapsed {
    padding-left: 0;
    justify-content: center;
  }

  &-content {
    white-space: nowrap;
  }
}

.home :deep(.arco-layout-footer) {
  height: 48px;
  color: var(--color-text-2);
  font-weight: 400;
  font-size: 14px;
  line-height: 48px;
}

.home :deep(.arco-layout-content) {
  color: var(--color-text-2);
  font-weight: 400;
  font-size: 14px;
  background: var(--color-bg-3);
}

.home :deep(.arco-layout-footer),
.home :deep(.arco-layout-content) {
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: var(--color-white);
  font-size: 16px;
  font-stretch: condensed;
  text-align: center;
}

.icon-left {
  width: 30px;
  height: 56px;
  background: #212121;
  border-radius: 1px 6px 6px 1px;
  position: absolute;
  top: 48%;
  display: flex;
  align-items: center;
  padding-left: 6px;
  transform: perspective(100px) rotateY(45deg) translate(-5px);
}
</style>
