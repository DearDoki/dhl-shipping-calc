
﻿import { FuelSurcharge, ShippingCalculation } from '../types'
import { getPriceForWeightAndPartition, calculateVolumetricWeight } from './prices'

// 默认燃油费率（从DHL官网获取）
// 当前按 9月 28-10月 4, 2026 费率自动更新
export const DEFAULT_FUEL_SURCHARGE: FuelSurcharge = {
  rate: 0.4625, // 46.25% (9月 28-10月 4, 2026)
  validFrom: '2026-09-28',
  validTo: '2026-10-04',
  lastUpdated: '2026-09-28T08:36:02.794577'
}

// 旺季附加费见 ./peakSurcharge.ts（按目的地分区计价，75折，2026-10-01 至 2027-02-05）
// 通过 calculateShipping 的 peakSurchargePerKg 参数传入（折后每公斤金额，0 表示不收）

// 主计算函数
export const calculateShipping = (
  weight: number,
  partition: number,
  fuelSurchargeRate: number = DEFAULT_FUEL_SURCHARGE.rate,
  peakSurchargePerKg: number = 0,
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
  
  // 旺季附加费（按计费重量 × 折后每公斤费率）
  const seasonalAmount =
    peakSurchargePerKg > 0
      ? Math.round(billableWeight * peakSurchargePerKg * 100) / 100
      : 0

  // 计算总费用
  // 公式：总运费 = 基础运费 × (1 + 燃油附加费率) + 旺季附加费
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

// 格式化货币
export const formatCurrency = (amount: number): string => {
  return `CNY ¥${amount.toFixed(2)}`
}




