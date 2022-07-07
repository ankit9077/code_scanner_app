import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/assets/models';
import { HttpService } from '../http/http.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  baseUrl = '/auth';
  constructor(private httpService: HttpService, private router: Router) { }

  public authenticateUser(user: User): Promise<any> {
    return new Promise((resolve, reject) => {
      const header = {
        'user-token': window.btoa(user.email + ':@#' + user.password),
      };
      this.httpService.post(this.baseUrl + '/login', {}, header).subscribe((response: any) => {
        localStorage.setItem(this.httpService.AUTHORIZATION_KEY, response.authToken);
        resolve(response);
      }, (err: any) => {
        reject(err);
      });
    });
  }

  public logout(): void {
    localStorage.clear();
    this.router.navigate(['login']);
  }
}
