import React from 'react'
import { Copy, Check } from 'lucide-react'
import { ShippingCalculation } from '../types'
import { formatCurrency } from '../data/calculator'

interface ResultDisplayProps {
  calculation: ShippingCalculation
  country: string
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ calculation, country }) => {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = () => {
    const text = `${country} 运费计算结果\n基础运费: ${formatCurrency(calculation.details.baseFreightAmount)}\n燃油附加费 (${calculation.fuelPercentage.toFixed(1)}%): ${formatCurrency(calculation.details.fuelAmount)}\n${calculation.details.seasonalAmount > 0 ? `冬季附加费: ${formatCurrency(calculation.details.seasonalAmount)}\n` : ''}总运费: ${formatCurrency(calculation.total)}`
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      {/* 费用明细 */}
      <div className="card">
        <h3 className="text-lg font-bold text-text-dark mb-4">费用明细</h3>
        
        <div className="space-y-3 mb-4">
          {/* 基础运费 */}
          <div className="flex justify-between items-start p-3 bg-bg-lighter rounded">
            <div>
              <p className="text-sm font-semibold text-text-dark">基础运费</p>
              <p className="text-xs text-text-light mt-1">按分区和重量计算</p>
            </div>
            <p className="text-lg font-bold text-primary-700">
              {formatCurrency(calculation.details.baseFreightAmount)}
            </p>
          </div>

          {/* 燃油附加费 */}
          <div className="flex justify-between items-start p-3 bg-bg-lighter rounded">
            <div>
              <p className="text-sm font-semibold text-text-dark">燃油附加费</p>
              <p className="text-xs text-text-light mt-1">{calculation.fuelPercentage.toFixed(1)}% 的基础运费</p>
            </div>
            <p className="text-lg font-bold text-primary-700">
              {formatCurrency(calculation.details.fuelAmount)}
            </p>
          </div>

          {/* 冬季附加费（如果适用） */}
          {calculation.details.seasonalAmount > 0 && (
            <div className="flex justify-between items-start p-3 bg-yellow-50 border border-yellow-200 rounded">
              <div>
                <p className="text-sm font-semibold text-text-dark">冬季附加费</p>
                <p className="text-xs text-text-light mt-1">高需求期间附加费</p>
              </div>
              <p className="text-lg font-bold text-yellow-600">
                {formatCurrency(calculation.details.seasonalAmount)}
              </p>
            </div>
          )}
        </div>

        {/* 分割线 */}
        <div className="border-t-2 border-primary-700 my-4"></div>

        {/* 总费用 */}
        <div className="flex justify-between items-center p-4 bg-gradient-to-r from-primary-700 to-primary-900 rounded-lg text-white">
          <div>
            <p className="text-sm font-semibold">总运费</p>
            <p className="text-xs opacity-90 mt-1">CNY 人民币</p>
          </div>
          <p className="text-3xl font-bold">
            ¥{calculation.total.toFixed(2)}
          </p>
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="flex gap-3">
        <button
          onClick={handleCopy}
          className="btn-primary flex items-center justify-center gap-2 flex-1"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              已复制
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              复制结果
            </>
          )}
        </button>
      </div>

      {/* 提示信息 */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded">
        <p className="text-xs font-semibold text-blue-900 mb-2">温馨提示</p>
        <ul className="text-xs text-blue-800 space-y-1">
          <li>• 上述价格仅供参考，不包含税费</li>
          <li>• 实际重量以DHL称重为准，按0.5kg向上取整</li>
          <li>• 偏远地区可能有额外附加费，请咨询DHL客服</li>
          <li>• 燃油费率和季节费可能随时调整</li>
        </ul>
      </div>
    </div>
  )
}

export default ResultDisplay
