import { Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';

import { AnnotationMapper } from './annotation.mapper';
import { AnnotationModel } from './annotation.model';

@Injectable({
  providedIn: 'root'
})
export class AnnotationService {
  private readonly mapper = new AnnotationMapper();

  // TODO: for future implementation:
  // private readonly httpClient = inject(HttpClient);

  // TODO: add cache:
  private readonly mockAnnotationListS = signal<AnnotationModel[]>([]);

  add(annotation: AnnotationModel): Observable<AnnotationModel>{
    this.mockAnnotationListS.update((annotationList) => [...annotationList, annotation]);

    return of(annotation);
  }

  get(documentId: string): Observable<AnnotationModel[]> {
    return of(this.mockAnnotationListS());
  }

  update(annotation: AnnotationModel): Observable<AnnotationModel>{
    this.mockAnnotationListS.update((annotationList) => {
      const resultList = annotationList.filter((annotation) => annotation.id !== annotation.id);
      return [...resultList, annotation];
    });

    return of(annotation);
  }

  remove(annotationId: string): Observable<string> {
    this.mockAnnotationListS.update((annotationList) => {
      const resultList = annotationList.filter((annotation) => annotation.id !== annotationId);
      return resultList;
    });

    return of(annotationId);
  }
}
