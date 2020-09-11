import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UniqueItemCustomerItemListComponent } from './unique-item-customer-item-list.component';

describe('UniqueItemCustomerItemListComponent', () => {
  let component: UniqueItemCustomerItemListComponent;
  let fixture: ComponentFixture<UniqueItemCustomerItemListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UniqueItemCustomerItemListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UniqueItemCustomerItemListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
