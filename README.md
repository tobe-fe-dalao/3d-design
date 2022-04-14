<p align="center">
  <a href="#">
    <img width="300" height="auto" src="./src/assets/img/logo.png"/>
  </a>
</p>
<div align="center">一个零门槛快速上手、可生成图或代码片段的3D模型调优工作台</div>


## 简介
3DDesign是由UU跑腿-大前端技术团队发起的3D模型工具平台，核心功能基于高性能 Web 图形引擎 [Oasis](https://oasisengine.cn/) 实现。  

<img width="600px" src="./public/docs/3DD.gif" /> 

### 架构设计

> 定位3D模型调试和产出的流程，基于Oasis引擎实时渲染，快速生成。  

<img width="600px" src="./public/docs/jiagou.png" /> 

下面是通过3DD产出的作品，相对建模软件渲染提高`300%`的效率，质量折损`18%`以内，并且可以通过JS脚本控制动画或可停止动画交互。

<img width="600px" src="./public/docs/runman.gif" />  

也可以通过js写微交互脚本，下面是图标的交互案例

<img width="120px" src="./public/docs/js-plugin.gif" />  


## 特性

- ✅Web3D调优：可视化配置，基于Oasis深度定制，移动端优先
- ✅拥抱PBR：[PBR材质](https://oasisengine.cn/0.6/docs/material-cn) 遵循能量守恒，符合物理规则，美术们只需要调整几个简单的参数，即使在复杂的场景中也能保证正确的渲染效果。
- ✅一键导图：支持导出不同尺寸的jpg、png图片
- ✅生成代码：支持自定义配置并生成代码片段，无缝嵌入Vue/React等框架中
- ✅导出配置：可以将调优后的配置导出，配合业务做深度交互
- ✅所见即所得：不再需要前端与UI反复的调整模型还原效果。
- ✅材质服用

## 安装
本地运行
1. 安装依赖
```shell
pnpm install
//or
yarn install 
```
2. 运行
```
npm run dev
```

[进入体验 😀](https://tobe-fe-dalao.github.io/3d-design/#/)

## 加入维护团队

| 标题 | 二维码 | 目前状态 |
| ---- | ---- | ----- |
| 3DD官方维护群                                              | <img src="./public/docs/dingtalk.png" width="200" /> </br>「钉钉群 」                |      招募中    |
| 扫地盲僧公众号                                             | <img src="./public/docs/wechat.jpg" width="200" /> </br>关注后回复「3DD」 | 运营中 |
Oasis官方交流群 | <img src="./public/docs/oasis-dingtalk.jpg" width="200" /> </br>「钉钉群 」 | 运营中                                                              |

## 开发计划
[Milestones](https://github.com/tobe-fe-dalao/3d-design/projects)  

## 开源协议
[MIT License](./LICENSE)  

