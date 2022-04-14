<template>
  <a-collapse
    expandIconPosition="right"
    :bordered="false"
    v-model:activeKey="activeKey"
  >
    <a-collapse-panel
      header="场景"
      key="1"
      :bordered="false"
      :headStyle="{ borderBottom: 'none' }"
    >
      <SceneConfigArea :sceneConfig="sceneConfig" />
    </a-collapse-panel>
    <a-collapse-panel
      v-if="selectedPart"
      class="material"
      header="材质"
      key="2"
      :bordered="false"
      :headStyle="{ borderBottom: 'none' }"
    >
      <div class="material-config">
        <a-space class="material-config-list" direction="vertical">
          <div class="material-config-list-item">
            <a-popover
              trigger="click"
              placement="left"
              :visible="showPresetMaterial"
              @visibleChange="(val: boolean) => showPresetMaterial = val"
            >
              <a-button
                class="flex items-center justify-between"
                style="background-color: #2e2e2e; font-size: 12px; border: none"
                block
                size="large"
              >
                <div class="flex items-center">
                  <template v-if="selectedMaterialPng">
                    <a-image
                      :width="30"
                      :src="selectedMaterialPng"
                      :preview="false"
                    ></a-image>
                    <span style="margin-left: 10px">{{
                      selectedPart.material.name
                    }}</span>
                  </template>
                  <template v-else>选择预设材质</template>
                </div>
                <down-outlined />
              </a-button>
              <template #content>
                <PresetMaterials
                  :selectedName="selectedPart.material.name"
                  @useMaterial="usePresetMaterial"
                />
              </template>
            </a-popover>
          </div>
          <div class="material-config-list-item">
            <div class="material-config-list-item-label">金属度：</div>
            <div class="material-config-list-item-right">
              {{ +selectedPart.material.metallic.toFixed(2) }}
              <a-slider
                v-model:value="selectedPart.material.metallic"
                :max="1"
                :step="0.01"
                @change="onmetallicChange"
                :style="{ width: '80%' }"
              />
            </div>
          </div>
          <div class="material-config-list-item">
            <div class="material-config-list-item-label">粗糙度：</div>
            <div class="material-config-list-item-right">
              {{ +selectedPart.material.roughness.toFixed(2) }}
              <a-slider
                v-model:value="selectedPart.material.roughness"
                :max="1"
                :step="0.01"
                @change="onroughnessChange"
                :style="{ width: '80%' }"
              />
            </div>
          </div>
          <!-- <div class="material-config-list-item">
            <div class="material-config-list-item-label">roughnessMetallicTexture：</div>
            <div class="material-config-list-item-right">
              <a-select size="mini" @change="(value:string)=>{onTextureChange(value, 'roughnessMetallicTexture')}">
                  <a-select-option
                      v-for="(item, key) in selectableTextures"
                      :key="key"
                      :value="key"
                      >{{ key }}</a-select-option
                  >
              </a-select>
            </div>
          </div>-->
          <div class="material-config-list-item">
            <div class="material-config-list-item-label">透明度：</div>
            <div class="material-config-list-item-right">
              {{ +selectedPart.material.opacity.toFixed(2) }}
              <a-slider
                v-model:value="selectedPart.material.opacity"
                :max="1"
                :step="0.01"
                @change="onOpacityChange"
                :style="{ width: '80%' }"
              />
            </div>
          </div>
          <div class="material-config-list-item">
            <div class="material-config-list-item-label">开启透明：</div>
            <div class="material-config-list-item-right">
              <a-checkbox
                v-model:checked="selectedPart.material.isTransparent"
                @change="onIsTransparentChange"
              ></a-checkbox>
            </div>
          </div>
          <div class="material-config-list-item">
            <div class="material-config-list-item-label">基础颜色：</div>
            <div class="material-config-list-item-right">
              <div class="border-2 border-gray-200">
                <color-picker
                  :color="selectedPart.material.baseColor"
                  @update:color="(color: ColorFormats.RGBA) => selectedPart?.changeColor(color)"
                />
              </div>
            </div>
          </div>
          <div class="material-config-list-item">
            <div class="material-config-list-item-label">自发光：</div>
            <div class="material-config-list-item-right">
              <div class="border-2 border-gray-200">
                <color-picker
                  :color="selectedPart.material.emissiveColor"
                  @update:color="
                    (color: ColorFormats.RGBA) => selectedPart?.changeEmissiveColor(color)
                  "
                />
              </div>
            </div>
          </div>
          <!-- <div class="material-config-list-item">
            <div class="material-config-list-item-label">baseTexture：</div>
            <div class="material-config-list-item-right">
              <a-select
                  size="mini"
                  :value="selectedPart.material.baseTexture?.name"
                  @change="(value:string)=>{onTextureChange(value, 'baseTexture')}"
              >
              <a-select-option
                  v-for="(item, key) in selectableTextures"
                  :key="key"
                  :value="key"
                  >{{ key }}</a-select-option
              >
              </a-select>
            </div>
          </div>
          <div class="material-config-list-item">
            <div class="material-config-list-item-label">normalTexture：</div>
            <div class="material-config-list-item-right">
              <a-select
                  size="mini"
                  :value="selectedPart.material.baseTexture?.name"
                  @change="(value:string)=>{onTextureChange(value, 'normalTexture')}"
              >
              <a-select-option
                  v-for="(item, key) in selectableTextures"
                  :key="key"
                  :value="key"
                  >{{ key }}</a-select-option
              >
              </a-select>
            </div>
          </div>
          <div class="material-config-list-item">
            <div class="material-config-list-item-label">normalTextureIntensity：</div>
            <div class="material-config-list-item-right">
              {{selectedPart.material.normalTextureIntensity}}
              <a-slider
                  v-model:value="selectedPart.material.normalTextureIntensity"
                  :max="1"
                  :step="0.01"
                  @change="onNormalTextureIntensityChange"
                  :style="{ width: '80%' }"
              />
            </div>
          </div>
          <div class="material-config-list-item">
            <div class="material-config-list-item-label">emissiveTexture：</div>
            <div class="material-config-list-item-right">
              <a-select size="mini" @change="(value:string)=>{onTextureChange(value, 'emissiveTexture')}">
              <a-select-option
                  v-for="(item, key) in selectableTextures"
                  :key="key"
                  :value="key"
                  >{{ key }}</a-select-option
              >
              </a-select>
            </div>
          </div>
          <div class="material-config-list-item">
            <div class="material-config-list-item-label">occlusionTexture：</div>
            <div class="material-config-list-item-right">
              <a-select size="mini" @change="(value:string)=>{onTextureChange(value, 'occlusionTexture')}">
              <a-select-option
                  v-for="(item, key) in selectableTextures"
                  :key="key"
                  :value="key"
                  >{{ key }}</a-select-option
              >
              </a-select>
            </div>
          </div>-->
        </a-space>
      </div>
    </a-collapse-panel>
    <a-collapse-panel
      header="预设交互"
      key="3"
      :bordered="false"
      :headStyle="{ borderBottom: 'none' }"
    >
      <div class="material-config-list-item">
        <div class="material-config-list-item-label">交互方式：</div>
        <div class="material-config-list-item-right">
          <a-select
            style="width: 120px"
            v-model:value="selectedAction"
            @change="onActionChange"
          >
            <a-select-option :value="1">普通</a-select-option>
            <a-select-option :value="2">自旋转</a-select-option>
            <a-select-option :value="3">跟随鼠标</a-select-option>
            <a-select-option :value="4">鼠标悬浮动画</a-select-option>
          </a-select>
        </div>
      </div>
    </a-collapse-panel>
  </a-collapse>
  <a-space class="material-btns" align="center">
    <a-button type="text" title="导出材质配置" @click="exportOneMaterialConfig">
      <template #icon>
        <a-image
          :width="30"
          :src="Icon01"
          :preview="false"
          style="margin: 3px 0 0 1px"
        ></a-image>
      </template>
    </a-button>
    <a-upload
      action="/"
      :beforeUpload="() => false"
      :showUploadList="false"
      @change="onuploadChange"
    >
      <a-button type="text" title="加载材质配置">
        <template #icon>
          <a-image
            :width="30"
            :src="Icon02"
            :preview="false"
            style="margin: 3px 0 0 1px"
          ></a-image>
        </template>
      </a-button>
    </a-upload>
    <a-button type="text" title="重置为模型默认样式" @click="resetToDefault">
      <template #icon>
        <a-image
          :width="30"
          :src="Icon03"
          :preview="false"
          style="margin: 3px 0 0 1px"
        ></a-image>
      </template>
    </a-button>
  </a-space>
