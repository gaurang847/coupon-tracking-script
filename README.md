# coupon-tracking-script
[![clasp](https://img.shields.io/badge/built%20with-clasp-4285f4.svg)](https://github.com/google/clasp)

A simple Google script that reads data from Google Sheets containing coupon-related data. And sends a daily mail with coupons that are active or are expiring that day. 

Does it happen to you that when you receive coupons and discount vouchers, you keep them aside thinking that you'll use them soon.  
But, then you totally forget about them?  
You find them again after they've expired only to feel unnecessary regret.

This Google Sheet + Google Script setup is my attempt to solve that problem.

## The Google Sheet

![Screenshot_Coupon_tracker2](https://user-images.githubusercontent.com/12295171/74967632-4c546d00-5411-11ea-90e4-f1fa58847929.png)

## What the Email looks like
![Screenshot_2020-02-21 Coupon tracking - Gmail](https://user-images.githubusercontent.com/12295171/74973314-1f0cbc80-541b-11ea-9a86-be14b8e625a5.png)

## The Setup
1. Open a new Google spreadsheet and add the columns:
    1. **Source** - The brand/provider of the coupon. Required
    2. **Description** - Brief Description about the coupon. Required.
    3. **Discount Code** - Discount code to be applied.
    4. **Link** - Link to any resource with additional information.
    5. **Expiry** - Coupon expiry date.
    6. **Used** - Whether the coupon has been used. Possible values - YES/NO

    **Note:** It is important that these columns are in sequence. And are placed contiguously starting from cell A1. The actual text is unimportant.
2. Go to Extensions -> Apps Script  
    Note the project ID from the browser address bar. We'll need it.  
    `https://script.google.com/u/0/home/projects/{project ID}/edit`  
    You can skip to Step #8 by copy-pasting all the JavaScript files from [src](src) folder as files in the Apps Script Editor. Just replace the `.js` extension with `.gs`.
3. Install [clasp][clasp_installation] and perform [login][clasp_login].  
    Use the same GMail account that was used to create the Google Sheet in Step #1. Or any account with proper access to that sheet.
4. Clone this repo. Remove `".sample"` from the file names.
    - [src/constants.sample.js](src/constants.sample.js)
    - [.clasp.sample.json](.clasp.sample.json)
5. Update the following values:  
    | Value | Location of file | Description |
    | --- | --- | --- |
    | project ID | [.clasp.json](.clasp.json) | The project ID from step 2 |
    | Mail recipient | [src/constants.js](src/constants.js) | The email address you want weekly coupon status emails on |
    | Link to sheet | [src/constants.js](src/constants.js) | The link will be added in the weekly coupon status email for quick access to the Google Sheet |
6. Run `clasp push`
7. In the Apps Script Editor, open the file `triggers.js`. Run the function `startTriggers`.
8. Fill the Google sheet with coupon details and you'll start receiving emails every Saturday.



[clasp_installation]: https://developers.google.com/apps-script/guides/clasp#requirements
[clasp_login]: https://developers.google.com/apps-script/guides/clasp#login
