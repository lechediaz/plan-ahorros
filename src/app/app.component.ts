import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ROUTES } from './constants';
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
    { title: 'Inicio', url: `/${ROUTES.HOME}`, icon: 'home-outline' },
    {
      title: 'Mis planes',
      url: `/${ROUTES.MY_PLANS}`,
      icon: 'paper-plane-outline',
    },
    {
      title: 'Información básica',
      url: `/${ROUTES.BASIC_INFO}`,
      icon: 'build-outline',
    },
  ];

  subscriptions: Subscription = new Subscription();

  userName: string = '';
  showApp = false;

  constructor(
    private basicInfoService: BasicInfoService,
    private databaseService: DatabaseService,
    public menuService: MenuService,
    private platform: Platform,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.menuService.setDisableMenu(true);

    this.platform
      .ready()
      .then(() => {
        if (this.platform.is('cordova')) {
          return this.databaseService.prepareDatabase();
        }

        return Promise.resolve();
      })
      .then(() => this.basicInfoService.loadBasicInfo())
      .then(() => {
        this.showApp = true;

        this.subscriptions.add(
          this.basicInfoService.basicInfo.subscribe((basicInfo) => {
            if (basicInfo !== null) {
              this.menuService.setDisableMenu();
              this.userName = basicInfo.username;
            } else {
              this.router.navigateByUrl(ROUTES.BASIC_INFO, {
                replaceUrl: true,
              });
            }
          })
        );
      });
  }

  ngOnDestroy(): void {
    this.databaseService.storage.close().then(() => {
      this.subscriptions.unsubscribe();
    });
  }
}
