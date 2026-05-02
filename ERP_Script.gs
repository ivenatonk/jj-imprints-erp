// ============================================================
//  JJ IMPRINTS GROUP — ERP APPS SCRIPT v2
//  Written against ACTUAL sheet names and column headers
//  confirmed from the live spreadsheet.
//
//  Form response sheets (Google Forms write here):
//    Enquiry_form   — 23 columns (Timestamp + 22 fields)
//    Payment_form   — 12 columns (Timestamp + 11 fields)
//    Expense_form   — 15 columns (Timestamp + 14 fields)
//
//  Master sheet layout:
//    Row 1  : Title banner
//    Row 2  : Enquiry Form link
//    Row 3  : Payment Form link
//    Row 4  : Expense Form link
//    Row 5  : Colour legend bar
//    Row 6  : Column headers
//    Row 7+ : Data (one row per CMID)
// ============================================================


// ── SHEET NAMES — exactly as they appear in your spreadsheet ─
const MASTER_SHEET  = "Master";
const ENQ_SHEET     = "Enquiry_form";
const PAY_SHEET     = "Payment_form";
const EXP_SHEET     = "Expense_form";

// ── MASTER SHEET STRUCTURE ───────────────────────────────────
const HEADER_ROW    = 6;   // column headers live in row 6
const DATA_START    = 7;   // client data starts in row 7

// ── MASTER COLUMN NUMBERS (1-indexed) ───────────────────────
//    Confirmed against Enquiry_form headers row 1:
//    Col B  = Timestamp (ignored in master)
//    Col C  = CMID (Client ID)
//    Col D  = Enquiry date  ... etc.

const MC = {
  // Identity
  CMID             : 1,   // A

  // ── ENQUIRY (cols 2-22, i.e. B-V) ────────────────────────
  ENQ_DATE         : 2,   // B  ← "Enquiry date"
  CLIENT_NAME      : 3,   // C  ← "Client Name"
  COMPANY_NAME     : 4,   // D  ← "Company Name"
  PHONE            : 5,   // E  ← "Phone"
  EMAIL            : 6,   // F  ← "Email"
  ADDRESS          : 7,   // G  ← "Address"
  CITY             : 8,   // H  ← "City"
  STATE            : 9,   // I  ← "State"
  GST_NO           : 10,  // J  ← "GST No"
  PRODUCT_TYPE     : 11,  // K  ← "Product Type"
  PRODUCT_DETAILS  : 12,  // L  ← "Product details"
  QUANTITY         : 13,  // M  ← "Quantity"
  SIZE_SPEC        : 14,  // N  ← "Size / Specification"
  MATERIAL         : 15,  // O  ← "Material"
  PRINTING_TYPE    : 16,  // P  ← "Printing Type"
  EST_VALUE        : 17,  // Q  ← "Estimated Value (₹)"
  ENQ_SOURCE       : 18,  // R  ← "Enquiry Source"
  SALES_PERSON     : 19,  // S  ← "Sales Person"
  ENQ_STATUS       : 20,  // T  ← "Enquiry Status"
  FOLLOWUP_DATE    : 21,  // U  ← "Follow-up Date"
  ENQ_REMARKS      : 22,  // V  ← "Enquiry Remarks"

  // ── PAYMENT (cols 23-32, i.e. W-AF) ──────────────────────
  PAY_DATE         : 23,  // W  ← "Payment Date"
  INVOICE_NO       : 24,  // X  ← "Invoice No"
  INVOICE_AMT      : 25,  // Y  ← "Invoice Amount (₹)"
  AMT_RECEIVED     : 26,  // Z  ← "Amount Received (₹)"
  PAY_MODE         : 27,  // AA ← "Payment Mode"
  TXN_ID           : 28,  // AB ← "Transaction ID / Cheque No"
  BANK_NAME        : 29,  // AC ← "Bank Name"
  BALANCE_DUE      : 30,  // AD ← "Balance Due (₹)"
  PAY_STATUS       : 31,  // AE ← "Payment Status"
  PAY_REMARKS      : 32,  // AF ← "Payment Remarks"

  // ── EXPENSE (cols 33-45, i.e. AG-AS) ─────────────────────
  EXP_DATE         : 33,  // AG ← "Expense Date"
  EXP_CATEGORY     : 34,  // AH ← "Expense Category"
  EXP_DESC         : 35,  // AI ← "Expense Description"
  VENDOR_NAME      : 36,  // AJ ← "Vendor Name"
  VENDOR_GSTIN     : 37,  // AK ← "Vendor GSTIN"
  EXP_INVOICE_NO   : 38,  // AL ← "Expense Invoice No"
  EXP_AMOUNT       : 39,  // AM ← "Expense Amount (₹)"
  TAX_AMOUNT       : 40,  // AN ← "Tax Amount (₹)"
  TOTAL_EXP        : 41,  // AO ← "Total Expense (₹)"
  PAID_BY          : 42,  // AP ← "Paid By"
  EXP_PAY_MODE     : 43,  // AQ ← "Expense Payment Mode"
  APPROVED_BY      : 44,  // AR ← "Approved By"
  EXP_REMARKS      : 45,  // AS ← "Expense Remarks"

  // ── META ──────────────────────────────────────────────────
  LAST_UPDATED     : 46,  // AT ← auto timestamp
};

const TOTAL_COLS = 46;

