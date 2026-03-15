import { useEffect } from "react";
import type { AppProps } from "next/app";
import AuthProvider from "@/context/AuthProvider";
import GoogleOAuthProvider from "@/components/GoogleOAuthProvider";
import { poppins } from "@/fonts";
import "@/styles/global.scss";

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    document.documentElement.classList.add(poppins.variable);
    document.body.classList.add(poppins.className);
  }, []);

  return (
    <>
      <style jsx global>{`
        html,
        body {
          font-family: ${poppins.style.fontFamily};
        }

        button,
        input,
        textarea,
        select {
          font-family: inherit;
        }
      `}</style>
      <div className={`${poppins.variable} ${poppins.className}`}>
        <GoogleOAuthProvider>
          <AuthProvider>
            <Component {...pageProps} />
          </AuthProvider>
        </GoogleOAuthProvider>
      </div>
    </>
  );
}
