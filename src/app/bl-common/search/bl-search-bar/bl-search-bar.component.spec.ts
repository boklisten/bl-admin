import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlSearchBarComponent } from './bl-search-bar.component';

describe('SearchBarComponent', () => {
  let component: BlSearchBarComponent;
  let fixture: ComponentFixture<BlSearchBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlSearchBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlSearchBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
