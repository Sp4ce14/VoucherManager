// Import NgModule decorator from Angular core
import { APP_INITIALIZER, NgModule } from '@angular/core';
// Import BrowserModule for browser-specific features
import { BrowserModule } from '@angular/platform-browser';
// Import the app routing module
import { AppRoutingModule } from './app-routing.module';
// Import the main app component
import { AppComponent } from './app.component';
// Import the vouchers module
import { VouchersModule } from './vouchers/vouchers.module';
// Import the shared module
import { SharedModule } from './shared/shared.module';
// Import the privacy component
import { PrivacycompComponent } from './privacycomp/privacycomp.component';
// Import ReactiveFormsModule for reactive forms
import { ReactiveFormsModule } from '@angular/forms';
// Import HTTP_INTERCEPTORS, HttpClientModule for HTTP handling
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
// Import the auth module
import { AuthModule } from './auth/auth.module';
// Import the token interceptor
import { TokenInterceptor } from './token.interceptor';
// Define the app module
@NgModule({
  declarations: [ // Declare components in this module
    AppComponent, // The main app component
    PrivacycompComponent // The privacy component
  ],
  imports: [ // Import other modules
    BrowserModule, // Browser module
    AppRoutingModule, // Routing module
    VouchersModule, // Vouchers module
    AuthModule, // Auth module
    SharedModule, // Shared module
    ReactiveFormsModule, // Reactive forms module
    HttpClientModule // HTTP client module
  ],
  providers: [ // Provide services
    {
      provide: HTTP_INTERCEPTORS, // Provide HTTP interceptor
      useClass: TokenInterceptor, // Use the TokenInterceptor class
      multi: true // Allow multiple interceptors
    }
    // {
    //   provide: 'BASE_API_URL', // Provide base API URL
    //   useValue: 'https://localhost:7093/api/' // Set the base API URL value 
    // } one way to set base url
  ],
  bootstrap: [AppComponent] // Bootstrap the app component
})
// Export the AppModule class
export class AppModule { }
