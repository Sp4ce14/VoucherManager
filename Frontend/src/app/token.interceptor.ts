import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, EMPTY, throwError } from 'rxjs';
import { catchError, filter, take, switchMap } from 'rxjs/operators';
import { AuthService } from './services/auth-service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    // Skip auth endpoints to prevent loops
    if (request.url.includes('/Auth/Login') || request.url.includes('/Auth/Signup') || request.url.includes('/Auth/Refresh')) {
      return next.handle(request);
    }

    const authReq = this.addToken(request, this.authService.getToken());

    return next.handle(authReq).pipe(
      catchError(err => {
        if (err instanceof HttpErrorResponse && err.status === 401) {
          return this.handle401(authReq, next);
        }
        return throwError(() => err);
      })
    );
  }

  private addToken(request: HttpRequest<any>, token: string) {
    return request.clone({ headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) });
  }

  private handle401(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      return this.authService.refreshReq().pipe(
        switchMap(res => {
          this.authService.setToken(res.token);
          return next.handle(this.addToken(request, res.token));
        }),
        catchError(err => {
          this.authService.logOut();
          return EMPTY; // stop the chain
        })
      );
    } 
  }

  
