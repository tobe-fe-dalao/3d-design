<template>
  <div class="tree beauty-scroll">
    <a-tree
      defaultExpandAll
      :treeData="treeData"
      :selectedKeys="selectedKeys"
      block-node
      show-icon
      @select="onselect"
    ></a-tree>
  </div>
</template>

<script lang="ts" setup>

import { ref, h, computed, inject, Ref } from 'vue'
import { GameManager } from "@/oasis";
import { OnePart } from '@/common/OnePart';
import { MeshRenderer } from 'oasis-engine';
import { InboxOutlined } from '@ant-design/icons-vue';

interface TreeItem {
  title: string
  key: string | number
  icon?: Function
  children?: TreeItem[]
  disabled?: boolean
}
// 声明对外抛出的事件
const emit = defineEmits(['selectPart'])

const props = defineProps({
  selectedModelPath: String,
  selectedPartIndex: Number
})

const name = computed(() => {
  return props.selectedModelPath?.slice(props.selectedModelPath?.lastIndexOf('/') + 1) || ''
})

const selectedKeys = computed(() => [props.selectedPartIndex])

const partsList = inject<Ref<OnePart[]>>('partsList', ref([]))
const treeData = computed(() => {
  const temp: TreeItem[] = [
    {
      title: name.value,
      key: name.value,
      children: [],
    },
  ]
  temp[0].children = Array.from(partsList.value, (onePart: OnePart, key) => {
    return {
      title: onePart.name,
      icon: () => h(InboxOutlined),
      key
    }
  })
  return temp
})

function onselect(selected: Array<string | number>) {
  // TODO 点选树节点，高亮对应部件
  // GameManager.ins.onPickOnePart({component: })
  emit('selectPart', selected[0])
}

</script>

<style scoped lang="scss">
.tree {
  overflow: overlay;
  height: 100%;
  margin-left: -10px;
  margin-top: -10px;
  & :deep() span.ant-tree-iconEle {
    line-height: normal;
  }
  & :deep() span.ant-tree-switcher {
    line-height: normal;
  }
}
</style>