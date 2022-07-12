import { emailRegex } from './../../assets/constants';
import { Router } from '@angular/router';
import { AuthenticationService } from './../services/authentication/authentication.service';
import { Component, OnInit } from '@angular/core';
import { User } from 'src/assets/models';
import { AlertController } from '@ionic/angular';

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
    private alertController: AlertController) {}

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
        this.generateAlert(err.error.message);
      });
    }else{
      if(!user.email.match(emailRegex)){
        this.generateAlert('Enter a valid Email');
      }else{
        this.generateAlert('values cannot be empty');
      }
    }
  }

  async generateAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message,
      buttons:[{text:'Ok', role: 'cancel'}]
    });
    await alert.present();
  }

}
