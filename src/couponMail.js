TRIGGER_SPECS.push({ functionName: 'sendCouponMail', frequency: 1, frequencyUnit: 'week' });

function sendCouponMail() {
  // get data from Google Spreadsheet
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheets = spreadsheet.getSheets();

  const activeCouponSheet = sheets[SHEETS.ACTIVE_COUPONS];
  let coupons = activeCouponSheet.getDataRange().getValues();
  coupons.shift();         //remove header row
  coupons = coupons.filter(_areRequiredColumnsFilled);

  // set the data
  const data = {};
  data.activeUnusedCoupons = coupons;
  data.expiringInAWeekCoupons = coupons.filter(coupon => _isExpiringInDays(coupon, 7));
  data.expiringInAFortnightCoupons = coupons.filter(coupon => _isExpiringInDays(coupon, 14));
  
  // log email quota
  const emailQuotaRemaining = MailApp.getRemainingDailyQuota();
  Logger.log("Remaining email quota: " + emailQuotaRemaining);

  // send the email
  const emailBody = _formEmailBody(data);
  MailApp.sendEmail({
    to: MAIL_RECIPIENT,
    subject: MAIL_SUBJECT,
    htmlBody: emailBody,
  });
}

// Private functions

function _areRequiredColumnsFilled(coupon) {
  // source and description are required columns.
  if (!coupon[COUPON_COLUMNS.DESCRIPTION] || coupon[COUPON_COLUMNS.DESCRIPTION].trim() === '')
    return false;

  if (!coupon[COUPON_COLUMNS.SOURCE] || coupon[COUPON_COLUMNS.SOURCE].trim() === '')
    return false;
  
  return true;
}

function _formEmailBody(data){
  const content = "";
  const headerRow = "<tr><th>Source</th><th>Description</th><th>Discount Code</th><th>Link</th><th>Expiry</th></tr>";
  
  const h3ActiveUnusedCoupons = "<h3>Active Coupons Available:</h3>";
  const tableActiveUnusedCoupons = _formTable(data.activeUnusedCoupons, headerRow);
  
  const h3ExpiringInAWeekCoupons = '<h3>Coupons Expiring in a Week:</h3>';
  const tableExpiringInAWeekCoupons = _formTable(data.expiringInAWeekCoupons, headerRow);

  const h3ExpiringInAFortnightCoupons = '<h3>Coupons Expiring in a Fortnight:</h3>';
  const tableExpiringInAFortnightCoupons = _formTable(data.expiringInAFortnightCoupons, headerRow);

  const footer = `<p>Click <a href='${LINK_TO_SHEET}'>here</a> to edit the coupon list</p>`;
  
  return content.concat(
    h3ActiveUnusedCoupons, tableActiveUnusedCoupons, h3ExpiringInAWeekCoupons, tableExpiringInAWeekCoupons,
    h3ExpiringInAFortnightCoupons, tableExpiringInAFortnightCoupons, footer
  );
}

function _formTable(coupons, headers){
  const table = "";
  const rows = coupons.reduce((str, coupon) => str.concat(_formRow(coupon)), "");
  return table.concat("<table cellspacing=0px cellpadding=5px border='1px solid'>", headers, rows, "</table>");
}

function _formRow(coupon){
  const row = "";
  coupon[COUPON_COLUMNS.LINK] = "".concat("<a href='", coupon[COUPON_COLUMNS.LINK], "'>Click</a>");

  let expiryDate = new Date(coupon[COUPON_COLUMNS.EXPIRY]).toDateString();
  if (expiryDate === "Invalid Date") expiryDate = "Not available";
  coupon[COUPON_COLUMNS.EXPIRY] = expiryDate;
  
  return row.concat("<tr><td>", coupon.join("</td><td>"), "</td></tr>");
}

function _isActive(coupon){
  const expiryDate = new Date(coupon[COUPON_COLUMNS.EXPIRY]);
  return expiryDate > new Date();
}

function _isExpiryToday(coupon){
  const expiryDate = new Date(coupon[COUPON_COLUMNS.EXPIRY]).setHours(0, 0, 0, 0);
  const today = new Date().setHours(0, 0, 0, 0);
  return expiryDate == today;
}

/**
 * @param {Date} date
 * @param {Date} rangeStart
 * @param {Date} rangeEnd
 * @returns {Boolean}
 */
function _isDateBetweenRange(date, rangeStart, rangeEnd) {
  const isDateAfterStart = date.getTime() > rangeStart.getTime();
  const isDateBeforeEnd = date.getTime() < rangeEnd.getTime();

  return isDateAfterStart && isDateBeforeEnd;
}

/**
 * @param {Object} coupon
 * @param {Number} numberOfDays
 * @returns {Boolean}
 */
function _isExpiringInDays(coupon, numberOfDays) { 
  const msInAWeek = numberOfDays * 24 * 60 * 60 * 1000; // 7 * 24 hrs = 24 * 60 minutes = 24 * 60 * 60 seconds = 24 * 60 * 60 * 1000 ms
  const startOfToday = new Date(new Date().setHours(0, 0, 0, 0));
  const endOfWeek = new Date(startOfToday.getTime() + msInAWeek);
  const couponExpiryDate = new Date(coupon[COUPON_COLUMNS.EXPIRY]);

  return _isDateBetweenRange(couponExpiryDate, startOfToday, endOfWeek);
}
