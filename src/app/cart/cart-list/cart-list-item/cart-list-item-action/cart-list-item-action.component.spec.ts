import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CartListItemActionComponent } from './cart-list-item-action.component';

describe('CartListItemActionComponent', () => {
  let component: CartListItemActionComponent;
  let fixture: ComponentFixture<CartListItemActionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CartListItemActionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CartListItemActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
