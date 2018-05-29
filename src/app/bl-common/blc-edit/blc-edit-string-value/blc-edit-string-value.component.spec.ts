import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlcEditStringValueComponent } from './blc-edit-string-value.component';

describe('BlcEditStringValueComponent', () => {
  let component: BlcEditStringValueComponent;
  let fixture: ComponentFixture<BlcEditStringValueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlcEditStringValueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlcEditStringValueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
