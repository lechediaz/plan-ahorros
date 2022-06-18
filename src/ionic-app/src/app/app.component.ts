import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

// Constants
import { ROUTES } from './constants';

// Models
import { BasicInfo } from './models';

// Services
import { BasicInfoService, DatabaseService, MenuService } from './services';

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
    private basicInfoService: BasicInfoService,
    private databaseService: DatabaseService,
    public menuService: MenuService
  ) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.basicInfoService.basicInfo
        .pipe(filter((basicInfo: BasicInfo) => basicInfo !== null))
        .subscribe((basicInfo) => (this.userName = basicInfo.username))
    );
  }

  ngOnDestroy(): void {
    this.databaseService.storage.close().then(() => {
      this.subscriptions.unsubscribe();
    });
  }
}
