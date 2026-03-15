import { GoogleOAuthProvider as Provider } from "@react-oauth/google";
import type { ReactNode } from "react";

const GOOGLE_CLIENT_ID =
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID?.trim() ?? "";

interface GoogleOAuthProviderProps {
  children: ReactNode;
}

export default function GoogleOAuthProvider({
  children,
}: GoogleOAuthProviderProps) {
  if (!GOOGLE_CLIENT_ID) {
    return <>{children}</>;
  }

  return <Provider clientId={GOOGLE_CLIENT_ID}>{children}</Provider>;
}

export { GOOGLE_CLIENT_ID };
