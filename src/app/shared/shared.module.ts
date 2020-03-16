import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';

import { NavbarComponent } from './navbar/navbar.component';
import { ImagePickerComponent } from './pickers/image-picker/image-picker.component';

@NgModule({
    declarations: [ ImagePickerComponent, NavbarComponent ],
    imports: [ CommonModule, IonicModule ],
    exports: [ImagePickerComponent, NavbarComponent ]
})
export class SharedModule { }
