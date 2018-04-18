import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerDetailModalContentComponent } from './customer-detail-modal-content.component';

describe('CustomerDetailModalContentComponent', () => {
  let component: CustomerDetailModalContentComponent;
  let fixture: ComponentFixture<CustomerDetailModalContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerDetailModalContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerDetailModalContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
