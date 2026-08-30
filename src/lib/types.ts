export type CatalogSection = 'razliv' | 'raspiv'
export type Gender = 'male' | 'female' | 'unisex'
export type VolumeMl = 5 | 10 | 20
export type OrderStatus = 'new' | 'confirmed' | 'paid' | 'completed' | 'cancelled'

export interface ProductNotes {
  top: string[]
  middle: string[]
  base: string[]
  display?: CatalogDisplay
}

export interface CatalogDisplay {
  tags: string[]
  mood: string
  moodIcon: string
  bottleColor: string
  bottleAccent: string
  ratings: {
    longevity: number
    sillage: number
    compliments: number
    versatility: number
  }
  season: string
  timeOfDay: string
  category: string
  isBestseller?: boolean
  isNew?: boolean
}

export interface Product {
  id: string
  slug: string
  brand: string
  name: string
  description: string
  gender: Gender
  notes: ProductNotes
  imageUrl: string
  isActive: boolean
}

export interface Offer {
  id: string
  productId: string
  section: CatalogSection
  pricePerMlTenge: number
  isOriginal: boolean
  isInStock: boolean
  isActive: boolean
}

export interface CartItem {
  offerId: string
  productId: string
  brand: string
  name: string
  section: CatalogSection
  volumeMl: VolumeMl
  quantity: number
  previewPricePerMl: number
  image?: string
  slug?: string
}

export interface OrderRequestItem {
  offerId: string
  volumeMl: VolumeMl
  quantity: number
}

export interface OrderPayload {
  clientRequestId: string
  customerName: string
  phone: string
  acceptedLegal: boolean
  items: OrderRequestItem[]
}

export interface OrderItemSnapshot {
  offerId: string
  productId: string
  brand: string
  name: string
  section: CatalogSection
  volumeMl: VolumeMl
  quantity: number
  pricePerMlTenge: number
  lineTotalTenge: number
}

export interface CalculatedOrder {
  items: OrderItemSnapshot[]
  totalTenge: number
}

export type OrderErrorCode =
  | 'invalid_payload'
  | 'invalid_name'
  | 'invalid_phone'
  | 'invalid_request_id'
  | 'empty_cart'
  | 'cart_too_large'
  | 'invalid_volume'
  | 'invalid_quantity'
  | 'offer_unavailable'
  | 'offer_out_of_stock'
  | 'legal_not_accepted'
