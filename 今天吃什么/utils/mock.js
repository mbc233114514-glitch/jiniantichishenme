// utils/mock.js 校园美食模拟数据

// ========== 模块一数据：全部美食（用于随机推荐） ==========
// category: '食堂' / '档口' / '校外' 用于首页筛选
const allFoods = [
  // 一食堂一楼
  { id: 'f001', name: '重庆小面', shop: '一食堂一楼', category: '食堂', floor: '一楼', price: 12, tags: ['麻辣', '面食', '快餐'], description: '学长学姐评价"巨好吃"', emoji: '🍜' },
  { id: 'f002', name: '自选麻辣烫', shop: '一食堂一楼', category: '食堂', floor: '一楼', price: 15, tags: ['麻辣', '自选'], description: '荤素自选，按签计费', emoji: '🍲' },
  { id: 'f003', name: '猪脚饭', shop: '一食堂一楼', category: '食堂', floor: '一楼', price: 14, tags: ['米饭', '招牌'], description: '学长学姐评价"巨好吃"', emoji: '🍖' },

  // 一食堂二楼
  { id: 'f004', name: '闽南沙茶面', shop: '一食堂二楼', category: '食堂', floor: '二楼', price: 13, tags: ['面食', '闽南风味'], description: '汤底浓郁，本地特色', emoji: '🍜' },
  { id: 'f005', name: '手工水饺', shop: '一食堂二楼', category: '食堂', floor: '二楼', price: 12, tags: ['面食', '北方口味'], description: '皮薄馅大，一份15个', emoji: '🥟' },
  { id: 'f006', name: '福鼎肉片', shop: '一食堂二楼', category: '食堂', floor: '二楼', price: 10, tags: ['汤类', '福建特色'], description: '福鼎名小吃，Q弹爽口', emoji: '🥣' },
  { id: 'f007', name: '沙县拌面+扁肉', shop: '一食堂二楼', category: '食堂', floor: '二楼', price: 11, tags: ['快餐', '福建特色'], description: '国民套餐，便宜管饱', emoji: '🍝' },

  // 一食堂三楼
  { id: 'f008', name: '自选快餐', shop: '一食堂三楼', category: '食堂', floor: '三楼', price: 10, tags: ['米饭', '经济实惠'], description: '好吃又便宜，三菜一汤', emoji: '🍱' },

  // 第三食堂品牌档口
  { id: 'b001', name: '茶百道奶茶', shop: '缤纷第三食堂', category: '档口', type: '奶茶饮品', price: 16, tags: ['奶茶', '饮品'], description: '招牌豆乳玉麒麟', emoji: '🧋' },
  { id: 'b002', name: '欣鹿客烤冷面', shop: '缤纷第三食堂', category: '档口', type: '烤冷面、冰淇淋', price: 12, tags: ['小吃', '甜品'], description: '店内设有价目表', emoji: '🍦' },
  { id: 'b003', name: '茶小咖果茶', shop: '缤纷第三食堂', category: '档口', type: '果茶、咖啡', price: 14, tags: ['饮品', '咖啡'], description: '现磨咖啡，新鲜果茶', emoji: '☕' },
  { id: 'b004', name: '校园水果捞', shop: '缤纷第三食堂', category: '档口', type: '果汁、水果捞、酸奶', price: 13, tags: ['水果', '健康'], description: '现榨纯果汁+安慕希酸奶', emoji: '🍓' },
  { id: 'b005', name: '禾喜零食', shop: '缤纷第三食堂', category: '档口', type: '零食、日用', price: 20, tags: ['零食', '日用'], description: '校园零食商超', emoji: '🛒' },
  { id: 'b006', name: '泉纺优选服务', shop: '缤纷第三食堂', category: '档口', type: '校园生活服务', price: 0, tags: ['服务'], description: '校园生活综合服务部', emoji: '🏪' },

  // —— 瑞幸咖啡（泉州纺织服装职业学院店）——
  { id: 'b007', name: '生椰拿铁', shop: '瑞幸咖啡(泉纺店)', category: '档口', type: '咖啡饮品', price: 13, tags: ['招牌', '咖啡', '人气'], description: '瑞幸招牌，椰香与咖啡平衡，被称"生椰拿铁定义者"', emoji: '🥤' },
  { id: 'b008', name: '冰吸生椰拿铁', shop: '瑞幸咖啡(泉纺店)', category: '档口', type: '咖啡饮品', price: 14, tags: ['夏季限定', '清凉'], description: '添加清凉因子，夏季爆款', emoji: '🥤' },
  { id: 'b009', name: '橙C美式', shop: '瑞幸咖啡(泉纺店)', category: '档口', type: '咖啡饮品', price: 10, tags: ['果咖', '低卡'], description: '橙汁+美式，清爽提神，热量低', emoji: '🍊' },

  // —— 益禾堂（纺织服装职业学院店）——
  { id: 'b010', name: '益禾烤奶', shop: '益禾堂(纺织学院店)', category: '档口', type: '奶茶饮品', price: 9, tags: ['招牌', '奶茶'], description: '益禾堂招牌，炭烧奶味，进店必点', emoji: '🧋' },
  { id: 'b011', name: '薄荷奶绿', shop: '益禾堂(纺织学院店)', category: '档口', type: '奶茶饮品', price: 8, tags: ['人气', '清爽'], description: '茉莉绿茶+薄荷，透心凉，复购率极高', emoji: '🌿' },
  { id: 'b012', name: '四季奶青', shop: '益禾堂(纺织学院店)', category: '档口', type: '奶茶饮品', price: 9, tags: ['清爽', '奶茶'], description: '口感清爽，淡淡栀子花香，不加料也好喝', emoji: '🍵' },

  // —— 库迪咖啡（泉州纺织服装学院店）——
  { id: 'b013', name: '潘帕斯蓝生酪茉莉拿铁', shop: '库迪咖啡(泉纺店)', category: '档口', type: '咖啡饮品', price: 13, tags: ['招牌', '颜值'], description: '颜值高，蓝色分层，生酪+茉莉茶香', emoji: '☕' },
  { id: 'b014', name: '星辰燕麦拿铁', shop: '库迪咖啡(泉纺店)', category: '档口', type: '咖啡饮品', price: 12, tags: ['燕麦奶', '健康'], description: '燕麦香浓郁，口感细腻，健康之选', emoji: '☕' },
  { id: 'b015', name: '杨梅吐气库可冰', shop: '库迪咖啡(泉纺店)', category: '档口', type: '咖啡饮品', price: 13, tags: ['果咖', '夏季'], description: '酸甜杨梅味，冰沙口感，夏日解腻', emoji: '🧊' },

  // —— 蜜雪冰城（纺织学院店）——
  { id: 'b016', name: '冰鲜柠檬水', shop: '蜜雪冰城(纺织学院店)', category: '档口', type: '饮品冰淇淋', price: 4, tags: ['招牌', '平价', '解渴'], description: '蜜雪招牌，年销超10亿杯，现切柠檬', emoji: '🍋' },
  { id: 'b017', name: '新鲜冰淇淋', shop: '蜜雪冰城(纺织学院店)', category: '档口', type: '饮品冰淇淋', price: 3, tags: ['冰淇淋', '性价比'], description: '性价比天花板，奶香浓郁', emoji: '🍦' },
  { id: 'b018', name: '草莓摇摇奶昔', shop: '蜜雪冰城(纺织学院店)', category: '档口', type: '饮品冰淇淋', price: 7, tags: ['奶昔', '果味'], description: '草莓果肉+冰淇淋，果香奶香融合', emoji: '🍓' },

  // —— 塔斯汀中国汉堡 ——
  { id: 'b019', name: '藤椒鸡腿中国汉堡', shop: '塔斯汀中国汉堡(泉纺店)', category: '档口', type: '汉堡快餐', price: 12, tags: ['招牌', '汉堡', '藤椒'], description: '藤椒味浓郁，肉量足，获评"王者级"', emoji: '🍔' },
  { id: 'b020', name: '板烧凤梨中国汉堡', shop: '塔斯汀中国汉堡(泉纺店)', category: '档口', type: '汉堡快餐', price: 17, tags: ['人气', '清爽'], description: '奥尔良鸡排+厚切凤梨，酸甜清爽，不踩雷', emoji: '🍔' },
  { id: 'b021', name: '香辣鸡腿中国汉堡', shop: '塔斯汀中国汉堡(泉纺店)', category: '档口', type: '汉堡快餐', price: 12, tags: ['辣味', '汉堡'], description: '湘式香辣风味，辣感鲜明，重口首选', emoji: '🍔' },

  // 校门口小吃街
  { id: 's001', name: '新疆烧烤', shop: '校门口小吃街', category: '校外', feature: '烧烤', location: '校门外对面', price: 25, tags: ['烧烤', '夜宵'], description: '正宗新疆风味，羊肉串一绝', emoji: '🍢' },
  { id: 's002', name: '东北麻辣烫', shop: '校门口小吃街', category: '校外', feature: '麻辣烫/麻辣拌/肠粉', location: '工业区超市门口', price: 16, tags: ['麻辣', '自选'], description: '东北做法，酱香浓郁', emoji: '🌶️' },
  { id: 's003', name: '河南烩面', shop: '校门口小吃街', category: '校外', feature: '烩面', location: '校门外', price: 14, tags: ['面食', '北方口味'], description: '汤鲜面筋道，料足', emoji: '🍜' },
  { id: 's004', name: '馋客鸡公煲', shop: '校门口小吃街', category: '校外', feature: '鸡公煲', location: '校门外', price: 22, tags: ['煲类', '招牌'], description: '一锅一份，配米饭绝配', emoji: '🍲' },
  { id: 's005', name: '阿缤卤肉饭', shop: '校门口小吃街', category: '校外', feature: '卤肉饭', location: '校门外', price: 13, tags: ['米饭', '台湾风味'], description: '卤汁香浓，肥而不腻', emoji: '🍚' },
  { id: 's006', name: '一元烧烤/阿卜羊肉串', shop: '校门口小吃街', category: '校外', feature: '街边烧烤、羊肉串', location: '校门外', price: 20, tags: ['烧烤', '夜宵'], description: '街边摊，气氛足', emoji: '🍖' }
];

