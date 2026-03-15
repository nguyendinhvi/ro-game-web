import type { GameOrientation } from "@/interfaces";

export interface ThumbDimensions {
  width: number;
  height: number;
}

const FALLBACK: Record<GameOrientation, ThumbDimensions> = {
  portrait: { width: 3, height: 4 },
  landscape: { width: 4, height: 3 },
};

export function parseThumbDimensions(
  url: string,
  orientation: GameOrientation = "landscape",
): ThumbDimensions {
  const cloudflare = url.match(/width=(\d+),height=(\d+)/i);
  if (cloudflare) {
    return {
      width: Number(cloudflare[1]),
      height: Number(cloudflare[2]),
    };
  }

  const pathSize = url.match(/(\d{2,4})x(\d{2,4})/i);
  if (pathSize) {
    return {
      width: Number(pathSize[1]),
      height: Number(pathSize[2]),
    };
  }

  const queryW = url.match(/[?&]w(?:idth)?=(\d+)/i);
  const queryH = url.match(/[?&]h(?:eight)?=(\d+)/i);
  if (queryW && queryH) {
    return {
      width: Number(queryW[1]),
      height: Number(queryH[1]),
    };
  }

  return FALLBACK[orientation];
}
