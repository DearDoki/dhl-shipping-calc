
﻿import { FuelSurcharge, ShippingCalculation } from '../types'
import { getPriceForWeightAndPartition, calculateVolumetricWeight } from './prices'

// 默认燃油费率（从DHL官网获取）
// 当前按 6月 15-21, 2026 费率自动更新
export const DEFAULT_FUEL_SURCHARGE: FuelSurcharge = {
  rate: 0.4700, // 47.00% (6月 15-21, 2026)
  validFrom: '2026-06-15',
  validTo: '2026-06-21',
  lastUpdated: '2026-06-15T08:40:08.909004'
}

// 旺季费配置（冬季）
export const SEASONAL_SURCHARGE_CONFIG = {
  enabled: true,
  name: '冬季附加费',
  months: [1, 2, 3], // 1月、2月、3月
  rate: 3.5, // 每公斤3.5元
  description: '冬季高需求期间的附加费',
}

// 主计算函数
export const calculateShipping = (
  weight: number,
  partition: number,
  fuelSurchargeRate: number = DEFAULT_FUEL_SURCHARGE.rate,
  applySeasonal: boolean = false,
  length?: number,
  width?: number,
  height?: number
): ShippingCalculation | null => {
  // 计算计费重量（取实际重量和体积重量的较大值）
  let billableWeight = weight
  
  if (length && width && height) {
    const volumetricWeight = calculateVolumetricWeight(length, width, height)
    billableWeight = Math.max(weight, volumetricWeight)
  }
  
  // 向上取整至0.5kg
  billableWeight = Math.ceil(billableWeight * 2) / 2
  
  // 获取基础运费
  const baseFreight = getPriceForWeightAndPartition(billableWeight, partition)
  if (baseFreight === null) {
    return null
  }
  
  // 计算燃油附加费
  const fuelAmount = baseFreight * fuelSurchargeRate
  
  // 计算季节性附加费（可选）
  let seasonalAmount = 0
  if (applySeasonal) {
    seasonalAmount = billableWeight * SEASONAL_SURCHARGE_CONFIG.rate
  }
  
  // 计算总费用
  // 公式：总运费 = 基础运费 × (1 + 燃油附加费率) + 其他附加费
  const total = baseFreight * (1 + fuelSurchargeRate) + seasonalAmount

  
  return {
    baseFreight,
    fuelSurcharge: fuelAmount,
    fuelPercentage: fuelSurchargeRate * 100,
    seasonalSurcharge: seasonalAmount,
    total,
    details: {
      baseFreightAmount: baseFreight,
      fuelAmount,
      seasonalAmount,
    },
  }
}

// 检查是否是旺季
export const isSeasonalPeriod = (date: Date = new Date()): boolean => {
  const month = date.getMonth() + 1
  return SEASONAL_SURCHARGE_CONFIG.months.includes(month)
}

// 格式化货币
export const formatCurrency = (amount: number): string => {
  return `CNY ¥${amount.toFixed(2)}`
}




