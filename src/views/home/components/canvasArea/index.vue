<template>
  <div class="canvas">
    <canvas id="canvas"></canvas>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { GameManager } from "@/oasis";

const emit = defineEmits(['engineInited'])

onMounted(async () => {
  // 初始化 渲染引擎
  await GameManager.ins.createEngine('canvas');
  emit('engineInited')
})

</script>

<style scoped lang="scss">
.canvas {
  width: 100%;
  height: 100%;
  #canvas {
    width: 100%;
    height: 100%;
  }
}
</style>