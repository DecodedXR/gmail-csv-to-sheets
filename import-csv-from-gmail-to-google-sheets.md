---
title: How to import CSV attachments from Gmail into Google Sheets automatically (free)
description: Automatically import CSV reports that arrive by email into a Google Sheet, every hour, appending or replacing data. Free Apps Script, no add-on or Zapier.
---
{% raw %}

# How to import CSV attachments from Gmail into Google Sheets automatically (free)

Plenty of tools only offer reports as a CSV attachment in a daily email: point-of-sale systems, banks, ad platforms, warehouse software. Downloading each file and importing it into Google Sheets takes a few minutes every time. This guide sets up a sheet that does it on its own, every hour, for free.

It uses [Gmail CSV to Sheets](https://github.com/DecodedXR/gmail-csv-to-sheets), a free, MIT-licensed Apps Script.

## Step 1: Find the emails with a Gmail search

In Gmail's search box, write a search that matches exactly the report emails, for example:

```
from:reports@vendor.com has:attachment filename:csv
```

Other useful parts: `subject:"Daily sales"`, `after:2026/10/01`, `label:reports`. Keep adjusting until the results are exactly the emails you want imported. You'll paste this search into the script.

## Step 2: Add the script to your sheet

1. Open the spreadsheet and the tab that should receive the data.
2. **Extensions → Apps Script**, delete the placeholder code, paste in [`Code.gs`](https://github.com/DecodedXR/gmail-csv-to-sheets/blob/main/Code.gs), and **Save**.
3. Reload the spreadsheet. A **📥 CSV Import** menu appears.

## Step 3: Choose append or replace

Choose **📥 CSV Import → Set Up Import…**, paste the search, and pick a mode:

- **Append (Yes):** every file's rows are added below the existing data. If a file starts with the same header row as the sheet, that header is skipped, so you get one clean table that grows every day. Use this for history and charts.
- **Replace (No):** the sheet is cleared and shows only the newest file. Use this when each email is a full snapshot (current inventory, open orders).

Approve Google's permission prompt the first time ("Google hasn't verified this app" → **Advanced → Go to (your project name) → Allow**; it's your own script).

## Step 4: Let it run

The first run imports what's already in your mailbox (up to 50 emails, oldest first). After that, it checks every hour. Each imported email gets the Gmail label **csv-imported**, which is how the script knows not to import it again. You'll see the label in Gmail's sidebar.

## Tips

- **Build on top of the raw data.** Keep the imported tab untouched and do your formulas, pivot tables and charts on another tab that references it. Each import then updates your dashboard automatically.
- **Re-import a file:** remove the csv-imported label from that email and choose **Import Now**.
- **Several reports:** use one spreadsheet per report, each with its own copy of the script and its own search.

## FAQ

**Does it work with Excel (.xlsx) attachments?** No, only CSV. Most tools can email CSV instead; check the report settings.

**Is it free?** Yes. It runs on your own Google account, with no add-on and no Zapier task limits.

**Does my computer need to be on?** No. The hourly check runs on Google's servers.

**How do I stop it?** **📥 CSV Import → Turn Off**.

---

[Get the script on GitHub](https://github.com/DecodedXR/gmail-csv-to-sheets) · Also free: [automatic email reminders from Google Sheets](https://decodedxr.github.io/sheets-deadline-reminders/automatic-email-reminders-google-sheets.html) · [Mail Merge for Google Sheets](https://decodedxr.github.io/sheets-mail-merge/free-mail-merge-google-sheets.html)
{% endraw %}
