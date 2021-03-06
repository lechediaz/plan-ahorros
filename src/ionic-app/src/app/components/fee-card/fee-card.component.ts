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
  @Input() isSkeleton: boolean = false;
  @Output() onQuotaSaved: EventEmitter<FeeCardInfo> =
    new EventEmitter<FeeCardInfo>();

  @Output() onCardClick: EventEmitter<FeeCardInfo> =
    new EventEmitter<FeeCardInfo>();

  /** Indicates if the save button can be shown. */
  showSaveButton = false;

  ngOnInit() {
    if (this.feeCardInfo !== null) {
      this.showSaveButton =
        new Date().getTime() -
          new Date(this.feeCardInfo.saving_date).getTime() >=
        0;
    }
  }

  /**
   * Handles the click on card event.
   */
  onQuotaSavedClickHandler() {
    this.onQuotaSaved.next(this.feeCardInfo);
  }

  /**
   * Handles the click on card event.
   */
  onCardClickHandler() {
    this.onCardClick.next(this.feeCardInfo);
  }
}
