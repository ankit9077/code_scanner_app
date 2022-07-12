import { Component, OnInit } from '@angular/core';

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
  constructor() { }

  ngOnInit() {}

}
