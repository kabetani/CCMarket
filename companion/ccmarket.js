export function CCMarketAPI() {
};

/**
 Get fiat data from Coindesk.
*/
CCMarketAPI.prototype.fiatRate = function(fiat, mark) {
  var self = this;
  return new Promise(function(resolve, reject) {
    var url = "https://api.coindesk.com/v1/bpi/currentprice/";
    url += fiat + ".json";
    fetch(url).then(function(response) {
      return response.json();
    }).then(function(json) {
      var data = {
        "type" : "fiat",
        "mark" : mark,
        "rate" : json["bpi"][fiat]["rate"]
      };
      resolve(data);
    }).catch(function (error) {
      console.log("Fetching " + url + " failed: " + JSON.stringify(error));
      reject(error);
    });
  });
}

/**
 Get market data from Bittrex.
*/
CCMarketAPI.prototype.currencyMarket = function(currency, no) {
  var self = this;
  return new Promise(function(resolve, reject) {
    var url = "https://bittrex.com/api/v1.1/public/getmarketsummary?";
    url += "market=" + currency.key;
    fetch(url).then(function(response) {
      return response.json();
    }).then(function(json) {
      var diff = ((json["result"][0]["Last"] - json["result"][0]["PrevDay"]) / json["result"][0]["PrevDay"]) * 100;
      var data = {
        "type" : "market",
        "no" : no, 
        "key" : currency.key,
        "MarketName": json["result"][0]["MarketName"], 
        "Last" : json["result"][0]["Last"],
        "Diff" : diff.toFixed(3),
      };
      resolve(data);
    }).catch(function (error) {
      console.log("Fetching " + url + " failed: " + JSON.stringify(error));
      reject(error);
    });
  });
}
