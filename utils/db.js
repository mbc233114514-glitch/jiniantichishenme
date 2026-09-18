// utils/db.js 云数据库访问层
// 策略：云数据库优先 → 本地 storage 缓存 → utils/mock.js 兜底
// 云未开通/集合未初始化时，小程序仍可完全正常使用本地 mock 数据
const mock = require('./mock.js');

// 云集合名 → 本地 mock 字段名 的映射
const COLLECTION_MAP = {
  foods: 'allFoods',
  canteens: 'canteenData',
  brands: 'brandStalls',
  streets: 'streetFood',
  links: 'linkDishes'
};

// 内存缓存（本次运行期内不重复请求云端）
const memCache = {};

// 懒获取 app 实例，避免循环依赖
function getAppInstance() {
  try { return getApp(); } catch (e) { return null; }
}

// 云数据库是否可用
function isCloudReady() {
  const app = getAppInstance();
  return !!(wx.cloud && app && app.globalData && app.globalData.cloudReady);
}

/**
 * 分页拉取云数据库集合全部记录（小程序端单次 get 上限 20 条）
 */
function fetchAllFromCloud(collectionName) {
  const db = wx.cloud.database();
  const col = db.collection(collectionName);
  const PAGE = 20;
  return col.count().then(res => {
    const total = res.total;
    if (total === 0) return [];
    const times = Math.ceil(total / PAGE);
    const tasks = [];
    for (let i = 0; i < times; i++) {
      tasks.push(col.skip(i * PAGE).limit(PAGE).get().then(r => r.data));
    }
    return Promise.all(tasks).then(pages => pages.reduce((acc, cur) => acc.concat(cur), []));
  });
}

/**
 * 读取一个数据集合
 * @param {string} name 集合 key：foods/canteens/brands/streets/links
 * @param {object} opts { forceCloud: 强制走云端刷新，忽略内存缓存 }
 * @returns {Promise<Array>}
 */
function getCollection(name, opts) {
  opts = opts || {};
  const mockKey = COLLECTION_MAP[name];
  const fallback = mock[mockKey] || [];

  // 1. 内存缓存命中（非强制刷新时直接返回，零耗时）
  if (!opts.forceCloud && memCache[name]) {
    return Promise.resolve(memCache[name]);
  }

  // 2. 云不可用 → storage 缓存 → mock
  if (!isCloudReady()) {
    const cached = wx.getStorageSync('cloud_cache_' + name);
    return Promise.resolve(Array.isArray(cached) && cached.length ? cached : fallback);
  }

  // 3. 走云端
  return fetchAllFromCloud(name).then(list => {
    if (list && list.length) {
      memCache[name] = list;
      wx.setStorageSync('cloud_cache_' + name, list);
      return list;
    }
    // 云端集合为空（未初始化）→ storage 缓存 → mock
    const cached = wx.getStorageSync('cloud_cache_' + name);
    return Array.isArray(cached) && cached.length ? cached : fallback;
  }).catch(err => {
    console.warn('[db] 读取集合 ' + name + ' 失败，使用本地数据:', err);
    const cached = wx.getStorageSync('cloud_cache_' + name);
    return Array.isArray(cached) && cached.length ? cached : fallback;
  });
}

// 语义化快捷方法
const getFoods    = (opts) => getCollection('foods', opts);
const getCanteens = (opts) => getCollection('canteens', opts);
const getBrands   = (opts) => getCollection('brands', opts);
const getStreets  = (opts) => getCollection('streets', opts);
const getLinks    = (opts) => getCollection('links', opts);

/**
 * 写入整个集合（管理页"本地上传种子"用，开发期兜底方案）
 * 使用 doc(id).set 避免重复；无 id 的记录自动生成
 */
async function seedCollectionFromLocal(name) {
  if (!isCloudReady()) throw new Error('云开发未初始化');
  const mockKey = COLLECTION_MAP[name];
  const data = mock[mockKey] || [];
  const col = wx.cloud.database().collection(name);
  let ok = 0;
  for (let i = 0; i < data.length; i++) {
    const item = Object.assign({}, data[i]);
    const docId = item.id || (name + '_' + (i + 1));
    await col.doc(docId).set({ data: item }).then(() => { ok++; });
  }
  delete memCache[name];
  return { total: data.length, success: ok };
}

module.exports = {
  COLLECTION_MAP,
  isCloudReady,
  getCollection,
  getFoods,
  getCanteens,
  getBrands,
  getStreets,
  getLinks,
  seedCollectionFromLocal,
  getPetImageMap
};

/**
 * 获取宠物 6 状态图片映射（云存储 fileID）
 * 优先本地 storage（本设备上传后立即生效），其次云端 config 集合，都没有则返回 null（页面回退本地包内图片）
 * @returns {Promise<Object|null>} { excited: 'cloud://...', happy: ..., ... }
 */
function getPetImageMap() {
  const local = wx.getStorageSync('pet_image_map');
  if (local && Object.keys(local).length) {
    return Promise.resolve(local);
  }
  if (!isCloudReady()) return Promise.resolve(null);
  return wx.cloud.database().collection('config').doc('pet_images').get()
    .then(res => {
      const images = (res.data && res.data.images) || null;
      if (images) wx.setStorageSync('pet_image_map', images);
      return images;
    })
    .catch(() => null);
}
