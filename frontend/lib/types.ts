export interface APOD {
  date: string;
  title: string;
  explanation: string;
  media_type: string;
  url: string;
  hdurl?: string | null;
  copyright?: string | null;
  fallback?: boolean;
}

export interface MarsPhoto {
  id: number | string;
  img_src: string;
  earth_date: string;
  rover: string;
  camera: string;
}

export interface MarsRoverResponse {
  rover: string;
  photos: MarsPhoto[];
  fallback?: boolean;
}

export interface NASAImage {
  nasa_id: string;
  title: string;
  description: string;
  date_created: string;
  media_type: string;
  thumbnail: string;
  image: string;
}

export interface NASAImageSearchResponse {
  query: string;
  items: NASAImage[];
  fallback?: boolean;
}

export interface Asteroid {
  id: string;
  name: string;
  close_approach_date: string;
  estimated_diameter_km: number;
  relative_velocity_kph: number;
  miss_distance_km: number;
  is_potentially_hazardous: boolean;
  absolute_magnitude_h?: number | null;
  risk_score: number;
  risk_level: string;
  explanation: string;
}

export interface AsteroidListResponse {
  element_count: number;
  asteroids: Asteroid[];
  fallback?: boolean;
}

export interface RiskScore {
  risk_score: number;
  risk_level: string;
  explanation: string;
}

export interface Exoplanet {
  pl_name?: string | null;
  hostname?: string | null;
  discoverymethod?: string | null;
  disc_year?: number | null;
  pl_rade?: number | null;
  pl_bmasse?: number | null;
  pl_orbper?: number | null;
  st_teff?: number | null;
  st_rad?: number | null;
  pl_eqt?: number | null;
  planet_name: string;
  host_star?: string | null;
  discovery_method?: string | null;
  discovery_year?: number | null;
  planet_radius_earth?: number | null;
  planet_mass_earth?: number | null;
  orbital_period_days?: number | null;
  stellar_temperature?: number | null;
  stellar_radius?: number | null;
  equilibrium_temperature?: number | null;
  habitability_score: number;
  habitability_category: string;
  explanation: string;
  missing_data_warning?: string | null;
}

export interface ExoplanetListResponse {
  count: number;
  exoplanets: Exoplanet[];
  fallback?: boolean;
}

export interface ExoplanetStats {
  total: number;
  discovery_methods: Record<string, number>;
  discoveries_by_year: Record<string, number>;
  avg_radius_earth?: number | null;
  avg_orbital_period_days?: number | null;
  fallback?: boolean;
}

export interface HabitabilityScore {
  habitability_score: number;
  category: string;
  explanation: string;
  missing_data_warning?: string | null;
}

export interface Planet {
  name: string;
  color: string;
  radius_km: number;
  distance_au: number;
  orbital_period_days: number;
  rotation_period_hours: number;
  moons: number;
  type: string;
  fact: string;
}

export interface SolarSystem {
  star: { name: string; type: string; radius_km: number; color: string };
  planets: Planet[];
  fallback?: boolean;
}

export interface ChatResponse {
  reply: string;
  mode: "ai" | "fallback";
  context_used: boolean;
}

export interface Health {
  status: string;
  app: string;
  version: string;
  nasa_key_configured: boolean;
  ai_key_configured: boolean;
}

export type FavoriteType = "apod" | "image" | "asteroid" | "exoplanet" | "planet";

export interface FavoriteItem {
  id: string;
  type: FavoriteType;
  title: string;
  payload: Record<string, unknown>;
}

export interface FavoriteCreate {
  type: FavoriteType;
  title: string;
  payload?: Record<string, unknown>;
}
