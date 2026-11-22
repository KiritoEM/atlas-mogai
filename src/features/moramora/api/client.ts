import { API_URL } from "./config";
import { DETECTION_ERRORS, translateServerMessage } from "./messages";
import type {
  ApiEnvelope,
  ImageDetection,
  Profile,
  User,
  VideoDetection,
} from "./types";

export type FieldErrors = Record<string, string[]>;

export class ApiError extends Error {
  readonly status: number;
  readonly code?: string;
  readonly fieldErrors: FieldErrors;

  constructor(
    status: number,
    message: string,
    code?: string,
    fieldErrors: FieldErrors = {},
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.fieldErrors = fieldErrors;
  }
}

export const NETWORK_MESSAGE =
  "Impossible de joindre le serveur Moramora. Vérifiez votre connexion ou que l'API est démarrée.";

/** The file was fully sent, then the connection dropped before the response. */
export const CONNECTION_LOST_MESSAGE =
  "La connexion avec le serveur a été coupée pendant l'analyse, avant de recevoir le résultat. Réessayez avec une précision plus faible ou une vidéo plus courte.";

function normalizeFieldErrors(raw: unknown): FieldErrors {
  if (!raw || typeof raw !== "object") {
    return {};
  }
  const result: FieldErrors = {};
  for (const [field, value] of Object.entries(raw)) {
    const list = Array.isArray(value) ? value : [value];
    result[field] = list.map((item) => translateServerMessage(String(item)));
  }
  return result;
}

function toApiError(status: number, payload: unknown): ApiError {
  const body = (payload ?? {}) as {
    message?: string;
    code?: string;
    errors?: unknown;
  };
  const fieldErrors = normalizeFieldErrors(body.errors);

  if (body.code && DETECTION_ERRORS[body.code]) {
    const detail = body.message ? translateServerMessage(body.message) : "";
    const message =
      body.code === "invalid_image" || body.code === "invalid_video"
        ? detail && detail !== body.message
          ? detail
          : DETECTION_ERRORS[body.code]
        : DETECTION_ERRORS[body.code];
    return new ApiError(status, message, body.code, fieldErrors);
  }
  if (status === 429) {
    return new ApiError(
      status,
      "Trop de tentatives. Patientez une minute avant de réessayer.",
      "throttled",
    );
  }
  if (status === 401 && body.message !== "Invalid email or password.") {
    return new ApiError(
      status,
      "Votre session a expiré. Reconnectez-vous pour continuer.",
      "unauthorized",
    );
  }
  if (fieldErrors.detail && Object.keys(fieldErrors).length === 1) {
    return new ApiError(status, fieldErrors.detail[0], undefined, {});
  }
  const message =
    Object.keys(fieldErrors).length > 0
      ? "Certains champs sont à corriger."
      : body.message
        ? translateServerMessage(body.message)
        : `Erreur inattendue du serveur (${status}).`;
  return new ApiError(status, message, undefined, fieldErrors);
}

type RequestOptions = {
  method?: "GET" | "POST";
  body?: unknown;
  token?: string | null;
  signal?: AbortSignal;
};

async function request<T>(
  path: string,
  { method = "GET", body, token, signal }: RequestOptions = {},
): Promise<T> {
  const headers: Record<string, string> = { Accept: "application/json" };
  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal,
    });
  } catch (error) {
    if (signal?.aborted) {
      throw error;
    }
    throw new ApiError(0, NETWORK_MESSAGE, "network");
  }

  const payload: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    throw toApiError(response.status, payload);
  }
  return payload as T;
}

type UploadOptions = {
  token: string;
  onProgress?: (fraction: number) => void;
  onUploaded?: () => void;
  signal?: AbortSignal;
};

/** Multipart upload through XHR, which (unlike fetch) reports upload progress. */
function upload<T>(
  path: string,
  form: FormData,
  { token, onProgress, onUploaded, signal }: UploadOptions,
): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${API_URL}${path}`);
    xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    xhr.setRequestHeader("Accept", "application/json");
    xhr.responseType = "json";

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        onProgress?.(event.loaded / event.total);
      }
    };
    let uploaded = false;
    xhr.upload.onload = () => {
      uploaded = true;
      onUploaded?.();
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(xhr.response as T);
      } else {
        reject(toApiError(xhr.status, xhr.response));
      }
    };
    // status 0: no HTTP response at all (server down, proxy cut, CORS-less
    // gateway error). After a complete upload, the server was reached.
    const fail = () =>
      reject(
        uploaded
          ? new ApiError(0, CONNECTION_LOST_MESSAGE, "connection_lost")
          : new ApiError(0, NETWORK_MESSAGE, "network"),
      );
    xhr.onerror = fail;
    xhr.ontimeout = fail;
    xhr.onabort = () =>
      reject(new DOMException("Upload cancelled", "AbortError"));

    if (signal) {
      if (signal.aborted) {
        xhr.abort();
        return;
      }
      signal.addEventListener("abort", () => xhr.abort(), { once: true });
    }
    xhr.send(form);
  });
}

export const api = {
  health: (signal?: AbortSignal) =>
    request<{ status: string }>("/api/health/", { signal }),

  signup: (input: {
    username: string;
    email: string;
    password: string;
    password_confirmation: string;
  }) =>
    request<ApiEnvelope<User>>("/api/auth/signup/", {
      method: "POST",
      body: input,
    }),

  login: (input: { email: string; password: string }) =>
    request<ApiEnvelope<{ access: string; user: User }>>("/api/auth/login/", {
      method: "POST",
      body: input,
    }),

  logout: (token: string) =>
    request<{ success: boolean; message: string }>("/api/auth/logout/", {
      method: "POST",
      token,
    }),

  profile: (token: string, signal?: AbortSignal) =>
    request<ApiEnvelope<Profile>>("/api/auth/profile/", { token, signal }),

  detectImage: (file: File, options: UploadOptions) => {
    const form = new FormData();
    form.append("image", file);
    return upload<ApiEnvelope<ImageDetection>>(
      "/api/detection/image/",
      form,
      options,
    );
  },

  detectVideo: (file: File, sampleFps: number, options: UploadOptions) => {
    const form = new FormData();
    form.append("video", file);
    form.append("sample_fps", String(sampleFps));
    return upload<ApiEnvelope<VideoDetection>>(
      "/api/detection/video/",
      form,
      options,
    );
  },
};

export function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === "AbortError";
}

export function errorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    return error.message;
  }
  return "Une erreur inattendue est survenue. Réessayez.";
}
