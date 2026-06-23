import { useEffect, useMemo, useRef } from "react";
import { mergeClass } from "@/utils";

export const GOOGLE_ADSENSE_CLIENT = "ca-pub-2808196405892823";
export const GAME_PLAYER_AD_SLOT = "7874812080";
export const GAME_MAIN_HORIZONTAL_AD_SLOT = "2716074501";

export const GOOGLE_ADSENSE_SLOTS = {
  square: GAME_PLAYER_AD_SLOT,
  horizontal: GAME_MAIN_HORIZONTAL_AD_SLOT,
} as const;

export type GoogleAdSenseVariant = keyof typeof GOOGLE_ADSENSE_SLOTS;

const ADSENSE_SCRIPT_ID = "google-adsense-script";

interface IProps {
  variant?: GoogleAdSenseVariant;
  adClient?: string;
  adSlot?: string;
  className?: string;
}

function loadAdSenseScript(client: string): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.resolve();
  }

  const existingScript = document.getElementById(
    ADSENSE_SCRIPT_ID,
  ) as HTMLScriptElement | null;

  if (existingScript) {
    if (existingScript.dataset.loaded === "true") {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      existingScript.addEventListener("load", () => resolve(), { once: true });
      existingScript.addEventListener(
        "error",
        () => reject(new Error("AdSense script failed to load")),
        { once: true },
      );
    });
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.id = ADSENSE_SCRIPT_ID;
    script.async = true;
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(client)}`;
    script.crossOrigin = "anonymous";
    script.dataset.loaded = "false";
    script.onload = () => {
      script.dataset.loaded = "true";
      resolve();
    };
    script.onerror = () => {
      reject(new Error("AdSense script failed to load"));
    };
    document.head.appendChild(script);
  });
}

export default function GoogleAdSenseUnit({
  variant = "square",
  adClient = GOOGLE_ADSENSE_CLIENT,
  adSlot,
  className = "",
}: IProps) {
  const pushedRef = useRef(false);
  const resolvedAdSlot = adSlot ?? GOOGLE_ADSENSE_SLOTS[variant];

  const rootClassName = useMemo(
    () =>
      mergeClass(
        "google-adsense-unit",
        `google-adsense-unit--${variant}`,
        variant === "square" && "ad-banner ad-banner--square",
        variant === "horizontal" && "ad-banner ad-banner--horizontal",
        className,
      ),
    [className, variant],
  );

  useEffect(() => {
    pushedRef.current = false;
  }, [resolvedAdSlot]);

  useEffect(() => {
    let cancelled = false;

    const initAd = async () => {
      try {
        await loadAdSenseScript(adClient);
        if (cancelled || pushedRef.current) {
          return;
        }

        pushedRef.current = true;
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch {
        // AdSense chưa sẵn sàng hoặc script lỗi
      }
    };

    void initAd();

    return () => {
      cancelled = true;
    };
  }, [adClient, resolvedAdSlot]);

  return (
    <aside className={rootClassName} aria-label="Quảng cáo">
      <span className="ad-banner-label">Quảng cáo</span>
      <div className="google-adsense-unit__slot">
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client={adClient}
          data-ad-slot={resolvedAdSlot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    </aside>
  );
}
