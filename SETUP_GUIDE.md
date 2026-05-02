# JJ Imprints ERP — Full Setup Guide

## Prerequisites
- A Google account
- Google Sheets access
- Google Forms access

---

## Step 1 — Create the Spreadsheet
1. Go to [sheets.google.com](https://sheets.google.com) → click **Blank**
2. Rename it: **JJ Imprints ERP**

## Step 2 — Paste the Script
1. Click **Extensions → Apps Script**
2. Delete all existing code (Ctrl+A → Delete)
3. Copy the entire contents of `src/ERP_Script.gs`
4. Paste it into the editor → click 💾 **Save**
5. Name the project: **JJ Imprints ERP**
6. Close the Apps Script tab

## Step 3 — Setup Sheets
1. Refresh your spreadsheet (F5)
2. Click **⚙️ JJ Imprints ERP → 1. Register Form Triggers**
3. Allow permissions when prompted

## Step 4 — Create Google Form A: Enquiry Form
1. Go to [forms.google.com](https://forms.google.com) → **Blank**
2. Title: `JJ Imprints — Client Enquiry Form`
3. Add these fields in order:

| # | Field | Type | Required |
|---|-------|------|----------|
| 1 | CMID (Client ID) | Short answer | ✅ |
| 2 | Enquiry Date | Date | ✅ |
| 3 | Client Name | Short answer | ✅ |
| 4 | Company Name | Short answer | ✅ |
| 5 | Phone | Short answer | ✅ |
| 6 | Email | Short answer | No |
| 7 | Address | Long answer | No |
| 8 | City | Short answer | ✅ |
| 9 | State | Dropdown | ✅ |
| 10 | GST No | Short answer | No |
| 11 | Product Type | Dropdown | ✅ |
| 12 | Product Details | Long answer | ✅ |
| 13 | Quantity | Short answer | ✅ |
| 14 | Size / Specification | Short answer | No |
| 15 | Material | Short answer | No |
| 16 | Printing Type | Dropdown | No |
| 17 | Estimated Value (₹) | Short answer | No |
| 18 | Enquiry Source | Dropdown | ✅ |
| 19 | Sales Person | Short answer | ✅ |
| 20 | Enquiry Status | Dropdown | ✅ |
| 21 | Follow-up Date | Date | No |
| 22 | Enquiry Remarks | Long answer | No |

4. Click **Responses → 🔗 Link to Sheets → Select existing → JJ Imprints ERP**
5. Name the sheet: `Enquiry_form`

## Step 5 — Create Google Form B: Payment Form

| # | Field | Type | Required |
|---|-------|------|----------|
| 1 | CMID (Client ID) | Short answer | ✅ |
| 2 | Payment Date | Date | ✅ |
| 3 | Invoice No | Short answer | ✅ |
| 4 | Invoice Amount (₹) | Short answer | ✅ |
| 5 | Amount Received (₹) | Short answer | ✅ |
| 6 | Payment Mode | Dropdown | ✅ |
| 7 | Transaction ID / Cheque No | Short answer | No |
| 8 | Bank Name | Short answer | No |
| 9 | Balance Due (₹) | Short answer | No |
| 10 | Payment Status | Dropdown | ✅ |
| 11 | Payment Remarks | Long answer | No |

Link to sheet name: `Payment_form`

## Step 6 — Create Google Form C: Expense Form

| # | Field | Type | Required |
|---|-------|------|----------|
| 1 | CMID (Client ID) | Short answer | ✅ |
| 2 | Expense Date | Date | ✅ |
| 3 | Expense Category | Dropdown | ✅ |
| 4 | Expense Description | Long answer | ✅ |
| 5 | Vendor Name | Short answer | ✅ |
| 6 | Vendor GSTIN | Short answer | No |
| 7 | Expense Invoice No | Short answer | No |
| 8 | Expense Amount (₹) | Short answer | ✅ |
| 9 | Tax Amount (₹) | Short answer | No |
| 10 | Total Expense (₹) | Short answer | ✅ |
| 11 | Paid By | Short answer | ✅ |
| 12 | Expense Payment Mode | Dropdown | ✅ |
| 13 | Approved By | Short answer | No |
| 14 | Expense Remarks | Long answer | No |

Link to sheet name: `Expense_form`

## Step 7 — Add Form Links to Master Sheet
1. **⚙️ JJ Imprints ERP → 2. Update Form Links**
2. Paste each form's respondent URL when prompted

## Step 8 — Colour-code Headers
1. **⚙️ JJ Imprints ERP → 3. 🎨 Recolour Master Headers**

## Step 9 — Add Update Button
1. **⚙️ JJ Imprints ERP → 4. 🖱️ Add Update Button to Sheet**
2. A yellow **✏️ UPDATE CLIENT** button appears in row 1

---

## Testing

Submit test data with `CMID: JJ-001` across all 3 forms and verify:

- `Enquiry_form` sheet → 1 new row ✅
- `Payment_form` sheet → 1 new row ✅
- `Expense_form` sheet → 1 new row ✅
- `Master` sheet → exactly **1 row** for `JJ-001` with all columns filled ✅

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Master not updating on form submit | Re-run Register Triggers |
| Wrong sheet name | Rename form response sheet to match exactly |
| Menu not showing | Refresh sheet, or run `onOpen` manually from Apps Script |
| CMID not matching | Check for extra spaces in the CMID field |
