<template>
  <div class="upload">
    <div class="upload-content">
      <div class="upload-content-title">上传</div>
      <div class="upload-list">
        <div class=" mb-2 avatar-uploader">
          <a-upload
            name="avatar"
            list-type="picture-card"
            :show-upload-list="false"
            action="/"
            :before-upload="beforeUpload"
            @change="handleChange"
          >
            <img v-if="imageUrl" :src="imageUrl" alt="avatar" />
            <div v-else>
              <loading-outlined v-if="loading"></loading-outlined>
              <plus-outlined v-else></plus-outlined>
              <div class="ant-upload-text">上传模型</div>
            </div>
          </a-upload>
        </div>
        <!-- <div class="upload-list-item" v-for="(item, index) in modelList" :key="index"></div> -->
        <div
          @click.stop="modelClick(item.path)"
          class="box-border mb-2 upload-list-item"
          v-for="(item, index) in modelList"
          :key="index"
        >
          <div
            :class="{ border: item.path === selectedModelPath }"
            class="overflow-hidden rounded-md w-100px h-100px"
            :title="item.name"
          >
            <a-image
              v-if="item.img"
              class="cursor-pointer avatar"
              :preview="false"
              :src="item.img"
              :alt="item.name"
              fallback="data:image/png;base64,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"
            />
            <div
              v-else
              class="cursor-pointer flex upload-list-err"
              style="color: rgba(95, 95, 96)"
            >
              <picture-filled style="font-size: 50px" />
              {{ item.name }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  PlusOutlined,
  LoadingOutlined,
  PictureFilled,
} from "@ant-design/icons-vue";
import { defineComponent, ref } from "vue";
import { message } from "ant-design-vue";
import type { UploadChangeParam, UploadProps } from "ant-design-vue";
import { GameManager } from "@/oasis";
import { ModelAssetsManager } from "@/manager/ModelAssetsManager";
import { IO } from "@/oasis/utils/IO";
import { AssetType } from "oasis-engine";

const emit = defineEmits(["upload", "clickModel"]);
const props = defineProps<{
  selectedModelPath: string;
}>();

const modelList = ref(ModelAssetsManager.UploadModelList);
const loading = ref<boolean>(false);
const imageUrl = ref<string>("");

/**
 * 选中本地文件
 * @param info 
 */
const handleChange = (info: UploadChangeParam) => {
  const isModel = info.file.name.endsWith(".gltf") || info.file.name.endsWith(".glb");
  if (!isModel) {
    message.error("请上传 GLTF/GLB 模型文件!");
    loading.value = false
    return
  }
  if (info.file.status === "uploading") {
    loading.value = true;
    return;
  }

  if (info.file) {
    handleUploadModel(info.file)
  }
  if (info.file.status === "error") {
    loading.value = false;
    message.error("upload error");
  }
};

/**
 * 加载用户upload的模型文件。暂时只支持单文件
 * @param file
 */
async function handleUploadModel(file: File) {
  let url = URL.createObjectURL(file);
  if (file.name.includes(".gltf")) {
    let gltf = await GameManager.ins.engine.resourceManager.load<any>({
      type: AssetType.JSON,
      url,
    });

    gltf.buffers.concat(gltf.images).forEach((item) => {
      if (!item) return;
      let { uri } = item;

      if (uri) {
        let index = uri.lastIndexOf("/");
        if (index > -1) {
          uri = uri.substr(index + 1);
        }
      }
    });
    const blob = new Blob([JSON.stringify(gltf)]);
    url = `${URL.createObjectURL(blob)}#.gltf`;

  } else {
    url = `${url}#.glb`;
  }

  ModelAssetsManager.addUploadModel({
    name: file.name,
    path: url
  });

  emit("upload", url);
}

const beforeUpload = (file: UploadProps["fileList"][number]) => {
  // const isLt2M = file.size / 1024 / 1024 < 2;
  // if (!isLt2M) {
  //   message.error('Image must smaller than 2MB!');
  // }
  // return isModel && isLt2M;
  return false;
};

/**点击切换模型 */
const modelClick = async (path: string) => {
  GameManager.ins.engine.dispatch(IO.SAVE_ALL_CONFIG);
  emit("clickModel", path);
};
</script>

<style scoped lang="scss">
.border {
  @apply rounded-md border-2 border-orange-600;
}
.avatar-uploader {
  :deep() .ant-upload.ant-upload-select-picture-card {
    width: 100px;
    height: 100px;
    margin: 0 6px 0px 0;
  }
}
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
.upload {
  width: 312px;
  &-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 81px;
    height: 81px;
    background: var(--bg-black-3);
    font-size: 30px;
    color: var(--bg-black-1);
  }
  &-content {
    &-title {
      margin: 0px 0 15px;
    }
  }
  &-list {
    display: flex;
    flex-wrap: wrap;
    &-item {
      width: 100px;
      height: 100px;
      margin-bottom: 6px;
      &:not(:nth-child(3n)) {
        margin-right: 6px;
      }
      :hover {
        background-color: var(--bg-black-2);
      }
    }
    &-err {
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
    }
  }
}
</style>
