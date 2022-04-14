<template>
  <a-popover trigger="click" overlayClassName="color-popover" placement="left">
    <div class="color">
      <div class="color-block" :style="{ backgroundColor: colorObj.rgba }"></div>
      <span>{{ }}</span>
    </div>
    <template #content>
      <div class="color-select">
        <div class="saturation-value" ref="saturation_value" @mousedown="mousedownSV">
          <div :style="`background-color: hsl(${hue}, 100%, 50%);`">
            <div class="point" :style="pointStyle"></div>
          </div>
          <div class="saturation-value-2"></div>
          <div class="saturation-value-3"></div>
        </div>
        <div class="color-select-middle">
          <div style="flex: auto">
            <div class="hue-slider" ref="hue_slider" @mousedown="mousedownHue">
              <div class="slider" :style="hueSliderStyle"></div>
            </div>
            <div class="alpha-slider" ref="alpha_slider" @mousedown="mousedownAlpha">
              <div class="slider" :style="alphaSliderStyle"></div>
              <div
                :style="`background: linear-gradient(to right, rgba(0,0,0,0), ${colorObj.rgb});width: 100%;height: 100%`"
              ></div>
            </div>
          </div>
          <div class="color-diamond">
            <div
              :style="`background-color: ${colorObj.rgba};width: 100%;height: 100%;box-shadow: inset 0 0 0 1px rgba(0, 0, 0, .15), inset 0 0 4px rgba(0, 0, 0, .25);`"
            ></div>
          </div>
        </div>
        <div class="color-value">
          <div class="hex">
            <label>
              <input :value="colorObj.hex8" @input="hexChange" spellcheck="false" />
            </label>
            <p>Hex</p>
          </div>
          <div class="rgba-r">
            <label>
              <input :value="red" @input="redChange" />
            </label>
            <p>R</p>
          </div>
          <div class="rgba-g">
            <label>
              <input :value="green" @input="greenChange" />
            </label>
            <p>G</p>
          </div>
          <div class="rgba-b">
            <label>
              <input :value="blue" @input="blueChange" />
            </label>
            <p>B</p>
          </div>
          <div class="rgba-a">
            <label>
              <input :value="alpha" @input="alphaChange" />
            </label>
            <p>A</p>
          </div>
        </div>
        <ul class="preset">
          <li
            v-for="item in preset"
            :key="item"
            :style="`background-color: ${item}`"
            @click="presetChange(item)"
          ></li>
        </ul>
      </div>
    </template>
  </a-popover>
</template>

<script lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import tinycolor, { ColorFormats } from 'tinycolor2';

