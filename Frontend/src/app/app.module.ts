import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { VouchersModule } from './vouchers/vouchers.module';
import { SharedModule } from './shared/shared.module';
import { PrivacycompComponent } from './privacycomp/privacycomp.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    PrivacycompComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    VouchersModule,
    SharedModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
