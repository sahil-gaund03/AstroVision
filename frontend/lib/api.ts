import type {
  APOD,
  AsteroidListResponse,
  ChatResponse,
  ExoplanetListResponse,
  ExoplanetStats,
  FavoriteCreate,
  FavoriteItem,
  HabitabilityScore,
  Health,
  MarsRoverResponse,
  NASAImageSearchResponse,
  RiskScore,
  SolarSystem,
} from "./types";

const BASE =
  process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, "") ||
  "http://localhost:8000";

export class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${BASE}${path}`, {
      ...init,
      headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
      cache: "no-store",
    });
  } catch {
    throw new ApiError("Cannot reach the AstroVision backend. Is it running?");
  }
  if (!res.ok) {
    let detail = `Request failed (${res.status})`;
    try {
      const body = (await res.json()) as { detail?: unknown };
      if (typeof body.detail === "string") detail = body.detail;
    } catch {
      // Keep the generic message when the backend response is not JSON.
    }
    throw new ApiError(detail, res.status);
  }
  try {
    return (await res.json()) as T;
  } catch {
    throw new ApiError("Backend returned an invalid response.", res.status);
  }
}

function qs(params: Record<string, unknown>): string {
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") sp.set(k, String(v));
  });
  const s = sp.toString();
  return s ? `?${s}` : "";
}

export const api = {
  getHealth: () => request<Health>("/health"),

  getAPOD: (date?: string) => request<APOD>(`/api/nasa/apod${qs({ date })}`),

  getMarsRoverPhotos: (params: { rover?: string; sol?: number; camera?: string } = {}) =>
    request<MarsRoverResponse>(`/api/nasa/mars-rover${qs(params)}`),

  searchNASAImages: (query: string) =>
    request<NASAImageSearchResponse>(`/api/nasa/images/search${qs({ q: query })}`),

  getUpcomingAsteroids: () =>
    request<AsteroidListResponse>("/api/asteroids/upcoming"),

  getAsteroidRiskScore: (params: {
    estimated_diameter_km: number;
    relative_velocity_kph: number;
    miss_distance_km: number;
    is_potentially_hazardous: boolean;
  }) => request<RiskScore>(`/api/asteroids/risk-score${qs(params)}`),

  getConfirmedExoplanets: (params: { limit?: number } = {}) =>
    request<ExoplanetListResponse>(`/api/exoplanets/confirmed${qs(params)}`),

  getExoplanetStats: () => request<ExoplanetStats>("/api/exoplanets/stats"),

  searchExoplanets: (query: string, limit = 100) =>
    request<ExoplanetListResponse>(`/api/exoplanets/search${qs({ q: query, limit })}`),

  getHabitabilityScore: (params: Record<string, number | undefined>) =>
    request<HabitabilityScore>(`/api/exoplanets/habitability-score${qs(params)}`),

  sendAssistantMessage: (payload: {
    message: string;
    context_type?: string;
    context_data?: Record<string, unknown>;
  }) =>
    request<ChatResponse>("/api/assistant/chat", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  getSolarSystemPlanets: () => request<SolarSystem>("/api/solar-system/planets"),

  getFavorites: () => request<FavoriteItem[]>("/api/favorites"),

  addFavorite: (payload: FavoriteCreate) =>
    request<FavoriteItem>("/api/favorites", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  deleteFavorite: (id: string) =>
    request<{ deleted: string }>(`/api/favorites/${encodeURIComponent(id)}`, {
      method: "DELETE",
    }),
};
