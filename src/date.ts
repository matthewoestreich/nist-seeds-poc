export function dateFromUnixTimestamp(timestamp: number): Date {
  return new Date(timestamp * 1000);
}

export function dateToUnixTimestamp(date: Date): number {
  return Math.floor(date.getTime() / 1000);
}

export function formatDate(date: Date): string {
  return date
    .toISOString()
    .replace("T", " ")
    .replace(/\.\d{3}Z$/, " +0000 UTC");
}
