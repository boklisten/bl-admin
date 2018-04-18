import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerDetailModalComponent } from './customer-detail-modal.component';

describe('CustomerDetailModalComponent', () => {
  let component: CustomerDetailModalComponent;
  let fixture: ComponentFixture<CustomerDetailModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerDetailModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerDetailModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
