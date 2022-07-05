import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  credentials: {email: string; password: string } = {email: '', password: ''};
  constructor() { }

  ngOnInit() {
  }

}
