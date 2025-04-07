import * as dayjs from 'dayjs';

export default function generateTimestamp() {
  return dayjs().format('DD/MM/YYYY HH:mm:ss');
}
