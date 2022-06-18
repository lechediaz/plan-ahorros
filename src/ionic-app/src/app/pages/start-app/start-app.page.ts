import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';

// Constants
import { ROUTES } from '../../constants';

// Services
import { BasicInfoService, DatabaseService } from '../../services';

@Component({
  selector: 'app-start-app',
  templateUrl: './start-app.page.html',
  styleUrls: ['./start-app.page.scss'],
})
export class StartAppPage implements OnInit {
  constructor(
    private platform: Platform,
    private router: Router,
    private basicInfoService: BasicInfoService,
    private databaseService: DatabaseService
  ) {}

  ngOnInit() {
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
        console.log('App started successfully!.');
        this.router.navigateByUrl(ROUTES.HOME, { replaceUrl: true });
      });
  }
}
