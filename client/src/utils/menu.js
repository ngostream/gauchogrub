export function getVisibleMeals(menu, hall) {
  return Object.entries(menu[hall] || {}).filter(([, stations]) =>
    stations && Object.keys(stations).length > 0
  )
}

export function isHallClosed(menu, hall) {
  return getVisibleMeals(menu, hall).length === 0
}
