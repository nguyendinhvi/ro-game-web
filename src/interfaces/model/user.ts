export type UserRole = "user" | "admin";

export interface IUser {
  id: string;
  email: string;
  display_name?: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface ILoginBody {
  email: string;
  password: string;
}

export interface IRegisterBody {
  email: string;
  password: string;
  display_name?: string;
}

export interface IGoogleLoginBody {
  id_token: string;
}

export interface IAuthResponse {
  user: IUser;
  access_token: string;
  token_type: "Bearer";
  expires_in: string;
}
