// pages/index/index.js 首页：随机推荐 + 筛选 + 快捷入口 + 喂食分享
const mock = require('../../utils/mock.js');
const db = require('../../utils/db.js');
const pet = require('../../utils/pet.js');
const app = getApp();

Page({
  data: {
    filterTabs: [],        // 顶部筛选 Tab
    activeFilter: 'all',   // 当前筛选 key
    recommend: null,       // 当前推荐结果
    recommendList: [],     // 当前筛选范围内的美食池
    cloudFoods: [],        // 云端/缓存的全部美食（初始用本地 mock 占位，避免空闪）
    cloudLinks: [],        // 云端/缓存的链接店铺
    isRolling: false,      // 是否在随机动画中
    quickEntries: [],      // 快捷入口
    isFavorite: false,     // 当前推荐是否已收藏
    showFeedConfirm: false // 是否显示喂食确认弹窗
  },

  onLoad() {
    // 纯 UI 配置留在本地
    this.setData({
      filterTabs: mock.filterTabs,
      quickEntries: mock.quickEntries,
      cloudFoods: mock.allFoods,
      cloudLinks: mock.linkDishes
    });
    // 异步加载云端数据（云不可用时 db.js 自动回退本地 mock）
    Promise.all([db.getFoods(), db.getLinks()]).then(res => {
      this.setData({ cloudFoods: res[0], cloudLinks: res[1] }, () => this.updatePool());
    });
    // 先用本地数据出首屏
    this.updatePool();
  },

  // 切换筛选 Tab
  onFilterChange(e) {
    const key = e.currentTarget.dataset.key;
    this.setData({ activeFilter: key }, () => this.updatePool());
  },

  // 更新当前筛选范围内的美食池，并随机一个
  updatePool() {
    const filter = this.data.activeFilter;
    let pool;
    if (filter === 'all') {
      pool = this.data.cloudFoods;
    } else if (filter === '链接') {
      pool = this.data.cloudLinks;
    } else {
      pool = this.data.cloudFoods.filter(f => f.category === filter);
    }
    this.setData({ recommendList: pool }, () => this.rollRandom());
  },

  // 随机推荐（带动画）
  rollRandom() {
    if (this.data.isRolling) return;
    const pool = this.data.recommendList;
    if (!pool || pool.length === 0) {
      this.setData({ recommend: null });
      return;
    }
    this.setData({ isRolling: true });
    // 简易"转盘"动画：每 80ms 切换一个，约 640ms 后定型
    let count = 0;
    this.timer && clearInterval(this.timer);
    this.timer = setInterval(() => {
      const r = pool[Math.floor(Math.random() * pool.length)];
      this.setData({ recommend: r });
      count++;
      if (count >= 8) {
        clearInterval(this.timer);
        const final = pool[Math.floor(Math.random() * pool.length)];
        this.setData({
          recommend: final,
          isRolling: false,
          isFavorite: app.isFavorite(final.id)
        });
      }
    }, 80);
  },

  // 下拉刷新：强制拉取云端最新数据后重新随机
  onPullDownRefresh() {
    Promise.all([db.getFoods({ forceCloud: true }), db.getLinks({ forceCloud: true })])
      .then(res => {
        this.setData({ cloudFoods: res[0], cloudLinks: res[1] }, () => this.updatePool());
      })
      .catch(() => this.updatePool())
      .then(() => setTimeout(() => wx.stopPullDownRefresh(), 600));
  },

  // 跳转到对应页面
  goEntry(e) {
    const path = e.currentTarget.dataset.path;
    wx.navigateTo({ url: path });
  },

  // 收藏当前推荐
  toggleFav() {
    if (!this.data.recommend) return;
    const isFav = app.toggleFavorite(this.data.recommend.id);
    this.setData({ isFavorite: isFav });
    wx.showToast({
      title: isFav ? '已收藏' : '已取消',
      icon: 'none'
    });
  },

  // 点击"我吃完了" → 弹出喂食确认
  onAteIt() {
    if (!this.data.recommend) return;
    // 链接类店铺不支持喂食（没有 tag 效果）
    if (this.data.activeFilter === '链接') {
      wx.showModal({
        title: '提示',
        content: '链接店铺暂不支持喂食，请到其他分类选菜后再试~',
        showCancel: false
      });
      return;
    }
    this.setData({ showFeedConfirm: true });
  },

  // 喂食确认回调
  onFeedConfirm(e) {
    const dish = e.detail.dish;
    this.setData({ showFeedConfirm: false });
    const { levelUp, newLevel } = pet.feedPet(dish);
    wx.showToast({ title: '已分享给小猪！', icon: 'success', duration: 1500 });
    if (levelUp) {
      setTimeout(() => {
        wx.showModal({ title: '🎉 升级啦', content: `泉纺小猪升到 Lv.${newLevel} 啦！`, showCancel: false });
      }, 1600);
    }
  },

  onFeedCancel() {
    this.setData({ showFeedConfirm: false });
  },

  // 跳转链接店铺
  goLinkDish() {
    const dish = this.data.recommend;
    if (!dish || this.data.activeFilter !== '链接') return;
    wx.showModal({
      title: '跳转确认',
      content: `即将打开「${dish.name}」的页面，是否继续？`,
      success: (res) => {
        if (res.confirm) {
          wx.navigateTo({
            url: `/pages/webview/index?url=${encodeURIComponent(dish.url)}&title=${encodeURIComponent(dish.name)}`
          });
        }
      }
    });
  }
});
