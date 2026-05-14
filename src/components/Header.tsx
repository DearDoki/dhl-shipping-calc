import React from 'react'
import { Package } from 'lucide-react'

const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-700 to-primary-900 rounded-lg flex items-center justify-center">
            <Package className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-text-dark">DHL运费计算器</h1>
            <p className="text-xs text-text-light">国际快递运费智能计算</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-text-light">从中国发出</p>
          <p className="text-sm font-semibold text-text-dark">DHL Express</p>
        </div>
      </div>
    </header>
  )
}

export default Header
