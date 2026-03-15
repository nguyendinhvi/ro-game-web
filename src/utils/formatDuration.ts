export function formatDuration(totalSeconds: number): string {
  if (totalSeconds <= 0) return "0 phút";

  const minutes = Math.floor(totalSeconds / 60);
  if (minutes < 1) return `${totalSeconds} giây`;
  if (minutes < 60) return `${minutes} phút`;

  const hours = Math.floor(minutes / 60);
  const remMinutes = minutes % 60;
  if (hours < 24) {
    return remMinutes > 0 ? `${hours} giờ ${remMinutes} phút` : `${hours} giờ`;
  }

  const days = Math.floor(hours / 24);
  const remHours = hours % 24;
  return remHours > 0 ? `${days} ngày ${remHours} giờ` : `${days} ngày`;
}