export default {
  name: 'MyColorSelect',
  props: {
    color: {
      type: [Object, String],
      default() {
        return {
          r: 217,
          g: 128,
          b: 95,
          a: 1,
        };
      }
    },
    preset: {
      type: Array,
      default() {
        return [
          '#D0021B', '#F5A623', '#F8E71C', '#8B572A', '#7ED321',
          '#417505', '#BD10E0', '#9013FE', '#4A90E2', '#50E3C2',
          '#B8E986', '#000000', '#4A4A4A', '#9B9B9B', '#FFFFFF'
        ]
      }
    }
  },
  setup(props, { emit }) {
    const refs = {
      saturation_value: ref(null),
      hue_slider: ref(null),
      alpha_slider: ref(null),
    }
    let pointStyle = ref("top: 25%;left: 80%;");
    let hueSliderStyle = ref("left: 0;");
    let alphaSliderStyle = ref("left: calc(100% - 6px);");

    let hue = ref(0);
    let saturation = ref(1);
    let value = ref(1);

    let red = ref(255);
    let green = ref(0);
    let blue = ref(0);

    let alpha = ref(1);

    onMounted(() => {
      let { r, g, b, a } = tinycolor(props.color).toRgb();
      red.value = r;
      green.value = g;
      blue.value = b;
      alpha.value = a;
    })

    watch(() => props.color, (newValue) => {
      let { r, g, b, a } = tinycolor(newValue).toRgb();
      red.value = r;
      green.value = g;
      blue.value = b;
      alpha.value = a;
    })

    watch([red, green, blue], (newValue) => {
      emit('update:color', {
        r: red.value,
        g: green.value,
        b: blue.value,
        a: alpha.value,
      })

      let { h, s, v } = rgb2hsv(red.value, green.value, blue.value);

      hue.value = h;
      saturation.value = s;
      value.value = v;

      // 移动背景板圆圈
      pointStyle.value = `top: ${100 - v * 100}%;left: ${s * 100}%;`;
      // 移动色调滑块
      hueSliderStyle.value = `left: ${hue.value / 360 * 100}%;`;
    })

    watch(alpha, () => {
      emit('update:color', {
        r: red.value,
        g: green.value,
        b: blue.value,
        a: alpha.value,
      })
      // 移动透明度滑块
      alphaSliderStyle.value = `left: ${(alpha.value >= 1) ? 'calc(100% - 6px)' : (alpha.value * 100) + '%'};`;
    })

    let colorObj = computed(() => {
      let r = red.value;
      let g = green.value;
      let b = blue.value;
      let a = alpha.value;
      let h = hue.value;
      let s = saturation.value;
      let v = value.value;
      return {
        rgb: `rgba(${r},${g},${b})`,
        rgba: `rgba(${r},${g},${b},${a})`,
        hex6: rgba2hex(r, g, b),
        hex8: rgba2hex(r, g, b, a),
        hsv: `hsv(${h},${s},${v})`,
        hsl: ``
      };
    })

    // 输入框值变化,限制输入的值
    function hexChange(e) {
      let v = e.target.value;
      if (/^#?([0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(v)) {
        let { r, g, b, a } = hex2rgba(v);
        red.value = r;
        green.value = g;
        blue.value = b;
        alpha.value = a;
      }
    }

    function redChange(e) {
      let v = e.target.value;
      if (v !== "") {
        (v > 255) && (red.value = 255);
        (v < 0) && (red.value = 0);
        (v >= 0 && v <= 255) && (red.value = parseInt(v));
      }
    }

    function greenChange(e) {
      let v = e.target.value;
      if (v !== "") {
        (v > 255) && (green.value = 255);
        (v < 0) && (green.value = 0);
        (v >= 0 && v <= 255) && (green.value = parseInt(v));
      }
    }

    function blueChange(e) {
      let v = e.target.value;
      if (v !== "") {
        (v > 255) && (blue.value = 255);
        (v < 0) && (blue.value = 0);
        (v >= 0 && v <= 255) && (blue.value = parseInt(v));
      }
    }

    function alphaChange(e) {
      let v = e.target.value;
      if (v !== "") {
        v = parseFloat(v);
        alpha.value = v;
        (v > 1) && (alpha.value = 1);
        (v < 0) && (alpha.value = 0);
        (v >= 0 && v <= 1) && (alpha.value = v);
      }
    }

    // 点击预设方块事件
    function presetChange(item) {
      if (/^#?([0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(item)) {
        let { r, g, b, a } = hex2rgba(item);
        red.value = r;
        green.value = g;
        blue.value = b;
        alpha.value = a;
      }
    }

    // 饱和度和亮度
    function handleChangeSV(e) {
      let w = refs.saturation_value.value.clientWidth;
      let h = refs.saturation_value.value.clientHeight;
      let x = e.pageX - refs.saturation_value.value.getBoundingClientRect().left;
      let y = e.pageY - refs.saturation_value.value.getBoundingClientRect().top;
      x = (x < w && x > 0) ? x : (x > w ? w : 0);
      y = (y < h && y > 0) ? y : (y > h ? h : 0);
      // 计算饱和度和亮度
      saturation.value = Math.floor((x / w) * 100 + 0.5) / 100;
      value.value = Math.floor((1 - y / h) * 100 + 0.5) / 100;
      // hsv转化为rgb
      let { r, g, b } = hsv2rgb(hue.value, saturation.value, value.value);
      red.value = r;
      green.value = g;
      blue.value = b;
      // 移动背景板圆圈
      pointStyle.value = `top: ${y}px;left: ${x}px;`;
    }

    function mousedownSV(e) {
      // 鼠标按下计算饱和度和亮度并添加事件
      handleChangeSV(e);
      // 添加整个页面的鼠标事件
      window.addEventListener('mousemove', handleChangeSV)
      window.addEventListener('mouseup', mouseupSV)
    }

    function mouseupSV(e) {
      // 鼠标松开后移除事件
      window.removeEventListener('mousemove', handleChangeSV)
      window.removeEventListener('mouseup', mouseupSV)
    }

    // 色调
    function handleChangeHue(e) {
      let w = refs.hue_slider.value.clientWidth;
      let x = e.pageX - refs.saturation_value.value.getBoundingClientRect().left;
      x = (x < w && x > 0) ? x : (x > w ? w : 0);
      // 计算色调
      hue.value = Math.floor((x / w) * 360 + 0.5);
      // hsv转化为rgb
      let { r, g, b } = hsv2rgb(hue.value, saturation.value, value.value);
      red.value = r;
      green.value = g;
      blue.value = b;
      // 移动滑块
      hueSliderStyle.value = `left: ${x >= (w - 6) ? (w - 6) : x}px;`;
    }

    function mousedownHue(e) {
      handleChangeHue(e);
      window.addEventListener('mousemove', handleChangeHue)
      window.addEventListener('mouseup', mouseupHue)
    }

    function mouseupHue(e) {
      window.removeEventListener('mousemove', handleChangeHue)
      window.removeEventListener('mouseup', mouseupHue)
    }

    // 透明度
    function handleChangeAlpha(e) {
      let w = refs.alpha_slider.value.clientWidth;
      let x = e.pageX - refs.saturation_value.value.getBoundingClientRect().left;
      x = (x < w && x > 0) ? x : (x > w ? w : 0);
      // 计算透明度
      alpha.value = Math.floor((x / w) * 100 + 0.5) / 100;
      // 移动滑块
      alphaSliderStyle.value = `left: ${x >= (w - 6) ? (w - 6) : x}px;`;
    }

    function mousedownAlpha(e) {
      handleChangeAlpha(e);
      window.addEventListener('mousemove', handleChangeAlpha)
      window.addEventListener('mouseup', mouseupAlpha)
    }

    function mouseupAlpha(e) {
      window.removeEventListener('mousemove', handleChangeAlpha)
      window.removeEventListener('mouseup', mouseupAlpha)
    }

    function hsv2rgb(h, s, v) {
      (h === 360) && (h = 0);
      let i = Math.floor(h / 60) % 6;
      let f = h / 60 - i;
      let p = v * (1 - s);
      let q = v * (1 - s * f);
      let t = v * (1 - s * (1 - f));
      let r, g, b;
      switch(i) {
        case 0:
          r = v;
          g = t;
          b = p;
          break;
        case 1:
          r = q;
          g = v;
          b = p;
          break;
        case 2:
          r = p;
          g = v;
          b = t;
          break;
        case 3:
          r = p;
          g = q;
          b = v;
          break;
        case 4:
          r = t;
          g = p;
          b = v;
          break;
        case 5:
          r = v;
          g = p;
          b = q;
          break;
      }
      
      r = Math.floor(r * 255 + 0.5);
      g = Math.floor(g * 255 + 0.5);
      b = Math.floor(b * 255 + 0.5);
      return { r, g, b }
    }

    function rgb2hsv(r, g, b) {
      let r1 = r / 255;
      let g1 = g / 255;
      let b1 = b / 255;
      let cmax = Math.max(r1, g1, b1);
      let cmin = Math.min(r1, g1, b1);
      let d = cmax - cmin;
      let h, s, v;
      if (d === 0) {
        h = 0;
      } else if (cmax === r1) {
        h = ((60 * (g1 - b1) / d) + 360) % 360;
      } else if (cmax === g1) {
        h = 60 * ((b1 - r1) / d + 2)
      } else if (cmax === b1) {
        h = 60 * ((r1 - g1) / d + 4)
      }
      if (cmax === 0) {
        s = 0;
      } else {
        s = d / cmax;
      }
      v = cmax;
      h = Math.floor(h + 0.5);
      s = Math.floor(s * 100 + 0.5) / 100;
      v = Math.floor(v * 100 + 0.5) / 100;
      return { h, s, v };
    }

    function rgba2hex(r, g, b, a = 1) {
      r = parseInt(r);
      let r1 = (r.toString(16).length !== 2) ? ('0' + r.toString(16)) : r.toString(16);
      g = parseInt(g);
      let g1 = (g.toString(16).length !== 2) ? ('0' + g.toString(16)) : g.toString(16);
      b = parseInt(b);
      let b1 = (b.toString(16).length !== 2) ? ('0' + b.toString(16)) : b.toString(16);
      a = parseFloat(a);
      let a1 = "";
      if (a !== 1) {
        let temp = Math.floor(256 * a);
        a1 = (temp.toString(16).length !== 2) ? ('0' + temp.toString(16)) : temp.toString(16);
      }
      return `#${r1}${g1}${b1}${a1}`.toUpperCase();
    }

    function hex2rgba(s) {
      if (/^#?[0-9a-fA-F]{3}$/.test(s)) {
        let b = s.substring(s.length - 1, s.length);
        let g = s.substring(s.length - 2, s.length - 1);
        let r = s.substring(s.length - 3, s.length - 2);
        return hex2rgba(`${r + r}${g + g}${b + b}`);
      }
      if (/^#?[0-9a-fA-F]{4}$/.test(s)) {
        let a = s.substring(s.length - 1, s.length);
        let b = s.substring(s.length - 2, s.length - 1);
        let g = s.substring(s.length - 3, s.length - 2);
        let r = s.substring(s.length - 4, s.length - 3);
        return hex2rgba(`${r + r}${g + g}${b + b}${a + a}`);
      }
      if (/^#?[0-9a-fA-F]{6}$/.test(s)) {
        let b = parseInt('0x' + s.substring(s.length - 2, s.length));
        let g = parseInt('0x' + s.substring(s.length - 4, s.length - 2));
        let r = parseInt('0x' + s.substring(s.length - 6, s.length - 4));
        return { r, g, b, a: 1 };
      }
      if (/^#?[0-9a-fA-F]{8}$/.test(s)) {
        let a = parseInt('0x' + s.substring(s.length - 2, s.length));
        a = a / 255;
        let b = parseInt('0x' + s.substring(s.length - 4, s.length - 2));
        let g = parseInt('0x' + s.substring(s.length - 6, s.length - 4));
        let r = parseInt('0x' + s.substring(s.length - 8, s.length - 6));
        return { r, g, b, a };
      }
    }

    return {
      colorObj,
      ...refs,
      pointStyle,
      hueSliderStyle,
      alphaSliderStyle,
      hue,
      saturation,
      value,
      red,
      green,
      blue,
      alpha,
      hexChange,
      redChange,
      greenChange,
      blueChange,
      alphaChange,
      presetChange,
      mousedownSV,
      mousedownHue,
      mousedownAlpha,
    }
  },
}
</script>
<style lang="scss">
.color {
  &-popover {
    .ant-popover-inner {
      background-color: white;
    }
    .ant-popover-arrow {
      border-top-color: white !important;
      border-right-color: white !important;
    }
    .ant-popover-inner-content {
      padding: 0;
    }
    &.ant-popover-placement-left > .ant-popover-content > .ant-popover-arrow {
      right: 7px;
    }
  }
}
</style>
<style scoped lang="scss">
.color {
  &-block {
    background-color: red;
    width: 50px;
    height: 24px;
    cursor: pointer;
  }
}
.color-select {
  width: 300px;
  position: relative;
  user-select: none;
  background: #fff;
  padding: 10px;
  color: #333;
  /*border: 1px solid #ccc;*/
  /*border-radius: 10px;*/
}

