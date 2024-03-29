import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

// Constants
import { ROUTES } from './constants';

// Models
import { BasicInfo } from './models';

// Services
import { BasicInfoService, DatabaseService, MenuService } from './services';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  public privacyPolicyURL = environment.privacyPolicyURL;
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
  show = false;

  constructor(
    private basicInfoService: BasicInfoService,
    private databaseService: DatabaseService,
    public menuService: MenuService,
    private platform: Platform,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log('Component', new Date().toLocaleTimeString());
    this.menuService.setDisableMenu(true);

    this.platform
      .ready()
      .then(() => {
        if (this.platform.is('cordova')) {
          return this.databaseService.prepareDatabase();
        }

        return Promise.resolve();
      })
      .then(() => this.basicInfoService.loadBasicInfo());

    this.subscriptions.add(
      this.basicInfoService.basicInfo
        .pipe(filter((basicInfo: BasicInfo) => basicInfo !== null))
        .subscribe((basicInfo) => {
          this.show = true;
          this.userName = basicInfo.username;
        })
    );
  }

  ngOnDestroy(): void {
    this.databaseService.storage.close().then(() => {
      this.subscriptions.unsubscribe();
    });
  }
}
