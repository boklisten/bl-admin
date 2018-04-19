import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemDetailCardComponent } from './item-detail-card.component';

describe('ItemDetailCardComponent', () => {
  let component: ItemDetailCardComponent;
  let fixture: ComponentFixture<ItemDetailCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemDetailCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemDetailCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
