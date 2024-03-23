import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from '../shared/auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserAuthGuard implements CanActivate {
  constructor(private router: Router, private auth: AuthService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const isUserLoggedIn = this.auth.checkUserLoggedIn();

    if (!isUserLoggedIn) {
      this.router.navigate(['/login/user']);
    }

    return isUserLoggedIn;
  }
}
