/*
 * Entry point for the watch app
 */

import * as messaging from "messaging";
import { CCMarketUI } from "./ui.js";

var ui = new CCMarketUI();

ui.updateUI("disconnected");

// Listen for the onopen event
messaging.peerSocket.onopen = function() {
  ui.updateUI("loading");
}

// Listen for the onmessage event
messaging.peerSocket.onmessage = function(evt) {
  ui.updateUI("loaded", evt);
}

// Listen for the onerror event
messaging.peerSocket.onerror = function(err) {
  console.log("Connection error: " + err.code + " - " + err.message);
  ui.updateUI("error");
}
