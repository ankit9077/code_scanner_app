import { AlertService } from './../../../services/alert/alert.service';
import { UserService } from './../../../services/user/user.service';
import { Component, OnInit } from '@angular/core';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { User } from 'src/assets/models';
@Component({
  selector: 'app-scanner',
  templateUrl: './scanner.page.html',
  styleUrls: ['./scanner.page.scss'],
})
export class ScannerPage implements OnInit {
  isScanning = false;
  data ='';
  constructor(
    private userService: UserService,
    private alertService: AlertService) { }

  get user(): User{
    return this.userService.user;
  }

  ngOnInit() {
  }

  async startScanner(): Promise<void>{
    const hasPermission = await this.checkPermissions();
    if(hasPermission){
      this.isScanning = true;
      const results = await BarcodeScanner.startScan();
      if(results.hasContent){
        this.data = results.content;
      }
      this.stopScan();
    }
  }

  stopScan() {
    this.isScanning = false;
    BarcodeScanner.showBackground();
    BarcodeScanner.stopScan();
  }

  async checkPermissions() {
    return new Promise(async (resolve,reject)=>{
      const status = await BarcodeScanner.checkPermission({force: true});
      if(status.granted){
        resolve(true);
      }else if(status.denied){
        this.alertService.generateAlert({
          header: 'No permission',
          message: 'Please allow camera access in your settings',
          buttons:[{text:'Ok', role: 'cancel'}]
        });
      resolve(false);
      }else{
        resolve(false);
      }
    });
  }

}
