import { AuthenticationService } from './../services/authentication/authentication.service';
import { AlertService } from './../services/alert/alert.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {
  passwords = {newPassword:'', confirmPassword:''};
  token = '';
  constructor(private route: ActivatedRoute,
    private alertService: AlertService,
    private authService: AuthenticationService,
    private router: Router) { }

  ngOnInit() {
    this.route.queryParams.subscribe((response) => {
      if (response && response.t) {
        this.token = response.t;
      }
    });
  }

  reset(){
    if(this.passwords.confirmPassword.length<8 || this.passwords.confirmPassword.length<8){
      this.alertService.generateAlert({
        header: 'Passwords problem',
        message: 'password should be minimum of 8 characters',
        buttons:[{text:'Ok', role: 'cancel'}]
      });
    }
    else if(this.passwords.newPassword!==this.passwords.confirmPassword){
      this.alertService.generateAlert({
        header: 'Passwords did not match',
        message: 'Try again!',
        buttons:[{text:'Ok', role: 'cancel'}]
      });
    }else{
      this.authService.resetPassword(this.token, this.passwords.newPassword).then((response) => {
        this.alertService.generateAlert({
          header: response.message,
          message: '',
          buttons:[{text:'Ok', role: 'cancel'}]
        });
        this.router.navigate(['login']);
      }, (err) => {
        this.alertService.generateAlert({
          header: err.message,
          message: 'Try again!',
          buttons:[{text:'Ok', role: 'cancel'}]
        });
      });
    }
  }

}
