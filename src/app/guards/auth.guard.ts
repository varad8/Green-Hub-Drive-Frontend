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
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private auth: AuthService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const isEvAdminLoggedIn = this.auth.checkEvAdminLoggedIn();

    if (!isEvAdminLoggedIn) {
      this.router.navigate(['/login/evadmin']);
    }

    return isEvAdminLoggedIn;
  }
}