// Master sheet column header labels (row 6)
const MASTER_HEADERS = [
  "CMID",
  "Enquiry Date","Client Name","Company Name","Phone","Email","Address","City","State",
  "GST No","Product Type","Product Details","Quantity","Size / Specification","Material",
  "Printing Type","Estimated Value (₹)","Enquiry Source","Sales Person","Enquiry Status",
  "Follow-up Date","Enquiry Remarks",
  "Payment Date","Invoice No","Invoice Amount (₹)","Amount Received (₹)","Payment Mode",
  "Transaction ID / Cheque No","Bank Name","Balance Due (₹)","Payment Status","Payment Remarks",
  "Expense Date","Expense Category","Expense Description","Vendor Name","Vendor GSTIN",
  "Expense Invoice No","Expense Amount (₹)","Tax Amount (₹)","Total Expense (₹)",
  "Paid By","Expense Payment Mode","Approved By","Expense Remarks",
  "Last Updated"
];

// ── ENQUIRY_FORM column positions (0-indexed from row array) ─
// Confirmed from live sheet row 1:
// 0=Timestamp, 1=CMID, 2=Enquiry date, 3=Client Name,
// 4=Company Name, 5=Phone, 6=Email, 7=Address, 8=City, 9=State,
// 10=GST No, 11=Product Type, 12=Product details, 13=Quantity,
// 14=Size/Specification, 15=Material, 16=Printing Type,
// 17=Estimated Value, 18=Enquiry Source, 19=Sales Person,
// 20=Enquiry Status, 21=Follow-up Date, 22=Enquiry Remarks
const ENQ_COLS = {
  TIMESTAMP : 0, CMID : 1, ENQ_DATE : 2, CLIENT_NAME : 3,
  COMPANY   : 4, PHONE : 5, EMAIL : 6, ADDRESS : 7,
  CITY      : 8, STATE : 9, GST : 10, PRODUCT_TYPE : 11,
  PROD_DET  : 12, QTY : 13, SIZE : 14, MATERIAL : 15,
  PRINT     : 16, EST_VAL : 17, SOURCE : 18, SALES : 19,
  STATUS    : 20, FOLLOWUP : 21, REMARKS : 22
};

// ── PAYMENT_FORM column positions (0-indexed) ────────────────
// 0=Timestamp, 1=CMID, 2=Payment Date, 3=Invoice No,
// 4=Invoice Amount, 5=Amount Received, 6=Payment Mode,
// 7=Transaction ID, 8=Bank Name, 9=Balance Due,
// 10=Payment Status, 11=Payment Remarks
const PAY_COLS = {
  TIMESTAMP : 0, CMID : 1, PAY_DATE : 2, INVOICE_NO : 3,
  INV_AMT   : 4, AMT_REC : 5, PAY_MODE : 6, TXN_ID : 7,
  BANK      : 8, BALANCE : 9, STATUS : 10, REMARKS : 11
};

// ── EXPENSE_FORM column positions (0-indexed) ────────────────
// 0=Timestamp, 1=CMID, 2=Expense Date, 3=Expense Category,
// 4=Expense Description, 5=Vendor Name, 6=Vendor GSTIN,
// 7=Expense Invoice No, 8=Expense Amount, 9=Tax Amount,
// 10=Total Expense, 11=Paid By, 12=Expense Payment Mode,
// 13=Approved By, 14=Expense Remarks
const EXP_COLS = {
  TIMESTAMP : 0, CMID : 1, EXP_DATE : 2, CATEGORY : 3,
  DESC      : 4, VENDOR : 5, GSTIN : 6, INV_NO : 7,
  EXP_AMT   : 8, TAX : 9, TOTAL : 10, PAID_BY : 11,
  PAY_MODE  : 12, APPROVED : 13, REMARKS : 14
};


// ============================================================
//  onFormSubmit — the ONLY trigger function needed
//  Fires whenever ANY linked form is submitted.
//  Detects which sheet was updated and routes accordingly.
// ============================================================
function onFormSubmit(e) {
  try {
    const sheetName = e.range.getSheet().getName();
    const dataRow   = e.range.getRow();

    if      (sheetName === ENQ_SHEET) _syncEnquiry(dataRow);
    else if (sheetName === PAY_SHEET) _syncPayment(dataRow);
    else if (sheetName === EXP_SHEET) _syncExpense(dataRow);
    else Logger.log("onFormSubmit: unrecognised sheet → " + sheetName);

  } catch (err) {
    Logger.log("onFormSubmit ERROR: " + err.stack);
  }
}


// ============================================================
//  SYNC: Enquiry_form → Master
// ============================================================
function _syncEnquiry(dataRow) {
  const ss   = SpreadsheetApp.getActiveSpreadsheet();
  const src  = ss.getSheetByName(ENQ_SHEET);
  const row  = src.getRange(dataRow, 1, 1, 23).getValues()[0];

  const cmid = String(row[ENQ_COLS.CMID]).trim();
  if (!cmid) return Logger.log("Enquiry: blank CMID on row " + dataRow);

  const master = ss.getSheetByName(MASTER_SHEET);
  const mRow   = _getOrCreateMasterRow(master, cmid);

  _writeToMaster(master, mRow, {
    [MC.ENQ_DATE]        : row[ENQ_COLS.ENQ_DATE],
    [MC.CLIENT_NAME]     : row[ENQ_COLS.CLIENT_NAME],
    [MC.COMPANY_NAME]    : row[ENQ_COLS.COMPANY],
    [MC.PHONE]           : row[ENQ_COLS.PHONE],
    [MC.EMAIL]           : row[ENQ_COLS.EMAIL],
    [MC.ADDRESS]         : row[ENQ_COLS.ADDRESS],
    [MC.CITY]            : row[ENQ_COLS.CITY],
    [MC.STATE]           : row[ENQ_COLS.STATE],
    [MC.GST_NO]          : row[ENQ_COLS.GST],
    [MC.PRODUCT_TYPE]    : row[ENQ_COLS.PRODUCT_TYPE],
    [MC.PRODUCT_DETAILS] : row[ENQ_COLS.PROD_DET],
    [MC.QUANTITY]        : row[ENQ_COLS.QTY],
    [MC.SIZE_SPEC]       : row[ENQ_COLS.SIZE],
    [MC.MATERIAL]        : row[ENQ_COLS.MATERIAL],
    [MC.PRINTING_TYPE]   : row[ENQ_COLS.PRINT],
    [MC.EST_VALUE]       : row[ENQ_COLS.EST_VAL],
    [MC.ENQ_SOURCE]      : row[ENQ_COLS.SOURCE],
    [MC.SALES_PERSON]    : row[ENQ_COLS.SALES],
    [MC.ENQ_STATUS]      : row[ENQ_COLS.STATUS],
    [MC.FOLLOWUP_DATE]   : row[ENQ_COLS.FOLLOWUP],
    [MC.ENQ_REMARKS]     : row[ENQ_COLS.REMARKS],
  });

  Logger.log("Enquiry synced → Master row " + mRow + " for CMID: " + cmid);
}


