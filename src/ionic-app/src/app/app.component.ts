import { MenuService } from './services/menu.service';
import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { BasicInfoService } from './services';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Inicio', url: '/home', icon: 'home' },
    { title: 'Mis planes', url: '/my-plans', icon: 'paper-plane' },
  ];

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
}
