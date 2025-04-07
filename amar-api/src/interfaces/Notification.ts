import { NotificationType } from '@prisma/client';

export default interface Notification {
  id?: string;
  title: string;
  message: string;
  isRead: boolean;
  type: NotificationType;
  clientId: string;
}
