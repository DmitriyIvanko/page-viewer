import { Injectable, inject } from '@angular/core';

import { DocumentMapper} from './document.mapper';
import { MOCK_DOCUMENT_RESPONSE } from './page.mock-data';
import { DocumentModel } from './document.model';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private readonly mapper = new DocumentMapper();

  // TODO: for future implementation:
  // private readonly httpClient = inject(HttpClient);

  get(documentId: string): DocumentModel {
 // TODO: for future implementation:
    // const url = `some-url${documentId}`;
    // this.httpClient.get(url).map((response) => this.mapper.mapInstanceToClient(response));

    return this.mapper.mapInstanceToClient(MOCK_DOCUMENT_RESPONSE)
  }
}