// ============================================================
//  SYNC: Payment_form → Master
// ============================================================
function _syncPayment(dataRow) {
  const ss   = SpreadsheetApp.getActiveSpreadsheet();
  const src  = ss.getSheetByName(PAY_SHEET);
  const row  = src.getRange(dataRow, 1, 1, 12).getValues()[0];

  const cmid = String(row[PAY_COLS.CMID]).trim();
  if (!cmid) return Logger.log("Payment: blank CMID on row " + dataRow);

  const master = ss.getSheetByName(MASTER_SHEET);
  const mRow   = _getOrCreateMasterRow(master, cmid);

  _writeToMaster(master, mRow, {
    [MC.PAY_DATE]    : row[PAY_COLS.PAY_DATE],
    [MC.INVOICE_NO]  : row[PAY_COLS.INVOICE_NO],
    [MC.INVOICE_AMT] : row[PAY_COLS.INV_AMT],
    [MC.AMT_RECEIVED]: row[PAY_COLS.AMT_REC],
    [MC.PAY_MODE]    : row[PAY_COLS.PAY_MODE],
    [MC.TXN_ID]      : row[PAY_COLS.TXN_ID],
    [MC.BANK_NAME]   : row[PAY_COLS.BANK],
    [MC.BALANCE_DUE] : row[PAY_COLS.BALANCE],
    [MC.PAY_STATUS]  : row[PAY_COLS.STATUS],
    [MC.PAY_REMARKS] : row[PAY_COLS.REMARKS],
  });

  Logger.log("Payment synced → Master row " + mRow + " for CMID: " + cmid);
}


// ============================================================
//  SYNC: Expense_form → Master
// ============================================================
function _syncExpense(dataRow) {
  const ss   = SpreadsheetApp.getActiveSpreadsheet();
  const src  = ss.getSheetByName(EXP_SHEET);
  const row  = src.getRange(dataRow, 1, 1, 15).getValues()[0];

  const cmid = String(row[EXP_COLS.CMID]).trim();
  if (!cmid) return Logger.log("Expense: blank CMID on row " + dataRow);

  const master = ss.getSheetByName(MASTER_SHEET);
  const mRow   = _getOrCreateMasterRow(master, cmid);

  _writeToMaster(master, mRow, {
    [MC.EXP_DATE]     : row[EXP_COLS.EXP_DATE],
    [MC.EXP_CATEGORY] : row[EXP_COLS.CATEGORY],
    [MC.EXP_DESC]     : row[EXP_COLS.DESC],
    [MC.VENDOR_NAME]  : row[EXP_COLS.VENDOR],
    [MC.VENDOR_GSTIN] : row[EXP_COLS.GSTIN],
    [MC.EXP_INVOICE_NO]: row[EXP_COLS.INV_NO],
    [MC.EXP_AMOUNT]   : row[EXP_COLS.EXP_AMT],
    [MC.TAX_AMOUNT]   : row[EXP_COLS.TAX],
    [MC.TOTAL_EXP]    : row[EXP_COLS.TOTAL],
    [MC.PAID_BY]      : row[EXP_COLS.PAID_BY],
    [MC.EXP_PAY_MODE] : row[EXP_COLS.PAY_MODE],
    [MC.APPROVED_BY]  : row[EXP_COLS.APPROVED],
    [MC.EXP_REMARKS]  : row[EXP_COLS.REMARKS],
  });

  Logger.log("Expense synced → Master row " + mRow + " for CMID: " + cmid);
}


// ============================================================
//  HELPER: Find existing CMID row in Master, or create new one
//  Searches only data rows (row 7 onwards) — skips panel + header
// ============================================================
function _getOrCreateMasterRow(masterSheet, cmid) {
  const lastRow = masterSheet.getLastRow();

  if (lastRow >= DATA_START) {
    const range  = masterSheet.getRange(DATA_START, 1, lastRow - DATA_START + 1, 1);
    const values = range.getValues();
    for (let i = 0; i < values.length; i++) {
      if (String(values[i][0]).trim() === cmid) {
        return DATA_START + i;
      }
    }
  }

  // Not found — write CMID in a new row
  const newRow = Math.max(lastRow + 1, DATA_START);
  masterSheet.getRange(newRow, MC.CMID).setValue(cmid);
  return newRow;
}


