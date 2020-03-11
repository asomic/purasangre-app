import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectHourPage } from './select-hour.page';

describe('SelectHourPage', () => {
  let component: SelectHourPage;
  let fixture: ComponentFixture<SelectHourPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectHourPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectHourPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
