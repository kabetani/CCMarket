import * as messaging from "messaging";
import { settingsStorage } from "settings";
import { me } from "companion";

import { CCMarketAPI } from "./ccmarket.js"
import { CURRENCY_COUNT, UPDATE_INTERVAL, BASE_FIAT, FAVORITE_CURRENCY_SETTING } from "../common/globals.js";

settingsStorage.onchange = function(evt) {
  getFiat();
  getCurrencyMarket();
}

// Get update interval
var interval = "0";
let intervalSetting = settingsStorage.getItem(UPDATE_INTERVAL);
if (intervalSetting) {
  try {
    intervalSetting = JSON.parse(intervalSetting);
    interval = intervalSetting["values"]["0"]["value"];
  }
  catch (e) {
    console.log("error parsing setting value: " + e);
  }
}
if (interval != null && interval !=  "0") {
  setInterval(function() {
    getFiat();
    getCurrencyMarket();
  }, parseInt(interval));
}

// Listen for the onopen event
messaging.peerSocket.onopen = function() {
  getFiat();
  getCurrencyMarket();
}

// Listen for the onmessage event
messaging.peerSocket.onmessage = function(evt) {
}

// Listen for the onerror event
messaging.peerSocket.onerror = function(err) {
}

function getCurrencyMarket() {
  let currencies = settingsStorage.getItem(FAVORITE_CURRENCY_SETTING);
  if (currencies) {
    try {
      currencies = JSON.parse(currencies);
    }
    catch (e) {
      console.log("error parsing setting value: " + e);
    }
  }
  
  if (!currencies || typeof(currencies) !== "object" || currencies.length < 1 || typeof(currencies[0]) !== "object") {
    currencies = [{ key: "btc-bcc", name: "BTC-BCC" }];
  }
  var ccmarketApi = new CCMarketAPI();
  currencies.forEach((currency, index) => {
    // Binance currency.
    if (currency.key.slice(-2) == '_N') {
      currency.key = currency.key.substr(0, currency.key.length - 2);
      ccmarketApi.binanceMarket(currency, index).then(function(data) {
        if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
          messaging.peerSocket.send(data);
        }
      }).catch(function (e) {
        console.log(e);
      });
    }
    else {
      ccmarketApi.currencyMarket(currency, index).then(function(data) {
        if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
          messaging.peerSocket.send(data);
        }
      }).catch(function (e) {
        console.log(e);
      });
    }
  });
}

function getFiat() {
  var fiat;
  var mark;
  let fiat_select = settingsStorage.getItem(BASE_FIAT);
  if (fiat_select) {
    try {
      fiat_select = JSON.parse(fiat_select);
    }
    catch (e) {
      console.log("error parsing setting value: " + e);
    }
  }
  if (fiat_select != null) {
    fiat = fiat_select["values"][0]["value"];
    mark = fiat_select["values"][0]["mark"];
  }
  else {
    fiat = 'USD';
    mark = "$";
  }
  var ccmarketApi = new CCMarketAPI();
  ccmarketApi.fiatRate(fiat, mark).then(function(data) {
    if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
      messaging.peerSocket.send(data);
    }
  }).catch(function (e) {
    console.log(e);
  });
}
