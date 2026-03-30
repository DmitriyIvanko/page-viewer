import { Injectable, signal } from '@angular/core';

import { NotificationModel } from './notification.model';

let ID = 0;

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  readonly notificationS = signal<NotificationModel | null>(null);
  readonly closeNotificationS = signal<string | null>(null);

  addNotification(notification: Omit<NotificationModel, 'id'>): void {
    this.notificationS.set({
      ...notification,
      id: String(ID++),
    });
  }

  closeNotification(id: string): void {
    this.closeNotificationS.set(id);
  }
}
