import { Injectable } from '@angular/core';
import { LoginModel } from '../models/LoginModel';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }
  public login(loginDetails: LoginModel): Observable<HttpResponse<any>> {
    return this.http.post("https://localhost:7175/api/Auth/Login", loginDetails, {observe: "response"});
  } 
}
