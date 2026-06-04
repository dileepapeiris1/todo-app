/**
 * Returns true when an ISO datetime string falls on today's calendar date.
 *
 * @param {string} iso - ISO 8601 datetime string.
 * @returns {boolean} Whether the date is today.
 */
export function isToday(iso: string): boolean {
  return new Date(iso).toDateString() === new Date().toDateString();
}

/**
 * Formats an ISO datetime string as a localised time, e.g. "02:30 PM".
 *
 * @param {string} iso - ISO 8601 datetime string.
 * @returns {string} Formatted time string.
 */
export function fmtTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' });
}

/**
 * Formats an ISO datetime string as a full date label used in section headers.
 *
 * @param {string} iso - ISO 8601 datetime string.
 * @returns {string} Full date string, e.g. "Wednesday, June 4, 2026".
 */
export function fmtDateLabel(iso: string): string {
  return new Date(iso).toLocaleDateString('en', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
}

/**
 * Converts an ISO datetime string to the format required by an
 * `<input type="datetime-local">` element (YYYY-MM-DDTHH:mm).
 *
 * @param {string} iso - ISO 8601 datetime string.
 * @returns {string} Local datetime string in YYYY-MM-DDTHH:mm format.
 */
export function toDateTimeLocal(iso: string): string {
  const date = new Date(iso);
  const pad  = (num: number) => String(num).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

/**
 * Returns the current local datetime in YYYY-MM-DDTHH:mm format,
 * suitable as the `min` attribute of a `<input type="datetime-local">`.
 *
 * @returns {string} Current local datetime string.
 */
export function nowDateTimeLocal(): string {
  const now = new Date();
  const pad = (num: number) => String(num).padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
}
