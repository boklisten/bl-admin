import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessengerMatchComponent } from './messenger-match.component';

describe('MessengerMatchComponent', () => {
  let component: MessengerMatchComponent;
  let fixture: ComponentFixture<MessengerMatchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessengerMatchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessengerMatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
