import { TestBed } from '@angular/core/testing';

import { ScrollHelper } from './scroll-helper';

describe('ScrollHelper', () => {
  let service: ScrollHelper;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScrollHelper);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
