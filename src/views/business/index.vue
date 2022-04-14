<script setup lang="ts">
import { PreviewManager, MouseMove } from '@/components/ModelPreview/preview/index'
import { onMounted, ref } from 'vue'
import { useStore } from "@/store";

const store = useStore()

onMounted(async () => {

  let allDataConfig
  try {
    allDataConfig = JSON.parse(localStorage.getItem('businessAllData') || "")
  } catch (error) {
    console.warn('没有配置')
  }

  await PreviewManager.ins.createEngine('businessCanvas', allDataConfig);

  store.toggleLoading(false)

})

const selectValue = ref('0')
const types = ['场景1', '场景2', '场景3']
function handleChange(val) {

}

</script>

<template>
  <div class="banner-wrap" :class="`bg-${selectValue}`">
    <canvas id="businessCanvas"></canvas>
    <a-select class="banner-wrap-select" v-model:value="selectValue" @change="handleChange">
      <a-select-option :value="`${index}`" v-for="(item, index) in types" :key="item">{{ item }}</a-select-option>
    </a-select>
  </div>
</template>

<style scoped lang="scss">
.banner-wrap {
  width: 100%;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background-size: cover;
  &-select {
    position: absolute;
    top: 10px;
    right: 10px;
    background-color: var(--bg-black-1);
    &.ant-select-focused {
    }
  }
  &.bg-0 {
    background: url(@/assets/img/business/beijing3.jpg) no-repeat center;
  }
  &.bg-1 {
    background-color: #112a11;
    background-image: linear-gradient(
        transparent 49px,
        rgba(0, 255, 0, 0.9) 49px,
        rgba(0, 255, 0, 0.9) 51px,
        transparent 51px
      ),
      linear-gradient(
        90deg,
        transparent 49px,
        rgba(0, 255, 0, 0.9) 49px,
        rgba(0, 255, 0, 0.9) 51px,
        transparent 51px
      ),
      linear-gradient(
        transparent 9px,
        rgba(0, 255, 0, 0.2) 9px,
        rgba(0, 255, 0, 0.2) 10px,
        transparent 10px
      ),
      linear-gradient(
        90deg,
        transparent 9px,
        rgba(0, 255, 0, 0.2) 9px,
        rgba(0, 255, 0, 0.2) 10px,
        transparent 10px
      );
    background-size: 100px 100px, 100px 100px, 20px 20px, 20px 20px;
    background-position: center;
    box-shadow: inset 0 0 30px 0 #000;
    #businessCanvas {
      height: 100%;
    }
  }
  &.bg-2 {
    background-image: linear-gradient(
      -90deg,
      rgb(16 185 249),
      rgb(255, 41, 248)
    );
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAQ0lEQVRIie3NIRUAIAxF0QdngjCTBCMkEoldDySOBlP8W+CWiBjAJpcbsICZHJ2aHDyKFClSpEiRIkV/RgZ0oCU/fgGqtQcvJDHU/QAAAABJRU5ErkJggg==);
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAQ0lEQVRIie3NIRUAIAxF0QdngjCTBKPbKiCRhEHiaDDFvwVuiYgBbHK5AQuYydGpycGjSJEiRYoUKVL0Z2RAB1ry4xdrugax0f07CgAAAABJRU5ErkJggg==);
    background-color: rgb(241, 244, 251);
    #businessCanvas {
      height: 100%;
    }
  }
}
#businessCanvas {
  position: absolute;
  height: 560px;
  width: 100%;
  min-width: 40%;
  left: 50%;
  transform: translateX(-49%);
  background: transparent;
}
</style>
