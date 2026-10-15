import assert from 'node:assert/strict'
import test from 'node:test'
import { getVisibleMeals, isHallClosed } from './menu.js'

test('missing hall is closed', () => {
  assert.equal(isHallClosed({}, 'Ortega'), true)
  assert.deepEqual(getVisibleMeals({}, 'Ortega'), [])
})

test('hall with only empty meals is closed', () => {
  const menu = { Carrillo: { Breakfast: {}, Lunch: {} } }
  assert.equal(isHallClosed(menu, 'Carrillo'), true)
  assert.deepEqual(getVisibleMeals(menu, 'Carrillo'), [])
})

test('visible meals keep menu order and their stations', () => {
  const lunch = { Grill: ['Pizza'] }
  const dinner = { Salad: ['Kale'] }
  const menu = { Carrillo: { Breakfast: {}, Lunch: lunch, Dinner: dinner } }
  assert.equal(isHallClosed(menu, 'Carrillo'), false)
  assert.deepEqual(getVisibleMeals(menu, 'Carrillo'), [
    ['Lunch', lunch],
    ['Dinner', dinner],
  ])
})

test('null meal data is ignored', () => {
  const menu = { Ortega: { Lunch: null, Dinner: { Grill: ['Tacos'] } } }
  assert.deepEqual(getVisibleMeals(menu, 'Ortega'), [
    ['Dinner', { Grill: ['Tacos'] }],
  ])
})
