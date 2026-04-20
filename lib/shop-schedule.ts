/** Weekday closure in US Eastern (handles EST/EDT via IANA zone). */
const EASTERN = 'America/New_York';

/** Friday 4:00 PM ET — shop closes */
const FRIDAY_CLOSE_HOUR = 16;
const FRIDAY_CLOSE_MINUTE = 0;

/** Saturday 11:00 PM ET — shop reopens */
const SATURDAY_OPEN_HOUR = 23;
const SATURDAY_OPEN_MINUTE = 0;

function easternWeekdayAndTime(now: Date): {
  weekday: string;
  minutesSinceMidnight: number;
} {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: EASTERN,
    weekday: 'long',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(now);

  const weekday = parts.find((p) => p.type === 'weekday')?.value ?? '';
  const hour = parseInt(parts.find((p) => p.type === 'hour')?.value ?? '0', 10);
  const minute = parseInt(parts.find((p) => p.type === 'minute')?.value ?? '0', 10);

  return {
    weekday,
    minutesSinceMidnight: hour * 60 + minute,
  };
}

/**
 * True during the weekly maintenance window: Fri 4:00 PM ET (inclusive) through Sat before 11:00 PM ET.
 * Opens again at Sat 11:00 PM ET and later.
 */
export function isScheduledShopClosure(now: Date = new Date()): boolean {
  const { weekday, minutesSinceMidnight } = easternWeekdayAndTime(now);

  const friClose = FRIDAY_CLOSE_HOUR * 60 + FRIDAY_CLOSE_MINUTE;
  const satOpen = SATURDAY_OPEN_HOUR * 60 + SATURDAY_OPEN_MINUTE;

  if (weekday === 'Friday') {
    return minutesSinceMidnight >= friClose;
  }
  if (weekday === 'Saturday') {
    return minutesSinceMidnight < satOpen;
  }
  return false;
}
