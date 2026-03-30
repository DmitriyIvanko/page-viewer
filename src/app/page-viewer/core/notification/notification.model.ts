import { NotificationType } from "./notification.type";

export interface NotificationModel {
  id: string;
  message: string;
  type?: NotificationType; // default Error;
}
