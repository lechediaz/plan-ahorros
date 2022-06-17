import { Subscription } from 'rxjs';
import { MenuService } from './services/menu.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Platform } from '@ionic/angular';

import { ROUTES } from 'src/app/constants';
import { BasicInfoService, DatabaseService } from './services';
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

  subscriptions: Subscription = new Subscription();

  userName: string = '';

  constructor(
    private platform: Platform,
    private basicInfoService: BasicInfoService,
    private databaseService: DatabaseService,
    public menuService: MenuService
  ) {
    this.platform
      .ready()
      .then(() => this.databaseService.prepareDatabase())
      .then(() => this.basicInfoService.loadBasicInfo())
      .then(() => {
        console.log('App started successfully!.');
      });
  }

  ngOnInit(): void {
    this.subscriptions.add(
      this.basicInfoService.basicInfo
        .pipe(filter((basicInfo) => basicInfo !== null))
        .subscribe((basicInfo) => (this.userName = basicInfo.username))
    );
  }

  ngOnDestroy(): void {
    this.databaseService.storage.close().then(() => {
      this.subscriptions.unsubscribe();
    });
  }
}
