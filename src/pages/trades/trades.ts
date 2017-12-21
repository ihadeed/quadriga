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

  _book: Book = 'btc_cad';

  set book(val: Book) {
    console.log('Setting book val');
    this._book = val;
    this.setActiveBook(val);
  }

  get book(): Book { return this._book; }

  get trades(): Observable<ITrades> {
    switch(this.book) {
      case 'btc_cad': return this.store.select('reducer','trades_btc_cad');
      case 'ltc_cad': return this.store.select('reducer','trades_ltc_cad');
      case 'eth_cad': return this.store.select('reducer','trades_eth_cad');
    }
  }

  get currency(): string {
    // console.log('GEtting currency, ', this.book, this.book.replace('_cad', '').toUpperCase());
    return this.book.replace('_cad', '').toUpperCase();
  }

  constructor(public store: Store<any>, private quad: QuadProvider) {}

  ngOnInit() {
    this.setActiveBook(this.book);
  }

  setActiveBook(book?: string) {
    if (this.quad && this.quad.shouldFetchTrades) {
      ['ltc_cad', 'btc_cad', 'eth_cad'].forEach(b => {
        this.quad.shouldFetchTrades[b] = b === book;
      });
    }
  }

  ionViewWillEnter() {
    this.setActiveBook(this.book);
    this.quad.shouldFetchPrices = false;
  }

  ionViewWillLeave() {
    this.quad.shouldFetchPrices = true;
    this.quad.shouldFetchTrades = {
      btc_cad: false,
      eth_cad: false,
      ltc_cad: false
    };
  }

  trackByFn(index: number, item: number[]) {
    if (!item) return index;
    return item[0] + '-' + item[1];
  }

}
