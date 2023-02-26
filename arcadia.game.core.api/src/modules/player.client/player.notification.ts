import { NotificationType } from './notification.type';

export class PlayerNotification {
  notificationId: NotificationType;
  title: string;
  message: string;
  command?: string;
  data?: Record<string, any>;
}