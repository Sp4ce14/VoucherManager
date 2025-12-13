import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/vouchers/services/auth-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public loginForm: FormGroup;
  public _userName: AbstractControl | null; 
  public _password: AbstractControl | null;
  public validationErr: string;
  constructor(private _formbuilder: FormBuilder, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.loginForm = this._formbuilder.group(
      {
        userName: ['', [Validators.required]],
        password: ['', [Validators.required]]
      }
    );
    this._userName = this.loginForm.get("userName");
    this._password = this.loginForm.get("password");
    this.loginForm.valueChanges.subscribe(x => {
      if (this._password?.errors && this._userName?.errors && (this._userName?.dirty || this._password?.dirty))
      {
        this.validationErr = "Both fields are required.";
      }
      else if (this._password?.errors && this._password?.dirty)
      {
        this.validationErr = "Password is required.";
      }
      else if (this._userName?.errors && this._userName?.dirty)
      {
        this.validationErr = "User Name is required.";
      }
      else {
        this.validationErr = "";
      }
  });
  }

  public login(): void {
    if (!this._userName?.errors && !this._password?.errors)
    {
      this.authService.login(this.loginForm.value).subscribe({
      next: res => {this.authService.setToken(res.token); console.log(res); this.router.navigate([''])},
      error: err => {this.validationErr = err.error}
    });
    }
    else {
      this.validationErr = "Please Enter some details.";
    }
  }
}
