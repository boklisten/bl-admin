import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderCustomerSearchComponent } from './header-customer-search.component';

describe('HeaderCustomerSearchComponent', () => {
  let component: HeaderCustomerSearchComponent;
  let fixture: ComponentFixture<HeaderCustomerSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeaderCustomerSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderCustomerSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
