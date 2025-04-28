import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import * as timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

export function parseIsoString(
  date: string | Date,
  time?: string | Date,
): string {
  const formattedDate = dayjs(date).format('YYYY-MM-DD');

  const datetime = time
    ? dayjs(`${formattedDate} ${time}`).format('YYYY-MM-DD HH:mm:ss')
    : formattedDate;

  return dayjs(datetime).toISOString();
}

export function parseLocalTime(datetime: string) {
  return dayjs(datetime).utcOffset(-180).format('DD/MM/YYYY HH:mm:ss');
}

export function dateRange(date: string): { startRange: Date; endRange: Date } {
  return {
    startRange: dayjs(date).startOf('day').toDate(),
    endRange: dayjs(date).endOf('day').toDate(),
  };
}
