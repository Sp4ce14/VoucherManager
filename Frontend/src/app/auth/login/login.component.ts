// Import Component, OnInit from Angular core
import { Component, OnInit } from '@angular/core';
// Import form related classes
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
// Import Router
import { Router } from '@angular/router';
// Import AuthService
import { AuthService } from 'src/app/services/auth-service';
// Define component decorator
@Component({
  selector: 'app-login', // Selector for the component
  templateUrl: './login.component.html', // Template file
  styleUrls: ['./login.component.css'] // Styles file
})
// Export the LoginComponent class
export class LoginComponent implements OnInit {
  // Public form group for login
  public loginForm: FormGroup;
  // Abstract control for username
  public _userName: AbstractControl | null;
  // Abstract control for password
  public _password: AbstractControl | null;
  // Validation error message
  public validationErr: string;
  // Constructor to inject dependencies
  constructor(private _formbuilder: FormBuilder, private authService: AuthService, private router: Router) { }
  // Implement ngOnInit
  ngOnInit(): void {
    // Create the form group
    this.loginForm = this._formbuilder.group(
      {
        userName: ['', [Validators.required]], // Username field with required validator
        password: ['', [Validators.required]] // Password field with required validator
      }
    );
    // Get controls
    this._userName = this.loginForm.get("userName");
    this._password = this.loginForm.get("password");
    // Subscribe to form value changes
    this.loginForm.valueChanges.subscribe(x => {
      // Check for validation errors
      if (this._password?.errors && this._userName?.errors && (this._userName?.dirty || this._password?.dirty)) {
        this.validationErr = "Both fields are required.";
      }
      else if (this._password?.errors && this._password?.dirty) {
        this.validationErr = "Password is required.";
      }
      else if (this._userName?.errors && this._userName?.dirty) {
        this.validationErr = "User Name is required.";
      }
      else {
        this.validationErr = "";
      }
    });
  }
  // Public login method
  public login(): void {
    // If no errors
    if (!this._userName?.errors && !this._password?.errors) {
      // Call login service
      this.authService.login(this.loginForm.value).subscribe({
        next: res => {
          this.authService.setToken(res.token);
          console.log(res);
          this.router.navigate(['']);
        }, // On success, set token, log, navigate
        error: err => { this.validationErr = err.error } // On error, set validation error
      });
    }
    else {
      this.validationErr = "Please Enter some details.";
    }
  }
}
