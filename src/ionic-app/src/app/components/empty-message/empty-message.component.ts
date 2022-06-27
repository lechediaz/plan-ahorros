import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-empty-message',
  templateUrl: './empty-message.component.html',
  styleUrls: ['./empty-message.component.scss'],
})
export class EmptyMessageComponent implements OnInit {
  constructor() {}

  @Input() message: string = 'Aquí no hay nada que mostrar.';

  ngOnInit() {}
}
