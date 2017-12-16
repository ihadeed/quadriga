import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { Store } from '@ngrx/store';
import { IAppState } from '../../app/reducer';

export interface ITicker {
  high: number;
  last: number;
  timestamp: number;
  volume: number;
  vwap: number;
  low: number;
  ask: number;
  bid: number;
}

export interface ITrades {
  bids: Array<number[]>;
  asks: Array<number[]>;
}

export type Book = 'ltc_cad' | 'btc_cad' | 'eth_cad';

@Injectable()
export class QuadProvider {

  constructor(public http: HttpClient, private store: Store<IAppState>) {}

  init() {
    this.createPriceObs('btc_cad');
    this.createPriceObs('ltc_cad', 1);
    this.createPriceObs('eth_cad', 2);

    this.createTradesObs('btc_cad');
    this.createTradesObs('ltc_cad', 1);
    this.createTradesObs('eth_cad', 2);
  }

  getTicker(book: Book) {
    return this.http.get('https://api.quadrigacx.com/v2/ticker?book=' + book)
      .map((val: any) => {
        if (val.error) {
          // too many requests, return last value
          return this.getLastTicker(book);
        }

        // API returns strings, we want numbers!
        for (let prop in val) {
          val[prop] = Number(val[prop]);
        }

        this.setLastTicker(book, val as ITicker);
        return val;
      })
      .toPromise();
  }

  getTrades(book: Book) {
    return this.http.get('https://api.quadrigacx.com/v2/order_book?book=' + book)
      .map((val: any) => {
        if (val.error || !val.bids || !val.asks) {
          return this.getLastTrades(book)
        }

        val.bids = val.bids.map(bid => bid.map(val => Number(val)));
        val.asks = val.asks.map(ask => ask.map(val => Number(val)));

        this.setLastTrades(book, val);
        return val;
      })
      .toPromise();
  }

  createPriceObs(book: Book, delay: number = 0) {
      const getTicker = () => {
        this.getTicker(book).then(val => {
          this.store.dispatch({
            type: 'SET_PRICES_' + book,
            payload: val
          });
        });
      };

      // delay the request by X seconds so we don't exhaust the API
      setTimeout(() => {
        // update every second
        setInterval(getTicker.bind(this), 10000);
        // call it immediately too ..
        getTicker();
      }, delay * 2500)
  }

  createTradesObs(book: Book, delay: number = 0) {
    const getTrades = () => {
      this.getTrades(book).then(val => {
        this.store.dispatch({
          type: 'SET_TRADES_' + book,
          payload: val
        })
      });
    };

    setTimeout(() => {
      setInterval(getTrades.bind(this), 5000);

      getTrades();
    }, delay * 3500);
  }

  private setLastTicker(book: Book, val: ITicker) {
    localStorage.setItem('TICKER_' + book, JSON.stringify(val));
  }

  private getLastTicker(book: Book) {
    try {
      return JSON.parse(localStorage.getItem('TICKER_' + book));
    } catch (e) {}
  }

  private setLastTrades(book: Book, val: ITicker) {
    localStorage.setItem('TRADES_' + book, JSON.stringify(val));
  }

  private getLastTrades(book: Book) {
    try {
      return JSON.parse(localStorage.getItem('TRADES_' + book));
    } catch (e) {}
  }

}
