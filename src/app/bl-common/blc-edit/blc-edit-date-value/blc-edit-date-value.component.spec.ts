import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlcEditDateValueComponent } from './blc-edit-date-value.component';

describe('BlcEditDateValueComponent', () => {
  let component: BlcEditDateValueComponent;
  let fixture: ComponentFixture<BlcEditDateValueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlcEditDateValueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlcEditDateValueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
