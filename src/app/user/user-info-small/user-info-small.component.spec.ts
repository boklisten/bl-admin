import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserInfoSmallComponent } from './user-info-small.component';

describe('UserInfoSmallComponent', () => {
  let component: UserInfoSmallComponent;
  let fixture: ComponentFixture<UserInfoSmallComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserInfoSmallComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserInfoSmallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
