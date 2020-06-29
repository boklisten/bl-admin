import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UidScannerListComponent } from './uid-scanner-list.component';

describe('UidScannerListComponent', () => {
  let component: UidScannerListComponent;
  let fixture: ComponentFixture<UidScannerListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UidScannerListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UidScannerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
