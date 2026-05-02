# 📋 JJ Imprints ERP — Google Sheets + Apps Script

[![Made with Google Apps Script](https://img.shields.io/badge/Made%20with-Google%20Apps%20Script-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://script.google.com)
[![Google Sheets](https://img.shields.io/badge/Google%20Sheets-ERP-34A853?style=for-the-badge&logo=google-sheets&logoColor=white)](https://sheets.google.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)
[![Status: Live](https://img.shields.io/badge/Status-Live-brightgreen?style=for-the-badge)]()

> A fully functional, zero-cost ERP system built for **[JJ Imprints Group](https://jjprintindia.com/)** — a printing & branding company based in India — using Google Sheets, Google Forms, and Google Apps Script.

---

## 🚀 What This Does

This ERP system replaces manual tracking spreadsheets with an automated, form-driven database that:

- Captures **client enquiries**, **payments**, and **expenses** via Google Forms
- Automatically syncs all form submissions into a **single Master sheet** — one row per client (CMID)
- Allows **direct in-sheet updates** (status, remarks, follow-ups) via a popup dialog — no form resubmission needed
- Colour-codes data by category so your team can read records at a glance
- Keeps a **full audit log** in individual form sheets while always showing the latest data in Master

---

## 🖼️ Screenshots

### Master Sheet — Panel + Colour-coded Headers
![Master Sheet](docs/screenshots/master-sheet.png)

### Update Client Record — Popup Dialog
![Update Dialog](docs/screenshots/update-dialog.png)

### Enquiry Form Sheet
![Enquiry Data](docs/screenshots/enquiry-data.png)

> 📌 *Add your own screenshots in the `docs/screenshots/` folder after setup.*

---

## 📁 Repository Structure

```
jj-imprints-erp/
│
├── src/
│   └── ERP_Script.gs          # Complete Google Apps Script (paste into Apps Script editor)
│
├── docs/
│   ├── SETUP_GUIDE.md         # Full step-by-step setup instructions
│   └── screenshots/           # Add your own screenshots here
│
├── assets/
│   └── form-fields.md         # All form fields documented
│
├── LICENSE                    # MIT License
└── README.md                  # This file
```

---

## ⚙️ Features

| Feature | Details |
|---------|---------|
| 📝 Enquiry Form | 22 fields — client info, product, printing type, sales person, status |
| 💳 Payment Form | 11 fields — invoice, amount, mode, transaction ID, balance |
| 🧾 Expense Form | 14 fields — vendor, category, GST, tax, approval |
| 🔄 Auto-sync | Form submissions instantly update Master sheet via triggers |
| 🔑 CMID System | One row per client — all 3 forms update the same row |
| ✏️ Update Dialog | Popup to update status/remarks without re-submitting forms |
| 🎨 Colour-coding | Blue = Enquiry, Green = Payment, Orange = Expense |
| 🔗 Form Links | Clickable links to all 3 forms pinned in the sheet panel |
| 🔁 Re-sync | Backfill Master from existing form data anytime |
| 🧹 Clear Data | Wipe all data rows while preserving headers and panel |

---

## 🗂️ Master Sheet Layout

```
Row 1  → 📋 Title banner  |  ✏️ UPDATE CLIENT button (yellow)
Row 2  → 📝 Enquiry Form link (blue)
Row 3  → 💳 Payment Form link (green)
Row 4  → 🧾 Expense Form link (orange)
Row 5  → Colour legend bar
Row 6  → Column headers (frozen)
Row 7+ → Client data — one row per CMID
```

**Column sections:**

| Columns | Section | Colour |
|---------|---------|--------|
| A | CMID | 🟦 Navy |
| B – V | Enquiry data (22 fields) | 🔵 Blue |
| W – AF | Payment data (10 fields) | 🟢 Green |
| AG – AS | Expense data (13 fields) | 🟠 Orange |
| AT | Last Updated (auto) | ⚫ Grey |

---

## 🛠️ Tech Stack

- **Google Sheets** — database + UI
- **Google Forms** — data entry
- **Google Apps Script** (V8 runtime) — automation, triggers, dialogs
- **HTML Service** — custom popup dialog with live data fetch
- **No external APIs, no paid tools, no backend**

---

## 📦 Setup Instructions

See the full guide → [`docs/SETUP_GUIDE.md`](docs/SETUP_GUIDE.md)

**Quick start:**
1. Create a new Google Spreadsheet
2. Go to **Extensions → Apps Script**
3. Paste the contents of `src/ERP_Script.gs`
4. Save and refresh the sheet
5. Use the **⚙️ JJ Imprints ERP** menu to set up sheets, link forms, and register triggers

---

## 📋 CMID System

Every client gets a unique **Client ID (CMID)** assigned manually (e.g. `JJ-001`, `JJ-002`).

- The same CMID is used across all 3 forms
- In Master sheet, there is **always exactly one row per CMID**
- When a form is submitted with an existing CMID → that row is **updated in place**
- Individual form sheets keep a **full timestamped log** of every submission

> For internal/non-client expenses, use `INTERNAL-EXP` or a month code like `EXP-MAY2025`

---

## 🧪 Testing

Use the sample test data in [`docs/SETUP_GUIDE.md`](docs/SETUP_GUIDE.md#testing) to verify the system end-to-end:

1. Submit Enquiry Form with `CMID: JJ-001`
2. Submit Payment Form with `CMID: JJ-001`
3. Submit Expense Form with `CMID: JJ-001`
4. Verify Master sheet shows **1 row** for `JJ-001` with all 3 form sections filled

---

## 🙋 About

Built for **JJ Imprints Group** — a promotional products & printing company.

- 🌐 Website: [jjprintindia.com](https://jjprintindia.com/)
- 📍 India

---

## 📄 License

This project is licensed under the [MIT License](LICENSE) — feel free to use, modify, and distribute.

---

## ⭐ If this helped you

Give the repo a ⭐ star — it helps others find it!
