import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, Observable, switchMap, tap, throwError } from 'rxjs';
import { AuthService } from './vouchers/services/auth-service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const newReq: any = request.clone({ headers: new HttpHeaders({ "Authorization": `Bearer ${this.authService.getToken()}` }) })
    console.log(newReq);
    return next.handle(newReq).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status == 401)
        {
          return this.authService.refreshReq().pipe(
            switchMap(res => {
              this.authService.setToken(res.token);
              const refreshReq: any = request.clone({ headers: new HttpHeaders({ "Authorization": `Bearer ${this.authService.getToken()}` }) })
              return next.handle(refreshReq);
            }),
            catchError((innerErr: HttpErrorResponse) => {
              this.authService.logOut();
              alert("You have been logged out, Please login again");
              return throwError(() => {innerErr});
            })
          )
        }
        return throwError(() => err)
      })
    );
  }
}
