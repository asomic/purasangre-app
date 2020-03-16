import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AlertPushModalPage } from './alert-push-modal.page';

describe('AlertPushModalPage', () => {
  let component: AlertPushModalPage;
  let fixture: ComponentFixture<AlertPushModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlertPushModalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AlertPushModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
