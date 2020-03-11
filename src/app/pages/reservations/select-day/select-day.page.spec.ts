import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectDayPage } from './select-day.page';

describe('AddDayPage', () => {
  let component: SelectDayPage;
  let fixture: ComponentFixture<SelectDayPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectDayPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectDayPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
