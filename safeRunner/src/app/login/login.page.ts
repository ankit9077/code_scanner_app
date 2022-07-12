import { AlertService } from './../services/alert/alert.service';
import { emailRegex } from './../../assets/constants';
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
  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private alertService: AlertService) {}

  ngOnInit() {
  }

  login() {
    const user = new User();
    user.email = this.credentials.email.trim();
    user.password = this.credentials.password.trim();
    if(user.email.match(emailRegex) && user.email.length && user.password.length){
      this.authService.authenticateUser(user).then((response) => {
        this.router.navigate(['home']);
      }, (err) => {
        this.alertService.generateAlert({
          header: 'Error',
          message: err.error.message,
          buttons:[{text:'Ok', role: 'cancel'}]
        });
      });
    }else{
      if(!user.email.match(emailRegex)){
        this.alertService.generateAlert({
            header: 'Error',
            message: 'Enter a valid Email',
            buttons:[{text:'Ok', role: 'cancel'}]
          });
      }else{
        this.alertService.generateAlert({
          header: 'Error',
          message: 'values cannot be empty',
          buttons:[{text:'Ok', role: 'cancel'}]
        });
      }
    }
  }

}
