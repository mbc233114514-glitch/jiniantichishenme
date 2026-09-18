// pages/pet/index.js 电子宠物页
const pet = require('../../utils/pet.js');
const mock = require('../../utils/mock.js');
const db = require('../../utils/db.js');
const sensitive = require('../../utils/sensitive-words.js');

const PIG_NAME_KEY = 'pigName';
const DEFAULT_PIG_NAME = '小猪';

Page({
  data: {
    petData: null,          // 完整宠物数据
    stateInfo: null,        // 当前状态信息（emoji/label/tip）
    animClass: '',          // 当前动画 class
    currentImg: '',         // 当前状态图片（云 fileID 优先，本地路径兜底）
    showFeedConfirm: false, // 是否显示喂食确认弹窗
    pendingDish: null,      // 待喂食菜品
    unlockedFeedList: [],   // 已解锁菜品列表（用于手动喂食）
    isAnimating: false,     // 是否正在播放动画
    pigName: DEFAULT_PIG_NAME,   // 小猪名字（从 storage 读取）
    showRename: false,      // 是否显示改名弹窗
    renameValue: '',        // 弹窗输入值
    renameError: ''         // 敏感词错误提示（红色）
  },

  onLoad() {
    this._foods = mock.allFoods;   // 菜品池（本地兜底，云端覆盖）
    this._imgMap = null;           // 宠物云图 fileID 映射
    this.loadPigName();
    this.refresh();
    // 异步加载云端菜品
    db.getFoods().then(list => {
      this._foods = list;
      this.refresh();
    });
    // 异步加载云存储宠物图片（无则继续用包内本地图）
    db.getPetImageMap().then(map => {
      if (map) {
        this._imgMap = map;
        this.refresh();
      }
    });
  },

  // 从本地 storage 读取小猪名字
  loadPigName() {
    const name = wx.getStorageSync(PIG_NAME_KEY);
    this.setData({ pigName: (name && String(name).trim()) || DEFAULT_PIG_NAME });
  },

  onShow() {
    this.refresh();
  },

  refresh() {
    const { pet: pd, stateInfo, animClass } = pet.getPetDisplay();
    const foods = this._foods || mock.allFoods;
    // 从全部菜品中过滤已解锁的
    let unlockedFeedList = foods.filter(f => pd.unlockedDishes && pd.unlockedDishes.includes(f.id));
    // 如果没有解锁菜品，给几个默认解锁的方便测试
    if (unlockedFeedList.length === 0) {
      unlockedFeedList = foods.slice(0, 5);
    }
    // 当前状态图片：云存储 fileID 优先，否则用代码包内本地图片
    const currentImg = (this._imgMap && this._imgMap[pd.currentState])
      || ('/assets/pet/pet_' + pd.currentState + '.png');
    this.setData({
      petData: pd,
      stateInfo,
      animClass,
      currentImg,
      unlockedFeedList
    });
  },

  // === 三个互动按钮 ===

  onPlay() {
    if (this.data.isAnimating) return;
    this.setData({ isAnimating: true, animClass: 'anim-happy' });
    const { levelUp, newLevel } = pet.playPet();
    setTimeout(() => {
      this.refresh();
      this.setData({ isAnimating: false });
      wx.showToast({ title: '小猪玩得很开心！', icon: 'none' });
      if (levelUp) wx.showModal({ title: '🎉 升级啦', content: `小猪升到 Lv.${newLevel} 啦！`, showCancel: false });
    }, 1200);
  },

  onClean() {
    if (this.data.isAnimating) return;
    this.setData({ isAnimating: true, animClass: 'anim-cleaning' });
    const { levelUp, newLevel } = pet.cleanPet();
    setTimeout(() => {
      this.refresh();
      this.setData({ isAnimating: false });
      wx.showToast({ title: '洗香香啦~', icon: 'none' });
      if (levelUp) wx.showModal({ title: '🎉 升级啦', content: `小猪升到 Lv.${newLevel} 啦！`, showCancel: false });
    }, 1200);
  },

  // 手动从已解锁列表选一个喂食
  onManualFeed(e) {
    const id = e.currentTarget.dataset.id;
    const dish = this.data.unlockedFeedList.find(d => d.id === id);
    if (!dish) return;
    this.setData({ showFeedConfirm: true, pendingDish: dish });
  },

  // === 喂食弹窗回调 ===
  onFeedConfirm(e) {
    const dish = e.detail.dish;
    this.setData({ showFeedConfirm: false, isAnimating: true, animClass: 'anim-eating' });
    const { levelUp, newLevel } = pet.feedPet(dish);
    setTimeout(() => {
      this.refresh();
      this.setData({ isAnimating: false });
      wx.showToast({ title: '小猪吃饱饱~', icon: 'none' });
      if (levelUp) wx.showModal({ title: '🎉 升级啦', content: `小猪升到 Lv.${newLevel} 啦！`, showCancel: false });
    }, 1500);
  },
  onFeedCancel() {
    this.setData({ showFeedConfirm: false, pendingDish: null });
  },

  // 跳首页选菜
  goIndex() {
    wx.switchTab({ url: '/pages/index/index', fail: () => wx.navigateBack() });
  },

  // 跳转云资源管理页
  goCloudAdmin() {
    wx.navigateTo({ url: '/pages/cloud-admin/index' });
  },

  // ====== 改名弹窗 ======

  // 点击名字 → 打开弹窗
  onTapName() {
    this.setData({
      showRename: true,
      renameValue: this.data.pigName,
      renameError: ''
    });
  },

  // 实时输入：只允许中文、英文、数字，过滤特殊符号
  onRenameInput(e) {
    const raw = e.detail.value || '';
    // 只保留中文、英文字母、数字，其余全部剔除
    const filtered = raw.replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, '');
    this.setData({
      renameValue: filtered,
      renameError: ''
    });
  },

  // 确认改名
  onRenameConfirm() {
    const name = (this.data.renameValue || '').trim();
    if (!name) {
      this.setData({ renameError: '名字不能为空' });
      return;
    }
    // 敏感词检查
    const result = sensitive.checkSensitive(name);
    if (!result.pass) {
      this.setData({
        renameError: `包含敏感词（${result.label}），请修改`
      });
      return;
    }
    // 存到本地 storage
    wx.setStorageSync(PIG_NAME_KEY, name);
    this.setData({
      pigName: name,
      showRename: false,
      renameError: ''
    });
    wx.showToast({ title: '名字已更新', icon: 'success', duration: 1000 });
  },

  // 取消改名
  onRenameCancel() {
    this.setData({
      showRename: false,
      renameError: ''
    });
  },

  // 阻止弹窗内容区域点击冒泡到遮罩
  noop() {},

  // 重置宠物（调试）
  onReset() {
    wx.showModal({
      title: '重置确认',
      content: '确定要重置泉纺小猪的所有数据吗？',
      confirmColor: '#F44336',
      success: (res) => {
        if (res.confirm) {
          pet.resetPet();
          this.refresh();
          wx.showToast({ title: '已重置', icon: 'success' });
        }
      }
    });
  }
});
