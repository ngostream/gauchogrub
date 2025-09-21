// src/utils/hallNames.js

export function normalizeHallName(hN) {
  if (hN === "Carrillo Dining Commons") return "Carrillo";
  if (hN === "De La Guerra Dining Commons") return "De-La-Guerra";
  if (hN === "Ortega Takeout") return "Ortega";
  if (hN === "Portola Dining Commons") return "Portola";
  return hN;
}

export function displayHallName(hN) {
  const map = {
    "Carrillo": "Carrillo Dining Commons",
    "De-La-Guerra": "De La Guerra Dining Commons",
    "Ortega": "Ortega Takeout",
    "Portola": "Portola Dining Commons"
  };
  return map[hN] || hN;
}