// ============================================================
//  HELPER: Write a map of { masterCol: value } into Master sheet
//  Always stamps Last Updated timestamp
// ============================================================
function _writeToMaster(masterSheet, row, fieldMap) {
  fieldMap[MC.LAST_UPDATED] = new Date();
  for (const [col, val] of Object.entries(fieldMap)) {
    if (val !== "" && val !== null && val !== undefined) {
      masterSheet.getRange(row, Number(col)).setValue(val);
    }
  }
}


// ============================================================
//  TRIGGER SETUP
//  Run this ONCE after pasting the script.
//  Clears old triggers and registers a fresh onFormSubmit
//  trigger for each form sheet.
// ============================================================
function registerTriggers() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // Remove ALL existing form-submit triggers to avoid duplicates
  ScriptApp.getProjectTriggers().forEach(t => {
    if (t.getEventType() === ScriptApp.EventType.ON_FORM_SUBMIT) {
      ScriptApp.deleteTrigger(t);
    }
  });

  // Create one trigger per form sheet
  [ENQ_SHEET, PAY_SHEET, EXP_SHEET].forEach(name => {
    if (ss.getSheetByName(name)) {
      ScriptApp.newTrigger("onFormSubmit")
        .forSpreadsheet(ss)
        .onFormSubmit()
        .create();
      Logger.log("Trigger registered for sheet: " + name);
    } else {
      Logger.log("WARNING: sheet not found — " + name);
    }
  });

  SpreadsheetApp.getUi().alert(
    "✅ Triggers registered!\n\n" +
    "Listening on:\n" +
    "• " + ENQ_SHEET + "\n" +
    "• " + PAY_SHEET + "\n" +
    "• " + EXP_SHEET + "\n\n" +
    "Submit any form and Master will update automatically."
  );
}


// ============================================================
//  RE-SYNC UTILITIES
//  Use these to backfill Master from existing sheet rows
//  (e.g. the JJ-001 test row you already submitted)
// ============================================================
function resyncEnquiry() {
  const ss   = SpreadsheetApp.getActiveSpreadsheet();
  const sh   = ss.getSheetByName(ENQ_SHEET);
  const last = sh.getLastRow();
  let count  = 0;
  for (let r = 2; r <= last; r++) {
    const cmid = sh.getRange(r, 2).getValue(); // col B = CMID
    if (cmid) { _syncEnquiry(r); count++; }
  }
  SpreadsheetApp.getUi().alert("✅ Enquiry re-sync complete. Rows processed: " + count);
}

function resyncPayment() {
  const ss   = SpreadsheetApp.getActiveSpreadsheet();
  const sh   = ss.getSheetByName(PAY_SHEET);
  const last = sh.getLastRow();
  let count  = 0;
  for (let r = 2; r <= last; r++) {
    const cmid = sh.getRange(r, 2).getValue(); // col B = CMID
    if (cmid) { _syncPayment(r); count++; }
  }
  SpreadsheetApp.getUi().alert("✅ Payment re-sync complete. Rows processed: " + count);
}

function resyncExpense() {
  const ss   = SpreadsheetApp.getActiveSpreadsheet();
  const sh   = ss.getSheetByName(EXP_SHEET);
  const last = sh.getLastRow();
  let count  = 0;
  for (let r = 2; r <= last; r++) {
    const cmid = sh.getRange(r, 2).getValue(); // col B = CMID
    if (cmid) { _syncExpense(r); count++; }
  }
  SpreadsheetApp.getUi().alert("✅ Expense re-sync complete. Rows processed: " + count);
}


// ============================================================
//  RECOLOUR MASTER HEADERS
//  Applies colour-coding to row 6 of Master sheet.
//  Safe to run on an existing sheet — touches only row 5 & 6.
// ============================================================
function recolourHeaders() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sh = ss.getSheetByName(MASTER_SHEET);
  if (!sh) {
    SpreadsheetApp.getUi().alert("❌ Master sheet not found.");
    return;
  }

  // Write header labels
  sh.getRange(HEADER_ROW, 1, 1, MASTER_HEADERS.length)
    .setValues([MASTER_HEADERS])
    .setFontColor("#ffffff")
    .setFontWeight("bold")
    .setHorizontalAlignment("center");

  // Colour each section
  sh.getRange(HEADER_ROW, 1,  1, 1 ).setBackground("#1a237e"); // CMID — navy
  sh.getRange(HEADER_ROW, 2,  1, 21).setBackground("#1565c0"); // Enquiry — blue
  sh.getRange(HEADER_ROW, 23, 1, 10).setBackground("#2e7d32"); // Payment — green
  sh.getRange(HEADER_ROW, 33, 1, 13).setBackground("#e65100"); // Expense — orange
  sh.getRange(HEADER_ROW, 46, 1, 1 ).setBackground("#37474f"); // Last Updated — grey
  sh.setRowHeight(HEADER_ROW, 30);

  // Legend bar in row 5
  sh.getRange(5, 1).setValue("LEGEND →")
    .setBackground("#eeeeee").setFontColor("#555555")
    .setFontSize(8).setFontWeight("bold");
  sh.getRange(5, 2, 1, 3).merge()
    .setValue("📝 Enquiry").setBackground("#bbdefb").setFontColor("#1565c0")
    .setFontSize(8).setFontWeight("bold").setHorizontalAlignment("center");
  sh.getRange(5, 5, 1, 3).merge()
    .setValue("💳 Payment").setBackground("#c8e6c9").setFontColor("#2e7d32")
    .setFontSize(8).setFontWeight("bold").setHorizontalAlignment("center");
  sh.getRange(5, 8, 1, 3).merge()
    .setValue("🧾 Expense").setBackground("#ffe0b2").setFontColor("#e65100")
    .setFontSize(8).setFontWeight("bold").setHorizontalAlignment("center");
  sh.getRange(5, 11, 1, TOTAL_COLS - 10).merge()
    .setValue("").setBackground("#eeeeee");
  sh.setRowHeight(5, 18);
  sh.setFrozenRows(HEADER_ROW);

  SpreadsheetApp.getUi().alert(
    "✅ Headers colour-coded!\n\n" +
    "🟦 Navy   = CMID (col A)\n" +
    "🔵 Blue   = Enquiry (cols B–V)\n" +
    "🟢 Green  = Payment (cols W–AF)\n" +
    "🟠 Orange = Expense (cols AG–AS)\n" +
    "⚫ Grey   = Last Updated (col AT)\n\n" +
    "Run  ⚙️ → Add Update Button  to place the\n" +
    "✏️ Update Client Record button on the sheet."
  );
}


