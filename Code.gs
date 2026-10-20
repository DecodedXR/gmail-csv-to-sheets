/** @OnlyCurrentDoc */ // asks Google for access to this spreadsheet only, not all your sheets

/**
 * Gmail CSV to Sheets: import CSV attachments from matching emails into this sheet, automatically.
 *
 * Setup: 📥 CSV Import → Set Up Import, enter a Gmail search such as
 *   from:reports@vendor.com has:attachment filename:csv
 * and choose Append (add each file's rows) or Replace (keep only the newest file).
 * It checks every hour. Imported emails get the Gmail label "csv-imported" and are never imported twice.
 */

const DONE_LABEL = 'csv-imported';

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('📥 CSV Import')
    .addItem('Set Up Import…', 'setUp')
    .addItem('Import Now', 'importMenu')
    .addItem('Turn Off', 'turnOff')
    .addToUi();
}

function setUp() {
  const ui = SpreadsheetApp.getUi();
  const q = ui.prompt('CSV Import', 'Gmail search for the emails to import (same as Gmail\'s search box), e.g.\n' +
    'from:reports@vendor.com has:attachment filename:csv', ui.ButtonSet.OK_CANCEL);
  if (q.getSelectedButton() !== ui.Button.OK || !q.getResponseText().trim()) return;
  const mode = ui.alert('CSV Import', 'Append each file\'s rows below the existing data?\n\n' +
    'Yes = Append (keep history)\nNo = Replace (sheet always shows only the newest file)', ui.ButtonSet.YES_NO_CANCEL);
  if (mode === ui.Button.CANCEL) return;
  const props = PropertiesService.getDocumentProperties();
  props.setProperties({
    query: q.getResponseText().trim(),
    mode: mode === ui.Button.YES ? 'append' : 'replace',
    sheetName: SpreadsheetApp.getActiveSheet().getName(),
  });
  stopTriggers_();
  ScriptApp.newTrigger('importScheduled').timeBased().everyHours(1).create();
  importMenu();
}

function importMenu() {
  const r = import_();
  SpreadsheetApp.getUi().alert(r.error || ('Imported ' + r.files + ' file(s), ' + r.rows + ' row(s). It checks again every hour.'));
}

function turnOff() {
  stopTriggers_();
  SpreadsheetApp.getUi().alert('Hourly import is off.');
}

function importScheduled() { import_(); }

function import_() {
  const props = PropertiesService.getDocumentProperties();
  const query = props.getProperty('query');
  const sheet = query && SpreadsheetApp.getActiveSpreadsheet().getSheetByName(props.getProperty('sheetName'));
  if (!sheet) return { error: 'Use "Set Up Import" first.' };
  const replace = props.getProperty('mode') === 'replace';
  const label = GmailApp.getUserLabelByName(DONE_LABEL) || GmailApp.createLabel(DONE_LABEL);

  // Oldest first, so appended data stays in date order.
  const threads = GmailApp.search(query + ' -label:' + DONE_LABEL, 0, 50).reverse();
  const res = { files: 0, rows: 0 };
  for (const thread of threads) {
    for (const msg of thread.getMessages()) {
      for (const a of msg.getAttachments()) {
        if (!isCsv_(a.getName(), a.getContentType())) continue;
        const csv = Utilities.parseCsv(a.getDataAsString().replace(/^\uFEFF/, ''));
        if (!csv.length) continue;
        if (replace) {
          sheet.clearContents();
          write_(sheet, 1, csv);
          res.rows = csv.length;
        } else {
          const header = sheet.getLastRow() ? sheet.getRange(1, 1, 1, sheet.getLastColumn()).getDisplayValues()[0] : null;
          const rows = rowsToAppend_(header, csv);
          write_(sheet, sheet.getLastRow() + 1, rows);
          res.rows += rows.length;
        }
        res.files++;
      }
    }
    thread.addLabel(label);
  }
  return res;
}

function isCsv_(name, type) {
  return /\.csv$/i.test(name) || /text\/csv|comma-separated/i.test(type);
}

/** Drop the file's header row when it repeats the sheet's existing header. */
function rowsToAppend_(sheetHeader, csv) {
  if (!sheetHeader) return csv;
  const same = csv[0].length && csv[0].every((h, i) => String(h).trim() === String(sheetHeader[i] || '').trim());
  return same ? csv.slice(1) : csv;
}

/** setValues needs a rectangle: pad short rows. */
function write_(sheet, startRow, rows) {
  if (!rows.length) return;
  const width = Math.max.apply(null, rows.map(r => r.length));
  sheet.getRange(startRow, 1, rows.length, width).setValues(rows.map(r => r.concat(Array(width - r.length).fill(''))));
}

function stopTriggers_() {
  ScriptApp.getProjectTriggers()
    .filter(t => t.getHandlerFunction() === 'importScheduled')
    .forEach(t => ScriptApp.deleteTrigger(t));
}
