export interface Country {
  name: string
  partition: number
  isRemote: boolean
  code?: string
}

export interface PriceTable {
  weightMin: number
  weightMax: number
  partition: { [key: number]: number }
}

export interface FuelSurcharge {
  rate: number
  validFrom: string
  validTo: string
  lastUpdated: string
}

export interface ShippingCalculation {
  baseFreight: number
  fuelSurcharge: number
  fuelPercentage: number
  seasonalSurcharge: number
  total: number
  details: {
    baseFreightAmount: number
    fuelAmount: number
    seasonalAmount: number
  }
}
