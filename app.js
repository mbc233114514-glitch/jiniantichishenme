// app.js 小程序入口
App({
  globalData: {
    favorites: [],     // 全局收藏列表，存储食品 id
    cloudEnv: 'cloud1-d6g0r1pok53464805',  // 云开发环境 ID
    cloudReady: false  // 云开发是否初始化成功
  },

  onLaunch() {
    // 初始化云开发（基础库 2.2.3+ 支持；低版本或非云环境静默降级）
    if (wx.cloud) {
      try {
        wx.cloud.init({
          env: this.globalData.cloudEnv,
          traceUser: true
        });
        this.globalData.cloudReady = true;
      } catch (e) {
        console.warn('[cloud] init failed, fallback to local mock:', e);
      }
    }

    // 启动时从本地缓存读取收藏列表
    const fav = wx.getStorageSync('favorites');
    if (Array.isArray(fav)) {
      this.globalData.favorites = fav;
    }
    // 启动时对宠物属性做一次衰减计算
    try {
      const pet = require('./utils/pet.js');
      pet.decayStats();
    } catch (e) {
      // 首次启动无宠物数据，忽略
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
