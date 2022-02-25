import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {ButtonModule} from 'primeng/button';
import {InputSwitchModule} from 'primeng/inputswitch';
import {FormsModule} from '@angular/forms';
import {TooltipModule} from 'primeng/tooltip';
import {SliderModule} from 'primeng/slider';
import {CardModule} from 'primeng/card';



import { AppComponent } from './app.component';
import { CanvasComponent } from './canvas/canvas.component';

@NgModule({
  declarations: [
    AppComponent,
    CanvasComponent
  ],
  imports: [
    BrowserModule,
    ButtonModule,
    InputSwitchModule,
    TooltipModule,
    CardModule,
    SliderModule,
    
    
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
