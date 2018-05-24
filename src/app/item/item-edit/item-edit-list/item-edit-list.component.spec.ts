import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemEditListComponent } from './item-edit-list.component';

describe('ItemEditListComponent', () => {
  let component: ItemEditListComponent;
  let fixture: ComponentFixture<ItemEditListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemEditListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemEditListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
