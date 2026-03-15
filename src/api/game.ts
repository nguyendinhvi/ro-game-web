import { https, type ApiMeta, type ApiResponse } from "../utils/https";
import type { IGame, GameStats, GameStatus } from "../interfaces";

export interface GameListQuery {
  page?: number;
  limit?: number;
  category?: string;
  tag?: string;
  featured?: boolean;
  status?: GameStatus;
  sort?: "newest" | "most_played" | "rating";
  search?: string;
}

export interface GameListResult {
  games: IGame[];
  meta?: ApiMeta;
}

export type CreateGamePayload = Omit<
  IGame,
  "id" | "created_at" | "updated_at" | "stats"
> & {
  stats?: Partial<GameStats>;
};

export type UpdateGamePayload = Partial<CreateGamePayload>;

const gameService = {
  getList(query: GameListQuery = {}) {
    return https.get<IGame[], ApiResponse<IGame[]>>("/games", {
      params: query,
    });
  },

  async getById(id: string): Promise<IGame> {
    const res = await https.get<IGame, ApiResponse<IGame>>(`/games/${id}`);
    return res.data;
  },

  /** GET /games/slug/:slug — slug trùng key trên URL (vd. blockblastadventure) */
  async getBySlug(slug: string): Promise<IGame> {
    const res = await https.get<IGame, ApiResponse<IGame>>(
      `/games/slug/${slug}`,
    );
    return res.data;
  },

  /** GET /games/slug/:slug/related — game liên quan theo tag, category */
  async getRelated(slug: string, limit = 9): Promise<IGame[]> {
    const res = await https.get<IGame[], ApiResponse<IGame[]>>(
      `/games/slug/${slug}/related`,
      { params: { limit } },
    );
    return res.data ?? [];
  },

  async create(payload: CreateGamePayload): Promise<IGame> {
    const res = await https.post<CreateGamePayload, ApiResponse<IGame>>(
      "/games",
      payload,
    );
    return res.data;
  },

  async updateById(id: string, payload: UpdateGamePayload): Promise<IGame> {
    const res = await https.put<UpdateGamePayload, ApiResponse<IGame>>(
      `/games/${id}`,
      payload,
    );
    return res.data;
  },

  async deleteById(id: string): Promise<void> {
    await https.delete<undefined, ApiResponse<{ deleted: boolean }>>(
      `/games/${id}`,
    );
  },
};

export { gameService };
