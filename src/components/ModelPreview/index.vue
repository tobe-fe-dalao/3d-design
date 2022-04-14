<template>
  <div class="flex items-center justify-center preview" v-show="show" @click="hideModal">
    <a-card
      :title="{ [ShowTabMap.模型]: '模型预览', [ShowTabMap.代码]: '代码' }[showTab]"
      @click.stop
      :body-style="{ background: 'rgba(241,244,251)', padding: 0 }"
    >
      <template #extra>
        <a-space>
          <template v-if="doType == 'model'">
            <download-outlined class="cursor-pointer icon-btn" @click="downLoad" />
          </template>
          <close-outlined
            class="cursor-pointer icon-btn"
            style="margin-top: 2px;"
            @click="show = false"
          />
        </a-space>
      </template>
      <div class="bg-opacity-0 preview-content">
        <div v-show="showTab == ShowTabMap.模型" class="w-full h-full" :class="`bg-${selectValue}`">
          <canvas id="preview-model"></canvas>
          <!-- <a-select
            class="preview-content-select"
            v-model:value="selectValue"
          >
            <a-select-option :value="`${index}`" v-for="(item, index) in types" :key="item">{{item}}</a-select-option>
          </a-select>-->
        </div>
        <div v-show="showTab == ShowTabMap.代码" class="w-full h-full">
          <div class="relative w-full h-full preview-code">
            <copy-outlined
              class="absolute cursor-pointer top-5 right-10 preview-code-copy"
              style="color:white;"
              @click="doCopy"
            />
            <div class="max-w-full max-h-full overflow-auto beauty-scroll">
              <highlightjs language="js" :code="codeText" />
            </div>
          </div>
        </div>
      </div>
    </a-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, nextTick } from "vue";
import { DownloadOutlined, CloseOutlined, CopyOutlined } from '@ant-design/icons-vue';
import { PreviewManager } from './preview'
import { code } from './code'
import hljsVuePlugin from "@highlightjs/vue-plugin";
//@ts-ignore
import { useClipboard } from 'v-clipboard3';
import { OnePart } from "../../common/OnePart";
import { cloneDeep } from 'lodash-es'
import { SceneConfig } from "../../common/SceneConfig";


const ShowTabMap = { '模型': 0, '代码': 1 }
export default defineComponent({
  components: {
    highlightjs: hljsVuePlugin.component,
    DownloadOutlined,
    CloseOutlined,
    CopyOutlined
  },
  setup(props, { emit }) {

    const ossUrl = 'https://uufefile.uupt.com/eic/cdn/glb/';

    let show = ref(false);
    let showTab = ref(ShowTabMap.模型);
    let codeText = ref('');
    /**code:查看代码; 'model':预览模型 */
    const doType = ref('model')

    function downLoad() {
      location.href = allConfigData.model.url;
    }

    let modelUrl = '';
    let allConfigData: any;
    /**
     * @param {string} url 模型地址
     * @param {array} data 材质配置数据
     * @param {SceneConfig} scene 场景配置数据
     */
    function showModal(allData: any) {
      allConfigData = allData
      show.value = true;
      doType.value = 'model';
      showTab.value = ShowTabMap.模型

      nextTick(async () => {
        await PreviewManager.ins.createEngine('preview-model', allData);

        selectedAction.value = JSON.parse(localStorage.getItem('selectedAction') || "1")
      })
    }

    /**展示代码 */
    function showCode(allData: any) {
      let url = allData.model.url
      let data = allData.materialsConfig;
      let scene = allData.sceneConfig

      doType.value = 'code';
      showTab.value = ShowTabMap.代码
      codeText.value = cloneDeep(code);

      // 展示模型和代码时 把代码处理一下
      let pattern = /public modelUrl.*;/;
      modelUrl = url.startsWith('http') ? url : ossUrl + url.slice(url.lastIndexOf('/') + 1);
      
      codeText.value = codeText.value.replace(pattern, `public modelUrl = '${modelUrl}'`);
      // 替换代码模板中的材质配置
      codeText.value = codeText.value.replace(/private materialsConfig.*;/, `private materialsConfig = ${JSON.stringify(data)}`);
      // 替换代码模板中的场景配置
      codeText.value = codeText.value.replace(/private sceneConfig.*;/, `private sceneConfig = ${JSON.stringify(scene)}`);
      show.value = true;

      selectedAction.value = JSON.parse(localStorage.getItem('selectedAction') || "1")
      // 替换代码模板中的 交互配置
      codeText.value = codeText.value.replace(/private defaultAction.*;/, `private defaultAction = ${JSON.stringify(selectedAction.value)};`);
    }

    function hideModal() {
      show.value = false;
      showTab.value = ShowTabMap.模型
      PreviewManager.ins.destroy()
      selectedAction.value = 1;
    }

    /**切换交互 */
    const selectedAction = ref(1);

    const selectValue = ref('0')
    const types = ['场景1']

    return {
      show,
      showTab,
      ShowTabMap,
      downLoad,
      codeText,
      showModal,
      hideModal,
      selectedAction,
      showCode,
      doType,
      selectValue,
      types
    };
  },
  methods: {
    async doCopy() {
      try {
        await useClipboard(this.codeText);
        this.$message.info('复制成功')
      } catch (error) {
        console.log(error);
        alert('copy error!');
      }
    }
  }
});
</script>

<style scoped lang="scss">
.preview {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  &-content {
    width: 600px;
    height: 600px;
    &-select {
      position: absolute;
      top: 60px;
      right: 10px;
      background-color: var(--bg-black-1);
    }
    .bg-0 {
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
  &-code {
    max-height: 100%;
    max-width: 100%;
  }
}
#preview-model {
  width: 100%;
  height: 100%;
}
.icon-btn {
  width: 20px;
  height: 20px;
}
</style>
