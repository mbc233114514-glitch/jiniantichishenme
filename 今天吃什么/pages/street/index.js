// pages/street/index.js 校外小吃街
const db = require('../../utils/db.js');
const app = getApp();

Page({
  data: {
    foods: []   // 带前端 isFavorite 字段
  },
  onLoad() {
    this.refreshList();
  },
  // 重新拉取列表 + 同步收藏状态（云优先，内存缓存命中时零耗时）
  refreshList() {
    db.getStreets().then(source => {
      const list = source.map(f => ({
        ...f,
        isFavorite: app.isFavorite(f.id)
      }));
      this.setData({ foods: list });
    });
  },
  // 切换"想去"
  toggleWant(e) {
    const id = e.currentTarget.dataset.id;
    app.toggleFavorite(id);
    this.refreshList();
    wx.showToast({
      title: '已更新想去列表',
      icon: 'none'
    });
  }
});
