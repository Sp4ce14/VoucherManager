import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChild, CanLoad, Route, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { map, Observable } from 'rxjs';
import { AuthService } from './services/auth-service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivateChild, CanLoad {
  constructor(private auth: AuthService) {}
  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (childRoute.data['role'] === "admin") {
      return !this.auth.hasRole('admin');
    }
    return this.auth.isLoggedIn();
  }
  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (route.data?.['showingAuth'] === true)
    {
      return !this.auth.isLoggedIn();
    }
    return this.auth.isLoggedIn();
  }
}
