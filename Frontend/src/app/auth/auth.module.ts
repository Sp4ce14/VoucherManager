// Import NgModule from Angular core
import { NgModule } from '@angular/core';
// Import CommonModule for common directives
import { CommonModule } from '@angular/common';
// Import LoginComponent
import { LoginComponent } from './login/login.component';
// Import SignupComponent
import { SignupComponent } from './signup/signup.component';
// Import AuthRoutingModule
import { AuthRoutingModule } from './auth-routing.module';
// Import ReactiveFormsModule
import { ReactiveFormsModule } from '@angular/forms';
// Import HttpClientModule
import { HttpClientModule } from '@angular/common/http';
// Define the auth module
@NgModule({
  declarations: [ // Declare components
    LoginComponent, // Login component
    SignupComponent // Signup component
  ],
  imports: [ // Import modules
    CommonModule, // Common module
    AuthRoutingModule, // Routing module
    ReactiveFormsModule // Reactive forms
  ]
})
// Export the AuthModule class
export class AuthModule { }