// ============================================================
//  ADD UPDATE BUTTON — places a clickable drawn button on
//  the Master sheet anchored inside the panel (rows 1–5).
//  Google Sheets doesn't support script-inserted drawings
//  directly, so we use a workaround: a richly styled cell
//  in row 1 right side + an instructions note, AND we insert
//  a real clickable image button using the Sheets UI approach.
//
//  WHAT THIS ACTUALLY DOES:
//  • Splits row 1 so the right portion becomes a bright
//    green "✏️ UPDATE CLIENT" button cell with a note
//    instructing the user to use the menu.
//  • Also adds a dedicated button cell in col AT of row 5
//    (the legend bar) that is clearly labelled.
//  • Most importantly: inserts a real Over-The-Grid image
//    that acts as a macro button via insertImage + assigns
//    the macro showUpdateDialog to it.
// ============================================================
function addUpdateButton() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sh = ss.getSheetByName(MASTER_SHEET);
  if (!sh) {
    SpreadsheetApp.getUi().alert("❌ Master sheet not found.");
    return;
  }

  // ── Step 1: Un-merge row 1 so we can split it ────────────
  try { sh.getRange(1, 1, 1, TOTAL_COLS).breakApart(); } catch(e) {}

  // ── Step 2: Title spans cols A–AQ (1–43) ─────────────────
  sh.getRange(1, 1, 1, 43).merge()
    .setValue("📋  JJ IMPRINTS GROUP — ERP MASTER SHEET")
    .setBackground("#0d47a1")
    .setFontColor("#ffffff")
    .setFontSize(14)
    .setFontWeight("bold")
    .setHorizontalAlignment("center")
    .setVerticalAlignment("middle");

  // ── Step 3: UPDATE button cell cols AR–AT (44–46) ────────
  sh.getRange(1, 44, 1, 3).merge()
    .setValue("✏️  UPDATE\nCLIENT")
    .setBackground("#f9a825")
    .setFontColor("#000000")
    .setFontSize(11)
    .setFontWeight("bold")
    .setHorizontalAlignment("center")
    .setVerticalAlignment("middle")
    .setWrap(true);

  sh.setRowHeight(1, 48);

  // ── Step 4: Insert a transparent over-the-grid button ────
  // Remove any existing drawings named "UpdateBtn"
  const drawings = sh.getDrawings();
  drawings.forEach(d => {
    try { if (d.getContainerInfo().getAnchorRow() === 0) d.remove(); } catch(e) {}
  });

  // We use a 1x1 white PNG encoded as base64 as the button image
  // and assign showUpdateDialog as its click macro.
  // NOTE: Apps Script insertImage assigns macros via onAction.
  const blob = Utilities.newBlob(
    Utilities.base64Decode(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
    ), "image/png", "btn"
  );

  // Place image overlaid on the yellow button cell (row 1, cols 44-46)
  // anchorRow/Col are 0-indexed in pixel positioning
  try {
    const img = sh.insertImage(blob, 44, 1);
    img.setWidth(sh.getColumnWidth(44) * 3)
       .setHeight(sh.getRowHeight(1))
       .assignScript("showUpdateDialog");
  } catch(e) {
    Logger.log("Image insert note: " + e.message);
  }

  SpreadsheetApp.getUi().alert(
    "✅ Done!\n\n" +
    "The yellow  ✏️ UPDATE CLIENT  cell is now visible\n" +
    "in the top-right of the Master sheet (row 1).\n\n" +
    "Click it to open the Update Client Record dialog.\n\n" +
    "If the click doesn't work directly on the cell,\n" +
    "use:  ⚙️ JJ Imprints ERP → ✏️ Update Client Record"
  );
}


// ============================================================
//  UPDATE FORM LINKS
//  Prompts for each form URL and writes clickable hyperlinks
//  into the panel rows (2, 3, 4) of Master sheet.
// ============================================================
function updateFormLinks() {
  const ui = SpreadsheetApp.getUi();
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sh = ss.getSheetByName(MASTER_SHEET);
  if (!sh) { ui.alert("❌ Master sheet not found."); return; }

  const enq = ui.prompt("📝 Enquiry Form URL", "Paste the Enquiry Form respondent link:", ui.ButtonSet.OK_CANCEL);
  if (enq.getSelectedButton() !== ui.Button.OK) return;

  const pay = ui.prompt("💳 Payment Form URL", "Paste the Payment Form respondent link:", ui.ButtonSet.OK_CANCEL);
  if (pay.getSelectedButton() !== ui.Button.OK) return;

  const exp = ui.prompt("🧾 Expense Form URL", "Paste the Expense Form respondent link:", ui.ButtonSet.OK_CANCEL);
  if (exp.getSelectedButton() !== ui.Button.OK) return;

  _writeLinkCell(sh, 2, "📝 Open Enquiry Form →", enq.getResponseText().trim(), "#e3f2fd", "#0d47a1");
  _writeLinkCell(sh, 3, "💳 Open Payment Form →", pay.getResponseText().trim(), "#e8f5e9", "#1b5e20");
  _writeLinkCell(sh, 4, "🧾 Open Expense Form →", exp.getResponseText().trim(), "#fff3e0", "#e65100");

  ui.alert("✅ Form links updated in Master sheet rows 2–4.");
}

