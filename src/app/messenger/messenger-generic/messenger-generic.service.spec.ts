import { TestBed } from '@angular/core/testing';

import { MessengerGenericService } from './messenger-generic.service';

describe('MessengerGenericService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MessengerGenericService = TestBed.get(MessengerGenericService);
    expect(service).toBeTruthy();
  });
});
