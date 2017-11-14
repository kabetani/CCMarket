export function CCMarketAPI() {
};

CCMarketAPI.prototype.currencyMarket = function(currency, no) {
  var self = this;
  return new Promise(function(resolve, reject) {
    var url = "https://bittrex.com/api/v1.1/public/getmarketsummary?";
    url += "market=" + currency.key;
    fetch(url).then(function(response) {
      return response.json();
    }).then(function(json) {
      var diff = ((json["result"][0]["Last"] - json["result"][0]["PrevDay"]) / json["result"][0]["PrevDay"]) * 100;
      var data = [{
        "no": no, 
        "key": currency.key,
        "MarketName": json["result"][0]["MarketName"], 
        "Last": json["result"][0]["Last"],
        "Diff" : diff.toFixed(3),
      }];
      resolve(data);
    }).catch(function (error) {
      console.log("Fetching " + url + " failed: " + JSON.stringify(error));
      reject(error);
    });
  });
}
