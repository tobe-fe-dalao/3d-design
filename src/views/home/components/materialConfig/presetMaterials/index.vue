<template>
  <a-card
    class="materials"
    :bordered="false"
    :bodyStyle="{ padding: '12px 8px', maxHeight: '700px' }"
  >
    <a-input-search v-model:value="filterText" placeholder="搜索预设" style="margin-bottom: 10px;" />
    <div class="materials-content">
      <div class="materials-list">
        <a-empty style="margin: 10px auto;" v-if="filtedList.length == 0" description="试试搜别的吧"></a-empty>
        <div
          v-else
          class="materials-list-item"
          :class="{ active: selectedName == item.name }"
          v-for="(item, index) in selectableMaterials"
          :key="index"
          @click="onclick(item.material)"
          :title="item.name"
        >
          <a-image
            class="materials-list-item-img"
            :src="item.img"
            :preview="false"
          ></a-image>
          <p>{{ item.name }}</p>
        </div>
      </div>
    </div>
  </a-card>
</template>

<script lang="ts" setup>
import { OneMaterial } from '@/common/OneMaterial';
import { MaterialPresetsManager } from '@/manager/MaterialPresetsManager';
import { GameManager } from '@/oasis';
import { PBRMaterial } from 'oasis-engine';
import { ref, computed } from 'vue';

const emit = defineEmits(['useMaterial'])
const props = defineProps(['selectedName'])


/**材质列表 */
const selectableMaterials = ref(MaterialPresetsManager.List);

const filterText = ref('');
const filtedList = computed(() => selectableMaterials.value.filter(i => i.name.includes(filterText.value)))

/**点击应用材质预设 */
function onclick(item: OneMaterial) {
  emit('useMaterial', item.name)
}

</script>

<style scoped lang="scss">
.materials {
  background: var(--bg-black-1);
  width: 270px;
  &-list {
    display: flex;
    flex-wrap: wrap;
    &-item {
      width: 80px;
      height: 80px;
      cursor: pointer;
      position: relative;
      margin-bottom: 6px;
      &.active {
        border: 2px solid var(--primary-color);
        border-radius: 4px;
      }
      &:hover {
        background-color: var(--bg-black-2);
      }
      &:not(:nth-child(3n)) {
        margin-right: 6px;
      }
      :deep() .ant-image {
        width: 80%;
        height: 80%;
        margin: 0 10%;
      }
      p {
        font-size: 12px;
        color: var(--color-text-2);
        position: absolute;
        height: 20px;
        left: 0;
        bottom: 0;
        width: 100%;
        text-align: center;
      }
    }
  }
}
</style>