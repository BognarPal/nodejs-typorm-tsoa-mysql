import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthenticationService } from './services';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(private router: Router, private authHttpService: AuthenticationService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> | boolean {
      if (!route.routeConfig || !route.routeConfig.path) {
        return true;
      }
      const routepath = route.routeConfig.path.toLowerCase();
        if (!environment.production) {
            console.log('debug info (canActivate)', routepath);
        }
        if (routepath === 'users') {
            return this.authHttpService.hasRole('Admin');
        } else {
            return true;
        }
    }
  
}
