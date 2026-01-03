// Import NgModule from Angular core
import { NgModule } from '@angular/core';
// Import RouterModule and Routes for routing
import { RouterModule, Routes } from '@angular/router';
// Import the privacy component
import { PrivacycompComponent } from './privacycomp/privacycomp.component';
import { AuthGuard } from './auth.guard';
// Define the routes array
const routes: Routes = [
  {path: 'vouchers', loadChildren: () => import('./vouchers/vouchers.module').then(m => m.VouchersModule), canLoad: [AuthGuard], canActivateChild: [AuthGuard]}, // Lazy load vouchers module
  {path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule), canLoad: [AuthGuard], data: {"showingAuth": true}}, // Lazy load auth module
  {path: 'privacy', component: PrivacycompComponent}, // Route to privacy component
  {path: '', redirectTo: 'vouchers', pathMatch: "full"}, // Default redirect to vouchers
];
// Define the routing module
@NgModule({
  imports: [RouterModule.forRoot(routes)], // Import RouterModule with routes
  exports: [RouterModule] // Export RouterModule
})
// Export the AppRoutingModule class
export class AppRoutingModule { }
