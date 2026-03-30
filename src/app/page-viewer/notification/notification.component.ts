import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';

import { NotificationModel, NotificationService } from '../core';

@Component({
  selector: 'pv-notification',
  imports: [],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'notification-list-container' }
})
export class NotificationComponent {

  readonly notificationList = signal<NotificationModel[]>([]);

  private readonly notificationService = inject(NotificationService);

  constructor() {
    effect(() => {
      const notification = this.notificationService.notificationS();

      if (notification == null) {
        return;
      }

      this.notificationList.update((notificationList) => [...notificationList, notification]);
    });

    effect(() => {
      const notificationId = this.notificationService.closeNotificationS();

      if (notificationId == null) {
        return;
      }

      this.onClose(notificationId);
    })
  }

  onClose(notificationId: string): void {
    this.notificationList.update((notificationList) => {
      return notificationList.filter((notification) => notification.id !== notificationId);
    });
  }

  onCloseAllClick(): void {
    this.notificationList.set([]);
  }

}
