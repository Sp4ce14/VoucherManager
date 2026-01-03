// Import NgModule from Angular core
import { NgModule } from '@angular/core';
// Import RouterModule and Routes
import { RouterModule, Routes } from '@angular/router';
// Import LoginComponent
import { LoginComponent } from './login/login.component';
// Import SignupComponent
import { SignupComponent } from './signup/signup.component';
// Define routes
const routes: Routes = [
  {path: 'login', component: LoginComponent}, // Route to login
  {path: 'signup', component: SignupComponent}, // Route to signup
  {path: '', redirectTo: 'signup', pathMatch: 'full'} // Default to signup
];
// Define the routing module
@NgModule({
  imports: [RouterModule.forChild(routes)], // For child routes
  exports: [RouterModule] // Export RouterModule
})
// Export the AuthRoutingModule class
export class AuthRoutingModule { }