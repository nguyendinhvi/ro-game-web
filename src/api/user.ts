import { https, type ApiResponse } from "../utils/https";
import type {
  IAuthResponse,
  ILoginBody,
  IRegisterBody,
  IUser,
} from "../interfaces";

const userService = {
  async login(body: ILoginBody): Promise<IAuthResponse> {
    const res = await https.post<ILoginBody, ApiResponse<IAuthResponse>>(
      "/users/login",
      body,
    );
    return res.data;
  },

  async register(body: IRegisterBody): Promise<IAuthResponse> {
    const res = await https.post<IRegisterBody, ApiResponse<IAuthResponse>>(
      "/users/register",
      body,
    );
    return res.data;
  },

  async googleLogin(idToken: string): Promise<IAuthResponse> {
    const res = await https.post<
      { id_token: string },
      ApiResponse<IAuthResponse>
    >("/users/google", { id_token: idToken });
    return res.data;
  },

  async logout(): Promise<{ revoked: boolean }> {
    const res = await https.post<undefined, ApiResponse<{ revoked: boolean }>>(
      "/users/logout",
    );
    return res.data;
  },

  async me(): Promise<IUser> {
    const res = await https.get<IUser, ApiResponse<IUser>>("/users/me");
    return res.data;
  },
};

export { userService };
