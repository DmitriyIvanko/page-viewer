import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { DocumentMapper} from './document.mapper';
import { DocumentModel } from './document.model';
import { DocumentSaveModel } from './document-save.model';
import { MOCK_DOCUMENT_RESPONSE } from './page.mock-data';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private readonly mapper = new DocumentMapper();

  // TODO: for future implementation:
  // private readonly httpClient = inject(HttpClient);

  get(documentId: string): Observable<DocumentModel> {
    // TODO: for future implementation:
    // const url = `some-url${documentId}`;
    // this.httpClient.get(url).map((response) => this.mapper.mapInstanceToClient(response));

    return of(this.mapper.mapInstanceToClient(MOCK_DOCUMENT_RESPONSE));
  }

  save(args: DocumentSaveModel): Observable<boolean> {
    console.log(args);

    return of(true);
  }
}
