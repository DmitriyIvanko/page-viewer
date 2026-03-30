import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';

import { DocumentService } from './document.service';
import { DocumentModel } from './document.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root'
})
export class DocumentStateService {
  readonly isLoadingS = signal<boolean>(false);
  readonly stateS = signal<DocumentModel | null>(null);

  private readonly destroyRef = inject(DestroyRef);
  private readonly documentService = inject(DocumentService);

  get(documentId: string): void {
    this.isLoadingS.set(true);
    this.documentService.get(documentId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe((document) => {
      this.isLoadingS.set(false);
      this.stateS.set(document);
    });
  }
}
