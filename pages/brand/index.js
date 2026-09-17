// pages/brand/index.js 品牌档口（缤纷第三食堂）
const mock = require('../../utils/mock.js');

Page({
  data: {
    stalls: []
  },
  onLoad() {
    this.setData({ stalls: mock.brandStalls });
  }
});
