export interface PlanetData {
  id: string;
  name: string;
  type: string;
  radiusKm: number;
  distanceFromSunKm: number;
  orbitalPeriodDays: number;
  dayLengthHours: number;
  moons: number;
  averageTemperature: string;
  color: string;
  secondaryColor: string;
  description: string;
  orbitRadius: number; // scene units
  size: number; // scene units
  orbitSpeed: number; // base angular speed
  rotationSpeed: number;
  hasRings: boolean;
  atmosphereColor: string;
}

export const SUN = { name: "Sun", color: "#fdb813", coronaColor: "#ff8a1e" };

export const SOLAR_SYSTEM_PLANETS: PlanetData[] = [
  { id: "mercury", name: "Mercury", type: "Terrestrial", radiusKm: 2439.7, distanceFromSunKm: 57_900_000, orbitalPeriodDays: 88, dayLengthHours: 1407.6, moons: 0, averageTemperature: "167 °C", color: "#9c9c9c", secondaryColor: "#6b6b6b", description: "The smallest planet and closest to the Sun, with extreme day-night temperature swings.", orbitRadius: 9, size: 0.5, orbitSpeed: 0.048, rotationSpeed: 0.004, hasRings: false, atmosphereColor: "#b8b8b8" },
  { id: "venus", name: "Venus", type: "Terrestrial", radiusKm: 6051.8, distanceFromSunKm: 108_200_000, orbitalPeriodDays: 225, dayLengthHours: 5832.5, moons: 0, averageTemperature: "464 °C", color: "#e6b873", secondaryColor: "#c98f3c", description: "The hottest planet due to a runaway greenhouse effect; it rotates backwards.", orbitRadius: 13, size: 0.9, orbitSpeed: 0.035, rotationSpeed: 0.002, hasRings: false, atmosphereColor: "#f0d9a0" },
  { id: "earth", name: "Earth", type: "Terrestrial", radiusKm: 6371, distanceFromSunKm: 149_600_000, orbitalPeriodDays: 365.25, dayLengthHours: 24, moons: 1, averageTemperature: "15 °C", color: "#4f93d6", secondaryColor: "#2e7d4f", description: "The only known world with liquid water covering most of its surface, and the only one known to host life.", orbitRadius: 17, size: 0.95, orbitSpeed: 0.03, rotationSpeed: 0.02, hasRings: false, atmosphereColor: "#7ec8ff" },
  { id: "mars", name: "Mars", type: "Terrestrial", radiusKm: 3389.5, distanceFromSunKm: 227_900_000, orbitalPeriodDays: 687, dayLengthHours: 24.6, moons: 2, averageTemperature: "-65 °C", color: "#c1440e", secondaryColor: "#883010", description: "The Red Planet hosts the tallest volcano and largest canyon in the solar system.", orbitRadius: 22, size: 0.7, orbitSpeed: 0.024, rotationSpeed: 0.018, hasRings: false, atmosphereColor: "#e07b4a" },
  { id: "jupiter", name: "Jupiter", type: "Gas Giant", radiusKm: 69911, distanceFromSunKm: 778_500_000, orbitalPeriodDays: 4333, dayLengthHours: 9.9, moons: 95, averageTemperature: "-110 °C", color: "#d8a47f", secondaryColor: "#a9764f", description: "The largest planet; its Great Red Spot is a storm wider than Earth.", orbitRadius: 30, size: 2.6, orbitSpeed: 0.013, rotationSpeed: 0.04, hasRings: false, atmosphereColor: "#e8c4a0" },
  { id: "saturn", name: "Saturn", type: "Gas Giant", radiusKm: 58232, distanceFromSunKm: 1_434_000_000, orbitalPeriodDays: 10759, dayLengthHours: 10.7, moons: 146, averageTemperature: "-140 °C", color: "#e3d9b0", secondaryColor: "#bda86f", description: "Famous for its spectacular ring system made of ice and rock.", orbitRadius: 39, size: 2.2, orbitSpeed: 0.0096, rotationSpeed: 0.038, hasRings: true, atmosphereColor: "#f0e8c8" },
  { id: "uranus", name: "Uranus", type: "Ice Giant", radiusKm: 25362, distanceFromSunKm: 2_871_000_000, orbitalPeriodDays: 30687, dayLengthHours: 17.2, moons: 28, averageTemperature: "-195 °C", color: "#aee3ee", secondaryColor: "#7fc6d6", description: "An ice giant that rotates on its side, likely due to an ancient collision.", orbitRadius: 47, size: 1.5, orbitSpeed: 0.0068, rotationSpeed: 0.03, hasRings: true, atmosphereColor: "#c8f0f8" },
  { id: "neptune", name: "Neptune", type: "Ice Giant", radiusKm: 24622, distanceFromSunKm: 4_495_000_000, orbitalPeriodDays: 60190, dayLengthHours: 16.1, moons: 16, averageTemperature: "-200 °C", color: "#3b5fd6", secondaryColor: "#2942a0", description: "The windiest planet, with supersonic winds reaching 2,100 km/h.", orbitRadius: 54, size: 1.45, orbitSpeed: 0.0054, rotationSpeed: 0.032, hasRings: false, atmosphereColor: "#5b7fff" },
];
