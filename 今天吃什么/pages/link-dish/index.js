// pages/link-dish/index.js 链接菜品页
const db = require('../../utils/db.js');

Page({
  data: { list: [] },
  onLoad() {
    // 云数据库优先，失败自动回退本地 mock
    db.getLinks().then(list => this.setData({ list }));
  },
  goJump(e) {
    const url = e.currentTarget.dataset.url;
    const name = e.currentTarget.dataset.name;
    const appId = e.currentTarget.dataset.appid || '';
    const isHttp = /^https?:\/\//i.test(url);

    if (appId) {
      // 有 appId：navigateToMiniProgram 一键跳转
      wx.showModal({
        title: '跳转确认',
        content: `即将跳转到「${name}」小程序，是否继续？`,
        success: (res) => {
          if (!res.confirm) return;
          wx.navigateToMiniProgram({
            appId,
            path: '',
            fail: () => {
              wx.showModal({
                title: '跳转失败',
                content: '可能未配置跳转白名单，是否改为复制链接手动打开？',
                success: (r) => {
                  if (r.confirm) {
                    wx.setClipboardData({
                      data: url,
                      success: () => wx.showToast({ title: '已复制', icon: 'success' })
                    });
                  }
                }
              });
            }
          });
        }
      });
    } else if (isHttp) {
      // http/https：走 webview 页面
      wx.showModal({
        title: '跳转确认',
        content: `即将打开「${name}」，是否继续？`,
        success: (res) => {
          if (res.confirm) {
            wx.navigateTo({
              url: `/pages/webview/index?url=${encodeURIComponent(url)}&title=${encodeURIComponent(name)}`
            });
          }
        }
      });
    } else {
      // 兜底：复制到剪贴板
      wx.setClipboardData({
        data: url,
        success: () => wx.showToast({ title: '已复制', icon: 'success' })
      });
    }
  }
});
