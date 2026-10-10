// DHL 旺季附加费（Peak Season Surcharge）
// 依据：DHL 官方旺季附加费表（始发地：中国大陆, 香港）+ 75折协议折扣
// 金额为打折前官方价，实际收取 = 每公斤费率 × 0.75
// 有效期：2026-10-01 至 2027-02-05（含当天），到期自动停用

export type PeakRegion =
  | '中国大陆和香港'
  | '亚洲'
  | '大洋洲'
  | '欧洲'
  | '美洲'
  | '中东地区/北非'
  | '其余国家'

export const PEAK_SURCHARGE_CONFIG = {
  enabled: true,
  name: '旺季附加费',
  validFrom: '2026-10-01',
  validTo: '2027-02-05',
  discount: 0.75, // 75折
  description: '旺季期间按目的地分区每公斤加收，享受75折协议折扣',
}

// 打折前官方每公斤费率（始发地：中国大陆, 香港）
export const PEAK_SURCHARGE_RATES: Record<PeakRegion, number> = {
  中国大陆和香港: 0.8,
  亚洲: 0.8,
  大洋洲: 3.8,
  欧洲: 14.3,
  美洲: 15.3,
  '中东地区/北非': 11.6,
  其余国家: 6.2,
}

// 国家 → 旺季分区映射（依据《目的地国家分区.xlsx》，与 DHL 官方分组一致）
// 注：美国不在 Excel「美洲」名单中，经确认按美洲计
export const PEAK_REGION_BY_COUNTRY: Record<string, PeakRegion> = {
  // 中国大陆和香港
  香港: '中国大陆和香港',
  澳门: '中国大陆和香港',
  // 亚洲
  韩国: '亚洲',
  台湾: '亚洲',
  日本: '亚洲',
  文莱: '亚洲',
  印度尼西亚: '亚洲',
  柬埔寨: '亚洲',
  老挝: '亚洲',
  马来西亚: '亚洲',
  菲律宾: '亚洲',
  新加坡: '亚洲',
  泰国: '亚洲',
  越南: '亚洲',
  印度: '亚洲',
  孟加拉: '亚洲',
  巴基斯坦: '亚洲',
  斯里兰卡: '亚洲',
  // 大洋洲
  澳大利亚: '大洋洲',
  新西兰: '大洋洲',
  // 美洲
  美国: '美洲',
  加拿大: '美洲',
  墨西哥: '美洲',
  巴西: '美洲',
  智利: '美洲',
  哥伦比亚: '美洲',
  阿根廷: '美洲',
  秘鲁: '美洲',
  乌拉圭: '美洲',
  // 欧洲（含以色列、土耳其，按 DHL 官方分组）
  奥地利: '欧洲',
  比利时: '欧洲',
  德国: '欧洲',
  西班牙: '欧洲',
  法国: '欧洲',
  爱尔兰: '欧洲',
  意大利: '欧洲',
  卢森堡: '欧洲',
  摩纳哥: '欧洲',
  荷兰: '欧洲',
  葡萄牙: '欧洲',
  圣马力诺: '欧洲',
  梵蒂冈: '欧洲',
  阿尔巴尼亚: '欧洲',
  保加利亚: '欧洲',
  塞浦路斯: '欧洲',
  捷克: '欧洲',
  丹麦: '欧洲',
  爱沙尼亚: '欧洲',
  芬兰: '欧洲',
  英国: '欧洲',
  希腊: '欧洲',
  克罗地亚: '欧洲',
  匈牙利: '欧洲',
  立陶宛: '欧洲',
  拉脱维亚: '欧洲',
  马耳他: '欧洲',
  波兰: '欧洲',
  罗马尼亚: '欧洲',
  瑞典: '欧洲',
  斯洛文尼亚: '欧洲',
  斯洛伐克: '欧洲',
  以色列: '欧洲',
  土耳其: '欧洲',
  // 中东地区/北非
  埃及: '中东地区/北非',
  摩洛哥: '中东地区/北非',
  沙特阿拉伯: '中东地区/北非',
  阿联酋: '中东地区/北非',
  // 其余国家
  南非: '其余国家',
  尼日利亚: '其余国家',
  肯尼亚: '其余国家',
  俄罗斯: '其余国家',
  乌克兰: '其余国家',
  白俄罗斯: '其余国家',
}

// 获取国家所属旺季分区（未收录的国家按「其余国家」处理）
export const getPeakRegion = (countryName: string): PeakRegion => {
  return PEAK_REGION_BY_COUNTRY[countryName] ?? '其余国家'
}

// 获取某国家折后每公斤旺季附加费（官方费率 × 0.75）
export const getPeakSurchargePerKg = (countryName: string): number => {
  const region = getPeakRegion(countryName)
  return PEAK_SURCHARGE_RATES[region] * PEAK_SURCHARGE_CONFIG.discount
}

// 当前日期是否在旺季附加费有效期内（含首尾两天，本地时区）
export const isPeakSurchargeActive = (date: Date = new Date()): boolean => {
  if (!PEAK_SURCHARGE_CONFIG.enabled) return false
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  const today = `${y}-${m}-${d}`
  return (
    today >= PEAK_SURCHARGE_CONFIG.validFrom &&
    today <= PEAK_SURCHARGE_CONFIG.validTo
  )
}
