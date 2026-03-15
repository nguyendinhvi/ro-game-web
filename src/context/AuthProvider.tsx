import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import API from "@/api";
import type { IAuthResponse, IRegisterBody, IUser } from "@/interfaces";
import { AUTH_SESSION_EXPIRED_EVENT } from "@/utils/authStorage";

interface IAuthContextValue {
  user: IUser | null;
  ready: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: (idToken: string) => Promise<void>;
  register: (body: IRegisterBody) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<IAuthContextValue | null>(null);

export function useAuth(): IAuthContextValue {
  const ctx = useContext(AuthContext);
  if (ctx == null) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}

interface IProps {
  children: ReactNode;
}

export default function AuthProvider({ children }: IProps) {
  const [user, setUser] = useState<IUser | null>(null);
  const [ready, setReady] = useState(false);

  const persistSession = useCallback((auth: IAuthResponse) => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("token", auth.access_token);
      window.localStorage.removeItem("ro_game_user");
    }
    setUser(auth.user);
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const auth = await API.user.login({ email, password });
      persistSession(auth);
    },
    [persistSession],
  );

  const loginWithGoogle = useCallback(
    async (idToken: string) => {
      const auth = await API.user.googleLogin(idToken);
      persistSession(auth);
    },
    [persistSession],
  );

  const register = useCallback(
    async (body: IRegisterBody) => {
      const auth = await API.user.register(body);
      persistSession(auth);
    },
    [persistSession],
  );

  const logout = useCallback(async () => {
    try {
      await API.user.logout();
    } catch {
      // vẫn xóa session local nếu API lỗi hoặc token đã hết hạn
    }

    if (typeof window !== "undefined") {
      window.localStorage.removeItem("token");
      window.localStorage.removeItem("ro_game_user");
    }
    setUser(null);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.removeItem("ro_game_user");

    const token = window.localStorage.getItem("token");
    if (!token) {
      setReady(true);
      return;
    }

    void API.user
      .me()
      .then(setUser)
      .catch(() => {
        window.localStorage.removeItem("token");
      })
      .finally(() => {
        setReady(true);
      });

    const onSessionExpired = () => {
      setUser(null);
    };
    window.addEventListener(AUTH_SESSION_EXPIRED_EVENT, onSessionExpired);
    return () => {
      window.removeEventListener(AUTH_SESSION_EXPIRED_EVENT, onSessionExpired);
    };
  }, []);

  const value: IAuthContextValue = {
    user,
    ready,
    login,
    loginWithGoogle,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
