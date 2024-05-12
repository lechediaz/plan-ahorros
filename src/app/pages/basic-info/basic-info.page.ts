import { filter } from 'rxjs/operators';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { ROUTES } from '../../constants';
import { BasicInfoService, MenuService } from './../../services';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-basic-info',
  templateUrl: './basic-info.page.html',
  styleUrls: ['./basic-info.page.scss'],
})
export class BasicInfoPage implements OnInit, OnDestroy {
  constructor(
    private menuService: MenuService,
    private basicInfoService: BasicInfoService,
    private router: Router,
    private toastController: ToastController
  ) {}

  basicInfoForm = new FormGroup({
    username: new FormControl('', [
      Validators.required,
      Validators.minLength(1),
      Validators.pattern('(\\w {0,1})+'),
    ]),
    income: new FormControl('', [Validators.required, Validators.min(0)]),
  });

  privacyPolicyURL = environment.privacyPolicyURL;
  subscriptions = new Subscription();

  ngOnInit() {
    this.menuService.setDisableMenu(true);

    this.subscriptions.add(
      this.basicInfoService.basicInfo
        .pipe(filter((basicInfo) => basicInfo !== null))
        .subscribe((basicInfo) => {
          const formValues = {
            income: String(basicInfo.income),
            username: basicInfo.username,
          };

          this.basicInfoForm.setValue(formValues);
        })
    );
  }

  ngOnDestroy(): void {
    this.menuService.setDisableMenu(false);
    this.subscriptions.unsubscribe();
  }

  async onSubmit() {
    const basicInfoFormValue = this.basicInfoForm.value;

    await this.basicInfoService.saveBasicInfo(basicInfoFormValue);

    this.router.navigateByUrl(`/${ROUTES.HOME}`, {
      replaceUrl: true,
    });

    const toast = await this.toastController.create({
      message: 'Información básica guardada',
      duration: 2000,
    });

    toast.present();
  }
}
