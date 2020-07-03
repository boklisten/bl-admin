import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UniqueItemRegisterFromCartComponent } from './unique-item-register-from-cart.component';

describe('UniqueItemRegisterFromCartComponent', () => {
  let component: UniqueItemRegisterFromCartComponent;
  let fixture: ComponentFixture<UniqueItemRegisterFromCartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UniqueItemRegisterFromCartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UniqueItemRegisterFromCartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
