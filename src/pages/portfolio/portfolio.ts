import { Component } from '@angular/core';
import { ActionSheetController, AlertController, IonicPage } from 'ionic-angular';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/last';
import 'rxjs/add/observable/combineLatest';

@IonicPage({
  name: 'portfolio'
})
@Component({
  selector: 'page-portfolio',
  templateUrl: 'portfolio.html',
})
export class PortfolioPage {

  btcPrice = this.store.select('reducer', 'prices_btc_cad');
  ltcPrice = this.store.select('reducer', 'prices_ltc_cad');
  ethPrice = this.store.select('reducer', 'prices_eth_cad');

  btcValue = new Observable<number>(obs => {
    this.btcPrice.subscribe(val => {
      const entry = this.entries.find(e => e.currency === 'BTC');
      if (entry) {
        obs.next(entry.value * val.last);
      }
    });
  });

  ltcValue = new Observable<number>(obs => {
    this.ltcPrice.subscribe(val => {
      console.log(val);
      const entry = this.entries.find(e => e.currency === 'LTC');
      if (entry) {
        obs.next(entry.value * val.last);
      }
    });
  });

  ethValue = new Observable<number>(obs => {
    this.ethPrice.subscribe(val => {
      const entry = this.entries.find(e => e.currency === 'ETH');
      if (entry) {
        obs.next(entry.value * val.last);
      }
    });
  });

  totalValue = Observable.combineLatest(this.btcValue, this.ltcValue, this.ethValue).map(vals => vals.reduce((a,b) => a+b, 0));

  entries: any[] = [];

  constructor(private store: Store<any>, private actionSheetCtrl: ActionSheetController, private alertCtrl: AlertController) {
    this.restorePortfolio();
  }

  add() {
    const showDialog = currency => {
      const entryIndex = this.entries.findIndex(e => e.currency === currency);
      let entry;
      if (entryIndex > -1) {
        entry = this.entries[entryIndex];
      }

      console.log('Currency is ', currency);
      console.log('Entry is ', entry);

      this.alertCtrl.create({
        title: 'Enter value',
        subTitle: 'Enter holding value in ' + currency,
        inputs: [
          {
            placeholder: 'Value in ' + currency,
            name: 'value',
            value: entry? entry.value : ''
          }
        ],
        buttons: [
          {
            text: 'Save',
            handler: (data) => {
              let { value } = data;
              value = Number(value);
              if (value && value > 0) {
                if (entry) entry.value = value;
                else entry = { currency, value };

                if (entryIndex > -1) this.entries[entryIndex] = entry;
                else this.entries.push(entry);

                this.savePortfolio()
              }
            }
          },
          'Cancel'
        ]
      }).present();
    };

    this.actionSheetCtrl.create({
      title: 'Select currency',
      buttons: [
        {
          text: 'BTC',
          handler: () => showDialog('BTC')
        },
        {
          text: 'LTC',
          handler: () => showDialog('LTC')
        },
        {
          text: 'ETH',
          handler: () => showDialog('ETH')
        }
      ]
    }).present();
  }

  getPrice(currency: string) {
    switch(currency) {
      case 'BTC': return this.btcValue;
      case 'LTC': return this.ltcValue;
      case 'ETH': return this.ethValue;
    }
  }

  savePortfolio() {
    localStorage.setItem('PORTFOLIO', JSON.stringify(this.entries));
  }

  restorePortfolio() {
    try {
      const val = JSON.parse(localStorage.getItem('PORTFOLIO'));
      if (val && val.length) this.entries = val;
    } catch (e) {}
  }

}
