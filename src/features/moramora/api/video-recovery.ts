import type {
  VideoDetection,
  VideoViolationFrame,
  WsMessage,
  WsVideoCompleted,
} from "./types";

/**
 * The video endpoint is synchronous: the HTTP request stays open for the whole
 * analysis, and proxies in front of the API may cut it while the server keeps
 * working. The server also pushes every flagged frame (`alert`) and the final
 * summary (`video_completed`) on the WebSocket, so the result can be rebuilt
 * from those messages when the HTTP response is lost.
 */
export type VideoTracker = {
  /** Upload followed, bound to the first video message received. */
  uploadId: string | null;
  frames: VideoViolationFrame[];
  completed: WsVideoCompleted["data"] | null;
};

export const emptyVideoTracker: VideoTracker = {
  uploadId: null,
  frames: [],
  completed: null,
};

function belongs(tracker: VideoTracker, uploadId: string | undefined) {
  return (
    uploadId !== undefined &&
    (tracker.uploadId === null || tracker.uploadId === uploadId)
  );
}

/** Folds a WebSocket message into the tracker; unrelated messages are ignored. */
export function trackVideoMessage(
  tracker: VideoTracker,
  message: WsMessage,
): VideoTracker {
  if (message.type === "alert") {
    if (message.source !== "video_upload" || !belongs(tracker, message.upload_id)) {
      return tracker;
    }
    const { frame, timestamp, detections } = message.data;
    if (frame === undefined || timestamp === undefined) {
      return tracker;
    }
    if (tracker.frames.some((known) => known.frame === frame)) {
      return tracker;
    }
    return {
      ...tracker,
      uploadId: message.upload_id ?? null,
      frames: [...tracker.frames, { frame, timestamp, detections, image: null }],
    };
  }
  if (message.type === "video_completed") {
    if (tracker.completed || !belongs(tracker, message.upload_id)) {
      return tracker;
    }
    return { ...tracker, uploadId: message.upload_id, completed: message.data };
  }
  return tracker;
}

/** The analysis result, once `video_completed` has been received. */
export function recoveredResult(
  tracker: VideoTracker,
  sampleFps: number,
): VideoDetection | null {
  if (!tracker.completed || !tracker.uploadId) {
    return null;
  }
  const { video, frames_analyzed, alert, summary, incidents } = tracker.completed;
  return {
    upload_id: tracker.uploadId,
    video,
    sample_fps: sampleFps,
    frames_analyzed,
    alert,
    summary,
    incidents: incidents ?? [],
    violations: [...tracker.frames].sort((a, b) => a.frame - b.frame),
  };
}

/**
 * How long to wait for `video_completed` after losing the HTTP response:
 * a generous per-frame budget plus a margin, capped at ten minutes.
 */
export function recoveryTimeoutMs(estimatedFrames: number | null): number {
  const frames = estimatedFrames ?? 120;
  return Math.min(10 * 60_000, 60_000 + frames * 3_000);
}
