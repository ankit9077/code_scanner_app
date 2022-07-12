import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(private alertController: AlertController) { }

  async generateAlert(alertObj: any) {
    const alert = await this.alertController.create(alertObj);
    await alert.present();
  }
}
