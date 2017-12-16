import { Component, EventEmitter } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Book, ITrades, QuadProvider } from '../../providers/quad/quad';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { IAppState } from '../../app/reducer';

@IonicPage({
  name: 'trades'
})
@Component({
  selector: 'page-trades',
  templateUrl: 'trades.html',
})
export class TradesPage {

  book: Book = 'btc_cad';

  get trades(): Observable<ITrades> {
    switch(this.book) {
      case 'btc_cad': return this.store.select('reducer','trades_btc_cad');
      case 'ltc_cad': return this.store.select('reducer','trades_ltc_cad');
      case 'eth_cad': return this.store.select('reducer','trades_eth_cad');
    }
  }

  constructor(public store: Store<any>) {
  }

}
