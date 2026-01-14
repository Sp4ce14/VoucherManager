import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChild, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { map, Observable, take } from 'rxjs';
import { AuthService } from './services/auth-service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivateChild, CanLoad {
  constructor(private auth: AuthService, private router: Router) {
  }
  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (childRoute.data['role'] === "admin") {
      return this.auth.roles$.pipe(
        take(1),
        map(roles => !roles.includes("admin") ? true : this.router.parseUrl('/login'))
      );
    }

    return this.auth.isLoggedin$.pipe(
      take(1),
      map(isLogged => isLogged ? true : this.router.parseUrl('/login'))
    );
  }
  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (route.data?.['isAuth'] === true) {
      if (!this.auth.checkLogin()) {
        return true;
      }
      return this.router.parseUrl('/');
    }
    if (this.auth.checkLogin()) {
      return true;
    }
    return this.router.parseUrl('/login');
  }
}
