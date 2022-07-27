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

  public changePassword(passwords: any): Promise<any> {
    const tempPasswords = {
      oldPassword:btoa(passwords.oldPassword.value.trim()),
      newPassword:btoa(passwords.newPassword.value.trim()),
      confirmPassword:btoa(passwords.confirmPassword.value.trim())
    };
    return new Promise((resolve, reject) => {
      this.httpService.post(this.baseUrl + '/change-password', tempPasswords).subscribe((response: any) => {
        resolve(response);
      }, (err: any) => {
        reject(err.error);
      });
    });
  }

  public forgotPassword(email: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.httpService.post(this.baseUrl + '/forgot-password', { email }).subscribe((response) => {
        resolve(response);
      }, (err: any) => {
        reject(err.error);
      });
    });
  }

  public resetPassword(token: string, password: string): Promise<any> {
    password = window.btoa(password);
    return new Promise((resolve, reject) => {
      this.httpService.post(this.baseUrl + '/reset-password', { token, password }).subscribe((response) => {
        resolve(response);
      }, (err: any) => {
        reject(err.error);
      });
    });
  }

  public logout(): void {
    localStorage.clear();
    this.router.navigate(['login']);
  }
}
