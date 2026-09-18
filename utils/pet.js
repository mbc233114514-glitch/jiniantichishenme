// utils/pet.js 宠物状态管理核心逻辑
// 负责：宠物数据存取、状态判定、喂食效果、属性衰减、升级判定

const mock = require('./mock.js');

const STORAGE_KEY = 'petData';
const DECAY_INTERVAL = 6 * 60 * 60 * 1000;  // 6 小时衰减一次
const MAX_NO_INTERACTION = 24 * 60 * 60 * 1000;  // 24 小时无互动额外扣分

// 菜品类型 → 喂食效果映射
const DISH_EFFECT_MAP = {
  // 主食：饱食多
  '面食':  { satiety: 25, mood: 15, exp: 10 },
  '米饭':  { satiety: 25, mood: 15, exp: 10 },
  '煲类':  { satiety: 25, mood: 15, exp: 10 },
  '汉堡':  { satiety: 25, mood: 15, exp: 10 },
  // 小吃：饱食中
  '麻辣':  { satiety: 15, mood: 10, exp: 5 },
  '自选':  { satiety: 15, mood: 10, exp: 5 },
  '汤类':  { satiety: 15, mood: 10, exp: 5 },
  // 饮品：心情多
  '奶茶':  { satiety: 10, mood: 20, exp: 8 },
  '咖啡':  { satiety: 10, mood: 20, exp: 8 },
  '饮品':  { satiety: 10, mood: 20, exp: 8 },
  '果咖':  { satiety: 10, mood: 20, exp: 8 },
  // 甜点：心情最多
  '冰淇淋': { satiety: 5, mood: 25, exp: 6 },
  '甜品':  { satiety: 5, mood: 25, exp: 6 },
  '奶昔':  { satiety: 5, mood: 25, exp: 6 },
  // 默认
  default: { satiety: 15, mood: 10, exp: 6 }
};

// 状态 → emoji 映射（避免真实图片依赖）
const STATE_EMOJI = {
  excited:  { emoji: '🐷', label: '兴奋',    tip: '小猪在等你喂好吃的~' },
  happy:    { emoji: '🐷', label: '开心',    tip: '小猪吃饱了，超开心！' },
  hungry:   { emoji: '🐷', label: '饥饿',    tip: '小猪饿了，快喂点吃的吧！' },
  bored:    { emoji: '🐷', label: '无聊',    tip: '小猪心情不好，陪它玩玩吧~' },
  dirty:    { emoji: '🐷', label: '脏兮兮',  tip: '小猪脏了，帮它洗个澡！' },
  sleeping: { emoji: '🐷', label: '睡觉',    tip: 'zzZ...小猪睡着了，别打扰它~' }
};

// 动作 → 动画 class 映射
const STATE_ANIMATION = {
  excited:  'anim-excited',
  happy:    'anim-happy',
  hungry:   'anim-hungry',
  bored:    'anim-bored',
  dirty:    'anim-dirty',
  sleeping: 'anim-sleeping',
  eating:   'anim-eating'
};

/**
 * 获取宠物数据（带持久化）
 */
function getPet() {
  let pet = wx.getStorageSync(STORAGE_KEY);
  if (!pet || typeof pet !== 'object') {
    pet = { ...mock.petDefaultData };
    wx.setStorageSync(STORAGE_KEY, pet);
  }
  return pet;
}

/**
 * 保存宠物数据
 */
function savePet(pet) {
  wx.setStorageSync(STORAGE_KEY, pet);
}

/**
 * 判定宠物当前状态（6 种）
 * @param {Object} pet
 * @returns {string} state key
 */
function getPetState(pet) {
  const hour = new Date().getHours();

  // 夜间或长时间无操作 → 睡觉
  if (hour >= 23 || hour < 7) return 'sleeping';

  // 属性过低优先显示
  if (pet.satiety < 30) return 'hungry';
  if (pet.mood < 30) return 'bored';
  if (pet.cleanliness < 30) return 'dirty';

  // 最近 5 分钟有喂食 → 开心
  const lastFeed = pet.fedRecords && pet.fedRecords[pet.fedRecords.length - 1];
  if (lastFeed && Date.now() - lastFeed.time < 5 * 60 * 1000) return 'happy';

  // 默认 → 兴奋
  return 'excited';
}

/**
 * 获取菜品对应的喂食效果（根据 tags 匹配）
 */
function getDishEffect(dish) {
  if (!dish || !dish.tags) return DISH_EFFECT_MAP.default;
  for (const tag of dish.tags) {
    if (DISH_EFFECT_MAP[tag]) {
      return DISH_EFFECT_MAP[tag];
    }
  }
  return DISH_EFFECT_MAP.default;
}

/**
 * 喂食：核心交互
 * @param {Object} dish 菜品对象
 * @returns {{effect: Object, levelUp: boolean, newLevel: number}}
 */
