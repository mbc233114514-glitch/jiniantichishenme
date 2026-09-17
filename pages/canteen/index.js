// pages/canteen/index.js 食堂菜单浏览
const mock = require('../../utils/mock.js');
const app = getApp();

Page({
  data: {
    floors: [],            // 楼层数据
    floorTabs: [],        // 楼层 Tab 文案
    activeFloor: 0,        // 当前楼层 index
    currentStalls: [],    // 当前楼层的档口列表
    detailPopup: null     // 当前打开的详情档口
  },

  onLoad() {
    const floors = mock.canteenData;
    this.setData({
      floors,
      floorTabs: floors.map(f => f.floor),
      currentStalls: floors[0].stalls
    });
  },

  // 切换楼层
  onFloorChange(e) {
    const idx = Number(e.currentTarget.dataset.index);
    this.setData({
      activeFloor: idx,
      currentStalls: this.data.floors[idx].stalls
    });
  },

  // 点击档口弹详情
  showDetail(e) {
    const stall = e.currentTarget.dataset.stall;
    this.setData({
      detailPopup: { ...stall, isFavorite: app.isFavorite(stall.id) }
    });
  },

  closeDetail() {
    this.setData({ detailPopup: null });
  },

  // 阻止冒泡
  stopPropagation() {},

  // 收藏
  toggleFav() {
    const s = this.data.detailPopup;
    if (!s) return;
    const isFav = app.toggleFavorite(s.id);
    this.setData({ 'detailPopup.isFavorite': isFav });
    wx.showToast({ title: isFav ? '已收藏' : '已取消', icon: 'none' });
  }
});
