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
export class SauthGuard implements CanActivate {
  constructor(private router: Router, private auth: AuthService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const isAdminLoggedIn = this.auth.checkSuperAdminLoggedIn();

    if (!isAdminLoggedIn) {
      this.router.navigate(['/login/admin']);
    }

    return isAdminLoggedIn;
  }
}
