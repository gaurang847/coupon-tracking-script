# coupon-tracking-script
A simple Google script that reads data from Google Sheets containing coupon-related data. And sends a daily mail with coupons that are active or are expiring that day. 

Does it happen to you that when you receive coupons and discount vouchers, you keep them aside thinking that you'll use them soon.  
But, then you totally forget about them?  
You find them again after they've expired only to feel unnecessary regret.

This Google Sheet + Google Script setup is my attempt to solve that problem.

## The Google Sheet

![Screenshot_Coupon_tracker2](https://user-images.githubusercontent.com/12295171/74967632-4c546d00-5411-11ea-90e4-f1fa58847929.png)

## What the Email looks like
![Screenshot_2020-02-21 Coupon tracking - Gmail](https://user-images.githubusercontent.com/12295171/74973314-1f0cbc80-541b-11ea-9a86-be14b8e625a5.png)

### Steps to make the script work
1. On the Google Sheets page, click `Tools -> Script Editor` to open the editor
2. Copy-paste the contents of `send_mail_v2.gs`
3. Click on `Run -> Run function -> start`  
Alternatively, you can also select the 'start' option from the 'Select function' drop-down. And then, click on Play button.
