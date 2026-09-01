import assert from 'node:assert/strict'
import test from 'node:test'
import {
  formatAdminOrderTime,
  isArchiveStatus,
  isWorkStatus,
  offerStockToast,
  ORDER_STATUS_LABEL,
} from './admin'

test('work queue is only new and confirmed', () => {
  assert.equal(isWorkStatus('new'), true)
  assert.equal(isWorkStatus('confirmed'), true)
  assert.equal(isWorkStatus('paid'), false)
  assert.equal(isArchiveStatus('paid'), true)
  assert.equal(isArchiveStatus('completed'), true)
  assert.equal(isArchiveStatus('cancelled'), true)
  assert.equal(isArchiveStatus('new'), false)
})

test('status labels are Russian without latin keys', () => {
  assert.equal(ORDER_STATUS_LABEL.new, 'Новый')
  assert.equal(ORDER_STATUS_LABEL.confirmed, 'Подтверждён')
  assert.equal(ORDER_STATUS_LABEL.paid, 'Оплачен')
  assert.equal(ORDER_STATUS_LABEL.completed, 'Выдан')
  assert.equal(ORDER_STATUS_LABEL.cancelled, 'Отмена')
  for (const label of Object.values(ORDER_STATUS_LABEL)) {
    assert.equal(/new|confirmed|paid|completed|cancelled/i.test(label), false)
  }
})

test('order time uses сегодня in Almaty day', () => {
  const now = new Date('2026-09-01T12:00:00+05:00')
  assert.equal(formatAdminOrderTime('2026-09-01T14:22:00+05:00', now), 'сегодня 14:22')
  assert.equal(formatAdminOrderTime('2026-08-31T09:05:00+05:00', now), 'вчера 09:05')
})

test('stock toast matches counter copy', () => {
  assert.equal(offerStockToast('Aventus', 'razliv', false), 'Aventus · разлив · нет в наличии')
  assert.equal(offerStockToast('Aventus', 'razliv', true), 'Aventus · разлив · в наличии')
})
