<template>
  <div class="upload">
    <a-upload>
      <template #upload-button>
        <div class="upload-btn">
          <icon-plus />
        </div>
      </template>
    </a-upload>
    <div class="upload-content">
      <div class="upload-content-title">自传模型</div>
      <div class="upload-list">
        <div class="upload-list-item" v-for="(item) in [1, 2, 3, 4]" :key="item"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
</script>

<style scoped lang="scss">
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
      margin: 30px 0 15px;
    }
  }
  &-list {
    display: flex;
    flex-wrap: wrap;
    &-item {
      width: 100px;
      height: 100px;
      background: yellow;
      margin-bottom: 6px;
      &:not(:nth-child(3n)) {
        margin-right: 6px;
      }
    }
  }
}
</style>