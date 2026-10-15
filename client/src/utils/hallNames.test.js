import assert from 'node:assert/strict'
import test from 'node:test'
import { displayHallName, normalizeHallName } from './hallNames.js'

const halls = [
  ['Carrillo Dining Commons', 'Carrillo'],
  ['De La Guerra Dining Commons', 'De-La-Guerra'],
  ['Ortega Takeout', 'Ortega'],
  ['Portola Dining Commons', 'Portola'],
]

test('hall names map between routes and display labels', () => {
  for (const [display, route] of halls) {
    assert.equal(normalizeHallName(display), route)
    assert.equal(displayHallName(route), display)
  }
})

test('unknown hall names pass through unchanged', () => {
  assert.equal(normalizeHallName('Unknown Hall'), 'Unknown Hall')
  assert.equal(displayHallName('Unknown Hall'), 'Unknown Hall')
})
