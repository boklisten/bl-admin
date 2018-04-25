import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CartListSmallComponent } from './cart-list-small.component';

describe('CartListSmallComponent', () => {
  let component: CartListSmallComponent;
  let fixture: ComponentFixture<CartListSmallComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CartListSmallComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CartListSmallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
