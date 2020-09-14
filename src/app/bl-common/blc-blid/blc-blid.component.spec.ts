import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlcBlidComponent } from './blc-blid.component';

describe('BlcBlidComponent', () => {
  let component: BlcBlidComponent;
  let fixture: ComponentFixture<BlcBlidComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlcBlidComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlcBlidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