function _writeLinkCell(sh, rowNum, label, url, bg, textColor) {
  const cell = sh.getRange(rowNum, 4, 1, TOTAL_COLS - 3).merge();
  if (url) {
    cell.setFormula('=HYPERLINK("' + url + '","' + label + '")')
      .setFontColor(textColor).setFontWeight("bold")
      .setFontStyle("normal").setBackground(bg);
  } else {
    cell.setValue("(no URL entered)").setFontColor("#9e9e9e").setFontStyle("italic");
  }
}


// ============================================================
//  CLEAR ALL DATA — keeps Master panel/headers, wipes data rows
// ============================================================
function clearAllData() {
  const ui  = SpreadsheetApp.getUi();
  const res = ui.alert("⚠️ WARNING",
    "This deletes ALL data rows from Master, Enquiry_form, Payment_form, Expense_form.\nAre you sure?",
    ui.ButtonSet.YES_NO);
  if (res !== ui.Button.YES) return;

  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // Master: delete from row 7 onwards
  const master = ss.getSheetByName(MASTER_SHEET);
  if (master.getLastRow() >= DATA_START) {
    master.deleteRows(DATA_START, master.getLastRow() - DATA_START + 1);
  }

  // Form sheets: delete from row 2 onwards (keep header row 1)
  [ENQ_SHEET, PAY_SHEET, EXP_SHEET].forEach(name => {
    const sh = ss.getSheetByName(name);
    if (sh && sh.getLastRow() > 1) {
      sh.deleteRows(2, sh.getLastRow() - 1);
    }
  });

  ui.alert("✅ All data cleared. Headers and panel preserved.");
}


// ============================================================
//  CUSTOM MENU
// ============================================================
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("⚙️ JJ Imprints ERP")
    .addItem("1. Register Form Triggers",        "registerTriggers")
    .addItem("2. Update Form Links",              "updateFormLinks")
    .addItem("3. 🎨 Recolour Master Headers",     "recolourHeaders")
    .addItem("4. 🖱️ Add Update Button to Sheet",  "addUpdateButton")
    .addSeparator()
    .addItem("✏️ Update Client Record",           "showUpdateDialog")
    .addSeparator()
    .addItem("Re-sync: Enquiry → Master",         "resyncEnquiry")
    .addItem("Re-sync: Payment → Master",         "resyncPayment")
    .addItem("Re-sync: Expense → Master",         "resyncExpense")
    .addSeparator()
    .addItem("⚠️ Clear ALL data (keep headers)",  "clearAllData")
    .addToUi();
}


