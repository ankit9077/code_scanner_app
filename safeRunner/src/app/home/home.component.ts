import { UserService } from './../services/user/user.service';
import { AuthenticationService } from './../services/authentication/authentication.service';
import { Component, OnInit } from '@angular/core';
import { User } from 'src/assets/models';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public appPages = [
    { title: 'Home', url: 'scanner', icon: 'mail' },
    { title: 'Settings', url: 'settings', icon: 'paper-plane' }
  ];
  isloading: boolean;
  constructor(
    private authenticationService: AuthenticationService,
    private userService: UserService) { }

  get user(): User{
    return this.userService.user;
  }
  ngOnInit() {
    this.isloading = true;
    this.userService.getUser().then((response: User) => {
      this.isloading = false;
    }, (err) => {
      this.isloading = false;
    });
  }

  logout(){
    this.authenticationService.logout();
  }

}
