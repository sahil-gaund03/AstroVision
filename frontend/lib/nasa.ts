import { api } from "./api";

export const getAPOD = api.getAPOD;
export const getMarsRoverPhotos = api.getMarsRoverPhotos;
export const searchNASAImages = api.searchNASAImages;

export const ROVERS = ["curiosity", "perseverance", "opportunity", "spirit"] as const;
export const CAMERAS = ["FHAZ", "RHAZ", "NAVCAM", "MAST", "CHEMCAM", "MAHLI"] as const;