</template>

<script lang="ts" setup>
import { DownOutlined } from "@ant-design/icons-vue";
import { OnePart } from "@/common/OnePart";
import { TextureManager } from "@/manager/TextureManager";
import { GameManager } from "@/oasis";
import { MeshRenderer, Vector3 } from "oasis-engine";
import PresetMaterials from "./presetMaterials/index.vue";
import SceneConfigArea from "./sceneConfig/index.vue";
import { reactive, ref, computed, inject, Ref } from "vue";
import ColorPicker from "@/components/colorPicker/index.vue";
import { ColorFormats } from "tinycolor2";
import { exportToFile } from "@/utils/utils";
import Icon01 from "@/assets/img/icon-01.svg";
import Icon02 from "@/assets/img/icon-02.svg";
import Icon03 from "@/assets/img/camera.svg";
import { cloneDeep } from "lodash-es";
import { IO } from "@/oasis/utils/io";
import { SceneConfig } from "@/common/SceneConfig";
import { ModelConfigJsonType } from "@/common/interface";
import { MaterialPresetsManager } from "@/manager/MaterialPresetsManager";

const partsList = inject<Ref<OnePart[]>>("partsList", ref([]));

const activeKey = ref(["1", "2", "3"]);

const selectedMaterialPng = computed(
  () =>
    MaterialPresetsManager.List.find(
      (i) => i.name === selectedPart.value?.material.name
    )?.img
);

