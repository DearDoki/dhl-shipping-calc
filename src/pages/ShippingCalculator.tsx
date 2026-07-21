import React, { useState, useMemo, useRef, useEffect } from 'react'
import { AlertCircle, Copy, Check } from 'lucide-react'
import { calculateShipping, DEFAULT_FUEL_SURCHARGE } from '../data/calculator'
import { findCountryByName, getAllCountries } from '../data/countries'
import { ShippingCalculation } from '../types'

type CurrencyCode = 'USD' | 'EUR' | 'JPY'

interface CurrencyOption {
  code: CurrencyCode
  label: string
  symbol: string
  rate: number
}

const CURRENCY_OPTIONS: CurrencyOption[] = [
  { code: 'USD', label: '美元', symbol: '$', rate: 6.3 },
  { code: 'EUR', label: '欧元', symbol: '€', rate: 7.8 },
  { code: 'JPY', label: '日元', symbol: 'JP¥', rate: 0.045 },
]


const getCurrencyOption = (code: CurrencyCode): CurrencyOption => {
  return CURRENCY_OPTIONS.find((option) => option.code === code) ?? CURRENCY_OPTIONS[0]
}

const ShippingCalculator: React.FC = () => {
  const [selectedCountry, setSelectedCountry] = useState<string>('')
  const [weight, setWeight] = useState<string>('')
  const [outputCurrency, setOutputCurrency] = useState<CurrencyCode>('USD')
  const [copied, setCopied] = useState(false)

  const [countryOpen, setCountryOpen] = useState(false)
  const [countrySearch, setCountrySearch] = useState('')
  const countryRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (countryRef.current && !countryRef.current.contains(e.target as Node)) {
        setCountryOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])


  const allCountries = getAllCountries()

  // 选中后显示：国家名 (分区 X)
  const selectedDisplay = (() => {
    if (!selectedCountry || countryOpen) return ''
    const c = findCountryByName(selectedCountry)
    return c ? `${c.name} (分区 ${c.partition})` : selectedCountry
  })()

  const filteredCountries = useMemo(() => {
    const q = countrySearch.trim()
    if (!q) return allCountries
    const lowerQ = q.toLowerCase()

    return allCountries
      .filter(c => {
        const nameMatch = c.name.toLowerCase().includes(lowerQ)
        const codeMatch = c.code ? c.code.toLowerCase().includes(lowerQ) : false
        return nameMatch || codeMatch
      })
      .sort((a, b) => {
        // 1. 国家名完全匹配排最前
        if (a.name === q) return -1
        if (b.name === q) return 1
        // 2. 以搜索词开头的排其次
        const aStarts = a.name.startsWith(q) || a.name.toLowerCase().startsWith(lowerQ)
        const bStarts = b.name.startsWith(q) || b.name.toLowerCase().startsWith(lowerQ)
        if (aStarts && !bStarts) return -1
        if (!aStarts && bStarts) return 1
        // 3. 其余保持原顺序
        return 0
      })
  }, [countrySearch, allCountries])

  const { calculation, error, countryInfo } = useMemo<{
    calculation: ShippingCalculation | null
    error: string
    countryInfo: ReturnType<typeof findCountryByName> | null
  }>(() => {
    const country = selectedCountry ? findCountryByName(selectedCountry) : null

    if (!selectedCountry || !weight) {
      return {
        calculation: null,
        error: '',
        countryInfo: country,
      }
    }

    if (!country) {
      return {
        calculation: null,
        error: '国家未找到',
        countryInfo: null,
      }
    }

    const weightNum = parseFloat(weight)
    if (isNaN(weightNum) || weightNum <= 0) {
      return {
        calculation: null,
        error: '请输入有效的重量',
        countryInfo: country,
      }
    }

    if (weightNum > 99999) {
      return {
        calculation: null,
        error: '重量超出范围',
        countryInfo: country,
      }
    }

    const result = calculateShipping(weightNum, country.partition, DEFAULT_FUEL_SURCHARGE.rate, false)

    if (!result) {
      return {
        calculation: null,
        error: '当前重量暂无可用报价',
        countryInfo: country,
      }
    }

    return {
      calculation: result,
      error: '',
      countryInfo: country,
    }
  }, [selectedCountry, weight])

  const isRemote = countryInfo?.isRemote || false
  const selectedCurrencyOption = getCurrencyOption(outputCurrency)
  const convertedTotal = calculation ? calculation.total / selectedCurrencyOption.rate : null

  const handleCopy = () => {
    if (calculation && convertedTotal !== null) {
      const text = `${selectedCountry} ${weight}kg\n人民币总运费：¥${calculation.total.toFixed(2)}\n${selectedCurrencyOption.label}总运费：${selectedCurrencyOption.symbol}${convertedTotal.toFixed(2)}\n汇率：1 ${selectedCurrencyOption.label} = ¥${selectedCurrencyOption.rate.toFixed(3)}`
      navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }



  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4 py-8">
      <div className="w-full max-w-md">
        {/* 卡片主体 */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* 顶部蓝色条 */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
            <h1 className="text-2xl font-bold">DHL 运费计算</h1>
            <p className="text-blue-100 text-sm mt-1">选择国家，输入重量，即时出价</p>
          </div>

          {/* 内容区域 */}
          <div className="p-6 space-y-5">
            {/* 国家选择 */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                目的国家
              </label>
              <div className="relative" ref={countryRef}>
                <input
                  type="text"
                  value={countryOpen ? countrySearch : selectedDisplay}
                  placeholder="搜索国家，如：美国 / US"
                  onChange={(e) => {
                    setCountrySearch(e.target.value)
                    setCountryOpen(true)
                  }}
                  onFocus={() => setCountryOpen(true)}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') setCountryOpen(false)
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-gray-700"
                />
                {countryOpen && (
                  <div className="absolute z-10 mt-1 w-full max-h-60 overflow-auto bg-white border border-gray-300 rounded-lg shadow-lg">
                    {filteredCountries.length === 0 ? (
                      <div className="px-4 py-3 text-sm text-gray-400">无匹配国家</div>
                    ) : (
                      filteredCountries.map((c) => (
                        <div
                          key={c.name}
                          onClick={() => {
                            setSelectedCountry(c.name)
                            setCountryOpen(false)
                            setCountrySearch('')
                          }}
                          className="px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 cursor-pointer"
                        >
                          {c.name} (分区 {c.partition})
                          {c.isRemote ? ' ⚠️偏远' : ''}
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* 重量输入 */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                重量 (kg)
              </label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="例：5.5"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-gray-700"
                min="0.5"
                max="99999"
                step="0.1"
              />
            </div>

            {/* 输出币别 */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                输出币别
              </label>
              <div className="relative">
                <select
                  value={outputCurrency}
                  onChange={(e) => setOutputCurrency(e.target.value as CurrencyCode)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white text-gray-700 appearance-none cursor-pointer"
                >
                  {CURRENCY_OPTIONS.map((option) => (
                    <option key={option.code} value={option.code}>
                      {option.label} ({option.code})
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>

            {/* 错误提示 */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex gap-2 items-start">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}


            {/* 偏远地区提示 */}
            {isRemote && selectedCountry && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex gap-2 items-start">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-yellow-700">
                  <strong>{selectedCountry}</strong> 属于偏远地区，可能产生附加费
                </p>
              </div>
            )}

            {/* 结果展示区 */}
            {calculation && !error ? (
              <div className="mt-6 pt-6 border-t border-gray-200 space-y-4">
                {/* 明细表 */}
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">基础运费</span>
                    <span className="font-medium text-gray-900">¥{calculation.baseFreight.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">燃油附加费 ({(DEFAULT_FUEL_SURCHARGE.rate * 100).toFixed(2)}%)</span>
                    <span className="font-medium text-gray-900">¥{calculation.fuelSurcharge.toFixed(2)}</span>
                  </div>
                </div>

                {/* 总费用 */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 mt-4 border border-blue-200">
                  <p className="text-xs text-gray-600 mb-1">总运费（人民币）</p>
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="text-3xl font-bold text-blue-600">
                      ¥{calculation.total.toFixed(2)}
                    </span>
                    <button
                      onClick={handleCopy}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-white border border-blue-300 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4" />
                          已复制
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          复制
                        </>
                      )}
                    </button>
                  </div>
                  <p className="mt-2 text-xs text-blue-700">
                    计算公式：总运费 = 基础运费 × (1 + 燃油附加费)
                  </p>
                  <div className="mt-3 pt-3 border-t border-blue-200">
                    <p className="text-xs text-gray-600 mb-1">换算总运费（{selectedCurrencyOption.label}）</p>
                    <p className="text-2xl font-semibold text-indigo-600">
                      {selectedCurrencyOption.symbol}{convertedTotal?.toFixed(2)}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      汇率：1 {selectedCurrencyOption.label} = ¥{selectedCurrencyOption.rate.toFixed(3)}
                    </p>
                  </div>
                </div>



                {/* 燃油费说明 */}
                <div className="text-xs text-gray-500 italic pt-2">
                  燃油费有效期：{DEFAULT_FUEL_SURCHARGE.validFrom} 至 {DEFAULT_FUEL_SURCHARGE.validTo}
                </div>
              </div>
            ) : (
              selectedCountry && weight && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg text-center text-gray-500 text-sm">
                  计算中...
                </div>
              )
            )}
          </div>
        </div>

        {/* 底部提示 */}
        <div className="mt-6 text-center text-gray-600 text-xs">
          <p>💡 输入国家和重量，即可快速查询DHL Express运费</p>
          <p className="mt-2 text-gray-500">价格仅供参考，最终以DHL报价为准</p>
        </div>
      </div>
    </div>
  )
}

export default ShippingCalculator
