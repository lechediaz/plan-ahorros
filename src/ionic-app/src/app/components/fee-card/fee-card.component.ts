import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FeeCardInfo } from '../../models';

@Component({
  selector: 'app-fee-card',
  templateUrl: './fee-card.component.html',
  styleUrls: ['./fee-card.component.scss'],
})
export class FeeCardComponent implements OnInit {
  constructor() {}

  @Input() feeCardInfo: FeeCardInfo = null;
  @Output() onQuotaSaved: EventEmitter<FeeCardInfo> =
    new EventEmitter<FeeCardInfo>();

  showSaveButton = false;

  ngOnInit() {
    this.showSaveButton =
      new Date().getTime() - new Date(this.feeCardInfo.saving_date).getTime() >=
      0;
  }

  onQuotaSavedClick() {
    this.onQuotaSaved.next(this.feeCardInfo);
  }
}
