// app.js 小程序入口
App({
  globalData: {
    favorites: []  // 全局收藏列表，存储食品 id
  },

  onLaunch() {
    // 启动时从本地缓存读取收藏列表
    const fav = wx.getStorageSync('favorites');
    if (Array.isArray(fav)) {
      this.globalData.favorites = fav;
    }
  },

  // 添加或取消收藏
  toggleFavorite(id) {
    const list = this.globalData.favorites;
    const idx = list.indexOf(id);
    if (idx >= 0) {
      list.splice(idx, 1);
    } else {
      list.push(id);
    }
    wx.setStorageSync('favorites', list);
    return idx < 0;  // 返回 true 表示已收藏
  },

  isFavorite(id) {
    return this.globalData.favorites.includes(id);
  }
});
