// pages/index/index.js 首页：随机推荐 + 筛选 + 快捷入口
const mock = require('../../utils/mock.js');
const app = getApp();

Page({
  data: {
    filterTabs: [],        // 顶部筛选 Tab
    activeFilter: 'all',   // 当前筛选 key
    recommend: null,       // 当前推荐结果
    recommendList: [],     // 当前筛选范围内的美食池
    isRolling: false,      // 是否在随机动画中
    quickEntries: [],      // 快捷入口
    isFavorite: false      // 当前推荐是否已收藏
  },

  onLoad() {
    this.setData({
      filterTabs: mock.filterTabs,
      quickEntries: mock.quickEntries
    });
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
    const pool = filter === 'all'
      ? mock.allFoods
      : mock.allFoods.filter(f => f.category === filter);
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
    // 简易"转盘"动画：每 80ms 切换一个，300ms 后定型
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

  // 下拉刷新：重新随机一次
  onPullDownRefresh() {
    this.updatePool();
    setTimeout(() => wx.stopPullDownRefresh(), 600);
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
  }
});
