import { NotificationType } from '../../prisma/generated/prisma-client-js';

export default interface Notification {
  id?: string;
  title: string;
  message: string;
  isRead: boolean;
  type: NotificationType;
  clientId: string;
}
