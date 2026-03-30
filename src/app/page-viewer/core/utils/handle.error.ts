import { catchError, Observable, of, OperatorFunction } from 'rxjs';
import { NotificationService, NotificationType } from '../notification';

export function handleError<T>(
  notificationService: NotificationService,
  defaultValue: T | null = null,
  type?: NotificationType,
): OperatorFunction<T, T | null> {
  return (source$: Observable<T>): Observable<T | null> => {
    return source$.pipe(
      catchError((error: Error) => {
        notificationService.addNotification({
          message: error.message,
          type: type ?? 'ERROR',
        });

        return of(defaultValue);
      }),
    );
  };
}
