import { ScannedCode } from './../../../../assets/models';
import { AlertController } from '@ionic/angular';
import { AlertService } from './../../../services/alert/alert.service';
import { UserService } from './../../../services/user/user.service';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { User } from 'src/assets/models';
import * as moment from 'moment';
@Component({
  selector: 'app-scanner',
  templateUrl: './scanner.page.html',
  styleUrls: ['./scanner.page.scss'],
})
export class ScannerPage implements OnInit, OnDestroy {
  isScanning = false;
  constructor(
    private alertController: AlertController,
    private userService: UserService,
    private alertService: AlertService) { }

  get user(): User{
    return this.userService.user;
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    if(this.isScanning){
      this.stopScan();
    }
  }

  async startScanner(): Promise<void>{
    const hasPermission = await this.checkPermissions();
    if(hasPermission){
      this.isScanning = true;
      const results = await BarcodeScanner.startScan();
      if(results.hasContent) {
        const data = JSON.parse(results.content);
        if(data.p && data.v) {
          if(!this.user.vehicleGuid.length) {
            this.userService.setVehicleToUser(data.v).then((response)=>{
              this.setScannedPartStatus(data.p);
            },(err)=>{
              this.alertService.generateAlert({
                header: 'Something went wrong!',
                message: err,
                buttons:[{text:'Ok', role: 'cancel'}]
              });
            });
          }else if(this.user.vehicleGuid!==data.v){
            this.alertService.generateAlert({
              header: '',
              message: 'Cancel previous progress before changing Vehicle',
              buttons:[{text:'Ok', role: 'cancel'}]
            });
          }else{
            this.setScannedPartStatus(data.p);
          }
        } else {
          this.alertService.generateAlert({
            header: '',
            message: 'Scan a valid QR Code!',
            buttons:[{text:'Ok', role: 'cancel'}]
          });
        }
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

  setScannedPartStatus(partId: string) {
    const foundAt = this.user.scannedCodes.findIndex(v=> v.codeInfo===partId);
    if(foundAt!==-1){
      this.checkForConfirmation(foundAt);
    }else{
      this.alertService.generateAlert({
        header: '',
        message: 'Please scan a valid part code',
        buttons:[{text:'Ok', role: 'cancel'}]
      });
    }
  }

  async checkForConfirmation(index: number) {
    const alert = await this.alertController.create({
      header: 'Confirm Status',
      message: `is ${this.user.scannedCodes[index].title} working?`,
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            this.getIssueDescription(index);
          }
        },
        {
          text: 'Yes',
          handler: () => {
            const scannedCode = JSON.parse(JSON.stringify(this.user.scannedCodes[index]));
            scannedCode.checked = true;
            scannedCode.issueDesc = '';
            scannedCode.hasIssue = false;
            scannedCode.dateTime = new Date();
            this.saveScannedCode(scannedCode);
          }
        }
      ]
    });
    await alert.present();
  }

  async getIssueDescription(index: number){
    const alert = await this.alertController.create({
      header: 'Description',
      inputs: [
        {
          name: 'description',
          placeholder: 'Enter Issue description'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'save',
          handler: data => {
            const scannedCode = JSON.parse(JSON.stringify(this.user.scannedCodes[index]));
            scannedCode.checked = true;
            scannedCode.issueDesc = data.description;
            scannedCode.hasIssue = true;
            scannedCode.dateTime = new Date();
            this.saveScannedCode(scannedCode);
          }
        }
      ]
    });
    await alert.present();
  }

  saveScannedCode(code: ScannedCode){
    this.userService.saveScannedCodeToUser(code).then(()=>{
    },(err)=>{
      this.alertService.generateAlert({
        header: 'Something went wrong!',
        message: '',
        buttons:[{text:'Ok', role: 'cancel'}]
      });
    });
  }

  getDate(date: Date){
    if(date){
      return moment(new Date(date)).format('lll');
    }else{
      return 'TBD';
    }
  }

  checkIfSubmitAllowed(){
    if(this.user && this.user.vehicleGuid.length && this.user.scannedCodes.length){
      const foundAt=this.user.scannedCodes.findIndex(x=>x.checked===false);
      return foundAt===-1;
    }else{
      return false;
    }
  }


  initiateSubmitReport(){
    if(this.checkIfSubmitAllowed()){
      if(this.user.isMultiUserVehicle){
        this.getVehiclePlateNumberAndSubmit();
      }else{
        this.submitReport();
      }
    }
  }

  submitReport(vehiclePlateNumber = ''){
    this.userService.submitReport(vehiclePlateNumber).then((response)=>{
      this.alertService.generateAlert({
        header: 'Successfully Submitted report',
        message: '',
        buttons:[{text:'Ok', role: 'cancel'}]
      });
    },err=>{
      this.alertService.generateAlert({
        header: 'Something went wrong!',
        message: err,
        buttons:[{text:'Ok', role: 'cancel'}]
      });
    });
  }

  async getVehiclePlateNumberAndSubmit(){
    const alert = await this.alertController.create({
      header: 'Truck Plate Number',
      inputs: [
        {
          name: 'plateNumber',
          placeholder: 'Enter Plate Number'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Submit',
          handler: data => {
            if(data.plateNumber && data.plateNumber.trim().length >= 5){
              this.submitReport(data.plateNumber.trim());
            }else{
              this.alertService.generateAlert({
                header: 'Incorrect plate Number',
                message: 'Enter correct plate number',
                buttons:[{text:'Ok', role: 'cancel'}]
              });
            }
          }
        }
      ]
    });
    await alert.present();
  }

  async cancelScanner(){

    const alert = await this.alertController.create({
      header: '',
      message: `Are you sure you want to cancel your progress`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Confirm',
          handler: () => {
            this.userService.cancelScanner().then((response)=>{
            },(err)=>{
            });
          }
        }
      ]
    });
    await alert.present();
  }

}
