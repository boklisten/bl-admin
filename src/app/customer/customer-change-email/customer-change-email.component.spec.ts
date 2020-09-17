import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerChangeEmailComponent } from './customer-change-email.component';

describe('CustomerChangeEmailComponent', () => {
  let component: CustomerChangeEmailComponent;
  let fixture: ComponentFixture<CustomerChangeEmailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerChangeEmailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerChangeEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
