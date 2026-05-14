import { PriceTable } from '../types'

// 基础价格表数据 - 从PDF提取
// 结构：weightMin, weightMax, 然后是9个分区的价格
export const PRICE_TABLES: PriceTable[] = [
  // 0-2.0kg 文件
  { weightMin: 0.5, weightMax: 0.5, partition: { 1: 77.60, 2: 106.40, 3: 103.20, 4: 113.60, 5: 162.40, 6: 178.40, 7: 186.40, 8: 231.20, 9: 326.40 } },
  { weightMin: 1.0, weightMax: 1.0, partition: { 1: 104.80, 2: 148.80, 3: 144.00, 4: 156.40, 5: 216.40, 6: 251.60, 7: 261.60, 8: 318.00, 9: 436.00 } },
  { weightMin: 1.5, weightMax: 1.5, partition: { 1: 132.00, 2: 191.20, 3: 184.80, 4: 199.60, 5: 270.40, 6: 324.80, 7: 336.80, 8: 404.80, 9: 545.60 } },
  { weightMin: 2.0, weightMax: 2.0, partition: { 1: 159.20, 2: 233.60, 3: 225.60, 4: 242.80, 5: 324.40, 6: 398.00, 7: 412.00, 8: 491.60, 9: 655.20 } },
  
  // 0.5kg以上包裹和2.5kg以上文件
  { weightMin: 0.5, weightMax: 0.5, partition: { 1: 97.50, 2: 132.00, 3: 123.30, 4: 146.40, 5: 147.30, 6: 151.50, 7: 192.60, 8: 246.90, 9: 370.50 } },
  { weightMin: 1.0, weightMax: 1.0, partition: { 1: 118.50, 2: 162.30, 3: 156.00, 4: 178.50, 5: 193.50, 6: 201.00, 7: 242.70, 8: 311.70, 9: 453.00 } },
  { weightMin: 1.5, weightMax: 1.5, partition: { 1: 139.50, 2: 192.60, 3: 188.70, 4: 210.60, 5: 239.70, 6: 250.50, 7: 292.80, 8: 376.50, 9: 535.50 } },
  { weightMin: 2.0, weightMax: 2.0, partition: { 1: 160.50, 2: 222.90, 3: 221.40, 4: 242.70, 5: 285.90, 6: 300.00, 7: 342.90, 8: 441.30, 9: 618.00 } },
  { weightMin: 2.5, weightMax: 2.5, partition: { 1: 181.50, 2: 253.20, 3: 254.10, 4: 275.40, 5: 332.10, 6: 349.20, 7: 393.00, 8: 506.10, 9: 700.50 } },
  { weightMin: 3.0, weightMax: 3.0, partition: { 1: 201.90, 2: 283.20, 3: 284.10, 4: 306.60, 5: 376.20, 6: 396.90, 7: 446.10, 8: 570.90, 9: 782.70 } },
  { weightMin: 3.5, weightMax: 3.5, partition: { 1: 222.30, 2: 313.20, 3: 314.10, 4: 337.80, 5: 420.30, 6: 444.60, 7: 499.20, 8: 635.70, 9: 864.90 } },
  { weightMin: 4.0, weightMax: 4.0, partition: { 1: 242.70, 2: 343.20, 3: 344.10, 4: 369.00, 5: 464.40, 6: 492.30, 7: 552.30, 8: 700.50, 9: 947.10 } },
  { weightMin: 4.5, weightMax: 4.5, partition: { 1: 263.10, 2: 373.20, 3: 374.10, 4: 400.20, 5: 508.50, 6: 540.00, 7: 605.40, 8: 765.30, 9: 1029.30 } },
  { weightMin: 5.0, weightMax: 5.0, partition: { 1: 283.50, 2: 403.20, 3: 404.10, 4: 431.40, 5: 552.60, 6: 587.70, 7: 658.50, 8: 830.10, 9: 1111.50 } },
  { weightMin: 5.5, weightMax: 5.5, partition: { 1: 302.70, 2: 431.70, 3: 433.50, 4: 462.30, 5: 592.50, 6: 635.40, 7: 706.50, 8: 888.30, 9: 1185.60 } },
  { weightMin: 6.0, weightMax: 6.0, partition: { 1: 321.90, 2: 460.20, 3: 462.90, 4: 493.20, 5: 632.40, 6: 683.10, 7: 754.50, 8: 946.50, 9: 1259.70 } },
  { weightMin: 6.5, weightMax: 6.5, partition: { 1: 341.10, 2: 488.70, 3: 492.30, 4: 524.10, 5: 672.30, 6: 730.80, 7: 802.50, 8: 1004.70, 9: 1333.80 } },
  { weightMin: 7.0, weightMax: 7.0, partition: { 1: 360.30, 2: 517.20, 3: 521.70, 4: 555.00, 5: 712.20, 6: 778.50, 7: 850.50, 8: 1062.90, 9: 1407.90 } },
  { weightMin: 7.5, weightMax: 7.5, partition: { 1: 379.50, 2: 545.70, 3: 551.10, 4: 585.90, 5: 752.10, 6: 826.20, 7: 898.50, 8: 1121.10, 9: 1482.00 } },
  { weightMin: 8.0, weightMax: 8.0, partition: { 1: 398.70, 2: 574.20, 3: 580.50, 4: 616.80, 5: 792.00, 6: 873.90, 7: 946.50, 8: 1179.30, 9: 1556.10 } },
  { weightMin: 8.5, weightMax: 8.5, partition: { 1: 417.90, 2: 602.70, 3: 609.90, 4: 647.70, 5: 831.90, 6: 921.60, 7: 994.50, 8: 1237.50, 9: 1630.20 } },
  { weightMin: 9.0, weightMax: 9.0, partition: { 1: 437.10, 2: 631.20, 3: 639.30, 4: 678.60, 5: 871.80, 6: 969.30, 7: 1042.50, 8: 1295.70, 9: 1704.30 } },
  { weightMin: 9.5, weightMax: 9.5, partition: { 1: 456.30, 2: 659.70, 3: 668.70, 4: 709.50, 5: 911.70, 6: 1017.00, 7: 1090.50, 8: 1353.90, 9: 1778.40 } },
  { weightMin: 10.0, weightMax: 10.0, partition: { 1: 475.50, 2: 688.20, 3: 698.10, 4: 740.40, 5: 951.60, 6: 1064.70, 7: 1138.50, 8: 1412.10, 9: 1852.50 } },
  { weightMin: 10.5, weightMax: 10.5, partition: { 1: 491.10, 2: 712.80, 3: 725.70, 4: 771.00, 5: 988.80, 6: 1109.70, 7: 1181.10, 8: 1463.10, 9: 1920.60 } },
  { weightMin: 11.0, weightMax: 11.0, partition: { 1: 506.70, 2: 737.40, 3: 753.30, 4: 801.60, 5: 1026.00, 6: 1154.70, 7: 1223.70, 8: 1514.10, 9: 1988.70 } },
  { weightMin: 11.5, weightMax: 11.5, partition: { 1: 522.30, 2: 762.00, 3: 780.90, 4: 832.20, 5: 1063.20, 6: 1199.70, 7: 1266.30, 8: 1565.10, 9: 2056.80 } },
  { weightMin: 12.0, weightMax: 12.0, partition: { 1: 537.90, 2: 786.60, 3: 808.50, 4: 862.80, 5: 1100.40, 6: 1244.70, 7: 1308.90, 8: 1616.10, 9: 2124.90 } },
  { weightMin: 12.5, weightMax: 12.5, partition: { 1: 553.50, 2: 811.20, 3: 836.10, 4: 893.40, 5: 1137.60, 6: 1289.70, 7: 1351.50, 8: 1667.10, 9: 2193.00 } },
  { weightMin: 13.0, weightMax: 13.0, partition: { 1: 569.10, 2: 835.80, 3: 863.70, 4: 924.00, 5: 1174.80, 6: 1334.70, 7: 1394.10, 8: 1718.10, 9: 2261.10 } },
  { weightMin: 13.5, weightMax: 13.5, partition: { 1: 584.70, 2: 860.40, 3: 891.30, 4: 954.60, 5: 1212.00, 6: 1379.70, 7: 1436.70, 8: 1769.10, 9: 2329.20 } },
  { weightMin: 14.0, weightMax: 14.0, partition: { 1: 600.30, 2: 885.00, 3: 918.90, 4: 985.20, 5: 1249.20, 6: 1424.70, 7: 1479.30, 8: 1820.10, 9: 2397.30 } },
  { weightMin: 14.5, weightMax: 14.5, partition: { 1: 615.90, 2: 909.60, 3: 946.50, 4: 1015.80, 5: 1286.40, 6: 1469.70, 7: 1521.90, 8: 1871.10, 9: 2465.40 } },
  { weightMin: 15.0, weightMax: 15.0, partition: { 1: 631.50, 2: 934.20, 3: 974.10, 4: 1046.40, 5: 1323.60, 6: 1514.70, 7: 1564.50, 8: 1922.10, 9: 2533.50 } },
  { weightMin: 20.0, weightMax: 20.0, partition: { 1: 778.50, 2: 1192.50, 3: 1267.50, 4: 1365.00, 5: 1785.00, 6: 2010.00, 7: 2145.00, 8: 2565.00, 9: 3465.00 } },
  { weightMin: 30.0, weightMax: 30.0, partition: { 1: 1102.50, 2: 1657.50, 3: 1747.50, 4: 1912.50, 5: 2565.00, 6: 2887.50, 7: 3067.50, 8: 3615.00, 9: 5040.00 } },
]

