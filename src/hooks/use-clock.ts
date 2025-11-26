import * as React from "react";
import dayjs, { Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * Restituisce un Dayjs aggiornato periodicamente.
 * @param tz  es. "Europe/Rome"; se omesso usa il fuso del browser
 * @param stepMs intervallo di aggiornamento (default 30s)
 */
export function useClock(tz?: string, stepMs = 30_000): Dayjs {
  const getNow = () => (tz ? dayjs().tz(tz) : dayjs());

  const [now, setNow] = React.useState<Dayjs>(() => getNow());

  React.useEffect(() => {
    const id = window.setInterval(() => {
      setNow(getNow());
    }, stepMs);
    return () => window.clearInterval(id);
  }, [tz, stepMs]);

  return now;
}