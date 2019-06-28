import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceIdSelectComponent } from './invoice-id-select.component';

describe('InvoiceIdSelectComponent', () => {
  let component: InvoiceIdSelectComponent;
  let fixture: ComponentFixture<InvoiceIdSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvoiceIdSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceIdSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