const showPresetMaterial = ref(false);

/**可选纹理列表 */
const selectableTextures = ref(TextureManager.defaultTextures);
const selectedPartIndex = ref(0);
function changeSelectedPart(partIndex: number) {
  // console.log("partIndex", partIndex);
  selectedPartIndex.value = partIndex;
}

/**
 * 加载材质配置
 */
function onuploadChange(res: any) {
  var reader = new FileReader();
  reader.readAsText(res.file);
  reader.onload = function () {
    //当读取完成之后会回调这个函数，然后此时文件的内容存储到了result中。直接操作即可。
    let json = JSON.parse(this.result as string);
    selectedPart.value?.loadMaterialConfig(json);
  };
}
/**获取当前材质配置数据 */
function getMaterialConfig() {
  let list = cloneDeep(partsList.value);
  // TODO 暂不支持导出贴图配置
  const attrs = [
    "baseTexture",
    "normalTexture",
    "emissiveTexture",
    "occlusionTexture",
    "roughnessMetallicTexture",
  ];
  list.forEach((item) => {
    delete item.renderer;
    // @ts-ignore
    attrs.forEach((i) => delete item.material[i]);
  });
  return list;
}

/**
 * 获取所有配置数据
 */
function getAllConfig() {
  const { position } = GameManager.ins.camera.entity.transform;
  sceneConfig.cameraConfig = {
    position,
    controlerTarget: GameManager.ins.controler?.target || new Vector3(),
  };
  const materialsConfig = getMaterialConfig();
  const index = GameManager.ins.modelGltf.url.lastIndexOf("?");
  const model = {
    url:
      index >= 0
        ? GameManager.ins.modelGltf.url.slice(0, index)
        : GameManager.ins.modelGltf.url,
  };

  const action = selectedAction.value;

  return {
    sceneConfig,
    materialsConfig,
    model,
    action,
  };
}

