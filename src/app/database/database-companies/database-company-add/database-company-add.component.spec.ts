import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatabaseCompanyAddComponent } from './database-company-add.component';

describe('DatabaseCompanyAddComponent', () => {
  let component: DatabaseCompanyAddComponent;
  let fixture: ComponentFixture<DatabaseCompanyAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatabaseCompanyAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatabaseCompanyAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
