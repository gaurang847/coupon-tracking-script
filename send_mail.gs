var COUPON_INDEX = {
  SOURCE: 0,
  DESCRIPTION: 1,
  DISCOUNT_CODE: 2,
  LINK: 3,
  EXPIRY: 4,
  USED: 5
};
var MAIL_RECIPIENT = "email@gmail.com";
var MAIL_SUBJECT = "Coupon tracking";
var LINK_TO_SHEET = "https://docs.google.com/spreadsheets/d/xxxxxxxxxxxxxxx/edit?usp=sharing";

// Main functions
function start(){
  stop();
  ScriptApp.newTrigger("main")
  .timeBased().everyDays(1).create();
}

function stop () {
  var triggers;

  triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    ScriptApp.deleteTrigger(triggers[i]);
  }
}

function main() {
  var sheet = SpreadsheetApp.getActiveSheet();
  var coupons = sheet.getDataRange().getValues();
  coupons.shift();         //remove header row
  
  var data = {};
  data.activeUnusedCoupons = coupons.filter(_isActive).filter(_isUnused);
  data.expiringTodayCoupons = coupons.filter(_isExpiryToday)
  
  var emailQuotaRemaining = MailApp.getRemainingDailyQuota();
  Logger.log("Remaining email quota: " + emailQuotaRemaining);
  
  var emailBody = _formEmailBody(data);
  MailApp.sendEmail({
    to: MAIL_RECIPIENT,
    subject: MAIL_SUBJECT,
    htmlBody: emailBody
  });
}

// Private functions

function _formEmailBody(data){
  var content = "";
  var headerRow = "<tr><th>Source</th><th>Description</th><th>Discount Code</th><th>Link</th><th>Expiry</th><th>Used</th></tr>";
  
  var h3ActiveUnusedCoupons = "<h3>Active Coupons Available:</h3>";
  var tableActiveUnusedCoupons = _formTable(data.activeUnusedCoupons, headerRow);
  
  var h3ExpiringTodayCoupons = "<h3>Coupons Expiring Today:</h3>";
  var tableExpiringTodayCoupons = _formTable(data.expiringTodayCoupons, headerRow);
  
  var footer = "<p>Click <a href='" + LINK_TO_SHEET + "'>here</a> to edit the coupon list</p>"
  
  return content.concat(h3ActiveUnusedCoupons, tableActiveUnusedCoupons, h3ExpiringTodayCoupons, tableExpiringTodayCoupons, footer);
}

function _formTable(coupons, headers){
  var table = "";
  var rows = coupons.reduce(function(str, coupon){
    return str.concat(_formRow(coupon))
  }, "");
  return table.concat("<table cellspacing=0px cellpadding=5px border='1px solid'>", headers, rows, "</table>");
}

function _formRow(coupon){
  var row = "";
  coupon[COUPON_INDEX.LINK] = "".concat("<a href='", coupon[COUPON_INDEX.LINK], "'>Click</a>");
  coupon[COUPON_INDEX.EXPIRY] = new Date(coupon[COUPON_INDEX.EXPIRY]).toDateString();
  return row.concat("<tr><td>", coupon.join("</td><td>"), "</td></tr>");
}

function _isActive(coupon){
  var expiryDate = new Date(coupon[COUPON_INDEX.EXPIRY])
  return expiryDate > new Date();
}

function _isExpiryToday(coupon){
  var expiryDate = new Date(coupon[COUPON_INDEX.EXPIRY]).setHours(0, 0, 0, 0);
  var today = new Date().setHours(0, 0, 0, 0);
  return expiryDate == today;
}

function _isUnused(coupon){
  return coupon[COUPON_INDEX.USED] == "NO";
}
