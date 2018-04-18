import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerDetailCardComponent } from './customer-detail-card.component';

describe('CustomerDetailCardComponent', () => {
  let component: CustomerDetailCardComponent;
  let fixture: ComponentFixture<CustomerDetailCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerDetailCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerDetailCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
