"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { WS_URL } from "../api/config";
import { describeDetections, violationsOf } from "../api/messages";
import type { Detection, WsAlert, WsMessage } from "../api/types";
import { useAuth } from "../auth/auth-provider";

export type SocketStatus =
  | "connecting"
  | "open"
  | "reconnecting"
  | "unauthorized";

export type AlertSource = "live" | "image_upload" | "video_upload";

export type JournalEntry = {
  id: string;
  receivedAt: number;
  source: AlertSource;
  detections: Detection[];
  uploadId?: string;
  frame?: number;
  timestamp?: number;
};

type Listener = (message: WsMessage) => void;

type SocketContextValue = {
  status: SocketStatus;
  journal: JournalEntry[];
  /** Latest alert, phrased for screen readers. */
  announcement: string;
  send: (payload: Blob | ArrayBuffer | string) => boolean;
  subscribe: (listener: Listener) => () => void;
  clearJournal: () => void;
};

const SocketContext = createContext<SocketContextValue | null>(null);

const JOURNAL_SIZE = 60;
/** Identical live-camera alerts closer than this are merged. */
const LIVE_MERGE_MS = 6000;
const MAX_BACKOFF_MS = 30_000;

type JournalAction =
  | { type: "alert"; message: WsAlert; at: number }
  | { type: "clear" };

function labelsKey(detections: Detection[]) {
  return [...new Set(detections.map((d) => d.label))].sort().join("|");
}

function journalReducer(
  state: JournalEntry[],
  action: JournalAction,
): JournalEntry[] {
  if (action.type === "clear") {
    return [];
  }
  const { message, at } = action;
  // The API alerts on any detection, compliant riders included: keep infractions only.
  const detections = violationsOf(message.data.detections);
  if (detections.length === 0) {
    return state;
  }
  const source: AlertSource = message.source ?? "live";
  const latest = state[0];
  if (
    source === "live" &&
    latest?.source === "live" &&
    at - latest.receivedAt < LIVE_MERGE_MS &&
    labelsKey(latest.detections) === labelsKey(detections)
  ) {
    return [{ ...latest, receivedAt: at, detections }, ...state.slice(1)];
  }
  const entry: JournalEntry = {
    id: `${at}-${Math.random().toString(36).slice(2, 8)}`,
    receivedAt: at,
    source,
    detections,
    uploadId: message.upload_id,
    frame: message.data.frame,
    timestamp: message.data.timestamp,
  };
  return [entry, ...state].slice(0, JOURNAL_SIZE);
}

export function DetectionSocketProvider({ children }: { children: ReactNode }) {
  const { token, expire } = useAuth();
  const [status, setStatus] = useState<SocketStatus>("connecting");
  const [journal, dispatch] = useReducer(journalReducer, []);
  const [announcement, setAnnouncement] = useState("");
  const socketRef = useRef<WebSocket | null>(null);
  const listenersRef = useRef(new Set<Listener>());
  const lastAnnounceRef = useRef(0);

  useEffect(() => {
    if (!token) {
      return;
    }
    let disposed = false;
    let attempt = 0;
    let retryTimer: ReturnType<typeof setTimeout> | undefined;

    const connect = () => {
      setStatus(attempt === 0 ? "connecting" : "reconnecting");
      const socket = new WebSocket(WS_URL, ["bearer", token]);
      socket.binaryType = "arraybuffer";
      socketRef.current = socket;

      socket.onopen = () => {
        attempt = 0;
        setStatus("open");
      };

      socket.onmessage = (event) => {
        if (typeof event.data !== "string") {
          return;
        }
        let message: WsMessage;
        try {
          message = JSON.parse(event.data) as WsMessage;
        } catch {
          return;
        }
        if (
          message.type === "alert" &&
          violationsOf(message.data.detections).length > 0
        ) {
          const at = Date.now();
          dispatch({ type: "alert", message, at });
          if (at - lastAnnounceRef.current > LIVE_MERGE_MS || message.source) {
            lastAnnounceRef.current = at;
            setAnnouncement(
              `Alerte : ${describeDetections(message.data.detections)}.`,
            );
          }
        }
        for (const listener of listenersRef.current) {
          listener(message);
        }
      };

      socket.onclose = (event) => {
        if (socketRef.current === socket) {
          socketRef.current = null;
        }
        if (disposed) {
          return;
        }
        if (event.code === 4401) {
          setStatus("unauthorized");
          expire();
          return;
        }
        const delay = Math.min(MAX_BACKOFF_MS, 1000 * 2 ** attempt);
        attempt += 1;
        setStatus("reconnecting");
        retryTimer = setTimeout(connect, delay);
      };
    };

    connect();

    // Reconnect immediately when the network comes back.
    const onOnline = () => {
      if (!socketRef.current && !disposed) {
        clearTimeout(retryTimer);
        attempt = 0;
        connect();
      }
    };
    window.addEventListener("online", onOnline);

    return () => {
      disposed = true;
      clearTimeout(retryTimer);
      window.removeEventListener("online", onOnline);
      socketRef.current?.close(1000);
      socketRef.current = null;
    };
  }, [token, expire]);

  const send = useCallback((payload: Blob | ArrayBuffer | string) => {
    const socket = socketRef.current;
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      return false;
    }
    socket.send(payload);
    return true;
  }, []);

  const subscribe = useCallback((listener: Listener) => {
    listenersRef.current.add(listener);
    return () => {
      listenersRef.current.delete(listener);
    };
  }, []);

  const clearJournal = useCallback(() => dispatch({ type: "clear" }), []);

  const value = useMemo(
    () => ({ status, journal, announcement, send, subscribe, clearJournal }),
    [status, journal, announcement, send, subscribe, clearJournal],
  );

  return <SocketContext value={value}>{children}</SocketContext>;
}

export function useDetectionSocket(): SocketContextValue {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error(
      "useDetectionSocket must be used inside <DetectionSocketProvider>.",
    );
  }
  return context;
}

/** Subscribes to WebSocket messages for the lifetime of the component. */
export function useSocketMessages(listener: Listener) {
  const { subscribe } = useDetectionSocket();
  const listenerRef = useRef(listener);
  useEffect(() => {
    listenerRef.current = listener;
  });
  useEffect(
    () => subscribe((message) => listenerRef.current(message)),
    [subscribe],
  );
}