// ========== 模块二数据：食堂菜单（按楼层） ==========
const canteenData = [
  {
    floor: '一楼',
    type: '快餐、小吃',
    stalls: [
      { id: 'f001', name: '重庆小面', signature: '重庆小面', price: 12, tags: ['面食', '麻辣'], note: '学长学姐评价"巨好吃"', emoji: '🍜' },
      { id: 'f002', name: '麻辣烫', signature: '自选麻辣烫', price: 15, tags: ['麻辣', '自选'], note: '荤素按签计费', emoji: '🍲' },
      { id: 'f003', name: '猪脚饭', signature: '猪脚饭', price: 14, tags: ['米饭', '招牌'], note: '学长学姐评价"巨好吃"', emoji: '🍖' }
    ]
  },
  {
    floor: '二楼',
    type: '特色小吃',
    stalls: [
      { id: 'f004', name: '沙茶面', signature: '闽南沙茶面', price: 13, tags: ['面食', '闽南风味'], note: '汤底浓郁', emoji: '🍜' },
      { id: 'f005', name: '水饺', signature: '手工水饺', price: 12, tags: ['面食', '北方口味'], note: '一份15个', emoji: '🥟' },
      { id: 'f006', name: '福鼎肉片', signature: '福鼎肉片', price: 10, tags: ['汤类', '福建特色'], note: 'Q弹爽口', emoji: '🥣' },
      { id: 'f007', name: '沙县小吃', signature: '拌面+扁肉', price: 11, tags: ['快餐', '福建特色'], note: '国民套餐', emoji: '🍝' }
    ]
  },
  {
    floor: '三楼',
    type: '米饭快餐',
    stalls: [
      { id: 'f008', name: '快餐窗口', signature: '自选快餐', price: 10, tags: ['米饭', '经济实惠'], note: '好吃又便宜', emoji: '🍱' }
    ]
  }
];

