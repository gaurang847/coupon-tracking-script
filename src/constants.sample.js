const LINK_TO_SHEET = "__link_to_coupon_tracking_Google_sheet__";
const MAIL_RECIPIENT = "__email_address__";
const MAIL_SUBJECT = "Coupon tracking";
const COUPON_COLUMNS = Object.freeze({
  SOURCE: 0,
  DESCRIPTION: 1,
  DISCOUNT_CODE: 2,
  LINK: 3,
  EXPIRY: 4,
  USED: 5,
});
const SHEETS = Object.freeze({ ACTIVE_COUPONS: 0 });
const TRIGGER_SPECS = [];
