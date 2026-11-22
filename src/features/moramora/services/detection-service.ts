import { upload, type UploadOptions } from "../api/client";
import type { ApiEnvelope, ImageDetection, VideoDetection } from "@/types";

export const detectionService = {
  analyzeImage: (file: File, options: UploadOptions) => {
    const form = new FormData();
    form.append("image", file);
    return upload<ApiEnvelope<ImageDetection>>(
      "/api/detection/image/",
      form,
      options,
    );
  },

  analyzeVideo: (file: File, sampleFps: number, options: UploadOptions) => {
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
