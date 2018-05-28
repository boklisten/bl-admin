import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlCommonToggleButtonComponent } from './bl-common-toggle-button.component';

describe('BlCommonToggleButtonComponent', () => {
  let component: BlCommonToggleButtonComponent;
  let fixture: ComponentFixture<BlCommonToggleButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlCommonToggleButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlCommonToggleButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
