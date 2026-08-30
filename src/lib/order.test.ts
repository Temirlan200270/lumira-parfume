import assert from 'node:assert/strict'
import test from 'node:test'
import {
  buildWhatsAppText,
  buildWhatsAppUrl,
  calculateOrder,
  createOrderNumber,
  normalizePhone,
  priceForVolume,
  validateOrderPayload,
} from './order'
import type { OfferForOrder } from './order'

const offer: OfferForOrder = {
  id: '11111111-1111-4111-8111-111111111111',
  productId: '22222222-2222-4222-8222-222222222222',
  brand: 'Creed',
  name: 'Aventus',
  section: 'razliv',
  pricePerMlTenge: 800,
  isOriginal: false,
  isInStock: true,
  isActive: true,
  productIsActive: true,
}

test('priceForVolume multiplies 5, 10 and 20 ml', () => {
  assert.equal(priceForVolume(800, 5), 4000)
  assert.equal(priceForVolume(800, 10), 8000)
  assert.equal(priceForVolume(1600, 20), 32000)
})

test('normalizePhone accepts KZ formats', () => {
  assert.equal(normalizePhone('+7 747 919 2766'), '+77479192766')
  assert.equal(normalizePhone('87479192766'), '+77479192766')
  assert.equal(normalizePhone('7479192766'), '+77479192766')
  assert.equal(normalizePhone('123'), null)
})

test('validateOrderPayload rejects empty cart, bad phone and missing legal consent', () => {
  const empty = validateOrderPayload({
    clientRequestId: '33333333-3333-4333-8333-333333333333',
    customerName: 'Алия',
    phone: '+77479192766',
    acceptedLegal: true,
    items: [],
  })
  assert.equal(empty.ok, false)
  if (!empty.ok) assert.equal(empty.error.code, 'empty_cart')

  const badPhone = validateOrderPayload({
    clientRequestId: '33333333-3333-4333-8333-333333333333',
    customerName: 'Алия',
    phone: '00',
    acceptedLegal: true,
    items: [
      {
        offerId: offer.id,
        volumeMl: 5,
        quantity: 1,
      },
    ],
  })
  assert.equal(badPhone.ok, false)
  if (!badPhone.ok) assert.equal(badPhone.error.code, 'invalid_phone')

  const noConsent = validateOrderPayload({
    clientRequestId: '33333333-3333-4333-8333-333333333333',
    customerName: 'Алия',
    phone: '+77479192766',
    items: [
      {
        offerId: offer.id,
        volumeMl: 5,
        quantity: 1,
      },
    ],
  })
  assert.equal(noConsent.ok, false)
  if (!noConsent.ok) assert.equal(noConsent.error.code, 'legal_not_accepted')
})

test('calculateOrder uses server prices and ignores client amounts', () => {
  const result = calculateOrder(
    [{ offerId: offer.id, volumeMl: 10, quantity: 2 }],
    [{ ...offer, pricePerMlTenge: 900 }]
  )
  assert.equal(result.ok, true)
  if (result.ok) {
    assert.equal(result.value.totalTenge, 18000)
    assert.equal(result.value.items[0]?.pricePerMlTenge, 900)
  }
})

test('calculateOrder rejects hidden and out-of-stock offers', () => {
  const hidden = calculateOrder(
    [{ offerId: offer.id, volumeMl: 5, quantity: 1 }],
    [{ ...offer, isActive: false }]
  )
  assert.equal(hidden.ok, false)
  if (!hidden.ok) assert.equal(hidden.error.code, 'offer_unavailable')

  const hiddenProduct = calculateOrder(
    [{ offerId: offer.id, volumeMl: 5, quantity: 1 }],
    [{ ...offer, productIsActive: false }]
  )
  assert.equal(hiddenProduct.ok, false)
  if (!hiddenProduct.ok) assert.equal(hiddenProduct.error.code, 'offer_unavailable')

  const out = calculateOrder(
    [{ offerId: offer.id, volumeMl: 5, quantity: 1 }],
    [{ ...offer, isInStock: false }]
  )
  assert.equal(out.ok, false)
  if (!out.ok) assert.equal(out.error.code, 'offer_out_of_stock')
})

test('WhatsApp text includes order number, volumes and server total', () => {
  const text = buildWhatsAppText({
    orderNumber: 'LM-ABCD1234',
    customerName: 'Алия',
    totalTenge: 8000,
    items: [
      {
        offerId: offer.id,
        productId: offer.productId,
        brand: 'Creed',
        name: 'Aventus',
        section: 'razliv',
        volumeMl: 10,
        quantity: 1,
        pricePerMlTenge: 800,
        lineTotalTenge: 8000,
      },
    ],
  })
  assert.match(text, /LM-ABCD1234/)
  assert.match(text, /Алия/)
  assert.match(text, /10 мл/)
  assert.match(text, /8 000 ₸/)
  const url = buildWhatsAppUrl(text)
  assert.match(url, /^https:\/\/wa\.me\/77479192766\?text=/)
})

test('createOrderNumber is short and stable', () => {
  assert.equal(createOrderNumber('aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee'), 'LM-AAAAAAAA')
})
