function startTriggers(){
  stopTriggers();
  Logger.log(TRIGGER_SPECS);

  TRIGGER_SPECS.forEach(triggerSpec => {
    const timeBasedTrigger = ScriptApp.newTrigger(triggerSpec.functionName).timeBased();
    switch(triggerSpec.frequencyUnit) {
      case 'minute': timeBasedTrigger.everyMinutes(triggerSpec.frequency).create(); break;
      case 'day': timeBasedTrigger.everyDays(triggerSpec.frequency).create(); break;
      case 'week': timeBasedTrigger.everyWeeks(triggerSpec.frequency).onWeekDay(ScriptApp.WeekDay.SATURDAY).create(); break;
    }
  });
}

function stopTriggers() {
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => ScriptApp.deleteTrigger(trigger));
}

function testTriggers() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheets = spreadsheet.getSheets();

  // print details of active triggers in a Spreadsheet cell
  const triggers = ScriptApp.getProjectTriggers();
  const testArray = triggers.map(trigger => trigger.getUniqueId())
  sheets[SHEETS.ACTIVE_COUPONS].getRange(21, 8, 1, 1).setValue(Utilities.jsonStringify({ testArray }));

  // print details of available coupons in a spreadsheet cell
  const coupons = sheets[SHEETS.ACTIVE_COUPONS].getDataRange().getValues();
  sheets[SHEETS.ACTIVE_COUPONS].getRange(21, 9, 1, 1).setValue(Utilities.jsonStringify({ coupons }));
}