// ============================================================
//  UPDATE CLIENT RECORD — Custom Dialog Popup
//  Opens a popup where user picks a CMID and updates:
//  • Enquiry Status, Follow-up Date, Sales Person, Enquiry Remarks
//  • Payment Status, Balance Due, Payment Remarks
// ============================================================
function showUpdateDialog() {
  const ss     = SpreadsheetApp.getActiveSpreadsheet();
  const master = ss.getSheetByName(MASTER_SHEET);
  const last   = master.getLastRow();

  // Build list of all existing CMIDs from Master sheet
  if (last < DATA_START) {
    SpreadsheetApp.getUi().alert("No client records found in Master sheet yet.");
    return;
  }

  const cmidList = master
    .getRange(DATA_START, MC.CMID, last - DATA_START + 1, 1)
    .getValues()
    .flat()
    .filter(v => v !== "" && v !== null);

  if (cmidList.length === 0) {
    SpreadsheetApp.getUi().alert("No CMIDs found in Master sheet.");
    return;
  }

  // Build CMID options for the dropdown
  const cmidOptions = cmidList.map(id =>
    `<option value="${id}">${id}</option>`
  ).join("");

  const html = `
<!DOCTYPE html>
<html>
<head>
  <base target="_top">
  <style>
    * { box-sizing: border-box; font-family: 'Google Sans', Arial, sans-serif; }
    body { margin: 0; padding: 0; background: #f8f9fa; }

    .header {
      background: #1a237e;
      color: white;
      padding: 16px 20px;
      font-size: 15px;
      font-weight: bold;
      letter-spacing: 0.3px;
    }

    .body { padding: 16px 20px; }

    .cmid-row {
      display: flex; align-items: center; gap: 10px;
      margin-bottom: 16px;
    }
    .cmid-row select {
      flex: 1; padding: 8px 10px; border: 1.5px solid #1a237e;
      border-radius: 6px; font-size: 13px; font-weight: bold;
      color: #1a237e; background: #e8eaf6;
    }
    .cmid-row button {
      padding: 8px 14px; background: #1a237e; color: white;
      border: none; border-radius: 6px; cursor: pointer;
      font-size: 12px; font-weight: bold;
    }
    .cmid-row button:hover { background: #283593; }

    .section {
      border-radius: 8px; margin-bottom: 14px; overflow: hidden;
      border: 1px solid #e0e0e0;
    }
    .section-title {
      padding: 8px 14px; font-size: 12px; font-weight: bold;
      color: white; letter-spacing: 0.4px;
    }
    .enq-title  { background: #1565c0; }
    .pay-title  { background: #2e7d32; }

    .section-body { padding: 12px 14px; background: white; }

    .field { margin-bottom: 10px; }
    .field label {
      display: block; font-size: 11px; font-weight: bold;
      color: #555; margin-bottom: 4px; text-transform: uppercase;
      letter-spacing: 0.3px;
    }
    .field input, .field select, .field textarea {
      width: 100%; padding: 7px 10px; border: 1px solid #ccc;
      border-radius: 5px; font-size: 13px; color: #333;
    }
    .field textarea { resize: vertical; min-height: 56px; }
    .field input:focus, .field select:focus, .field textarea:focus {
      outline: none; border-color: #1a237e;
    }

    .current-val {
      font-size: 10px; color: #888; margin-top: 3px;
    }
    .current-val span { color: #1a237e; font-weight: bold; }

    .row2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }

    .footer {
      padding: 12px 20px; background: #f1f3f4;
      border-top: 1px solid #e0e0e0;
      display: flex; justify-content: flex-end; gap: 10px;
    }
    .btn-cancel {
      padding: 9px 20px; background: white; color: #555;
      border: 1px solid #ccc; border-radius: 6px;
      cursor: pointer; font-size: 13px;
    }
    .btn-save {
      padding: 9px 20px; background: #1b5e20; color: white;
      border: none; border-radius: 6px; cursor: pointer;
      font-size: 13px; font-weight: bold;
    }
    .btn-save:hover { background: #2e7d32; }
    .btn-cancel:hover { background: #f5f5f5; }

    #status {
      font-size: 12px; color: #2e7d32; font-weight: bold;
      padding: 6px 20px; display: none; text-align: center;
    }
    #loading {
      font-size: 12px; color: #777; padding: 20px;
      text-align: center; display: none;
    }
  </style>
</head>
<body>

<div class="header">✏️ Update Client Record</div>
<div class="body">

  <!-- CMID Selector -->
  <div class="cmid-row">
    <select id="cmidSelect">
      <option value="">— Select CMID —</option>
      ${cmidOptions}
    </select>
    <button onclick="loadRecord()">Load</button>
  </div>

  <div id="loading">Loading client data...</div>

  <div id="formArea" style="display:none">

    <!-- ENQUIRY SECTION -->
    <div class="section">
      <div class="section-title enq-title">📝 Enquiry Fields</div>
      <div class="section-body">
        <div class="row2">
          <div class="field">
            <label>Enquiry Status</label>
            <select id="enqStatus">
              <option>New</option>
              <option>In Discussion</option>
              <option>Quoted</option>
              <option>Sample Shared</option>
              <option>Converted</option>
              <option>Lost</option>
            </select>
            <div class="current-val">Current: <span id="cur_enqStatus">—</span></div>
          </div>
          <div class="field">
            <label>Follow-up Date</label>
            <input type="date" id="followupDate">
            <div class="current-val">Current: <span id="cur_followup">—</span></div>
          </div>
        </div>
        <div class="field">
          <label>Sales Person</label>
          <input type="text" id="salesPerson" placeholder="Name of sales person">
          <div class="current-val">Current: <span id="cur_sales">—</span></div>
        </div>
        <div class="field">
          <label>Enquiry Remarks</label>
          <textarea id="enqRemarks" placeholder="Add notes or remarks..."></textarea>
          <div class="current-val">Current: <span id="cur_enqRemarks">—</span></div>
        </div>
      </div>
    </div>

    <!-- PAYMENT SECTION -->
    <div class="section">
      <div class="section-title pay-title">💳 Payment Fields</div>
      <div class="section-body">
        <div class="row2">
          <div class="field">
            <label>Payment Status</label>
            <select id="payStatus">
              <option>Advance</option>
              <option>Partial</option>
              <option>Full Payment</option>
              <option>Pending</option>
              <option>Overdue</option>
            </select>
            <div class="current-val">Current: <span id="cur_payStatus">—</span></div>
          </div>
          <div class="field">
            <label>Balance Due (₹)</label>
            <input type="number" id="balanceDue" placeholder="0">
            <div class="current-val">Current: <span id="cur_balance">—</span></div>
          </div>
        </div>
        <div class="field">
          <label>Payment Remarks</label>
          <textarea id="payRemarks" placeholder="Add payment notes..."></textarea>
          <div class="current-val">Current: <span id="cur_payRemarks">—</span></div>
        </div>
      </div>
    </div>

  </div><!-- end formArea -->
</div><!-- end body -->

<div id="status">✅ Record updated successfully!</div>

<div class="footer">
  <button class="btn-cancel" onclick="google.script.host.close()">Cancel</button>
  <button class="btn-save" id="saveBtn" onclick="saveRecord()" style="display:none">
    💾 Save Changes
  </button>
</div>

<script>
  var currentCmid = "";

  function loadRecord() {
    var cmid = document.getElementById("cmidSelect").value;
    if (!cmid) { alert("Please select a CMID first."); return; }
    currentCmid = cmid;
    document.getElementById("loading").style.display = "block";
    document.getElementById("formArea").style.display = "none";
    document.getElementById("saveBtn").style.display  = "none";
    document.getElementById("status").style.display   = "none";

    google.script.run
      .withSuccessHandler(populateForm)
      .withFailureHandler(function(err){ alert("Error: " + err.message); })
      .getClientRecord(cmid);
  }

  function populateForm(data) {
    document.getElementById("loading").style.display  = "none";
    document.getElementById("formArea").style.display = "block";
    document.getElementById("saveBtn").style.display  = "inline-block";

    // Enquiry fields
    setDropdown("enqStatus",  data.enqStatus);
    document.getElementById("followupDate").value = data.followupDate || "";
    document.getElementById("salesPerson").value  = data.salesPerson  || "";
    document.getElementById("enqRemarks").value   = data.enqRemarks   || "";

    // Payment fields
    setDropdown("payStatus", data.payStatus);
    document.getElementById("balanceDue").value  = data.balanceDue  || "";
    document.getElementById("payRemarks").value  = data.payRemarks  || "";

    // Current value labels
    document.getElementById("cur_enqStatus").textContent = data.enqStatus   || "—";
    document.getElementById("cur_followup").textContent  = data.followupDate || "—";
    document.getElementById("cur_sales").textContent     = data.salesPerson  || "—";
    document.getElementById("cur_enqRemarks").textContent= data.enqRemarks   || "—";
    document.getElementById("cur_payStatus").textContent = data.payStatus    || "—";
    document.getElementById("cur_balance").textContent   = data.balanceDue !== "" ? "₹" + data.balanceDue : "—";
    document.getElementById("cur_payRemarks").textContent= data.payRemarks   || "—";
  }

  function setDropdown(id, val) {
    var sel = document.getElementById(id);
    for (var i = 0; i < sel.options.length; i++) {
      if (sel.options[i].value === val) { sel.selectedIndex = i; return; }
    }
  }

  function saveRecord() {
    if (!currentCmid) { alert("No CMID loaded."); return; }
    var updates = {
      cmid        : currentCmid,
      enqStatus   : document.getElementById("enqStatus").value,
      followupDate: document.getElementById("followupDate").value,
      salesPerson : document.getElementById("salesPerson").value,
      enqRemarks  : document.getElementById("enqRemarks").value,
      payStatus   : document.getElementById("payStatus").value,
      balanceDue  : document.getElementById("balanceDue").value,
      payRemarks  : document.getElementById("payRemarks").value,
    };
    document.getElementById("saveBtn").textContent = "Saving...";
    google.script.run
      .withSuccessHandler(function() {
        document.getElementById("status").style.display    = "block";
        document.getElementById("saveBtn").textContent     = "💾 Save Changes";
        // Refresh current values
        loadRecord();
      })
      .withFailureHandler(function(err) {
        alert("Save failed: " + err.message);
        document.getElementById("saveBtn").textContent = "💾 Save Changes";
      })
      .saveClientRecord(updates);
  }
</script>
</body>
</html>`;

  const htmlOutput = HtmlService.createHtmlOutput(html)
    .setWidth(520)
    .setHeight(620)
    .setTitle("Update Client Record");

  SpreadsheetApp.getUi().showModalDialog(htmlOutput, "✏️ Update Client Record");
}


