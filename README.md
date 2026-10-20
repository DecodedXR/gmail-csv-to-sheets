# Free Gmail CSV to Google Sheets import

![Free Gmail CSV to Google Sheets import](assets/cover.png)

Get the CSV reports that arrive by email (daily sales, bank exports, ad spend, inventory, form tools) into a Google Sheet **automatically**. Point it at a Gmail search and it imports every matching attachment, every hour, without you downloading or uploading anything. One Apps Script file: no add-on, no Zapier, no subscription.

- **Append** keeps a running history: each new file's rows go below the last, with the repeated header row dropped
- **Replace** keeps the sheet showing only the newest file
- Imported emails get the Gmail label **csv-imported** and are never imported twice
- Works with any Gmail search: `from:reports@vendor.com has:attachment filename:csv`

New to this? Read the [step-by-step guide](https://decodedxr.github.io/gmail-csv-to-sheets/import-csv-from-gmail-to-google-sheets.html).

Files saved to a Drive folder instead of emailed? Use [Drive CSV to Sheets](https://github.com/DecodedXR/drive-csv-to-sheets).

## One-time setup (3 minutes)

1. Open the sheet (and the tab) the data should go into.
2. **Extensions → Apps Script**, delete the placeholder code, paste in `Code.gs`, save.
3. Reload the sheet. A **📥 CSV Import** menu appears.
4. **📥 CSV Import → Set Up Import…**:
   - Enter the Gmail search that finds the report emails. Test it in Gmail's search box first: it should list exactly the emails you want.
   - Choose **Yes** to append or **No** to replace.
5. Google asks for permission the first time ("Google hasn't verified this app" → **Advanced → Go to (your project name) → Allow**; it's your own script).

It imports what's already there (up to 50 emails per run, oldest first), then checks every hour.

## Notes

- Only `.csv` attachments are imported. For Excel files, ask the sender for CSV, or save them as CSV first.
- To re-import an email, remove its **csv-imported** label in Gmail and choose **Import Now**.
- Sheets formats values as it would if you typed them, so dates and numbers become real dates and numbers.
- **Turn Off** stops the hourly check. **Set Up Import** again changes the search, mode or target tab.

## More free Google tools

- [Sheets Mail Merge](https://github.com/DecodedXR/sheets-mail-merge): a personalized email to every row.
- [Sheets Deadline Reminders](https://github.com/DecodedXR/sheets-deadline-reminders): automatic emails before a due date.
- [Sheets Doc Merge](https://github.com/DecodedXR/sheets-doc-merge): one PDF per row from a Google Docs template.
- [Sheets to Calendar](https://github.com/DecodedXR/sheets-to-calendar): rows become Google Calendar events.
- [Form Auto-Reply](https://github.com/DecodedXR/form-auto-reply): your own email to every Google Form respondent.
- [Form Prefill Links](https://github.com/DecodedXR/form-prefill-links): a pre-filled Google Form link for every row.

## License

MIT. See `LICENSE`.