// ========== 模块三数据：品牌档口 ==========
const brandStalls = [
  { id: 'b001', name: '茶百道', type: '奶茶饮品', emoji: '🧋', tags: ['奶茶', '饮品'], note: '招牌豆乳玉麒麟，店内设有价目表' },
  { id: 'b002', name: '欣鹿客', type: '烤冷面、冰淇淋', emoji: '🍦', tags: ['小吃', '甜品'], note: '店内设有价目表' },
  { id: 'b003', name: '茶小咖', type: '果茶、咖啡', emoji: '☕', tags: ['饮品', '咖啡'], note: '现磨咖啡，新鲜果茶' },
  { id: 'b004', name: '校园水果吧', type: '现榨纯果汁、水果捞、安慕希酸奶', emoji: '🍓', tags: ['水果', '健康'], note: '鲜榨现做，健康首选' },
  { id: 'b005', name: '禾喜零食商超', type: '零食、日用', emoji: '🛒', tags: ['零食', '日用'], note: '校园零食商超，价格亲民' },
  { id: 'b006', name: '泉纺优选服务部', type: '校园生活服务', emoji: '🏪', tags: ['服务'], note: '校园生活综合服务部' },

  // 新增 5 家品牌连锁
  { id: 'b007_9', name: '瑞幸咖啡', type: '咖啡饮品', emoji: '🥤', tags: ['咖啡', '饮品'], note: '招牌生椰拿铁，价格区间 9.9-15 元' },
  { id: 'b010_12', name: '益禾堂', type: '奶茶饮品', emoji: '🧋', tags: ['奶茶', '人气'], note: '招牌益禾烤奶 8-10 元，进店必点' },
  { id: 'b013_15', name: '库迪咖啡', type: '咖啡饮品', emoji: '☕', tags: ['咖啡', '颜值'], note: '潘帕斯蓝生酪拿铁，蓝色分层颜值担当' },
  { id: 'b016_18', name: '蜜雪冰城', type: '饮品冰淇淋', emoji: '🍦', tags: ['平价', '解渴'], note: '冰鲜柠檬水 4 元，新鲜冰淇淋 2 元起，性价比之王' },
  { id: 'b019_21', name: '塔斯汀中国汉堡', type: '汉堡快餐', emoji: '🍔', tags: ['汉堡', '中式'], note: '藤椒鸡腿堡 12 元，板烧凤梨堡 17 元' }
];

