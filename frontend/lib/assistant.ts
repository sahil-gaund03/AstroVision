import { api } from "./api";

export const sendAssistantMessage = api.sendAssistantMessage;

export const CONTEXT_TYPES = [
  { id: "general", label: "General" },
  { id: "apod", label: "APOD" },
  { id: "mars", label: "Mars Rover" },
  { id: "exoplanet", label: "Exoplanet" },
  { id: "asteroid", label: "Asteroid" },
  { id: "planet", label: "Planet" },
] as const;

export const SUGGESTED_PROMPTS = [
  "Could Kepler-22 b support life?",
  "Explain what a nebula is.",
  "How dangerous are near-Earth asteroids?",
  "Compare Mars and Earth.",
  "Give me an astronomy quiz.",
  "What is a black hole?",
];
