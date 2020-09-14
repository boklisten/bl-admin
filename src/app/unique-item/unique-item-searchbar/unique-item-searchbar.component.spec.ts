import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UniqueItemSearchbarComponent } from './unique-item-searchbar.component';

describe('UniqueItemSearchbarComponent', () => {
  let component: UniqueItemSearchbarComponent;
  let fixture: ComponentFixture<UniqueItemSearchbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UniqueItemSearchbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UniqueItemSearchbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
