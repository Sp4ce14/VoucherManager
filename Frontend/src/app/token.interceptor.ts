import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders,
  HttpResponse
} from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthService } from './vouchers/services/auth-service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const newReq: any = request.clone({ headers: new HttpHeaders({ "Authorization": `Bearer ${this.authService.getToken()}` }) })
    console.log(newReq);
    return next.handle(newReq).pipe(
      tap({
        next: (event) => {
          if (event instanceof HttpResponse) {
            if (event.status == 401) {
              this.authService.refreshReq().subscribe({
                next: res => {
                  console.log(res);
                  this.authService.setToken(res.token);
                  const afterRefReq: any = request.clone({ headers: new HttpHeaders({ "Authorization": `Bearer ${this.authService.getToken()}` }) })
                  return next.handle(afterRefReq);
                },
                error: err => {
                  console.log(err);
                  this.authService.logOut();
                }
              });;
            }
          }
        }
      })
    );
  }
}
