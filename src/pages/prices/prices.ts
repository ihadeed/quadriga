import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { ITicker, QuadProvider } from '../../providers/quad/quad';
import { Store } from '@ngrx/store';
import { IAppState } from '../../app/reducer';

@IonicPage({
  name: 'prices'
})
@Component({
  selector: 'page-prices',
  templateUrl: 'prices.html',
})
export class PricesPage {

  books: any = [
    {
      name: 'BTC',
      ticker: this.store.select('reducer','prices_btc_cad')
    },
    {
      name: 'LTC',
      ticker: this.store.select('reducer','prices_ltc_cad')
    },
    {
      name: 'ETH',
      ticker: this.store.select('reducer','prices_eth_cad')
    },
  ];

  constructor(private store: Store<any>) {
    this.restoreIndexes();
  }

  reorderItems(indexes) {
    let element = this.books[indexes.from];
    this.books.splice(indexes.from, 1);
    this.books.splice(indexes.to, 0, element);
    this.saveIndexes();
  }

  private saveIndexes() {
    let indexes = this.books.map(book => book.name);
    localStorage.setItem('PRICE_INDEXES', JSON.stringify(indexes));
  }

  private restoreIndexes() {
    try {
      let indexes = JSON.parse(localStorage.getItem('PRICE_INDEXES'));
      for (let i = 0; i < 2; i++) {
        const elIndex = this.books.findIndex(book => book.name === indexes[i]);
        if (elIndex !== i) {
          const el = this.books.splice(elIndex, 1)[0];
          this.books.splice(i, 0, el);
        }
      }
    } catch (e) {}
  }

}
