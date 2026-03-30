import { TestBed } from '@angular/core/testing';

import { DocumentService } from './document.service';

describe('PageService', () => {
  let service: DocumentService;

  beforeEach(() => {
    TestBed.configureTestingModule(Object.create(null));
    service = TestBed.inject(DocumentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
