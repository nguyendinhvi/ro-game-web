export function mergeClass(
  ...classes: (string | false | null | undefined)[]
): string {
  return classes.filter(Boolean).join(" ");
}

export { parseThumbDimensions } from "./parseThumbDimensions";
export type { ThumbDimensions } from "./parseThumbDimensions";
export {
  buildPageTitle,
  DEFAULT_OG_IMAGE,
  DEFAULT_SEO,
  resolveAbsoluteUrl,
  SITE_NAME,
} from "./seo";
export { formatDuration } from "./formatDuration";
export {
  displayNameFromUser,
  initialsFromUser,
  profileHandleFromUser,
  profileSlugFromUser,
} from "./profile";