// ========== 模块四数据：校外小吃街 ==========
const streetFood = [
  { id: 's001', name: '新疆烧烤', feature: '烧烤', location: '校门外对面', emoji: '🍢', tags: ['烧烤', '夜宵'], note: '正宗新疆风味，羊肉串一绝' },
  { id: 's002', name: '东北麻辣烫', feature: '麻辣烫/麻辣拌，另有肠粉', location: '工业区超市门口', emoji: '🌶️', tags: ['麻辣', '自选'], note: '东北做法，酱香浓郁' },
  { id: 's003', name: '河南烩面', feature: '烩面', location: '校门外', emoji: '🍜', tags: ['面食', '北方口味'], note: '汤鲜面筋道，料足' },
  { id: 's004', name: '馋客鸡公煲', feature: '鸡公煲', location: '校门外', emoji: '🍲', tags: ['煲类', '招牌'], note: '一锅一份，配米饭绝配' },
  { id: 's005', name: '台湾阿缤卤肉饭', feature: '卤肉饭', location: '校门外', emoji: '🍚', tags: ['米饭', '台湾风味'], note: '卤汁香浓，肥而不腻' },
  { id: 's006', name: '一元烧烤/新疆阿卜羊肉串', feature: '街边烧烤、羊肉串', location: '校门外', emoji: '🍖', tags: ['烧烤', '夜宵'], note: '街边摊，气氛足' }
];

// ========== 首页分类筛选配置 ==========
const filterTabs = [
  { key: 'all',    label: '全部' },
  { key: '食堂',  label: '食堂' },
  { key: '档口',  label: '档口' },
  { key: '校外',  label: '校外' },
  { key: '链接',  label: '链接' }
];

// ========== 快捷入口 ==========
const quickEntries = [
  { key: 'canteen', label: '食堂菜单', emoji: '🍚', path: '/pages/canteen/index', color: '#FF6B35' },
  { key: 'brand',   label: '品牌档口', emoji: '🧋', path: '/pages/brand/index',   color: '#FFA500' },
  { key: 'street',  label: '校外小吃', emoji: '🍢', path: '/pages/street/index',  color: '#4CAF50' },
  { key: 'pet',     label: '我的小猪', emoji: '🐷', path: '/pages/pet/index',     color: '#FF9EC4' }
];

// ========== 模块九：链接菜品（可跳转外部） ==========
// 存放有官方小程序/外卖链接的店铺，点击可跳转 web-view
const linkDishes = [
  {
    id: 'lk_001',
    name: '瑞幸咖啡（泉州纺织服装职业学院店）',
    emoji: '🥤',
    type: '咖啡饮品',
    price: '9.9-15 元',
    url: '#小程序://瑞幸咖啡/PflsdqPckhMdA8o',
    appId: 'wx21c7506e98a2fe75',
    reason: '招牌生椰拿铁，价格实惠',
    category: '链接',
    tags: ['招牌', '咖啡', '可跳转']
  },
  {
    id: 'lk_002',
    name: '蜜雪冰城（纺织学院店）',
    emoji: '🍦',
    type: '饮品冰淇淋',
    price: '4-7 元',
    url: '#小程序://蜜雪冰城/aCuAAyZxIctGJHy',
    appId: 'wx10cabce5fb1f4933',
    reason: '冰鲜柠檬水 4 元，性价比之王',
    category: '链接',
    tags: ['平价', '解渴', '可跳转']
  },
  {
    id: 'lk_003',
    name: '库迪咖啡（泉州纺织服装学院店）',
    emoji: '☕',
    type: '咖啡饮品',
    price: '9.9-15 元',
    url: '#小程序://库迪咖啡/5Za7KeFgTMpAtf',
    appId: 'wxde8ac0a21135c07d',
    reason: '潘帕斯蓝生酪拿铁，颜值担当',
    category: '链接',
    tags: ['咖啡', '颜值', '可跳转']
  }
];

// ========== 模块六：宠物初始数据 ==========
const petDefaultData = {
  name: '泉纺小猪',
  level: 1,
  exp: 0,
  satiety: 60,          // 饱食度 0-100
  mood: 70,             // 心情值 0-100
  cleanliness: 80,      // 清洁度 0-100
  currentState: 'excited',
  fedRecords: [],       // 喂食记录
  unlockedDishes: [],   // 已解锁菜品 id
  lastDecayTime: null   // 上次衰减时间戳
};

module.exports = {
  allFoods,
  canteenData,
  brandStalls,
  streetFood,
  filterTabs,
  quickEntries,
  linkDishes,
  petDefaultData
};
