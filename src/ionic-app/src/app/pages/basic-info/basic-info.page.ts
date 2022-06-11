import { Component, OnInit } from '@angular/core';
import { MenuService } from './../../services';

@Component({
  selector: 'app-basic-info',
  templateUrl: './basic-info.page.html',
  styleUrls: ['./basic-info.page.scss'],
})
export class BasicInfoPage implements OnInit {
  constructor(private menuService: MenuService) {}

  ngOnInit() {
    this.menuService.setDisableMenu(true);
  }
}
