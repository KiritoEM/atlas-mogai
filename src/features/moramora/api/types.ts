export type User = {
  id: number;
  username: string;
  email: string;
};

export type Profile = User & {
  date_joined: string;
  last_login: string | null;
};

export type BoundingBox = { x1: number; y1: number; x2: number; y2: number };

export type Detection = {
  class_id: number;
  label: string;
  confidence: number;
  bbox: BoundingBox;
};

export type ImageDetection = {
  upload_id: string;
  /** Annotated JPEG, base64. */
  image: string;
  detections: Detection[];
  alert: boolean;
};

export type VideoMetadata = {
  duration: number;
  fps: number;
  frame_count: number;
  width: number;
  height: number;
};

export type VideoViolationFrame = {
  frame: number;
  timestamp: number;
  detections: Detection[];
  image: string | null;
};

/**
 * One continuous scene in infraction. The API groups consecutive flagged
 * frames, keeps only infractions confirmed over several frames and counts
 * the people (or motorbikes) involved, instead of one entry per frame.
 */
export type VideoIncident = {
  start: number;
  end: number;
  /** Analysed frames in infraction within the incident. */
  frames: number;
  /** People (or motorbikes) per infraction label, e.g. { without_helmet: 3 }. */
  counts: Record<string, number>;
  key_frame: number;
  timestamp: number;
  /** Confirmed detections drawn on the key frame. */
  detections: Detection[];
  /** Annotated key frame (JPEG base64), null beyond the server cap. */
  image: string | null;
};

export type VideoDetection = {
  upload_id: string;
  video: VideoMetadata;
  sample_fps: number;
  frames_analyzed: number;
  alert: boolean;
  /** People (or motorbikes) per infraction label, over all incidents. */
  summary: Record<string, number>;
  incidents: VideoIncident[];
  /** Frames of the incidents, for the timeline. */
  violations: VideoViolationFrame[];
};

export type ApiEnvelope<T> = {
  success: boolean;
  message: string;
  data: T;
};

export type DetectionErrorCode =
  | "invalid_image"
  | "invalid_video"
  | "busy"
  | "processing_error";

export type WsDetectionResult = {
  type: "detection_result";
  success: true;
  data: { image: string; detections: Detection[]; message: string };
};

export type WsAlert = {
  type: "alert";
  event: "DETECTION_ALERT";
  message: string;
  source?: "image_upload" | "video_upload";
  upload_id?: string;
  data: { detections: Detection[]; frame?: number; timestamp?: number };
};

export type WsVideoCompleted = {
  type: "video_completed";
  upload_id: string;
  data: {
    video: VideoMetadata;
    frames_analyzed: number;
    alert: boolean;
    summary: Record<string, number>;
    /** Without images, to keep the WebSocket message small. */
    incidents: VideoIncident[];
  };
};

export type WsError = {
  type: "error";
  success: false;
  code: "invalid_image" | "busy" | "processing_error";
  message: string;
};

export type WsMessage = WsDetectionResult | WsAlert | WsVideoCompleted | WsError;
