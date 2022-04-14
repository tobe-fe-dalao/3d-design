<template>
  <a-form :model="form" layout="vertical">
    <a-form-item label="图片宽度">
      <a-input-number
        v-model:value="form.width"
        placeholder="请输入图片宽度,范围1 - 2048"
        style="width: 100%;"
        :min="1"
        :max="2048"
      />
    </a-form-item>
    <a-form-item label="图片高度">
      <a-input-number
        v-model:value="form.height"
        placeholder="请输入图片高度,范围1 - 2048"
        style="width: 100%;"
        :min="1"
        :max="2048"
      />
    </a-form-item>
    <a-form-item label="导出格式">
      <a-select :style="{ width: '100%' }" placeholder="请选择导出格式" v-model:value="form.isPNG">
        <a-select-option value="true">PNG格式</a-select-option>
        <a-select-option value="false">JPG格式</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item label="图片大小">
      <a-select :style="{ width: '100%' }" v-model:value="size">
        <a-select-option :value="0.5">0.5倍</a-select-option>
        <a-select-option :value="1">原图</a-select-option>
        <a-select-option :value="1.5">1.5倍</a-select-option>
        <a-select-option :value="2">2倍</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item label="jpg格式的图片质量" v-if="form.isPNG != 'true'">
      <a-slider v-model:value="form.jpgQuality" :max="1" :step="0.1" />
    </a-form-item>
  </a-form>
  <div class="flex justify-end">
    <a-button type="primary" @click="handleClick" style="background-color: #ff6900;">导出图片</a-button>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from "vue";
import { GameManager } from '@/oasis/index'

export default defineComponent({
  setup() {
    let form = reactive({
      width: 1024,
      height: 1024,
      isPNG: "true",
      jpgQuality: 1,
    });

    let size = ref(1)

    const handleClick = () => {
      let ispng = form.isPNG === 'true'

      let width = form.width * size.value
      let height = form.height * size.value


      GameManager.ins.screenshot(width, height, ispng, form.jpgQuality)
    };

    return {
      form,
      size,
      handleClick,
    };
  },
});
</script>

<style scoped></style>