/* 饱和度和亮度 */
.saturation-value {
  cursor: pointer;
  width: 100%;
  height: 200px;
  position: relative;
  margin-bottom: 10px;
  box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.1);
}

.saturation-value > div {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

/* 圆圈 */
.point {
  box-sizing: border-box;
  width: 6px;
  height: 6px;
  background-color: transparent;
  border: 2px solid #ccc;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  position: absolute;
  z-index: 9;
}

.saturation-value-2 {
  background: linear-gradient(to right, white, #ffffff00);
}

.saturation-value-3 {
  background: linear-gradient(to top, black, #ffffff00);
}

/* 色调 透明度 */
.color-select-middle {
  width: 100%;
  display: flex;
  margin-bottom: 10px;
}

/* 色调滑块条 */
.hue-slider {
  position: relative;
  margin-bottom: 6px;
  height: 10px;
  background: linear-gradient(
    90deg,
    red 0,
    #ff0 17%,
    #0f0 33%,
    #0ff 50%,
    #00f 67%,
    #f0f 83%,
    red
  );
  box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.1);
}

/* 透明度滑块条 */
.alpha-slider {
  position: relative;
  height: 10px;
  box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.1);
  background: #fff
    url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAWElEQVRIiWM8fubkfwYygKWJOSM5+mCAhRLNoxaPWjxq8ajFoxbTyeL/DAfJ0Xjs3Cl7Siwmu4Yht1aDgZEYx6MWj1o8avGoxaMWD3qLya5X//4nqx6HAQC7RBGFzolqTAAAAABJRU5ErkJggg==");
  background-size: 10px 10px;
}

/* 滑块 */
.slider {
  position: absolute;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.6);
  box-sizing: border-box;
  width: 6px;
  height: 100%;
  background-color: #fff;
}

