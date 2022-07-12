import { Router } from '@angular/router';
import { HttpService } from './../http/http.service';
import { Injectable } from '@angular/core';
import { User } from 'src/assets/models';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  user: User;
  private baseUrl = '/user';

  constructor(private httpService: HttpService, private router: Router) { }

  public getUser(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.httpService.get(this.baseUrl).subscribe((response: any) => {
        this.user = response.result;
        resolve(response.result);
      }, (err) => {
        reject(err.message);
        localStorage.clear();
        this.router.navigate(['login']);
      });
    });
  }

  public setVehicleToUser(vehicleId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.httpService.post(this.baseUrl+'/set-vehicle', {vehicleId}).subscribe((response: any) => {
        this.user = response.result;
        resolve(response.result);
      }, (err) => {
        reject(err.message);
      });
    });
  }
}
