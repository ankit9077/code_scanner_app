import { HttpService } from './../services/http/http.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private httpService: HttpService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree | any {
      if (localStorage.getItem(this.httpService.AUTHORIZATION_KEY)) {
        return true;
      } else {
        this.router.navigate(['login']);
      }
  }

}
