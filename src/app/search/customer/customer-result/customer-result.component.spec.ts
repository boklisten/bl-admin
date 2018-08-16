import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerResultComponent } from './customer-result.component';

describe('CustomerResultComponent', () => {
  let component: CustomerResultComponent;
  let fixture: ComponentFixture<CustomerResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
