import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlCommonAlertComponent } from './bl-common-alert.component';

describe('BlCommonAlertComponent', () => {
  let component: BlCommonAlertComponent;
  let fixture: ComponentFixture<BlCommonAlertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlCommonAlertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlCommonAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
