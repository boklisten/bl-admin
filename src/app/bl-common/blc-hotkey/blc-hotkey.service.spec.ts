import { TestBed } from '@angular/core/testing';

import { BlcHotkeyService } from './blc-hotkey.service';

describe('BlcHotkeyService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BlcHotkeyService = TestBed.get(BlcHotkeyService);
    expect(service).toBeTruthy();
  });
});
