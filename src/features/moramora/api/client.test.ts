import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  ApiError,
  CONNECTION_LOST_MESSAGE,
  NETWORK_MESSAGE,
  api,
  isAbortError,
} from "./client";

/** Minimal XMLHttpRequest double; each test drives the request by hand. */
class FakeXhr {
  static last: FakeXhr;
  method = "";
  url = "";
  headers: Record<string, string> = {};
  body: FormData | null = null;
  status = 0;
  response: unknown = null;
  responseType = "";
  timeout = 0;
  upload: { onprogress?: (e: ProgressEvent) => void; onload?: () => void } = {};
  onload?: () => void;
  onerror?: () => void;
  ontimeout?: () => void;
  onabort?: () => void;

  constructor() {
    FakeXhr.last = this;
  }
  open(method: string, url: string) {
    this.method = method;
    this.url = url;
  }
  setRequestHeader(name: string, value: string) {
    this.headers[name] = value;
  }
  send(body: FormData) {
    this.body = body;
  }
  abort() {
    this.onabort?.();
  }

  // Test helpers
  finishUpload() {
    this.upload.onprogress?.({ lengthComputable: true, loaded: 1, total: 1 } as ProgressEvent);
    this.upload.onload?.();
  }
  respond(status: number, response: unknown) {
    this.status = status;
    this.response = response;
    this.onload?.();
  }
  dropConnection() {
    this.status = 0;
    this.onerror?.();
  }
}

const video = new File([new Uint8Array(16)], "clip.mp4", { type: "video/mp4" });

function startVideo(sampleFps = 0.5, extra: { signal?: AbortSignal } = {}) {
  const onProgress = vi.fn();
  const onUploaded = vi.fn();
  const promise = api.detectVideo(video, sampleFps, {
    token: "jwt",
    onProgress,
    onUploaded,
    ...extra,
  });
  return { promise, xhr: FakeXhr.last, onProgress, onUploaded };
}

beforeEach(() => {
  vi.stubGlobal("XMLHttpRequest", FakeXhr);
});
afterEach(() => {
  vi.unstubAllGlobals();
});

describe("api.detectVideo", () => {
  it.each([0.5, 1, 2, 5])("sends the video with sample_fps=%s", async (fps) => {
    const { promise, xhr } = startVideo(fps);
    expect(xhr.method).toBe("POST");
    expect(xhr.url).toMatch(/\/api\/detection\/video\/$/);
    expect(xhr.headers.Authorization).toBe("Bearer jwt");
    expect(xhr.body?.get("sample_fps")).toBe(String(fps));
    expect((xhr.body?.get("video") as File).name).toBe("clip.mp4");

    xhr.finishUpload();
    xhr.respond(200, { success: true, message: "ok", data: { upload_id: "a" } });
    await expect(promise).resolves.toMatchObject({ data: { upload_id: "a" } });
  });

  it("reports upload progress and the end of the upload", () => {
    const { xhr, onProgress, onUploaded } = startVideo();
    xhr.finishUpload();
    expect(onProgress).toHaveBeenCalledWith(1);
    expect(onUploaded).toHaveBeenCalledOnce();
  });

  it("reports an unreachable server when the upload never completed", async () => {
    const { promise, xhr } = startVideo();
    xhr.dropConnection();
    const error = await promise.catch((e: unknown) => e);
    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ code: "network", status: 0, message: NETWORK_MESSAGE });
  });

  it("reports a lost connection when it drops after the upload", async () => {
    const { promise, xhr } = startVideo();
    xhr.finishUpload();
    xhr.dropConnection();
    await expect(promise).rejects.toMatchObject({
      code: "connection_lost",
      status: 0,
      message: CONNECTION_LOST_MESSAGE,
    });
  });

  it("treats a request timeout like a dropped connection", async () => {
    const { promise, xhr } = startVideo();
    xhr.finishUpload();
    xhr.ontimeout?.();
    await expect(promise).rejects.toMatchObject({ code: "connection_lost" });
  });

  it("translates server detection errors", async () => {
    const { promise, xhr } = startVideo();
    xhr.finishUpload();
    xhr.respond(503, { success: false, code: "busy", message: "busy" });
    await expect(promise).rejects.toMatchObject({ status: 503, code: "busy" });
  });

  it("rejects with an AbortError when cancelled", async () => {
    const controller = new AbortController();
    const { promise } = startVideo(1, { signal: controller.signal });
    controller.abort();
    const error = await promise.catch((e: unknown) => e);
    expect(isAbortError(error)).toBe(true);
  });
});
