// cloudfunctions/initData/index.js
// 云函数入口：
//   action 缺省 / 'seedAll'      → 初始化/覆盖 5 个美食集合的种子数据（幂等，可重复调用）
//   action = 'savePetImages'     → 保存宠物图片 fileID 映射到 config 集合
const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();
const seed = require('./seed.js');

// 集合名 → 种子数据 的映射
const COLLECTIONS = {
  foods: seed.foods,
  canteens: seed.canteens,
  brands: seed.brands,
  streets: seed.streets,
  links: seed.links
};

// 幂等写入：有 id 用 id 作 doc，无 id 用 集合名_序号
async function upsertAll(name, list) {
  let success = 0;
  for (let i = 0; i < list.length; i++) {
    const docId = list[i].id || (name + '_' + (i + 1));
    await db.collection(name).doc(docId).set({ data: list[i] });
    success++;
  }
  return success;
}

exports.main = async (event) => {
  const action = event.action || 'seedAll';

  try {
    if (action === 'savePetImages') {
      // event.data: { excited: 'cloud://...', happy: ..., ... 共 6 个状态 }
      await db.collection('config').doc('pet_images').set({
        data: { images: event.data || {}, updatedAt: db.serverDate() }
      });
      return { code: 0, msg: '宠物图片配置已保存' };
    }

    // 默认：写入全部种子集合
    const result = {};
    for (const name of Object.keys(COLLECTIONS)) {
      result[name] = await upsertAll(name, COLLECTIONS[name]);
    }
    return { code: 0, msg: '种子数据初始化成功（幂等，可重复执行）', result };
  } catch (err) {
    return { code: -1, msg: '初始化失败：' + err.message, err };
  }
};
