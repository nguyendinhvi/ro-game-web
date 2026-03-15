import { gameService } from "./game";
import { userService } from "./user";
import { categoryService } from "./category";
import { playSessionService } from "./playSession";
import { gameLikeService } from "./gameLike";

const API = {
  game: gameService,
  user: userService,
  category: categoryService,
  playSession: playSessionService,
  gameLike: gameLikeService,
};

export default API;
