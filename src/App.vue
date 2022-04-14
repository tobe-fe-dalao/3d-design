<template>
  <router-view></router-view>
  <transition name="fade">
    <div v-if="store.loading" class="flex items-center justify-center loading">
      <div class="la-square-jelly-box la-dark la-3x">
        <div style="background-color: #ff6900;"></div>
        <div></div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts" setup>
import { useStore } from "@/store";

const store = useStore()

</script>
<style lang="scss">
.ant-btn.ant-btn-primary {
  background-color: #ff6900;
}

.beauty-scroll {
  /* 设置滚动条的样式 */
  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  /* 滚动槽 */
  &::-webkit-scrollbar-track {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0);
  }
  /* 滚动条滑块 */
  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: rgba(92, 92, 92, 0.5);
  }
}
.vc-hue-slider__bar {
  background: linear-gradient(
    to right,
    red 0%,
    yellow 16.66%,
    lime 33.33%,
    aqua 50%,
    blue 66.66%,
    fuchsia 83.33%,
    red 100%
  ) !important;
}
.arco-btn.arco-btn-primary {
  background-color: var(--primary-color);
}
.arco-btn.arco-btn-primary:hover {
  background-color: var(--primary-color-1);
}
</style>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from {
  opacity: 0;
}
.fade-leave-to {
  opacity: 0;
}
.loading {
  right: 0;
  bottom: 0;
  position: fixed;
  left: 0;
  top: 0;
  background-color: #212121;
}

/*!
 * Load Awesome v1.1.0 (http://github.danielcardoso.net/load-awesome/)
 * Copyright 2015 Daniel Cardoso <@DanielCardoso>
 * Licensed under MIT
 */
.la-square-jelly-box,
.la-square-jelly-box > div {
  position: relative;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
}
.la-square-jelly-box {
  display: block;
  font-size: 0;
  color: #fff;
}
.la-square-jelly-box.la-dark {
  color: #333;
}
.la-square-jelly-box > div {
  display: inline-block;
  float: none;
  background-color: currentColor;
  border: 0 solid currentColor;
}
.la-square-jelly-box {
  width: 32px;
  height: 32px;
}
.la-square-jelly-box > div:nth-child(1),
.la-square-jelly-box > div:nth-child(2) {
  position: absolute;
  left: 0;
  width: 100%;
}
.la-square-jelly-box > div:nth-child(1) {
  top: -25%;
  z-index: 1;
  height: 100%;
  border-radius: 10%;
  -webkit-animation: square-jelly-box-animate 0.6s -0.1s linear infinite;
  -moz-animation: square-jelly-box-animate 0.6s -0.1s linear infinite;
  -o-animation: square-jelly-box-animate 0.6s -0.1s linear infinite;
  animation: square-jelly-box-animate 0.6s -0.1s linear infinite;
}
.la-square-jelly-box > div:nth-child(2) {
  bottom: -9%;
  height: 10%;
  background: #000;
  border-radius: 50%;
  opacity: 0.2;
  -webkit-animation: square-jelly-box-shadow 0.6s -0.1s linear infinite;
  -moz-animation: square-jelly-box-shadow 0.6s -0.1s linear infinite;
  -o-animation: square-jelly-box-shadow 0.6s -0.1s linear infinite;
  animation: square-jelly-box-shadow 0.6s -0.1s linear infinite;
}
.la-square-jelly-box.la-sm {
  width: 16px;
  height: 16px;
}
.la-square-jelly-box.la-2x {
  width: 64px;
  height: 64px;
}
.la-square-jelly-box.la-3x {
  width: 96px;
  height: 96px;
}
/*
 * Animations
 */
