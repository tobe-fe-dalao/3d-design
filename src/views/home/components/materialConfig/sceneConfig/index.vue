<template>
  <div class="scene" v-if="sceneConfig">
    <div class="scene-config">
      <a-space class="scene-config-list" direction="vertical">
        <div class="scene-config-list-item">
          <div class="scene-config-list-item-label">背景显/隐：</div>
          <div class="scene-config-list-item-right">
            <a-checkbox
              v-model:checked="sceneConfig.background.show"
              @change="(e: Event) => sceneConfig?.toggleBackground((e.target as HTMLInputElement).checked)"
            ></a-checkbox>
          </div>
        </div>
        <div class="scene-config-list-item">
          <div class="scene-config-list-item-label">环境光图：</div>
          <div class="scene-config-list-item-right">
            <a-select
              v-model:value="sceneConfig.light.IBLUrl"
              style="width: 100%;"
              placeholder="切换IBL"
              @change="(url: Event | string) => sceneConfig?.setIBL(url as string)"
            >
              <a-select-option
                v-for="(item, index) in IBLURLS"
                :key="item.name"
                :value="item.url"
              >{{ item.name }}</a-select-option>
            </a-select>
          </div>
        </div>
        <div class="scene-config-list-item">
          <div class="scene-config-list-item-label">直射光颜色：</div>
          <div class="scene-config-list-item-right">
            <color-picker
              :color="sceneConfig.light.direct.color"
              @update:color="(color: ColorFormats.RGBA) => sceneConfig?.changeDirectLightColor(color)"
            />
          </div>
        </div>
        <div class="scene-config-list-item">
          <div class="scene-config-list-item-label">直射光强度：</div>
          <div class="scene-config-list-item-right">
            {{ +sceneConfig.light.direct.intensity.toFixed(2) }}
            <a-slider
              v-model:value="sceneConfig.light.direct.intensity"
              :max="1"
              :step="0.01"
              @change="(value: Event | number) => sceneConfig?.changeDirectLightIntensity(value as number)"
              :style="{ width: '80%' }"
            />
          </div>
        </div>
      </a-space>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { SceneConfig } from "@/common/SceneConfig";
import { ColorFormats } from 'tinycolor2'
import ColorPicker from '@/components/colorPicker/index.vue'
import { IBLURLS } from '@/common/constants'

const props = defineProps({
  sceneConfig: {
    type: SceneConfig,
    required: true
  }
})

</script>

<style scoped lang="scss">
.scene {
  &-config {
    &-list {
      width: 100%;
      &-item {
        display: flex;
        justify-content: space-between;
        align-items: center;

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
}
</style>