import { catchError, Observable, of, OperatorFunction } from 'rxjs';
import { NotificationService, NotificationType } from '../notification';

export function handleError<T>(
  notificationService: NotificationService,
  defaultValue: T,
  type?: NotificationType,
): OperatorFunction<T, T> {
  return (source$: Observable<T>): Observable<T> => {
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
