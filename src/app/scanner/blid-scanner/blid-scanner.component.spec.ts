import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlidScannerComponent } from './blid-scanner.component';

describe('BlidScannerComponent', () => {
  let component: BlidScannerComponent;
  let fixture: ComponentFixture<BlidScannerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlidScannerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlidScannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
