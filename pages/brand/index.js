// pages/brand/index.js 品牌档口（缤纷第三食堂）
const db = require('../../utils/db.js');

Page({
  data: {
    stalls: []
  },
  onLoad() {
    // 云数据库优先，失败自动回退本地 mock
    db.getBrands().then(list => this.setData({ stalls: list }));
  }
});
