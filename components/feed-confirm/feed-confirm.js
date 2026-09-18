// components/feed-confirm/feed-confirm.js
// 喂食确认弹窗组件
// 属性：show { Boolean, value: false } — 是否显示
// 属性：dish { Object, value: null } — 当前菜品
// 事件：feedconfirm — 用户点击"分享给小猪"
// 事件：feedcancel  — 用户点击"取消/再想想"
const pet = require('../../utils/pet.js');

Component({
  properties: {
    show: { type: Boolean, value: false },
    dish: { type: Object, value: null }
  },

  data: {
    effect: null,       // 喂食效果预览
    computedEffectKey: '' // 标记，避免同一 dish 重复计算闪烁
  },

  observers: {
    // 监听 dish 变化 → 重算 effect
    'dish': function (dish) {
      if (!dish) {
        this.setData({ effect: null });
        return;
      }
      const effect = pet.getDishEffect(dish);
      this.setData({ effect, computedEffectKey: dish.id || dish.name || '' });
    },
    // 监听 show 变化 → 显示时确保 effect 已计算（防御性）
    'show': function (val) {
      if (val && this.data.dish && !this.data.effect) {
        const effect = pet.getDishEffect(this.data.dish);
        this.setData({ effect });
      }
    }
  },

  methods: {
    onConfirm() {
      this.triggerEvent('feedconfirm', { dish: this.data.dish });
    },
    onCancel() {
      this.triggerEvent('feedcancel');
    },
    stopPropagation() {
      // 阻止弹窗内点击冒泡到遮罩层
    }
  }
});
