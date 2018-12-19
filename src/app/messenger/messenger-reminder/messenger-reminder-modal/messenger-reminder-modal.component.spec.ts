import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessengerReminderModalComponent } from './messenger-reminder-modal.component';

describe('MessengerReminderModalComponent', () => {
  let component: MessengerReminderModalComponent;
  let fixture: ComponentFixture<MessengerReminderModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessengerReminderModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessengerReminderModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
