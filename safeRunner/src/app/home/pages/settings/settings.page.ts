import { AuthenticationService } from './../../../services/authentication/authentication.service';
import { AlertService } from './../../../services/alert/alert.service';
import { User } from 'src/assets/models';
import { UserService } from './../../../services/user/user.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  passwords = {
    oldPassword:{value:'', show: false},
    newPassword:{value:'', show: false},
    confirmPassword:{value:'', show: false}
  };
  showPasswordChange: boolean;
  isLoading: boolean;
  get user(): User{
  return this.userService.user;
}
  // eslint-disable-next-line @typescript-eslint/member-ordering
  constructor(
    private userService: UserService,
    private alertService: AlertService,
    private authService: AuthenticationService
    ) {}

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.passwords= {
      oldPassword:{value:'', show: false},
      newPassword:{value:'', show: false},
      confirmPassword:{value:'', show: false}
    };
    this.showPasswordChange = false;
  }

  openChangePasswordSettings(){
    this.passwords= {
      oldPassword:{value:'', show: false},
      newPassword:{value:'', show: false},
      confirmPassword:{value:'', show: false}
    };
    this.showPasswordChange = true;
  }

  checkIfPasswordsValid(){
    return !this.passwords.oldPassword.value.trim().length
    || !this.passwords.newPassword.value.trim().length
    || !this.passwords.confirmPassword.value.trim().length;
  }

  changePassword(){
    if(this.passwords.newPassword.value!==this.passwords.confirmPassword.value){
      this.alertService.generateAlert({
        header: 'Passwords did not match',
        message: 'Try again!',
        buttons:[{text:'Ok', role: 'cancel'}]
      });
    }else{
      this.isLoading = false;
      this.authService.changePassword(this.passwords).then((res)=>{
        this.alertService.generateAlert({
          header: 'Password Changed Successfully',
          message: '',
          buttons:[{text:'Ok', role: 'cancel'}]
        });
        this.passwords= {
          oldPassword:{value:'', show: false},
          newPassword:{value:'', show: false},
          confirmPassword:{value:'', show: false}
        };
        this.showPasswordChange = false;
        this.isLoading = false;
      },(err)=>{
        this.alertService.generateAlert({
          header: err.message,
          message: '',
          buttons:[{text:'Ok', role: 'cancel'}]
        });
        this.isLoading = false;
      });
    }
  }
}
