import { https, type ApiResponse } from "../utils/https";
import type { IGame } from "@/interfaces/model/game";

export type PlaySessionStatus = "active" | "completed";

export interface IPlaySession {
  id: string;
  user_id: string;
  game_id: string;
  game?: IGame;
  started_at: string;
  ended_at?: string;
  duration_seconds: number;
  status: PlaySessionStatus;
  created_at: string;
  updated_at: string;
}

export interface IPlaySessionListItem extends IPlaySession {
  user_email?: string;
  user_display_name?: string;
}

export interface IPlaySessionStats {
  total_sessions: number;
  total_duration_seconds: number;
  active_sessions: number;
  unique_users: number;
  unique_games: number;
  top_users: {
    user_id: string;
    email: string;
    display_name?: string;
    session_count: number;
    total_duration_seconds: number;
  }[];
  top_games: {
    game_id: string;
    game: IGame;
    session_count: number;
    total_duration_seconds: number;
  }[];
}

const playSessionService = {
  async start(gameId: string): Promise<IPlaySession> {
    const res = await https.post<
      { game_id: string },
      ApiResponse<IPlaySession>
    >("/play-sessions/start", { game_id: gameId });
    return res.data;
  },

  async end(sessionId: string): Promise<IPlaySession> {
    const res = await https.patch<undefined, ApiResponse<IPlaySession>>(
      `/play-sessions/${sessionId}/end`,
    );
    return res.data;
  },

  async myHistory(params?: Record<string, unknown>) {
    const res = await https.get<
      IPlaySessionListItem[],
      ApiResponse<IPlaySessionListItem[]>
    >("/play-sessions/me", { params });
    return { items: res.data ?? [], meta: res.meta };
  },

  async myStats(): Promise<IPlaySessionStats> {
    const res = await https.get<
      IPlaySessionStats,
      ApiResponse<IPlaySessionStats>
    >("/play-sessions/stats/me");
    return res.data;
  },
};

export { playSessionService };