/* 颜色方块 */
.color-diamond {
  position: relative;
  margin-left: 5px;
  width: 26px;
  height: 26px;
  border-radius: 3px;
  overflow: hidden;
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAWElEQVRIiWM8fubkfwYygKWJOSM5+mCAhRLNoxaPWjxq8ajFoxbTyeL/DAfJ0Xjs3Cl7Siwmu4Yht1aDgZEYx6MWj1o8avGoxaMWD3qLya5X//4nqx6HAQC7RBGFzolqTAAAAABJRU5ErkJggg==");
  background-size: 10px 10px;
}

/* 颜色的值 hex rgba */
.color-value {
  width: 100%;
  display: flex;
  justify-content: space-between;
}

.color-value div {
  padding: 0 3px;
  text-align: center;
}

.color-value input {
  font-size: 12px;
  box-sizing: border-box;
  width: 34px;
  height: 24px;
  padding: 0;
  margin: 0;
  outline: none;
  text-align: center;
  border-radius: 3px;
  border: 1px solid #ccc;
}

.color-value p {
  font-size: 12px;
  margin: 3px 0 0;
}

.color-value .rgba-a {
  padding-right: 0;
}

.color-value .hex {
  flex: 1;
  padding-left: 0;
}

.color-value .hex input {
  width: 100%;
  height: 24px;
}

/* 预设颜色  */
.preset {
  width: 100%;
  padding: 0;
  margin: 10px 0 0;
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
}

.preset li {
  width: 20px;
  height: 20px;
  margin-right: 6px;
  margin-bottom: 6px;
  border: 1px solid #ccc;
  border-radius: 6px;
}
</style>
