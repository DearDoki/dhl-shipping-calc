import React, { useMemo, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { COUNTRIES } from '../data/countries'
import { DEFAULT_FUEL_SURCHARGE } from '../data/calculator'

interface InputFormProps {
  selectedCountry: string
  onCountryChange: (country: string) => void
  weight: string
  onWeightChange: (weight: string) => void
  length: string
  onLengthChange: (length: string) => void
  width: string
  onWidthChange: (width: string) => void
  height: string
  onHeightChange: (height: string) => void
  fuelSurchargeRate: number
  onFuelSurchargeChange: (rate: number) => void
  applySeasonal: boolean
  onSeasonalChange: (apply: boolean) => void
}

const InputForm: React.FC<InputFormProps> = ({
  selectedCountry,
  onCountryChange,
  weight,
  onWeightChange,
  length,
  onLengthChange,
  width,
  onWidthChange,
  height,
  onHeightChange,
  fuelSurchargeRate,
  onFuelSurchargeChange,
  applySeasonal,
  onSeasonalChange,
}) => {
  const [countrySearchOpen, setCountrySearchOpen] = useState(false)
  const [countrySearchText, setCountrySearchText] = useState('')
  const [showDimensions, setShowDimensions] = useState(false)

  // 搜索过滤国家列表
  const filteredCountries = useMemo(() => {
    if (!countrySearchText) return COUNTRIES
    return COUNTRIES.filter(c =>
      c.name.toLowerCase().includes(countrySearchText.toLowerCase()) ||
      c.code?.toLowerCase().includes(countrySearchText.toLowerCase())
    )
  }, [countrySearchText])

  const handleCountrySelect = (countryName: string) => {
    onCountryChange(countryName)
    setCountrySearchOpen(false)
    setCountrySearchText('')
  }

  return (
    <div className="space-y-6">
      {/* 国家选择 */}
      <div>
        <label className="block text-sm font-semibold text-text-dark mb-2">
          目的国家 <span className="text-error">*</span>
        </label>
        <div className="relative">
          <button
            onClick={() => setCountrySearchOpen(!countrySearchOpen)}
            className="w-full input-base flex items-center justify-between bg-white cursor-pointer"
          >
            <span className={selectedCountry ? 'text-text-dark' : 'text-text-light'}>
              {selectedCountry || '请选择国家...'}
            </span>
            <ChevronDown className={`w-4 h-4 transition-transform ${countrySearchOpen ? 'rotate-180' : ''}`} />
          </button>

          {countrySearchOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-border rounded-lg shadow-lg z-10">
              <input
                type="text"
                placeholder="搜索国家..."
                value={countrySearchText}
                onChange={(e) => setCountrySearchText(e.target.value)}
                className="w-full px-4 py-2 border-b border-border focus:outline-none"
              />
              <div className="max-h-64 overflow-y-auto">
                {filteredCountries.length > 0 ? (
                  filteredCountries.map((country) => (
                    <button
                      key={country.name}
                      onClick={() => handleCountrySelect(country.name)}
                      className="w-full text-left px-4 py-2 hover:bg-primary-100 table-row-hover text-sm transition-colors"
                    >
                      <div className="flex justify-between">
                        <span className="text-text-dark font-medium">{country.name}</span>
                        <span className="text-text-light text-xs">分区{country.partition}</span>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-3 text-center text-text-light text-sm">
                    未找到匹配的国家
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 重量输入 */}
      <div>
        <label className="block text-sm font-semibold text-text-dark mb-2">
          重量 (kg) <span className="text-error">*</span>
        </label>
        <input
          type="number"
          min="0.5"
          max="99999"
          step="0.5"
          value={weight}
          onChange={(e) => onWeightChange(e.target.value)}
          className="input-base"
          placeholder="例：5.5"
        />
        <p className="text-xs text-text-light mt-1">最小0.5kg，最大99,999kg，按0.5kg向上取整计费</p>
      </div>

      {/* 尺寸输入（可选） */}
      <div>
        <button
          onClick={() => setShowDimensions(!showDimensions)}
          className="text-sm text-primary-700 hover:text-primary-900 font-medium cursor-pointer"
        >
          {showDimensions ? '▼' : '▶'} 计算体积重量（可选）
        </button>
        {showDimensions && (
          <div className="mt-3 p-4 bg-bg-lighter rounded-lg space-y-3">
            <p className="text-xs text-text-light">
              如果计算的体积重量超过实际重量，将按体积重量收费。计算公式：长×宽×高÷5000
            </p>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-xs font-semibold text-text-dark mb-1">长 (cm)</label>
                <input
                  type="number"
                  value={length}
                  onChange={(e) => onLengthChange(e.target.value)}
                  className="input-base"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-text-dark mb-1">宽 (cm)</label>
                <input
                  type="number"
                  value={width}
                  onChange={(e) => onWidthChange(e.target.value)}
                  className="input-base"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-text-dark mb-1">高 (cm)</label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => onHeightChange(e.target.value)}
                  className="input-base"
                  placeholder="0"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 燃油费率 */}
      <div>
        <label className="block text-sm font-semibold text-text-dark mb-2">
          燃油附加费率 (%)
        </label>
        <div className="flex gap-2 items-center">
          <input
            type="number"
            min="0"
            max="100"
            step="0.1"
            value={(fuelSurchargeRate * 100).toFixed(1)}
            onChange={(e) => {
              const val = parseFloat(e.target.value)
              if (!isNaN(val)) {
                onFuelSurchargeChange(val / 100)
              }
            }}
            className="input-base flex-1"
          />
          <button
            onClick={() => onFuelSurchargeChange(DEFAULT_FUEL_SURCHARGE.rate)}
            className="btn-secondary text-xs px-3 py-2 whitespace-nowrap"
          >
            使用默认值
          </button>
        </div>
        <p className="text-xs text-text-light mt-1">
          当前默认值：{(DEFAULT_FUEL_SURCHARGE.rate * 100).toFixed(1)}%
        </p>
      </div>

      {/* 季节费勾选 */}
      <div className="pt-2 border-t border-border">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={applySeasonal}
            onChange={(e) => onSeasonalChange(e.target.checked)}
            className="w-4 h-4 cursor-pointer"
          />
          <span className="text-sm font-semibold text-text-dark">
            应用冬季附加费（1-3月）
          </span>
        </label>
        <p className="text-xs text-text-light mt-2 ml-7">
          冬季（1月-3月）高需求期间，每公斤加收 ¥3.5
        </p>
      </div>
    </div>
  )
}

export default InputForm
