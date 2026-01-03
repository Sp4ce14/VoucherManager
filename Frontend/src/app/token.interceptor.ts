// Import Injectable decorator from Angular core
import { Injectable } from '@angular/core';
// Import HTTP related classes
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
// Import Observable and related from rxjs
import { Observable, BehaviorSubject, throwError } from 'rxjs';
// Import operators from rxjs
import { catchError, filter, take, switchMap } from 'rxjs/operators';
// Import AuthService
import { AuthService } from './services/auth-service';
// Make the class injectable
@Injectable()
// Implement HttpInterceptor
export class TokenInterceptor implements HttpInterceptor {
  // Flag to track if refresh is in progress
  private isRefreshing = false;
  // Subject to notify about token refresh
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  // Constructor to inject AuthService
  constructor(private authService: AuthService) { }
  // Implement intercept method
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Skip auth endpoints to prevent loops
    if (request.url.includes('/Auth/Login') || request.url.includes('/Auth/Signup') || request.url.includes('/Auth/Refresh')) {
      return next.handle(request);
    }
    // Add token to request
    const authReq = this.addToken(request, this.authService.getToken());
    // Handle the request and catch errors
    return next.handle(authReq).pipe(
      catchError(err => {
        // If 401 error, handle refresh
        if (err instanceof HttpErrorResponse && err.status === 401) {
          return this.handle401(authReq, next);
        }
        // Otherwise, throw error
        return throwError(() => err);
      })
    );
  }
  // Private method to add token to request
  private addToken(request: HttpRequest<any>, token: string) {
    // If no token, return original request
    if (!token) {
      return request;
    }
    // Clone request with Authorization header
    return request.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  }
  // Private method to handle 401 errors
  private handle401(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // If not refreshing, start refresh
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);
      // Call refresh
      return this.authService.refreshReq().pipe(
        switchMap((res: any) => {
          this.isRefreshing = false;
          this.authService.setToken(res.token);
          this.refreshTokenSubject.next(res.token);
          return next.handle(this.addToken(request, res.token));
        }),
        catchError((err) => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(null);
          this.authService.logOut();
          return throwError(() => err);
        })
      );
    } else {
      // If refreshing, wait for new token
      return this.refreshTokenSubject.pipe(
        filter(token => token != null),
        take(1),
        switchMap(token => {
          return next.handle(this.addToken(request, token));
        })
      );
    }
  } 
  }
// End of class

  
