"use client";

import { useMutation } from "@tanstack/react-query";
import { detectionService } from "@/features/moramora/services/detection-service";

type ImageDetectionVariables = {
  file: File;
  token: string;
  signal?: AbortSignal;
  onProgress?: (fraction: number) => void;
  onUploaded?: () => void;
};

export function useImageDetectionMutation() {
  return useMutation({
    mutationFn: ({ file, token, ...options }: ImageDetectionVariables) =>
      detectionService
        .analyzeImage(file, { token, ...options })
        .then(({ data }) => data),
  });
}

type VideoDetectionVariables = ImageDetectionVariables & { sampleFps: number };

export function useVideoDetectionMutation() {
  return useMutation({
    mutationFn: ({
      file,
      sampleFps,
      token,
      ...options
    }: VideoDetectionVariables) =>
      detectionService
        .analyzeVideo(file, sampleFps, { token, ...options })
        .then(({ data }) => data),
  });
}
