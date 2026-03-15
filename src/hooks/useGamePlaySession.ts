import { useCallback, useEffect, useRef } from "react";
import API from "@/api";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api";

export function useGamePlaySession(gameId: string, enabled: boolean) {
  const sessionIdRef = useRef<string | null>(null);
  const endingRef = useRef(false);

  const endSession = useCallback(async () => {
    const sessionId = sessionIdRef.current;
    if (!sessionId || endingRef.current) return;

    endingRef.current = true;
    sessionIdRef.current = null;

    try {
      await API.playSession.end(sessionId);
    } catch {
      const token =
        typeof window !== "undefined"
          ? window.localStorage.getItem("token")
          : null;
      if (token) {
        void fetch(`${API_BASE}/play-sessions/${sessionId}/end`, {
          method: "PATCH",
          keepalive: true,
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
      }
    }
  }, []);

  const startSession = useCallback(async () => {
    if (!enabled || sessionIdRef.current) return;

    try {
      const session = await API.playSession.start(gameId);
      sessionIdRef.current = session.id;
      endingRef.current = false;
    } catch {
      // user chưa đăng nhập hoặc lỗi mạng — bỏ qua
    }
  }, [enabled, gameId]);

  useEffect(() => {
    sessionIdRef.current = null;
    endingRef.current = false;
  }, [gameId]);

  useEffect(() => {
    if (!enabled) return;

    const onHide = () => {
      if (document.visibilityState === "hidden") {
        void endSession();
      }
    };

    const onUnload = () => {
      void endSession();
    };

    window.addEventListener("visibilitychange", onHide);
    window.addEventListener("pagehide", onUnload);

    return () => {
      window.removeEventListener("visibilitychange", onHide);
      window.removeEventListener("pagehide", onUnload);
      void endSession();
    };
  }, [enabled, endSession, gameId]);

  return { startSession, endSession };
}
