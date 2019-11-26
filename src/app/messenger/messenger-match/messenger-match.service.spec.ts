import { TestBed } from '@angular/core/testing';

import { MessengerMatchService } from './messenger-match.service';

describe('MessengerMatchService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MessengerMatchService = TestBed.get(MessengerMatchService);
    expect(service).toBeTruthy();
  });
});
