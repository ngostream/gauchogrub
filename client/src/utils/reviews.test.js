import assert from 'node:assert/strict'
import test from 'node:test'
import { reviewCacheKey, reviewEndpoint, validateReview } from './reviews.js'

test('review endpoints encode spaces and reserved characters', () => {
  assert.equal(reviewEndpoint('Carrillo', 'Fish & Chips'), '/Carrillo/Fish%20%26%20Chips')
})

test('review endpoints preserve slash-containing item names for the backend', () => {
  assert.equal(reviewEndpoint('De-La-Guerra', 'Soup/Salad'), '/De-La-Guerra/Soup__slash__Salad')
  assert.equal(reviewCacheKey('De-La-Guerra', 'Soup/Salad'), 'De-La-Guerra-Soup__slash__Salad-reviews')
})

test('review validation rejects blank text without checking profanity', () => {
  let checked = false
  const error = validateReview('   ', () => { checked = true; return false })
  assert.equal(error, 'Please enter a review before submitting.')
  assert.equal(checked, false)
})

test('review validation accepts exactly 300 characters', () => {
  assert.equal(validateReview('a'.repeat(300), () => false), null)
})

test('review validation rejects more than 300 characters', () => {
  assert.equal(validateReview('a'.repeat(301), () => false), 'Review cannot exceed 300 characters.')
})

test('review validation checks trimmed text for profanity', () => {
  let checkedText
  const error = validateReview('  bad  ', (text) => { checkedText = text; return true })
  assert.equal(checkedText, 'bad')
  assert.equal(error, 'Please avoid using offensive language.')
})

test('review validation accepts ordinary text', () => {
  assert.equal(validateReview('  Tasty!  ', () => false), null)
})
