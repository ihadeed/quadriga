import { ITicker, ITrades } from '../providers/quad/quad';

export const BLANK_PRICES = {
  high: 0,
  last: 0,
  timestamp: 0,
  volume: 0,
  vwap: 0,
  low: 0,
  ask: 0,
  bid: 0
};

export const BLANK_TRADES = {
  bids: [],
  asks: []
};

export interface IAppState {
  prices_btc_cad: ITicker;
  prices_ltc_cad: ITicker;
  prices_eth_cad: ITicker;
  trades_btc_cad: ITrades;
  trades_ltc_cad: ITrades;
  trades_eth_cad: ITrades;
}

export function saveSate(val: any) {
  localStorage.setItem('APP_STATE', JSON.stringify(val));
}

export function restoreSate() {
  try {
    const val = JSON.parse(localStorage.getItem('APP_STATE'));
    if (val) {
      return val;
    }
  } catch (e) {}

  return {
    prices_btc_cad: BLANK_PRICES,
    prices_ltc_cad: BLANK_PRICES,
    prices_eth_cad: BLANK_PRICES,
    trades_btc_cad: BLANK_TRADES,
    trades_ltc_cad: BLANK_TRADES,
    trades_eth_cad: BLANK_TRADES
  }
}

export function reducer(state = restoreSate(), action) {
  switch(action.type) {
    case 'SET_PRICES_btc_cad':
      state.prices_btc_cad = action.payload;
      break;

    case 'SET_PRICES_ltc_cad':
      state.prices_ltc_cad = action.payload;
      break;

    case 'SET_PRICES_eth_cad':
      state.prices_eth_cad = action.payload;
      break;

    case 'SET_TRADES_btc_cad':
      state.trades_btc_cad = action.payload;
      break;

    case 'SET_TRADES_ltc_cad':
      state.trades_ltc_cad = action.payload;
      break;

    case 'SET_TRADES_eth_cad':
      state.trades_eth_cad = action.payload;
      break;
  }

  saveSate(state);
  return state;
}
