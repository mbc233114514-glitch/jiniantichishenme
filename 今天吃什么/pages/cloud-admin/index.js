// pages/cloud-admin/index.js 云资源管理（开发/运维页）
const dbLayer = require('../../utils/db.js');

// 6 种宠物状态 → 本地包内图片路径
const PET_STATES = ['excited', 'happy', 'hungry', 'bored', 'dirty', 'sleeping'];
const COLLECTION_NAMES = ['foods', 'canteens', 'brands', 'streets', 'links'];

Page({
  data: {
    cloudReady: false,
    busy: false,
    log: '',
    counts: {}
  },

  onLoad() {
    this.setData({ cloudReady: dbLayer.isCloudReady() });
  },

  // 日志输出到页面
  log(msg) {
    const time = new Date().toLocaleTimeString();
    this.setData({ log: '[' + time + '] ' + msg + '\n' + this.data.log });
  },

  // 1. 调用 initData 云函数初始化数据库（推荐）
  seedByFunction() {
    if (!this.guard()) return;
    this.setData({ busy: true });
    this.log('开始调用 initData 云函数...');
    wx.cloud.callFunction({
      name: 'initData',
      data: { action: 'seedAll' },
      success: res => {
        if (res.result && res.result.code === 0) {
          this.log('✅ ' + res.result.msg + ' ' + JSON.stringify(res.result.result));
          wx.showToast({ title: '数据库初始化成功', icon: 'success' });
          this.checkCounts();
        } else {
          this.log('❌ 云函数返回异常: ' + JSON.stringify(res.result));
          wx.showModal({
            title: '云函数可能未部署',
            content: '请在开发者工具左侧 cloudfunctions/initData 目录上右键 → 「上传并部署：云端安装依赖」，完成后重试；或改用下方「本地直写」。',
            showCancel: false
          });
        }
      },
      fail: err => {
        this.log('❌ 调用失败: ' + err.errMsg);
        wx.showModal({
          title: '云函数调用失败',
          content: '请确认：1) 已开通云开发并选择环境 ' + getApp().globalData.cloudEnv + '；2) 已右键上传部署 initData 云函数。也可改用下方「本地直写」（需把集合权限设为所有用户可读写）。',
          showCancel: false
        });
      },
      complete: () => this.setData({ busy: false })
    });
  },

  // 2. 上传 6 张宠物图到云存储，并把 fileID 写入 config 集合
  uploadPetImages() {
    if (!this.guard()) return;
    this.setData({ busy: true });
    this.log('开始上传 6 张宠物图片到云存储...');
    const fileMap = {};
    let done = 0;

    const uploadOne = (state) => {
      return new Promise((resolve, reject) => {
        wx.cloud.uploadFile({
          cloudPath: 'pet/pet_' + state + '.png',
          filePath: '/assets/pet/pet_' + state + '.png',  // 代码包内文件可直接上传
          success: r => {
            fileMap[state] = r.fileID;
            done++;
            this.log('上传成功 (' + done + '/6) ' + state);
            resolve(r.fileID);
          },
          fail: reject
        });
      });
    };

    (async () => {
      try {
        for (const s of PET_STATES) {
          await uploadOne(s);
        }
        // 存本地一份（本设备即时生效）
        wx.setStorageSync('pet_image_map', fileMap);
        // 通过云函数写 config 集合（管理员权限，其他用户可读）
        const cf = await new Promise((resolve, reject) => {
          wx.cloud.callFunction({
            name: 'initData',
            data: { action: 'savePetImages', data: fileMap },
            success: resolve,
            fail: reject
          });
        });
        if (cf.result && cf.result.code === 0) {
          this.log('✅ 全部图片已上传，fileID 配置已写入云端 config 集合');
          wx.showToast({ title: '宠物图已上云', icon: 'success' });
        } else {
          this.log('⚠️ 图片已上传但配置未入云（云函数未部署），本机已生效');
        }
      } catch (e) {
        this.log('❌ 上传中断: ' + (e.errMsg || JSON.stringify(e)));
        wx.showToast({ title: '上传失败，见日志', icon: 'none' });
      } finally {
        this.setData({ busy: false });
      }
    })();
  },

  // 3. 备用：小程序端直接批量写种子数据（需集合权限允许创建者写入）
  async seedLocal() {
    if (!this.guard()) return;
    this.setData({ busy: true });
    this.log('开始从本地直写种子数据...');
    try {
      for (const name of COLLECTION_NAMES) {
        const r = await dbLayer.seedCollectionFromLocal(name);
        this.log('✅ ' + name + ' 写入 ' + r.success + '/' + r.total);
      }
      this.log('全部完成（数据归属于当前微信用户，需把集合权限设为所有用户可读）');
      wx.showToast({ title: '本地直写完成', icon: 'success' });
      this.checkCounts();
    } catch (e) {
      this.log('❌ 直写失败: ' + (e.errMsg || e.message));
    } finally {
      this.setData({ busy: false });
    }
  },

  // 4. 检查云端各集合记录数
  checkCounts() {
    if (!this.guard()) return;
    const counts = {};
    let pending = COLLECTION_NAMES.length;
    this.log('查询云端集合记录数...');
    COLLECTION_NAMES.forEach(name => {
      wx.cloud.database().collection(name).count()
        .then(r => {
          counts[name] = r.total;
        })
        .catch(() => {
          counts[name] = '集合不存在';
        })
        .then(() => {
          pending--;
          if (pending === 0) {
            this.setData({ counts });
            this.log('记录数: ' + JSON.stringify(counts));
          }
        });
    });
  },

  guard() {
    if (!dbLayer.isCloudReady()) {
      wx.showToast({ title: '云开发未就绪', icon: 'none' });
      return false;
    }
    if (this.data.busy) {
      wx.showToast({ title: '正在执行中...', icon: 'none' });
      return false;
    }
    return true;
  }
});
