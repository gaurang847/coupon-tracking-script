// Using ES6 features of JavaScript that are now available since Google Scripts switched to Chrome's V8 engine from Mozilla's Rhino
// https://developers.google.com/apps-script/guides/v8-runtime

const COUPON_INDEX = Object.freeze({
  SOURCE: 0,
  DESCRIPTION: 1,
  DISCOUNT_CODE: 2,
  LINK: 3,
  EXPIRY: 4,
  USED: 5
});
const MAIL_RECIPIENT = "email@gmail.com";
const MAIL_SUBJECT = "Coupon tracking";
const LINK_TO_SHEET = "https://docs.google.com/spreadsheets/d/xxxxxxxxxxxxxxx/edit?usp=sharing";

// Main functions
function start(){
  stop();
  ScriptApp.newTrigger("main")
  .timeBased().everyDays(1).create();
}

function stop () {
  let triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => ScriptApp.deleteTrigger(trigger));
}

function main() {
  // get data from Google Sheet
  let sheet = SpreadsheetApp.getActiveSheet();
  let coupons = sheet.getDataRange().getValues();
  coupons.shift();         //remove header row
  
  // set the data
  let data = {};
  data.activeUnusedCoupons = coupons.filter(_isActive).filter(_isUnused);
  data.expiringTodayCoupons = coupons.filter(_isExpiryToday)
  
  // log email quota
  let emailQuotaRemaining = MailApp.getRemainingDailyQuota();
  Logger.log("Remaining email quota: " + emailQuotaRemaining);
  
  // send the email
  let emailBody = _formEmailBody(data);
  MailApp.sendEmail({
    to: MAIL_RECIPIENT,
    subject: MAIL_SUBJECT,
    htmlBody: emailBody
  });
}

// Private functions

function _formEmailBody(data){
  let content = "";
  let headerRow = "<tr><th>Source</th><th>Description</th><th>Discount Code</th><th>Link</th><th>Expiry</th><th>Used</th></tr>";
  
  let h3ActiveUnusedCoupons = "<h3>Active Coupons Available:</h3>";
  let tableActiveUnusedCoupons = _formTable(data.activeUnusedCoupons, headerRow);
  
  let h3ExpiringTodayCoupons = "<h3>Coupons Expiring Today:</h3>";
  let tableExpiringTodayCoupons = _formTable(data.expiringTodayCoupons, headerRow);
  
  let footer = `<p>Click <a href='${LINK_TO_SHEET}'>here</a> to edit the coupon list</p>`;
  
  return content.concat(h3ActiveUnusedCoupons, tableActiveUnusedCoupons, h3ExpiringTodayCoupons, tableExpiringTodayCoupons, footer);
}

function _formTable(coupons, headers){
  let table = "";
  let rows = coupons.reduce((str, coupon) => str.concat(_formRow(coupon)), "");
  return table.concat("<table cellspacing=0px cellpadding=5px border='1px solid'>", headers, rows, "</table>");
}

function _formRow(coupon){
  let row = "";
  coupon[COUPON_INDEX.LINK] = "".concat("<a href='", coupon[COUPON_INDEX.LINK], "'>Click</a>");
  coupon[COUPON_INDEX.EXPIRY] = new Date(coupon[COUPON_INDEX.EXPIRY]).toDateString();
  return row.concat("<tr><td>", coupon.join("</td><td>"), "</td></tr>");
}

function _isActive(coupon){
  let expiryDate = new Date(coupon[COUPON_INDEX.EXPIRY])
  return expiryDate > new Date();
}

function _isExpiryToday(coupon){
  let expiryDate = new Date(coupon[COUPON_INDEX.EXPIRY]).setHours(0, 0, 0, 0);
  let today = new Date().setHours(0, 0, 0, 0);
  return expiryDate == today;
}

function _isUnused(coupon){
  return coupon[COUPON_INDEX.USED] === "NO";
}