// 30.1kg+ 按每公斤单价
export const WEIGHT_UNIT_PRICE: { [key: number]: number } = {
  1: 20.23,
  2: 27.30,
  3: 29.54,
  4: 31.92,
  5: 55.86,
  6: 59.09,
  7: 51.00,
  8: 56.98,
  9: 88.32,
}

// 获取特定重量和分区的价格
export const getPriceForWeightAndPartition = (weight: number, partition: number): number | null => {
  const roundedWeight = Math.ceil(weight * 2) / 2 // 向上取整至0.5kg

  // 先找完全匹配的档位；如果同重量存在文件价和包裹价，默认取后者（包裹价）
  const exactMatches = PRICE_TABLES.filter(
    pt => roundedWeight >= pt.weightMin && roundedWeight <= pt.weightMax
  )

  if (exactMatches.length > 0) {
    const matchedTable = exactMatches[exactMatches.length - 1]
    return matchedTable.partition[partition] || null
  }

  // 某些重量段（如 15.5-19.5kg、20.5-29.5kg）源价格表只有上一个整档
  // 这种情况按“向上匹配到最近的更高重量档位”处理，例如 23.5kg 按 30kg 档计费
  const nextUpperBracket = PRICE_TABLES.find(pt => pt.weightMin >= roundedWeight)
  if (nextUpperBracket) {
    return nextUpperBracket.partition[partition] || null
  }

  // 如果超过表格范围，使用单价计算（30.1kg以上）
  if (weight > 30) {
    const unitPrice = WEIGHT_UNIT_PRICE[partition] || null
    if (unitPrice) {
      return Math.ceil(weight) * unitPrice
    }
  }

  return null
}


// 计算体积重量
export const calculateVolumetricWeight = (length: number, width: number, height: number): number => {
  return (length * width * height) / 5000
}
