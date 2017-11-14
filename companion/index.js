import * as messaging from "messaging";
import { settingsStorage } from "settings";
import { me } from "companion";

import { CCMarketAPI } from "./ccmarket.js"
import { CURRENCY_COUNT, FAVORITE_CURRENCY_SETTING, UPDATE_INTERVAL } from "../common/globals.js";

settingsStorage.onchange = function(evt) {
  getCurrencyMarket();
}

// Check update interval
let interval = settingsStorage.getItem(FAVORITE_CURRENCY_SETTING);
if (interval != null && interval !=  "0") {
  setInterval(function() {
    getCurrencyMarket();
  }, parseInt(interval));
}

// Listen for the onopen event
messaging.peerSocket.onopen = function() {
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
    ccmarketApi.currencyMarket(currency, index).then(function(data) {
      if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
        messaging.peerSocket.send(data);
      }
    }).catch(function (e) {
      console.log("error"); console.log(e)
    });
  });
}
