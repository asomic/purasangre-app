import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ClasesTodayPage } from './clases-today.page';

describe('ClasesTodayPage', () => {
  let component: ClasesTodayPage;
  let fixture: ComponentFixture<ClasesTodayPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClasesTodayPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ClasesTodayPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
