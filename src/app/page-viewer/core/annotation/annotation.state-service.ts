import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { AnnotationModel } from './annotation.model';
import { AnnotationService } from './annotation.service';
import { NotificationService } from '../notification';
import { handleError } from '../utils';

@Injectable({
  providedIn: 'root'
})
export class AnnotationStateService {
  readonly isLoadingS = signal<boolean>(false);
  readonly stateS = signal<AnnotationModel[]>([]);

  private readonly destroyRef = inject(DestroyRef);
  private readonly annotationService = inject(AnnotationService);
  private readonly notificationService = inject(NotificationService);

  add(entity: AnnotationModel): void {
    this.isLoadingS.set(true);
    this.annotationService.add(entity).pipe(
      handleError<AnnotationModel | null>(this.notificationService, null),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe((response) => {
      this.isLoadingS.set(false);
      debugger;
      if (response != null)  {
        this.stateS.update((entityList) => [...entityList, response]);
        debugger;
      }
    });
  }

  get(documentId: string): void {
    this.isLoadingS.set(true);
    this.annotationService.get(documentId).pipe(
      handleError<AnnotationModel[]>(this.notificationService, []),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe((entityList) => {
      this.isLoadingS.set(false);
      this.stateS.set(entityList);
    });
  }

  remove(entityId: string): void {
    this.isLoadingS.set(true);
    this.annotationService.remove(entityId).pipe(
      handleError<string | null>(this.notificationService, null),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe((entityId) => {
      this.isLoadingS.set(false);

      if (entityId != null) {
        this.stateS.update((entityList) => {
          return entityList.filter((entity) => entity.id !== entityId);
        });
      }
    });
  }

  update(entity: AnnotationModel): void {
    this.isLoadingS.set(true);
    this.annotationService.update(entity).pipe(
      handleError<AnnotationModel | null>(this.notificationService, null),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe((entity) => {
      this.isLoadingS.set(false);

      if (entity != null)  {
        this.stateS.update((entityList) => {
          const restList = entityList.filter((entity) => entity.id !== entity.id);

          return [...restList, entity];
        });
      }
    });
  }

}