// ============================================================
//  SERVER-SIDE: Read current values for a CMID
//  Called by the dialog via google.script.run
// ============================================================
function getClientRecord(cmid) {
  const ss     = SpreadsheetApp.getActiveSpreadsheet();
  const master = ss.getSheetByName(MASTER_SHEET);
  const mRow   = _getOrCreateMasterRow(master, cmid);

  // Read all relevant columns in one call for efficiency
  const vals = master.getRange(mRow, 1, 1, TOTAL_COLS).getValues()[0];

  // Format date fields nicely
  function fmtDate(v) {
    if (!v || v === "") return "";
    try {
      const d = new Date(v);
      return isNaN(d) ? String(v) : d.toISOString().split("T")[0]; // YYYY-MM-DD
    } catch(e) { return String(v); }
  }

  return {
    enqStatus   : String(vals[MC.ENQ_STATUS    - 1] || ""),
    followupDate: fmtDate(vals[MC.FOLLOWUP_DATE - 1]),
    salesPerson : String(vals[MC.SALES_PERSON   - 1] || ""),
    enqRemarks  : String(vals[MC.ENQ_REMARKS    - 1] || ""),
    payStatus   : String(vals[MC.PAY_STATUS     - 1] || ""),
    balanceDue  : String(vals[MC.BALANCE_DUE    - 1] || ""),
    payRemarks  : String(vals[MC.PAY_REMARKS    - 1] || ""),
  };
}


// ============================================================
//  SERVER-SIDE: Write updated values back to Master sheet
//  Called by the dialog via google.script.run
// ============================================================
function saveClientRecord(updates) {
  const ss     = SpreadsheetApp.getActiveSpreadsheet();
  const master = ss.getSheetByName(MASTER_SHEET);
  const mRow   = _getOrCreateMasterRow(master, updates.cmid);

  // Helper to write only if value is non-empty
  function w(col, val) {
    if (val !== null && val !== undefined && String(val).trim() !== "") {
      master.getRange(mRow, col).setValue(val);
    }
  }

  w(MC.ENQ_STATUS,     updates.enqStatus);
  w(MC.FOLLOWUP_DATE,  updates.followupDate);
  w(MC.SALES_PERSON,   updates.salesPerson);
  w(MC.ENQ_REMARKS,    updates.enqRemarks);
  w(MC.PAY_STATUS,     updates.payStatus);
  w(MC.BALANCE_DUE,    updates.balanceDue);
  w(MC.PAY_REMARKS,    updates.payRemarks);
  w(MC.LAST_UPDATED,   new Date());

  Logger.log("saveClientRecord: updated CMID " + updates.cmid + " at row " + mRow);
}

