import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CartListItemAgeComponent } from './cart-list-item-age.component';

describe('CartListItemAgeComponent', () => {
  let component: CartListItemAgeComponent;
  let fixture: ComponentFixture<CartListItemAgeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CartListItemAgeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CartListItemAgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
