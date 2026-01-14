import { Injectable } from '@angular/core';
import { LoginModel } from '../vouchers/models/LoginModel';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { SignupModel } from '../vouchers/models/SignupModel';
import { jwtDecode } from 'jwt-decode';
import { jwtModel } from '../vouchers/models/jwtModel';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = "https://localhost:7175/api/";
  constructor(private http: HttpClient, public router: Router) {
    this.loadRoles();
  }
  private roleSubject = new BehaviorSubject<string[]>([]);
  public roles$ = this.roleSubject.asObservable();

  public loggedInSubject = new BehaviorSubject<boolean>(false);
  public isLoggedin$ = this.loggedInSubject.asObservable();

  public login(loginDetails: LoginModel): Observable<any> {
    return this.http.post(this.baseUrl + "Auth/Login", loginDetails, { withCredentials: true });
  }

  public signUp(signUpDetails: SignupModel): Observable<any> {
    return this.http.post(this.baseUrl + "Auth/SignUp", signUpDetails, { withCredentials: true });
  }
  public checkLogin(): boolean{
    console.log(this.loggedInSubject.value);
    return this.loggedInSubject.value;
  }
  public setToken(token: string): void {
    localStorage.setItem("token", token);
    this.loggedInSubject.next(true);
    this.loadRoles();
  }
  public logOut(): void {
    this.http.get(this.baseUrl + "Auth/Logout", { withCredentials: true }).subscribe(x => {
      localStorage.removeItem("token");
      this.loggedInSubject.next(false)
      this.loadRoles();
      this.router.navigate(['/login']).then(() => {
        setTimeout(() => {
          alert("You have been logged out, Please Login again.");
        }, 0);
      }
      );
    }
    );
  }

  private loadRoles(): void {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode<jwtModel>(token);
        this.roleSubject.next(decoded.role);
        this.loggedInSubject.next(true);  // Token exists, user is logged in
      } catch (e) {
        console.error('Failed to decode token', e);
        this.roleSubject.next([]);
        this.logOut();
      }
    }
    else {
      this.roleSubject.next([]);
      this.loggedInSubject.next(false);  // No token, user is logged out
    }
  }

  public refreshReq(): Observable<any> {
    return this.http.post(this.baseUrl + "Auth/Refresh", { token: this.getToken() }, { withCredentials: true })
  }

  public getToken(): string {
    var token = localStorage.getItem('token');
    return token != null ? token : '';
  }
}
