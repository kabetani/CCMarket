import { CURRENCY_COUNT, CURRENCIES } from "../common/globals.js";

let document = require("document");

var fiatRate;
var fiatMark;

export function CCMarketUI() {
  this.currencyList = document.getElementById("currencyList");
  this.statusText = document.getElementById("status");
  
  this.tiles = [];
  for (var i = 0; i < CURRENCY_COUNT; i++) {
    var tile = document.getElementById(`currency-${i}`);
    if (tile) {
      tile.style.display = "none";
      this.tiles.push(tile);
    }
  }
}

CCMarketUI.prototype.updateUI = function(state, data) {
  if (state === "loaded") {
    //console.log("Getting data : " + JSON.stringify(data));
    
    this.currencyList.style.display = "inline";
    this.statusText.text = "";
    if (data.data.type == 'market') {
      this.updateCurrencyList(data);
    }
    else {
      this.fiatRate = Number(data.data.rate.replace(/,/g, ''));
      this.fiatMark = data.data.mark;
    }
  }
  else {
    this.currencyList.style.display = "none";
    
    if (state === "loading") {
      this.statusText.text = "Loading currency data ...";
    }
    else if (state === "disconnected") {
      this.statusText.text = "Please check connection to phone and Fitbit App."
    }
    else if (state === "error") {
      this.statusText.text = "Something terrible happened.";
    }
  }
}

CCMarketUI.prototype.updateCurrencyList = function(currency) {
  var set_tile = this.tiles[currency["data"]["no"]];
  
  if (currency["data"]["key"] in CURRENCIES) {
    var opacity;
    var d_price;
    var d_fiat;
    
    var diff = parseFloat(currency["data"]["Diff"]);
    var price = parseFloat(currency["data"]["Last"]);
    var market = currency["data"]["MarketName"];
    
    if (price > 999) {
      d_price = price.toFixed(1);
    }
    else if (price > 0.0001) {
      d_price = price.toFixed(4);
    }
    else {
      d_price = price.toExponential(2);
    }
    if (this.fiatRate != null && market.substr(0, 3) === 'BTC') {
      var fiatRate = price * parseFloat(this.fiatRate);
      if (fiatRate > 999) {
        d_fiat = fiatRate.toFixed(0);
      }
      else if (fiatRate > 0.0001) {
        d_fiat = fiatRate.toFixed(2);
      }
      else {
        d_fiat = fiatRate.toExponential(2);
      }
      set_tile.getElementById("c-fiat").text = this.fiatMark + d_fiat;
    }
    
    set_tile.style.display = "inline";
    set_tile.getElementById("c-name").text = market;
    set_tile.getElementById("c-price").text = d_price;
    if (diff >= 0) {
      if (diff > 20) {
        opacity = 0.4;
      }
      else if (diff > 10) {
        opacity = 0.5;
      }
      else if (diff > 5) {
        opacity = 0.6;
      }
      else {
        opacity = 0.7;
      }
      diff = "+" + diff;
      set_tile.getElementById("c-diff").style.fill = "#a0ffa0";
      set_tile.getElementById("c-fiat").style.fill = "#a0ffa0";
      set_tile.getElementById("c-back").style.fill = "#20ff20";
    }
    else {
      if (diff < -20) {
        opacity = 0.4;
      }
      else if (diff < -10) {
        opacity = 0.5;
      }
      else if (diff < -5) {
        opacity = 0.6;
      }
      else {
        opacity = 0.7;
      }
      set_tile.getElementById("c-diff").style.fill = "#ffa0a0";
      set_tile.getElementById("c-fiat").style.fill = "#ffa0a0";
      set_tile.getElementById("c-back").style.fill = "#ff0000";
    }
    set_tile.getElementById("c-diff").text = diff + "%";
    set_tile.getElementById("c-back").style.opacity = opacity;
  }
  
}
