import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemInformationComponent } from './item-information.component';

describe('ItemInformationComponent', () => {
  let component: ItemInformationComponent;
  let fixture: ComponentFixture<ItemInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemInformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