function feedPet(dish) {
  const pet = getPet();
  const effect = getDishEffect(dish);

  pet.satiety    = Math.min(100, pet.satiety + effect.satiety);
  pet.mood       = Math.min(100, pet.mood + effect.mood);
  pet.cleanliness = Math.max(0, pet.cleanliness - 3);  // 吃东西会稍微弄脏一点
  pet.exp       += effect.exp;

  // 记录喂食（最多保留 20 条）
  pet.fedRecords.push({
    dishName: dish.name,
    emoji: dish.emoji || '🍽️',
    time: Date.now()
  });
  if (pet.fedRecords.length > 20) {
    pet.fedRecords = pet.fedRecords.slice(-20);
  }

  // 解锁菜品
  if (dish.id && !pet.unlockedDishes.includes(dish.id)) {
    pet.unlockedDishes.push(dish.id);
  }

  // 升级判定
  let levelUp = false;
  while (pet.exp >= pet.level * 50) {
    pet.exp -= pet.level * 50;
    pet.level += 1;
    levelUp = true;
  }

  pet.currentState = getPetState(pet);
  pet.lastDecayTime = Date.now();
  savePet(pet);

  return { effect, levelUp, newLevel: pet.level };
}

/**
 * 玩耍：心情 +15，清洁 -5
 */
function playPet() {
  const pet = getPet();
  pet.mood        = Math.min(100, pet.mood + 15);
  pet.cleanliness = Math.max(0, pet.cleanliness - 5);
  pet.exp        += 2;  // 玩也加一点经验

  let levelUp = false;
  while (pet.exp >= pet.level * 50) {
    pet.exp -= pet.level * 50;
    pet.level += 1;
    levelUp = true;
  }

  pet.currentState = getPetState(pet);
  savePet(pet);
  return { levelUp, newLevel: pet.level };
}

/**
 * 清洁：清洁度 +20
 */
function cleanPet() {
  const pet = getPet();
  pet.cleanliness = Math.min(100, pet.cleanliness + 20);
  pet.mood       = Math.min(100, pet.mood + 5);
  pet.exp        += 2;

  let levelUp = false;
  while (pet.exp >= pet.level * 50) {
    pet.exp -= pet.level * 50;
    pet.level += 1;
    levelUp = true;
  }

  pet.currentState = getPetState(pet);
  savePet(pet);
  return { levelUp, newLevel: pet.level };
}

/**
 * 属性衰减：根据距离上次衰减的时间差计算
 * 每 6 小时：饱食 -10，心情 -5，清洁 -8
 * 超过 24 小时无互动：心情额外 -20
 */
function decayStats() {
  const pet = getPet();
  const now = Date.now();
  const lastTime = pet.lastDecayTime || now;
  const elapsed = now - lastTime;

  if (elapsed < DECAY_INTERVAL) return pet;  // 不到 6 小时不衰减

  const periods = Math.floor(elapsed / DECAY_INTERVAL);
  pet.satiety    = Math.max(0, pet.satiety    - 10 * periods);
  pet.mood       = Math.max(0, pet.mood       - 5  * periods);
  pet.cleanliness = Math.max(0, pet.cleanliness - 8  * periods);

  // 长时间无互动额外扣分
  if (elapsed > MAX_NO_INTERACTION) {
    pet.mood = Math.max(0, pet.mood - 20);
  }

  pet.lastDecayTime = now;
  pet.currentState = getPetState(pet);
  savePet(pet);
  return pet;
}

/**
 * 获取完整宠物展示数据（带状态、emoji、动画 class）
 */
function getPetDisplay() {
  const pet = decayStats();  // 先衰减再展示
  const stateInfo = STATE_EMOJI[pet.currentState] || STATE_EMOJI.excited;
  const animClass = STATE_ANIMATION[pet.currentState] || '';
  return { pet, stateInfo, animClass };
}

/**
 * 重置宠物（调试用）
 */
function resetPet() {
  const fresh = { ...mock.petDefaultData };
  savePet(fresh);
  return fresh;
}

/**
 * 修改宠物名字（仅做空值与长度校验，不做敏感词过滤）
 * @param {string} rawName 原始输入
 * @returns {{success: boolean, name?: string, msg?: string}}
 */
function updateName(rawName) {
  let name = String(rawName == null ? '' : rawName).trim();
  if (!name) return { success: false, msg: '名字不能为空' };
  if (name.length > 12) return { success: false, msg: '名字不能超过 12 个字' };

  const pet = getPet();
  pet.name = name;
  savePet(pet);
  return { success: true, name };
}

module.exports = {
  STORAGE_KEY,
  getPet,
  savePet,
  getPetState,
  getDishEffect,
  feedPet,
  playPet,
  cleanPet,
  decayStats,
  getPetDisplay,
  resetPet,
  updateName,
  STATE_EMOJI,
  STATE_ANIMATION
};
