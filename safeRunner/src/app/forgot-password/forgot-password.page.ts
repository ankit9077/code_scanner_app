import { Router } from '@angular/router';
import { AuthenticationService } from './../services/authentication/authentication.service';
import { AlertService } from './../services/alert/alert.service';
import { Component, OnInit } from '@angular/core';
import { emailRegex } from 'src/assets/constants';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {
  email: string;
  isloading = false;
  constructor(
    private alertService: AlertService,
    private authService: AuthenticationService,
    private router: Router) { }

  ngOnInit() {
  }

  forgotPassword(){
    if(!this.email.match(emailRegex)){
      this.alertService.generateAlert({
        header: 'Email issue',
        message: 'enter a valid Email address',
        buttons:[{text:'Ok', role: 'cancel'}]
      });
    }else{
      this.isloading = true;
      this.authService.forgotPassword(this.email.trim()).then((response) => {
        this.alertService.generateAlert({
          header: 'Success',
          message: 'Check your email for the reset link',
          buttons:[{text:'Ok', role: 'cancel'}]
        });
        this.router.navigate(['login']);
      }, (err) => {
        this.alertService.generateAlert({
          header: 'Something went wrong!',
          message: '',
          buttons:[{text:'Ok', role: 'cancel'}]
        });
      });
    }
  }

}