/**
 * 加载完整配置数据
 */
function loadAllConfig(data: ModelConfigJsonType) {
  loadMaterialConfig(data.materialsConfig);
  loadSceneConfig(data.sceneConfig);
}
/**
 * 加载材质配置数据
 * @param data
 */
function loadMaterialConfig(materialsConfig: OnePart[]) {
  partsList.value.forEach((onePart) => {
    let config: OnePart | undefined = materialsConfig.find(
      (i) => i.name == onePart.name
    );
    config && onePart.loadMaterialConfig(config.material);
  });
}
/** 导出一份材质配置 json文件 */
function exportOneMaterialConfig() {
  let materialConfig = cloneDeep(selectedPart.value?.material);
  const attrs = [
    "baseTexture",
    "normalTexture",
    "emissiveTexture",
    "occlusionTexture",
    "roughnessMetallicTexture",
  ];
  attrs.forEach((i) => delete materialConfig[i]);
  exportToFile(materialConfig, "diy-material.json");
}

/** 被选中的部件 */
const selectedPart = computed(() => {
  let onePart = partsList.value.find(
    (i, index) => index === selectedPartIndex.value
  );
  return onePart;
});

/** 修改粗糙度 */
function onroughnessChange(value: Event | number) {
  selectedPart.value?.changeRoughness(value as number);
}
/**修改金属度 */
function onmetallicChange(value: Event | number) {
  selectedPart.value?.changeMetallic(value as number);
}

/** 透明控制 */
function onIsTransparentChange(e: Event) {
  selectedPart.value?.changeIsTransparent(
    (e?.target as HTMLInputElement).checked
  );
}
/**修改透明度 */
function onOpacityChange(value: Event | number) {
  selectedPart.value?.changeOpacity(value as number);
}

function onTextureChange(name: string, textureType: string) {
  selectedPart.value?.changeTexture(name, textureType);
}
function onNormalTextureIntensityChange(value: number) {
  selectedPart.value?.changeNormalTextureIntensity(value);
}

/**使用预设材质 */
function usePresetMaterial(name: string) {
  showPresetMaterial.value = false;
  selectedPart.value?.changeMaterial(name);
}

/**场景配置实例 */
let sceneConfig = reactive(new SceneConfig());
/**
 * 加载场景配置的json数据
 * @param data
 */
function loadSceneConfig(data: SceneConfig) {
  sceneConfig.loadSceneConfig(data);
}

/**切换交互 */
const selectedAction = ref(1);
/**初始化一下 */
localStorage.setItem("selectedAction", JSON.stringify(selectedAction.value));
function onActionChange() {
  localStorage.setItem("selectedAction", JSON.stringify(selectedAction.value));
}

/** 重置模型为默认样式 */
function resetToDefault() {
  localStorage.removeItem(
    `modelConfig:${GameManager.ins.modelGltf.url.slice(
      0,
      GameManager.ins.modelGltf.url.lastIndexOf("?")
    )}`
  );
  GameManager.ins.engine.dispatch(IO.REFRESH_MODEL);
}

defineExpose({
  changeSelectedPart,
  loadAllConfig,
  getAllConfig,
});
</script>

<style scoped lang="scss">
.ant-collapse {
  background-color: var(--bg-black-1);
  & :deep() .ant-collapse-item {
    border-color: var(--border-black-1);
    .ant-collapse-header {
      color: white;
    }
    .ant-collapse-content {
      color: #cfcfcf;
    }
  }
}
.material {
  &-config {
    &-list {
      width: 100%;
      &-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        :deep() .vc-color-wrap {
          margin-right: 0;
        }
        &-right {
          width: 120px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-direction: row-reverse;
        }
      }
    }
  }
  &-btns {
    margin: 20px;
    width: calc(100% - 40px);
    background-color: #2e2e2e;
    height: 44px;
    padding: 0 20px;
  }
}
</style>
