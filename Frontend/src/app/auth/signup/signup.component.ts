import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/vouchers/services/auth-service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  public signUpForm: FormGroup;
  public _userName: AbstractControl | null; 
  public _email: AbstractControl | null;
  public _password: AbstractControl | null;
  public _confirmPassword: AbstractControl | null;
  public validationErr: string;
  constructor(private _formbuilder: FormBuilder, private authService: AuthService) {}

  ngOnInit(): void {
    this.signUpForm = this._formbuilder.group(
      {
        userName: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required]],
        confirmPassword: ['', [Validators.required]]
      }
    );
    this._userName = this.signUpForm.get("userName");
    this._email = this.signUpForm.get("email");
    this._password = this.signUpForm.get("password");
    this._confirmPassword = this.signUpForm.get("confirmPassword");
    this.signUpForm.valueChanges.subscribe(x => {
      if (this._password?.errors && this._userName?.errors && this._confirmPassword?.errors && this._email?.errors && (this._userName?.dirty || this._password?.dirty || this._confirmPassword?.dirty || this._email?.dirty))
      {
        this.validationErr = "All fields are required.";
      }
      else if (this._password?.errors && this._password?.dirty)
      {
        this.validationErr = "Password is required.";
      }
      else if (this._userName?.errors && this._userName?.dirty)
      {
        this.validationErr = "User Name is required.";
      }
      else if (this._email?.errors && this._email?.dirty)
      {
        this.validationErr = "Email missing or invalid";
      }
      else if (this._confirmPassword?.dirty && (this._confirmPassword?.errors || this._confirmPassword.value != this._password?.value))
      {
        this.validationErr = "Passwords do not match";
      }
      else {
        this.validationErr = "";
      }
  });
  }

  public register(): void {
    if (!this._password?.errors && !this._userName?.errors && !this._confirmPassword?.errors && !this._email?.errors && this._confirmPassword != this._password)
    {
      this.authService.signUp(this.signUpForm.value).subscribe({
      next: res => {this.authService.setToken(res.token); console.log(res.token);},
      error: err => {this.validationErr = err.error; console.log(err.error)}
    });
    }
    else {
      this.validationErr = "Please Enter some details.";
    }
  }
}
