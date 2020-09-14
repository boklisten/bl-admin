import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UniqueItemActiveInformationComponent } from './unique-item-active-information.component';

describe('UniqueItemActiveInformationComponent', () => {
  let component: UniqueItemActiveInformationComponent;
  let fixture: ComponentFixture<UniqueItemActiveInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UniqueItemActiveInformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UniqueItemActiveInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
