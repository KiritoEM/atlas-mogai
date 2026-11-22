import { describe, expect, it } from "vitest";
import type {
  Detection,
  VideoIncident,
  WsAlert,
  WsMessage,
  WsVideoCompleted,
} from "@/types";
import {
  emptyVideoTracker,
  recoveredResult,
  recoveryTimeoutMs,
  trackVideoMessage,
} from "./video-recovery";

const noHelmet: Detection = {
  class_id: 2,
  label: "without_helmet",
  confidence: 0.9,
  bbox: { x1: 0, y1: 0, x2: 10, y2: 10 },
};

function alert(
  uploadId: string,
  frame: number,
  source: WsAlert["source"] = "video_upload",
): WsAlert {
  return {
    type: "alert",
    event: "DETECTION_ALERT",
    message: "A violation has been detected",
    source,
    upload_id: uploadId,
    data: { detections: [noHelmet], frame, timestamp: frame / 30 },
  };
}

const incident: VideoIncident = {
  start: 0,
  end: 2,
  frames: 2,
  counts: { without_helmet: 2 },
  key_frame: 60,
  timestamp: 2,
  detections: [noHelmet, noHelmet],
  image: null,
};

function completed(uploadId: string): WsVideoCompleted {
  return {
    type: "video_completed",
    upload_id: uploadId,
    data: {
      video: { duration: 21, fps: 30, frame_count: 629, width: 720, height: 1280 },
      frames_analyzed: 11,
      alert: true,
      summary: { without_helmet: 2 },
      incidents: [incident],
    },
  };
}

function track(...messages: WsMessage[]) {
  return messages.reduce(trackVideoMessage, emptyVideoTracker);
}

describe("trackVideoMessage", () => {
  it("binds to the first video upload and collects its flagged frames", () => {
    const tracker = track(alert("a", 60), alert("a", 0));
    expect(tracker.uploadId).toBe("a");
    expect(tracker.frames.map((frame) => frame.frame)).toEqual([60, 0]);
    expect(tracker.frames[0]).toMatchObject({ timestamp: 2, image: null });
  });

  it("ignores other uploads, photo alerts and live alerts", () => {
    const live: WsAlert = { ...alert("x", 1), source: undefined, upload_id: undefined };
    const tracker = track(
      alert("a", 0),
      alert("b", 30),
      alert("p", 1, "image_upload"),
      live,
      completed("b"),
    );
    expect(tracker.frames).toHaveLength(1);
    expect(tracker.completed).toBeNull();
  });

  it("ignores duplicated frames", () => {
    expect(track(alert("a", 0), alert("a", 0)).frames).toHaveLength(1);
  });

  it("binds to video_completed when no frame was flagged", () => {
    const tracker = track(completed("a"));
    expect(tracker.uploadId).toBe("a");
    expect(tracker.completed?.frames_analyzed).toBe(11);
  });
});

describe("recoveredResult", () => {
  it("is null until video_completed is received", () => {
    expect(recoveredResult(emptyVideoTracker, 1)).toBeNull();
    expect(recoveredResult(track(alert("a", 0)), 1)).toBeNull();
  });

  it("rebuilds the API result from WebSocket messages, frames in order", () => {
    const result = recoveredResult(
      track(alert("a", 60), alert("a", 0), completed("a")),
      0.5,
    );
    expect(result).toEqual({
      upload_id: "a",
      video: completed("a").data.video,
      sample_fps: 0.5,
      frames_analyzed: 11,
      alert: true,
      summary: { without_helmet: 2 },
      incidents: [incident],
      violations: [
        { frame: 0, timestamp: 0, detections: [noHelmet], image: null },
        { frame: 60, timestamp: 2, detections: [noHelmet], image: null },
      ],
    });
  });
});

describe("recoveryTimeoutMs", () => {
  it("scales with the number of frames and is capped", () => {
    expect(recoveryTimeoutMs(10)).toBe(90_000);
    expect(recoveryTimeoutMs(10)).toBeLessThan(recoveryTimeoutMs(100));
    expect(recoveryTimeoutMs(10_000)).toBe(600_000);
    expect(recoveryTimeoutMs(null)).toBe(recoveryTimeoutMs(120));
  });
});
