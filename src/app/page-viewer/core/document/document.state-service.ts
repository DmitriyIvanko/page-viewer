import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { NotificationService } from '../notification';
import { handleError } from '../utils';
import { DocumentService } from './document.service';
import { DocumentModel } from './document.model';
import { DocumentSaveModel } from './document-save.model';

@Injectable({
  providedIn: 'root'
})
export class DocumentStateService {
  readonly isLoadingS = signal<boolean>(false);
  readonly stateS = signal<DocumentModel | null>(null);

  private readonly destroyRef = inject(DestroyRef);
  private readonly documentService = inject(DocumentService);
  private readonly notificationService = inject(NotificationService);

  get(documentId: string): void {
    this.isLoadingS.set(true);
    this.documentService.get(documentId).pipe(
      handleError<DocumentModel | null>(this.notificationService, null),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe((entity) => {
      this.isLoadingS.set(false);
      this.stateS.set(entity);
    });
  }

  save(request: DocumentSaveModel): void {
    this.isLoadingS.set(true);
    this.documentService.save(request).pipe(
      handleError<boolean>(this.notificationService, false),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe((response) => {
      this.isLoadingS.set(false);

      if (!response) {
        this.notificationService.addNotification({ message: 'Document not saved' });
      }
    });
  }
}
