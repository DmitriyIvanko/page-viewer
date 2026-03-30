import { Injectable, signal } from '@angular/core';

import { NotificationModel } from './notification.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  readonly notificationS = signal<NotificationModel | null>(null);
  readonly closeNotificationS = signal<string | null>(null);

  addNotification(notification: NotificationModel): void {
    this.notificationS.set(notification);
  }

  closeNotification(id: string): void {
    this.closeNotificationS.set(id);
  }
}
