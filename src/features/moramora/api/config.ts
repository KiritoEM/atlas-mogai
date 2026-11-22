const DEFAULT_API_URL = "http://localhost:8000";

/** Base URL of the MoraMora Django API, without trailing slash. */
export const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_URL
).replace(/\/+$/, "");

/** Detection WebSocket, derived from the API URL (http → ws, https → wss). */
export const WS_URL = `${API_URL.replace(/^http/, "ws")}/ws/detection/`;

/** Server-side limits (see backend settings), checked before uploading. */
export const LIMITS = {
  imageBytes: 5 * 1024 * 1024,
  videoBytes: 50 * 1024 * 1024,
  videoSeconds: 120,
  videoMaxFrames: 120,
} as const;

export const IMAGE_TYPES = ["image/jpeg", "image/png"];
export const VIDEO_TYPES = [
  "video/mp4",
  "video/quicktime",
  "video/x-msvideo",
  "video/avi",
  "video/webm",
  "video/x-matroska",
];
