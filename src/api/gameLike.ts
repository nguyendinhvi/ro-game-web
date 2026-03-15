import { https, type ApiResponse } from "../utils/https";
import type { IGame } from "../interfaces/model/game";

export interface IGameLikeListItem {
  id: string;
  user_id: string;
  game_id: string;
  game?: IGame;
  created_at: string;
}

export interface IGameLikeToggleResult {
  liked: boolean;
  likes_count: number;
}

export interface IGameLikeStatus {
  liked: boolean;
  likes_count: number;
}

const gameLikeService = {
  async toggle(gameId: string): Promise<IGameLikeToggleResult> {
    const res = await https.post<
      { game_id: string },
      ApiResponse<IGameLikeToggleResult>
    >("/game-likes/toggle", { game_id: gameId });
    return res.data;
  },

  async status(gameId: string): Promise<IGameLikeStatus> {
    const res = await https.get<IGameLikeStatus, ApiResponse<IGameLikeStatus>>(
      `/game-likes/status/${gameId}`,
    );
    return res.data;
  },

  async myLikes(params?: Record<string, unknown>) {
    const res = await https.get<
      IGameLikeListItem[],
      ApiResponse<IGameLikeListItem[]>
    >("/game-likes/me", { params });
    return { items: res.data ?? [], meta: res.meta };
  },
};

export { gameLikeService };