@-webkit-keyframes square-jelly-box-animate {
  17% {
    border-bottom-right-radius: 10%;
  }
  25% {
    -webkit-transform: translateY(25%) rotate(22.5deg);
    transform: translateY(25%) rotate(22.5deg);
  }
  50% {
    border-bottom-right-radius: 100%;
    -webkit-transform: translateY(50%) scale(1, 0.9) rotate(45deg);
    transform: translateY(50%) scale(1, 0.9) rotate(45deg);
  }
  75% {
    -webkit-transform: translateY(25%) rotate(67.5deg);
    transform: translateY(25%) rotate(67.5deg);
  }
  100% {
    -webkit-transform: translateY(0) rotate(90deg);
    transform: translateY(0) rotate(90deg);
  }
}
@-moz-keyframes square-jelly-box-animate {
  17% {
    border-bottom-right-radius: 10%;
  }
  25% {
    -moz-transform: translateY(25%) rotate(22.5deg);
    transform: translateY(25%) rotate(22.5deg);
  }
  50% {
    border-bottom-right-radius: 100%;
    -moz-transform: translateY(50%) scale(1, 0.9) rotate(45deg);
    transform: translateY(50%) scale(1, 0.9) rotate(45deg);
  }
  75% {
    -moz-transform: translateY(25%) rotate(67.5deg);
    transform: translateY(25%) rotate(67.5deg);
  }
  100% {
    -moz-transform: translateY(0) rotate(90deg);
    transform: translateY(0) rotate(90deg);
  }
}
@-o-keyframes square-jelly-box-animate {
  17% {
    border-bottom-right-radius: 10%;
  }
  25% {
    -o-transform: translateY(25%) rotate(22.5deg);
    transform: translateY(25%) rotate(22.5deg);
  }
  50% {
    border-bottom-right-radius: 100%;
    -o-transform: translateY(50%) scale(1, 0.9) rotate(45deg);
    transform: translateY(50%) scale(1, 0.9) rotate(45deg);
  }
  75% {
    -o-transform: translateY(25%) rotate(67.5deg);
    transform: translateY(25%) rotate(67.5deg);
  }
  100% {
    -o-transform: translateY(0) rotate(90deg);
    transform: translateY(0) rotate(90deg);
  }
}
@keyframes square-jelly-box-animate {
  17% {
    border-bottom-right-radius: 10%;
  }
  25% {
    -webkit-transform: translateY(25%) rotate(22.5deg);
    -moz-transform: translateY(25%) rotate(22.5deg);
    -o-transform: translateY(25%) rotate(22.5deg);
    transform: translateY(25%) rotate(22.5deg);
  }
  50% {
    border-bottom-right-radius: 100%;
    -webkit-transform: translateY(50%) scale(1, 0.9) rotate(45deg);
    -moz-transform: translateY(50%) scale(1, 0.9) rotate(45deg);
    -o-transform: translateY(50%) scale(1, 0.9) rotate(45deg);
    transform: translateY(50%) scale(1, 0.9) rotate(45deg);
  }
  75% {
    -webkit-transform: translateY(25%) rotate(67.5deg);
    -moz-transform: translateY(25%) rotate(67.5deg);
    -o-transform: translateY(25%) rotate(67.5deg);
    transform: translateY(25%) rotate(67.5deg);
  }
  100% {
    -webkit-transform: translateY(0) rotate(90deg);
    -moz-transform: translateY(0) rotate(90deg);
    -o-transform: translateY(0) rotate(90deg);
    transform: translateY(0) rotate(90deg);
  }
}
@-webkit-keyframes square-jelly-box-shadow {
  50% {
    -webkit-transform: scale(1.25, 1);
    transform: scale(1.25, 1);
  }
}
@-moz-keyframes square-jelly-box-shadow {
  50% {
    -moz-transform: scale(1.25, 1);
    transform: scale(1.25, 1);
  }
}
@-o-keyframes square-jelly-box-shadow {
  50% {
    -o-transform: scale(1.25, 1);
    transform: scale(1.25, 1);
  }
}
@keyframes square-jelly-box-shadow {
  50% {
    -webkit-transform: scale(1.25, 1);
    -moz-transform: scale(1.25, 1);
    -o-transform: scale(1.25, 1);
    transform: scale(1.25, 1);
  }
}
</style>
