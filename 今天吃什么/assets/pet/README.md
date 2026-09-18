# 宠物素材目录

## 当前方案：Emoji + CSS 动画（无需实际 PNG）

为避免真实图片资源缺失导致的空白/破图问题，当前项目采用 **Emoji（🐷）+ CSS 动画 + 状态装饰符** 的组合方案来表现 6 种宠物状态：

| 状态 | 主 Emoji | 装饰符 | CSS 动画 |
|------|----------|--------|----------|
| excited 兴奋/期待 | 🐷 | ✨（星星闪烁） | animExcited 轻微跳动+旋转 |
| happy 开心 | 🐷 | 💕（爱心漂浮） | animHappy 开心跳跃 |
| hungry 饥饿 | 🐷 | 🍖（食物图标） | animHungry 轻微缩放（肚子饿了瘪下去） |
| bored 无聊/难过 | 🐷 | 💔（心碎） | animBored 轻微左右摇摆 + 半透明 |
| dirty 脏兮兮 | 🐷 | 💩（便便） | animDirty 轻微下沉 |
| sleeping 睡觉 | 🐷 | 💤（ZZZ） | animSleep 呼吸式缩放 |

## 如果想用真实 PNG 图片（可选）

在本目录下放置以下 6 张图片（512×512px 透明 PNG）：

- `pet_excited.png` — 兴奋/期待
- `pet_happy.png` — 开心
- `pet_hungry.png` — 饥饿
- `pet_bored.png` — 无聊/难过
- `pet_dirty.png` — 脏兮兮
- `pet_sleeping.png` — 睡觉

替换方式：编辑 `pages/pet/index.wxml`，把 `<view class="pet-emoji">🐷</view>` 改为：
```xml
<image src="/assets/pet/pet_{{petData.currentState}}.png" class="pet-img" mode="aspectFit" />
```
并在 `pages/pet/index.wxss` 中加：
```css
.pet-img { width: 400rpx; height: 400rpx; }
```
同时可移除 `.pet-emoji` 相关样式。

注意：状态判定逻辑在 `utils/pet.js` 的 `getPetState()` 函数中，返回 key 与文件名一一对应。
