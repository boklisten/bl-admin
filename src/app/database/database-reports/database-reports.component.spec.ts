import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatabaseReportsComponent } from './database-reports.component';

describe('DatabaseReportsComponent', () => {
  let component: DatabaseReportsComponent;
  let fixture: ComponentFixture<DatabaseReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatabaseReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatabaseReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
