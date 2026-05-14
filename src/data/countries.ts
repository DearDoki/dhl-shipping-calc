import { Country } from '../types'

export const COUNTRIES: Country[] = [
  // 分区1
  { name: '香港', partition: 1, isRemote: false, code: 'HK' },
  { name: '澳门', partition: 1, isRemote: false, code: 'MO' },
  
  // 分区2
  { name: '韩国', partition: 2, isRemote: false, code: 'KR' },
  { name: '台湾', partition: 2, isRemote: false, code: 'TW' },
  
  // 分区3
  { name: '日本', partition: 3, isRemote: false, code: 'JP' },
  
  // 分区4
  { name: '文莱', partition: 4, isRemote: false, code: 'BN' },
  { name: '印度尼西亚', partition: 4, isRemote: false, code: 'ID' },
  { name: '柬埔寨', partition: 4, isRemote: false, code: 'KH' },
  { name: '老挝', partition: 4, isRemote: false, code: 'LA' },
  { name: '马来西亚', partition: 4, isRemote: false, code: 'MY' },
  { name: '菲律宾', partition: 4, isRemote: false, code: 'PH' },
  { name: '新加坡', partition: 4, isRemote: false, code: 'SG' },
  { name: '泰国', partition: 4, isRemote: false, code: 'TH' },
  { name: '越南', partition: 4, isRemote: false, code: 'VN' },
  
  // 分区5
  { name: '澳大利亚', partition: 5, isRemote: false, code: 'AU' },
  { name: '新西兰', partition: 5, isRemote: false, code: 'NZ' },
  
  // 分区6
  { name: '加拿大', partition: 6, isRemote: false, code: 'CA' },
  { name: '墨西哥', partition: 6, isRemote: false, code: 'MX' },
  { name: '美国', partition: 6, isRemote: false, code: 'US' },
  
  // 分区7
  { name: '奥地利', partition: 7, isRemote: false, code: 'AT' },
  { name: '比利时', partition: 7, isRemote: false, code: 'BE' },
  { name: '德国', partition: 7, isRemote: false, code: 'DE' },
  { name: '西班牙', partition: 7, isRemote: false, code: 'ES' },
  { name: '法国', partition: 7, isRemote: false, code: 'FR' },
  { name: '爱尔兰', partition: 7, isRemote: false, code: 'IE' },
  { name: '意大利', partition: 7, isRemote: false, code: 'IT' },
  { name: '卢森堡', partition: 7, isRemote: false, code: 'LU' },
  { name: '摩纳哥', partition: 7, isRemote: false, code: 'MC' },
  { name: '荷兰', partition: 7, isRemote: false, code: 'NL' },
  { name: '葡萄牙', partition: 7, isRemote: false, code: 'PT' },
  { name: '圣马力诺', partition: 7, isRemote: false, code: 'SM' },
  { name: '梵蒂冈', partition: 7, isRemote: false, code: 'VA' },
  { name: '阿尔巴尼亚', partition: 7, isRemote: false, code: 'AL' },
  { name: '保加利亚', partition: 7, isRemote: false, code: 'BG' },
  { name: '塞浦路斯', partition: 7, isRemote: false, code: 'CY' },
  { name: '捷克', partition: 7, isRemote: false, code: 'CZ' },
  { name: '丹麦', partition: 7, isRemote: false, code: 'DK' },
  { name: '爱沙尼亚', partition: 7, isRemote: false, code: 'EE' },
  { name: '芬兰', partition: 7, isRemote: false, code: 'FI' },
  { name: '英国', partition: 7, isRemote: false, code: 'GB' },
  { name: '希腊', partition: 7, isRemote: false, code: 'GR' },
  { name: '克罗地亚', partition: 7, isRemote: false, code: 'HR' },
  { name: '匈牙利', partition: 7, isRemote: false, code: 'HU' },
  { name: '立陶宛', partition: 7, isRemote: false, code: 'LT' },
  { name: '拉脱维亚', partition: 7, isRemote: false, code: 'LV' },
  { name: '马耳他', partition: 7, isRemote: false, code: 'MT' },
  { name: '波兰', partition: 7, isRemote: false, code: 'PL' },
  { name: '罗马尼亚', partition: 7, isRemote: false, code: 'RO' },
  { name: '瑞典', partition: 7, isRemote: false, code: 'SE' },
  { name: '斯洛文尼亚', partition: 7, isRemote: false, code: 'SI' },
  { name: '斯洛伐克', partition: 7, isRemote: false, code: 'SK' },
  
  // 分区8（其他）
  { name: '巴西', partition: 8, isRemote: false, code: 'BR' },
  { name: '智利', partition: 8, isRemote: false, code: 'CL' },
  { name: '哥伦比亚', partition: 8, isRemote: false, code: 'CO' },
  { name: '阿根廷', partition: 8, isRemote: false, code: 'AR' },
  { name: '秘鲁', partition: 8, isRemote: false, code: 'PE' },
  { name: '乌拉圭', partition: 8, isRemote: false, code: 'UY' },
  { name: '印度', partition: 7, isRemote: false, code: 'IN' },
  { name: '孟加拉', partition: 5, isRemote: false, code: 'BD' },
  { name: '巴基斯坦', partition: 9, isRemote: true, code: 'PK' },
  { name: '斯里兰卡', partition: 9, isRemote: true, code: 'LK' },
  
  // 分区9（偏远地区）
  { name: '南非', partition: 9, isRemote: true, code: 'ZA' },
  { name: '尼日利亚', partition: 9, isRemote: true, code: 'NG' },
  { name: '肯尼亚', partition: 9, isRemote: true, code: 'KE' },
  { name: '埃及', partition: 9, isRemote: true, code: 'EG' },
  { name: '摩洛哥', partition: 9, isRemote: true, code: 'MA' },
  { name: '以色列', partition: 7, isRemote: false, code: 'IL' },
  { name: '沙特阿拉伯', partition: 9, isRemote: true, code: 'SA' },
  { name: '阿联酋', partition: 9, isRemote: true, code: 'AE' },
  { name: '土耳其', partition: 7, isRemote: false, code: 'TR' },
  { name: '俄罗斯', partition: 9, isRemote: true, code: 'RU' },
  { name: '泰国', partition: 4, isRemote: false, code: 'TH' },
  { name: '乌克兰', partition: 9, isRemote: true, code: 'UA' },
  { name: '白俄罗斯', partition: 9, isRemote: true, code: 'BY' },
]

export const PARTITION_NAMES: { [key: number]: string } = {
  1: '分区1',
  2: '分区2',
  3: '分区3',
  4: '分区4',
  5: '分区5',
  6: '分区6',
  7: '分区7',
  8: '分区8',
  9: '分区9',
}

export const findCountryByName = (name: string): Country | undefined => {
  return COUNTRIES.find(c => c.name.toLowerCase() === name.toLowerCase())
}

export const getCountriesByPartition = (partition: number): Country[] => {
  return COUNTRIES.filter(c => c.partition === partition)
}

export const getAllCountries = (): Country[] => {
  return COUNTRIES
}
