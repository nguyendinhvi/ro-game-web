import { useEffect, useRef } from "react";
import { useGoogleOAuth } from "@react-oauth/google";
import { GOOGLE_CLIENT_ID } from "./GoogleOAuthProvider";

interface GoogleSignInButtonProps {
  disabled?: boolean;
  onSuccess: (idToken: string) => void | Promise<void>;
  onError?: () => void;
}

export default function GoogleSignInButton({
  disabled = false,
  onSuccess,
  onError,
}: GoogleSignInButtonProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const onSuccessRef = useRef(onSuccess);
  const onErrorRef = useRef(onError);
  const { clientId, scriptLoadedSuccessfully } = useGoogleOAuth();

  onSuccessRef.current = onSuccess;
  onErrorRef.current = onError;

  useEffect(() => {
    const container = overlayRef.current;
    if (!scriptLoadedSuccessfully || !container || disabled || !clientId) {
      return;
    }

    const google = window.google;
    if (!google?.accounts?.id) {
      return;
    }

    container.innerHTML = "";

    google.accounts.id.initialize({
      client_id: clientId,
      callback: (response) => {
        if (!response.credential) {
          onErrorRef.current?.();
          return;
        }
        void onSuccessRef.current(response.credential);
      },
    });

    const width = container.parentElement?.clientWidth ?? 190;

    google.accounts.id.renderButton(container, {
      type: "standard",
      theme: "outline",
      size: "large",
      text: "continue_with",
      shape: "rectangular",
      width,
    });
  }, [clientId, disabled, scriptLoadedSuccessfully]);

  if (!GOOGLE_CLIENT_ID) {
    return (
      <button
        type="button"
        className="login-social-btn"
        disabled
        title="Chưa cấu hình Google Client ID"
      >
        <span className="login-social-icon login-social-icon--google" aria-hidden />
        Google
      </button>
    );
  }

  return (
    <div
      className={`login-social-btn-overlay${
        disabled ? " login-social-btn-overlay--disabled" : ""
      }`}
    >
      <span className="login-social-btn login-social-btn--visual" aria-hidden>
        <span className="login-social-icon login-social-icon--google" aria-hidden />
        Google
      </span>
      <div
        ref={overlayRef}
        className="login-social-google-hit"
        aria-label="Đăng nhập Google"
      />
    </div>
  );
}
