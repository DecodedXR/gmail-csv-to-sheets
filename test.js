// Self-check for CSV detection, header de-duplication and padding: node test.js
const vm = require('vm'), fs = require('fs'), assert = require('assert');
const ctx = {}; vm.runInNewContext(fs.readFileSync(__dirname + '/Code.gs', 'utf8'), ctx);
const plain = x => JSON.parse(JSON.stringify(x));
assert.equal(ctx.isCsv_('Report 2026-10-20.CSV', 'application/octet-stream'), true);
assert.equal(ctx.isCsv_('data', 'text/csv'), true);
assert.equal(ctx.isCsv_('report.xlsx', 'application/vnd.ms-excel'), false);
const csv = [['Date', 'Sales'], ['10/20', '5']];
assert.deepEqual(plain(ctx.rowsToAppend_(null, csv)), csv);                  // empty sheet: keep header
assert.deepEqual(plain(ctx.rowsToAppend_(['Date', 'Sales'], csv)), [['10/20', '5']]); // same header: drop it
assert.deepEqual(plain(ctx.rowsToAppend_(['Day', 'Sales'], csv)), csv);      // different: keep
let wrote;
ctx.write_({ getRange: (r, c, h, w) => ({ setValues: v => { wrote = { r, h, w, v }; } }) }, 3, [['a'], ['b', 'c']]);
assert.deepEqual(plain(wrote), { r: 3, h: 2, w: 2, v: [['a', ''], ['b', 'c']] });
console.log('ok');
