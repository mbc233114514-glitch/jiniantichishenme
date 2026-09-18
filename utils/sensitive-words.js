// utils/sensitive-words.js
// 本地敏感词库，分类存放，提供 checkSensitive(text) 检查方法
// 词库来源参考：https://github.com/fwwdn/sensitive-stop-words (Apache 2.0)
//
// 说明：
//   1. 广告类、辱骂类已内置示例词；
//   2. 政治/色情/暴力/违法四类因内容安全规则未内联，留空数组；
//      请从 GitHub 词库下载对应 .txt，调用 loadFromText(category, text) 初始化，
//      或直接在下方数组中填入词条。
//   3. checkSensitive 兼容大小写、去除所有空格后再匹配。

// ========== 六类敏感词库 ==========
const wordBank = {
  // 政治类（示例空，从 政治类.txt 导入）
  politics: [],
  // 色情类（示例空，从 色情类.txt 导入）
  porn: [],
  // 暴力类（示例空，从 涉枪涉爆违法信息关键词.txt 导入）
  violence: [],
  // 广告类
  ad: [
    '兼职', '招聘', '代购', '扣扣', '客服', '微店', '淘宝',
    '代开发票', '信用卡提现', '无抵押贷款', '款到发货',
    '连锁加盟', '免费二级域名', '私家侦探', '针孔摄像',
    '六合彩', '改卷内幕', '出售答案', '考中答案'
  ],
  // 辱骂类
  insult: [
    '白痴', '傻逼', '傻比', '煞笔', '弱智', '脑残', '废物',
    '贱人', '婊子', '骚货', '狗屎', '滚蛋', '去死', '王八蛋',
    '操你', '日你', '草泥马', '尼玛', '你妈', '他妈', '他爸',
    '猪头', '蠢猪', '垃圾', '败类', '人渣', '混蛋', '混账'
  ],
  // 违法类（示例空，从 涉枪涉爆违法信息关键词.txt 导入）
  illegal: []
};

// 分类中文名（用于提示）
const CATEGORY_LABEL = {
  politics: '政治敏感',
  porn: '色情低俗',
  violence: '暴力恐怖',
  ad: '广告推广',
  insult: '辱骂攻击',
  illegal: '违法违规'
};

/**
 * 从文本批量导入某一类敏感词
 * @param {string} category 分类 key
 * @param {string} text 词库文本（支持逗号分隔或每行一词）
 */
function loadFromText(category, text) {
  if (!wordBank[category]) return;
  if (typeof text !== 'string' || !text) return;
  // 兼容逗号分隔、换行、分号
  const words = text
    .split(/[,;\n\r]+/)
    .map(w => w.trim())
    .filter(w => w.length > 0);
  // 去重后合并
  const set = new Set(wordBank[category]);
  words.forEach(w => set.add(w));
  wordBank[category] = Array.from(set);
}

/**
 * 检查文本是否包含敏感词
 * @param {string} text 待检查文本
 * @returns {{pass: boolean, category?: string, word?: string, label?: string}}
 */
function checkSensitive(text) {
  if (text == null) return { pass: true };
  // 去除所有空格（含全角空格）并转小写
  const cleaned = String(text).replace(/\s+/g, '').toLowerCase();
  if (!cleaned) return { pass: true };

  for (const category of Object.keys(wordBank)) {
    const words = wordBank[category] || [];
    for (const w of words) {
      if (!w) continue;
      if (cleaned.includes(w.toLowerCase())) {
        return {
          pass: false,
          category,
          word: w,
          label: CATEGORY_LABEL[category]
        };
      }
    }
  }
  return { pass: true };
}

module.exports = {
  wordBank,
  CATEGORY_LABEL,
  loadFromText,
  checkSensitive
};
