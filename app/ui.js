import { CURRENCY_COUNT, CURRENCIES } from "../common/globals.js";

let document = require("document");

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

CCMarketUI.prototype.updateUI = function(state, currency) {
  if (state === "loaded") {
    this.currencyList.style.display = "inline";
    this.statusText.text = "";
    this.updateCurrencyList(currency);
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
  var set_tile = this.tiles[currency["data"][0]["no"]];
  if (currency["data"][0]["key"] in CURRENCIES) {
    set_tile.style.display = "inline";
    set_tile.getElementById("c-name").text = currency["data"][0]["MarketName"];
    set_tile.getElementById("c-price").text = currency["data"][0]["Last"];
    var opacity;
    var diff = parseFloat(currency["data"][0]["Diff"]);
    if (diff > 0) {
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
      set_tile.getElementById("c-back").style.fill = "#ff0000";
    }
    set_tile.getElementById("c-diff").text = diff + "%";
    set_tile.getElementById("c-back").style.opacity = opacity;
  }
  
}
