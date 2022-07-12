import { Router } from '@angular/router';
import { AuthenticationService } from './../services/authentication/authentication.service';
import { Component, OnInit } from '@angular/core';
import { User } from 'src/assets/models';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  isLoading: boolean;
  errorMessage = '';
  credentials: {email: string; password: string } = {email: '', password: ''};
  constructor(private authService: AuthenticationService, private router: Router) {}

  ngOnInit() {
  }

  login() {
    const user = new User();
    user.email = this.credentials.email.trim();
    user.password = this.credentials.password.trim();
    this.errorMessage = 'starting';
    this.authService.authenticateUser(user).then((response) => {
      this.errorMessage = 'success';
      this.router.navigate(['home']);
    }, (err) => {
      this.errorMessage = 'Failed';
      this.errorMessage = err.error.message;
    });
  }

}
