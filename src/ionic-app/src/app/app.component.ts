import { Subscription } from 'rxjs';
import { MenuService } from './services/menu.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Platform } from '@ionic/angular';

import { ROUTES } from 'src/app/constants';
import { BasicInfoService } from './services';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  public appPages = [
    { title: 'Inicio', url: `/${ROUTES.HOME}`, icon: 'home' },
    { title: 'Mis planes', url: `/${ROUTES.MY_PLANS}`, icon: 'paper-plane' },
    {
      title: 'Información básica',
      url: `/${ROUTES.BASIC_INFO}`,
      icon: 'build',
    },
  ];

  subscriptions = new Subscription();

  nombreUsuario = '';

  constructor(
    private platform: Platform,
    private basicInfoService: BasicInfoService,
    public menuService: MenuService
  ) {
    this.platform
      .ready()
      .then(() => this.basicInfoService.loadBasicInfo())
      .then(() => {
        console.log('Información cargada');
      });
  }

  ngOnInit(): void {
    this.subscriptions.add(
      this.basicInfoService.basicInfo
        .pipe(filter((basicInfo) => basicInfo !== null))
        .subscribe((basicInfo) => (this.nombreUsuario = basicInfo.username))
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
