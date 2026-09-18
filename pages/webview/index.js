// pages/webview/index.js 带错误兜底
Page({
  data: { url: '', title: '', loadError: false },

  onLoad(opts) {
    const url = opts.url ? decodeURIComponent(opts.url) : '';
    const title = opts.title ? decodeURIComponent(opts.title) : '外部页面';
    wx.setNavigationBarTitle({ title });
    this.setData({ url, title });
  },

  onWebviewError(e) {
    // web-view 加载失败（通常是业务域名未配置或测试号限制）
    this.setData({ loadError: true });
    wx.showToast({ title: '页面加载失败', icon: 'none' });
  },

  onWebviewLoad() {
    // 加载成功，清除错误态
    this.setData({ loadError: false });
  },

  copyLink() {
    wx.setClipboardData({
      data: this.data.url,
      success: () => wx.showToast({ title: '链接已复制', icon: 'success' })
    });
  }
});
