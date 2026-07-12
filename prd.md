# PRD – AA-hub: Enterprise Accounting Web App (Student Practice Edition)

| | |
|---|---|
| **Product** | AA-hub – Minimalized enterprise accounting web app (streamlined from MISA SME) |
| **Document version** | 1.1 |
| **Document type** | Product Requirements Document (PRD) |
| **Status** | Updated – official statutory templates integrated |
| **Date** | 11 Jul 2026 |
| **Applicable accounting standard** | Circular 99/2025/TT-BTC (dated 27 Oct 2025, Ministry of Finance of Vietnam) |
| **Reference templates** | B01-DN (Statement of Financial Position), B02-DN (Income Statement) – per Circular 99/2025 |
| **Target users** | Accounting & Auditing students practicing bookkeeping operations |

> **Changelog v1.1:** Integrated the official statutory templates from two supplementary files (`bao-cao-tinh-hinh-tai-chinh-theo-thong-tu99.docx` and `99_2025_TT-BTC_565484.docx`). Finalized the structure and indicator codes ("Mã số") for the Income Statement (§8.3) and the Statement of Financial Position (§8.4); added Appendix B (Account → SoFP indicator-code mapping) and Appendix C (Account → Income Statement indicator-code mapping); closed dependencies D1 and D2.

---

## 1. Background & Objectives

### 1.1. Background
Accounting students need a simulated environment to practice the full cycle of recording → posting → preparing financial statements. Commercial software such as MISA SME is feature-complete but too complex, contains many modules irrelevant to learning, carries licensing cost, and has a steep learning curve. AA-hub is built as a **minimalized** version of MISA SME, retaining only the core operational flow students must master: master-data management, cash/bank voucher posting, and the preparation of the four foundational financial reports.

### 1.2. Product objectives
1. Allow students to enter cash transactions (cash and bank receipts/payments) and have the system **automatically generate journal entries, printable vouchers, and downstream report data** — mirroring the true data flow of real accounting software.
2. Help learners **see the cause-and-effect relationship** between a single journal entry and its impact on the General Journal → Trial Balance → Income Statement → Statement of Financial Position.
3. Ensure all computations follow the principles of double-entry and balance (Total Debit = Total Credit; Total Assets = Total Equity & Liabilities).

### 1.3. Success Metrics
- **Correctness:** 100% of sample transactions yield a balanced Trial Balance (Total Debit movement = Total Credit movement) and a balanced Statement of Financial Position (Total Assets = Total Equity & Liabilities).
- **Flow completion:** A user can create a voucher and view the corresponding printed voucher in ≤ 5 actions.
- **Automation:** No manual step is required for data to flow from a voucher into all four reports.

---

## 2. Target Users & Personas

| Persona | Description | Key needs |
|---|---|---|
| **Student (primary user)** | Enrolled in Principles of Accounting / Financial Accounting | Enter transactions quickly, see auto-generated vouchers and reports to check exercises |
| **Instructor (secondary)** | Sets exercises, grades work | View company data tied to each student account, cross-check results |

> **This PRD** focuses on the Student flow. The Instructor/admin role is listed in the Roadmap for a later phase.

---

## 3. Scope

### 3.1. In Scope
- Management of company information, suppliers, and customers.
- Chart of Accounts per Circular 99/2025/TT-BTC (pre-seeded + auto-fill from a template).
- **Cash/Bank Transactions module**: cash receipts/payments (account 111) and bank deposits (account 112), distinguishing Customer vs. Supplier counterparties.
- Generation and printing of vouchers: **Cash Receipt, Cash Payment, Payment Order**.
- Four reports: **General Journal, Trial Balance, Income Statement, Statement of Financial Position (Balance Sheet)**.

### 3.2. Out of Scope (v1.0)
- Full Purchasing, Sales, Inventory, Fixed Assets, Payroll, Tax (returns), and Tools & Supplies modules as in the full product.
- Automatic period-end closing entries to account 911 (this version stops at account class 8; see Assumptions).
- Multi-currency, multi-branch, granular permissions.
- E-invoice integration, digital signatures, real electronic banking.

---

## 4. Glossary

| Term | Definition |
|---|---|
| **Voucher** | A record of an economic transaction (cash receipt, cash payment, payment order, etc.) |
| **Journal entry / Posting** | Recording Debit – Credit to one or more accounts for a transaction |
| **Debit account / Credit account** | The account recorded on the Debit / Credit side of an entry |
| **Counterparty (Partner)** | The supplier or customer involved in a transaction |
| **Movement (arising amount)** | The amount of change during the period (as opposed to opening/closing balance) |
| **Account class 1–4** | Asset accounts (1, 2) and Equity/Liability accounts (3, 4) – feed the Trial Balance & Balance Sheet |
| **Account class 5–8** | Revenue/Income accounts (5, 7) and Expense accounts (6, 8) – feed the Income Statement |

---

## 5. Information Architecture & Sitemap

```
AA-hub
├── 1. Company Information
│   ├── 1.1 Company profile (linked to the student account)
│   ├── 1.2 Supplier list
│   ├── 1.3 Customer list
│   └── 1.4 Chart of Accounts (Circular 99/2025)
│
├── 2. Cash/Bank Transactions
│   ├── 2.1 Voucher list
│   └── 2.2 Create voucher
│         ├── Choose source: [Cash Fund] | [Bank Deposit]
│         └── Choose type:  [Receive] [Receive from Customer] [Pay] [Pay Supplier]
│               → Posting form → Save → View/Print voucher
│
└── 3. Reports
    ├── 3.1 General Journal
    ├── 3.2 Trial Balance
    ├── 3.3 Income Statement
    └── 3.4 Statement of Financial Position (Balance Sheet)
```

**Data-flow principle — the backbone of the product:**

```
Voucher (Module 2)  ──►  Ledger entries
        │
        ├──►  General Journal   (lists every entry)
        ├──►  Trial Balance     (aggregates accounts 1–4)
        ├──►  Income Statement  (aggregates accounts 5–8)
        └──►  Statement of Financial Position (closing balances of accounts 1–4)
```
Every report is a **function of the set of ledger entries** — no report figures are entered manually (except opening balances). This is an invariant requirement of the system.

---

## 6. Module 1 – Company Information

### 6.1. Company profile
**Purpose:** Store the profile of the enterprise the student is accounting for, tied to the login account so instructors can cross-check.

**Data fields:**

| Field | Type | Required | Note |
|---|---|---|---|
| Company name | Text | ✔ | |
| Address | Text | ✔ | Printed on vouchers |
| Tax code (Tax ID) | Text (10/13 digits) | ✔ | Validate VN tax-code format |
| Student full name | Text | ✔ | Tied to the account |
| Class | Text | ✔ | Tied to the account |
| Accounting period | Date range | ✔ | Defines the period for reports & opening balances |

**Functional requirements:**
- FR-1.1.1: Each student account is tied to **one company profile**.
- FR-1.1.2: Company info (name, address, tax code) **auto-populates** the header of every printed voucher.

**Acceptance criteria:** Enter company info → open any Cash Receipt → the voucher header shows the correct Company name, Address, and Tax code.

### 6.2. Supplier list
**Fields:** Supplier name, Address, Tax code, **Goods name** (items supplied).
- FR-1.2.1: CRUD for the supplier list.
- FR-1.2.2: A supplier is the **data source for the "Counterparty" field** in Pay Supplier transactions.

### 6.3. Customer list
**Fields:** Customer name, Address, Tax code.
- FR-1.3.1: CRUD for the customer list.
- FR-1.3.2: A customer is the data source for the "Counterparty" field in Receive from Customer transactions.

> **Counterparty normalization:** when a counterparty is selected on the posting form, the system **auto-fills the corresponding Address and Tax code**, keeping master data consistent with the voucher.

### 6.4. Chart of Accounts
**Purpose:** Provide a standard account list for users to choose from when posting entries.

**Requirements:**
- FR-1.4.1: The system **pre-seeds the entire chart of accounts per Circular 99/2025/TT-BTC** (source of truth: the project-provided file `99_2025_TT-BTC_565484.docx`). Data is loaded once at initialization; no manual entry needed. Class-9 accounts (e.g., **911 – Determination of business results**) remain in the list for completeness but are **not used in v1.0** (see Assumption A1 – no closing to 911).
- FR-1.4.2: Each account carries: **Account number, Account name, Level (1 / 2), Parent account, Account class (Asset / Equity-Liability / Revenue / Expense…), Balance nature (Debit / Credit / dual)**.
- FR-1.4.3: **Auto-fill from a template:** users may apply a standard chart-of-accounts template to populate their company's list (like choosing a template in MISA) instead of typing each row.
- FR-1.4.4: The account picker on the posting form is a **searchable combobox** by account number or name.

**Classification used for reporting (mandatory tagging):**

| Group | Leading digit | Nature | Feeds report |
|---|---|---|---|
| Assets | 1, 2 | Balance & increases on **Debit** | Trial Balance + Balance Sheet (Assets side) |
| Equity & Liabilities | 3, 4 | Balance & increases on **Credit** | Trial Balance + Balance Sheet (Equity & Liabilities side) |
| Revenue / Income | 5, 7 | Closed on **Credit** | Income Statement (positive figure) |
| Expenses | 6, 8 | Closed on **Debit** | Income Statement (negative, in parentheses) |

---

## 7. Module 2 – Cash/Bank Transactions

This is the core data-entry module. All report data originates here.

### 7.1. Voucher list screen

**Table layout:**

| No. | Voucher No. | Counterparty | Voucher date | Description | Amount | Actions |
|---|---|---|---|---|---|---|
| Auto | PT0001… | (customer/supplier name) | dd/mm/yyyy | Narration | 1,000,000 | 👁 View / ✏️ Edit |

**Functional requirements:**
- FR-2.1.1: **No.** auto-increments; **Voucher No.** is auto-generated with a prefix by voucher type (e.g., `PT` cash receipt, `PC` cash payment, `UNC` payment order) plus a sequence number.
- FR-2.1.2: **Search/filter** on columns: Voucher No., Counterparty, Voucher date, Description (each has a "Search" box).
- FR-2.1.3: **Actions** column: *View voucher* (opens the printable voucher) and *Edit voucher* (reopens the posting form). Editing and re-saving updates all downstream reports.
- FR-2.1.4: A prominent **"Create voucher"** button at the top of the list.
- FR-2.1.5: Amounts display with VN thousands separators (dot).

### 7.2. Create-voucher flow (two-step selection)

**Step 1 – Choose cash source:**
- `[Cash Fund]` → all entries use **account 111**
- `[Bank Deposit]` → all entries use **account 112**

**Step 2 – Choose transaction type (4 options):**

| Option | Meaning | Printed voucher |
|---|---|---|
| **Receive** | General receipt (no specific customer, e.g., other income) | Cash Receipt (if 111) / Accounting Voucher – Bank Credit Advice (if 112) |
| **Receive from Customer** | Customer payment / settling receivables | Cash Receipt (111) / Bank Credit Advice (112) |
| **Pay** | General payment (expenses, other) | Cash Payment (111) / **Payment Order** (112) |
| **Pay Supplier** | Paying/settling supplier payables | Cash Payment (111) / **Payment Order** (112) |

> The combination **2 sources × 4 types = 8 transaction scenarios**. Default journal entries per scenario are in **Appendix A**.

### 7.3. Detailed posting form

**Header section:**

| Field | Required | Note |
|---|---|---|
| Counterparty | Depends on type | Chosen from Customers (Receive from Customer) or Suppliers (Pay Supplier); auto-fills Address + Tax code |
| Address | Auto | Auto-filled from counterparty, editable |
| Reason (for receipt/payment) | ✔ | Becomes the "Narration" on the voucher and in the General Journal |
| Voucher date | ✔ | Defaults to today |
| Posting date | ✔ | Defaults to voucher date |
| Voucher No. | Auto | Editable |
| Attached source documents | Number | Count of attached source documents (printed on the voucher) |

**Posting grid (multiple rows):**

| Narration | Debit acct | Credit acct | Amount | Counterparty |
|---|---|---|---|---|
| … | (account combobox) | (account combobox) | (number) | (customer/supplier) |

**Business rules:**
- BR-2.3.1: **One of the Debit/Credit legs is hard-locked by the chosen cash source** — Receive: `Debit = 111/112`; Pay: `Credit = 111/112`. The user selects the other (contra) account.
- BR-2.3.2: **Total Debit amount = Total Credit amount** within a voucher (balance check before saving). If it does not balance → block saving and report the error.
- BR-2.3.3: Multiple posting rows are allowed (e.g., splitting revenue + VAT: `Debit 111 / Credit 511` and `Credit 3331`).
- BR-2.3.4: The "Tax" field (for Receive-from-Customer with an invoice): when a tax rate is entered, the system auto-generates the corresponding `Credit 3331` line.
- BR-2.3.5: Amount > 0.

**"Save" button:**
- FR-2.3.6: When the user clicks **"Save"**, the system:
  1. Generates and stores the journal entries in the ledger.
  2. Generates the **printable voucher** of the correct type (Cash Receipt / Cash Payment / Payment Order) in the **standard accounting format**, immediately viewable/downloadable/printable.
  3. **Pushes data** into the General Journal and the related reports.
- FR-2.3.7: A secondary **"View accounting voucher"** button opens the just-saved voucher.

### 7.4. Printed vouchers (Cash Receipt / Cash Payment / Payment Order)

Each voucher type follows the **standard accounting format**, at minimum containing:

**Cash Receipt / Cash Payment:**
- Header: Company name, Address, Tax code (from Module 1); voucher name; voucher number; date; Debit…/Credit… (account numbers).
- Body: Payer/payee full name (Counterparty); Address; reason for receipt/payment; Amount (in figures + **in words**); number of attached source documents.
- Footer: signature blocks (Director, Chief Accountant, Preparer, Cashier, Payer/Payee).

**Payment Order (bank payment):**
- Payer (company) details, account number, at bank.
- Beneficiary (counterparty/supplier) details, account number, at bank.
- Amount in figures & words; payment content; date issued.

- FR-2.4.1: The amount in words is **auto-converted** from the numeric amount (Vietnamese).
- FR-2.4.2: Vouchers support **PDF export / printing**.

---

## 8. Module 3 – Reports

All reports pull data **in real time from the set of ledger entries**, filtered by the selected **accounting period**.

### 8.1. General Journal

Lists every posted entry in sequence.

**Columns:**

| Posting date | Voucher date | Voucher No. | Narration | Contra account | Debit movement | Credit movement |
|---|---|---|---|---|---|---|

- FR-3.1.1: Each entry (each Debit/Credit pair) creates a corresponding row; the contra account shows the account on the opposite leg.
- FR-3.1.2: A **Total row** at the bottom: Total Debit movement = Total Credit movement (must be equal — control check).
- FR-3.1.3: Sorted by Posting date → Voucher No.

### 8.2. Trial Balance (accounts 1–4)

Aggregates by each account with leading digit 1 → 4 from the General Journal.

**Columns (7 numeric columns):**

| Acct | Acct name | Opening Debit | Opening Credit | Debit movement | Credit movement | Closing Debit | Closing Credit |
|---|---|---|---|---|---|---|---|

**Rules & formulas:**
- BR-3.2.1: **Opening balances** are **entered/filled at the start** (not derived from movements).
- BR-3.2.2: Core formula: **Closing balance = Opening balance +/- net movement during the period.**
- BR-3.2.3: **Asset accounts (leading 1, 2):**
  - Opening balance → **Debit** column
  - **Increases** → Debit column; **Decreases** → Credit column
  - **Closing Debit = Opening Debit + Debit movement − Credit movement** (placed on the **Debit** side)
- BR-3.2.4: **Equity & Liability accounts (leading 3, 4):**
  - Opening balance → **Credit** column
  - **Increases** → Credit column; **Decreases** → Debit column
  - **Closing Credit = Opening Credit + Credit movement − Debit movement** (placed on the **Credit** side)
- BR-3.2.5: **Balance controls:** Total Opening Debit = Total Opening Credit; Total Debit movement = Total Credit movement; Total Closing Debit = Total Closing Credit. If not equal → warn.

> **Clarification (open question):** the original slide states that "decreases" for accounts 3,4 go in the "Credit" column — this is understood to be a typo; per accounting principles, decreases in equity/liabilities go on the **Debit** side. The PRD applies the standard principle in BR-3.2.4; please confirm with the project owner.

### 8.3. Income Statement (Template B02-DN)

The report follows the official **Template B02-DN** of Circular 99/2025 (columns: Indicator | Code | Note | This year | Last year). Aggregated from the General Journal by accounts with leading digits 5 → 8.

**Core aggregation logic (preserving the original brief's intent):**
- BR-3.3.1: **Accounts leading 5, 7** (Revenue, Income): take the **total Credit movement** of each account → enter the **positive figure** into the corresponding indicator.
- BR-3.3.2: **Accounts leading 6, 8** (Expenses): take the **total Debit movement** of each account → display as **negative in parentheses `(figure)`** (accounting negative convention).
- FR-3.3.3: The system **maps each account → the correct B02-DN indicator code** and enters the figure (details in Appendix C).

**B02-DN structure & indicator formulas (finalized per the official template):**

| Indicator | Code | Source (account) | Formula |
|---|---|---|---|
| Revenue from sales & services | 01 | Total Credit of 511 | (+) |
| Revenue deductions | 02 | Total movement of 521 | (figure) |
| **Net revenue** | **10** | | **10 = 01 − 02** |
| Cost of goods sold | 11 | Total Debit of 632 | (figure) |
| **Gross profit** | **20** | | **20 = 10 − 11** |
| Financial income | 22 | Total Credit of 515 | (+) |
| Financial expenses | 23 | Total Debit of 635 | (figure) |
| Selling expenses | 25 | Total Debit of 641 | (figure) |
| General & administrative expenses | 26 | Total Debit of 642 | (figure) |
| **Operating profit** | **30** | | **30 = 20 + 21 + 22 − (23 + 25 + 26)** |
| Other income | 31 | Total Credit of 711 | (+) |
| Other expenses | 32 | Total Debit of 811 | (figure) |
| **Other profit** | **40** | | **40 = 31 − 32** |
| **Total accounting profit before tax** | **50** | | **50 = 30 + 40** |
| Current corporate income tax expense | 51 | Total Debit of 821 | (figure) |
| **Profit after CIT** | **60** | | **60 = 50 − 51 − 52** |

- BR-3.3.4: Codes 10, 20, 30, 40, 50, 60 are **auto-computed** by the formulas above; indicators drawn from accounts 6,8 display in parentheses and are subtracted in the formulas.
- BR-3.3.5: Indicators with **no data still keep their code** (do not renumber), per the template's note.

> **Scope assumption:** v1.0 stops at account class 8 and does not perform closing entries to account 911; profit indicators (codes 30/50/60) are **computed by formula** directly on the report, for learning purposes. (See Assumption A1.)

### 8.4. Statement of Financial Position – Balance Sheet (Template B01-DN)

Follows the official **Template B01-DN** of Circular 99/2025 (source: file `bao-cao-tinh-hinh-tai-chinh-theo-thong-tu99.docx`). Columns: ASSETS/EQUITY & LIABILITIES | Code | Note | Closing balance | Opening balance.

**Standard structure (fixed frame per the template):**
- **A – CURRENT ASSETS (Code 100)** comprising: Cash & cash equivalents (110); Short-term financial investments (120); Short-term receivables (130); Inventories (140); Short-term biological assets (150); Other current assets (160).
- **B – NON-CURRENT ASSETS (Code 200)** comprising: Long-term receivables (210); Fixed assets (220); … ; Other non-current assets (270).
- **TOTAL ASSETS (Code 280 = 100 + 200)**.
- **C – LIABILITIES (Code 300)** comprising: Current liabilities (310); Non-current liabilities (330).
- **D – OWNER'S EQUITY (Code 400)**.
- **TOTAL EQUITY & LIABILITIES (Code 440 = 300 + 400)**.

**Preparation rules:**
- BR-3.4.1: Figures are **taken directly from the closing balances in the Trial Balance** (accounts 1–4), not entered manually. The "Opening balance" column comes from opening balances.
- BR-3.4.2: **Invariant balance check: TOTAL ASSETS (280) = TOTAL EQUITY & LIABILITIES (440).** If unbalanced → red warning showing the difference.
- BR-3.4.3: **Note the distinction "Indicator code" ≠ "Account number".** Some indicators aggregate several accounts (e.g., indicator Code 111 "Cash" = Debit balance of accounts **111 + 112**). The detailed mapping is in **Appendix B**.
- BR-3.4.4: Contra/reduction indicators marked `(*)` (accumulated depreciation, provisions…) are recorded as **negative in parentheses `(...)`**.
- BR-3.4.5: **Dual-nature accounts** (e.g., 131, 331): if a **Debit balance** → shown on the Assets side (131 → Code 131 trade receivables; 331 Debit balance → Code 132 prepayments to suppliers); if a **Credit balance** → shown on the Equity & Liabilities side (331 → Code 311 trade payables; 131 Credit balance → Code 312 advances from customers). **No netting** — evaluate the balance per individual counterparty.
- BR-3.4.6: Indicators with no data still keep their code.

---

## 9. Data Model (high level)

| Entity | Key fields | Relationship |
|---|---|---|
| **Company** | id, name, address, taxCode, student, class, accountingPeriod | 1–1 with User |
| **User** | id, username, role(student/teacher) | 1–1 Company |
| **Partner** | id, type(Customer/Supplier), name, address, taxCode, goodsName | source for Counterparty |
| **Account** | number, name, level, parentAcct, class, balanceNature | seeded from Circular 99/2025 |
| **Voucher** | id, voucherNo, type(PT/PC/UNC), source(111/112), voucherDate, postingDate, partnerId, reason, attachedDocs | 1–n LedgerEntry |
| **LedgerEntry** | id, voucherId, narration, debitAcct, creditAcct, amount, partnerId | n–1 Voucher |
| **OpeningBalance** | acct, openingDebit, openingCredit, period | used by Trial Balance |

**Report data index:** the General Journal / Trial Balance / Income Statement / Balance Sheet are all **aggregate queries over `LedgerEntry` + `OpeningBalance`**, filtered by `Company` and `accountingPeriod`. Report figures are never stored separately.

---

## 10. Non-Functional Requirements

| # | Requirement |
|---|---|
| NFR-1 | **Responsive web app**, working well on common browsers. |
| NFR-2 | **Number & currency format** per VN convention (thousands separator = dot, VND). |
| NFR-3 | **Accounting correctness** is priority #1: all balance constraints (BR-2.3.2, BR-3.2.5, BR-3.4.2) must be auto-checked. |
| NFR-4 | Each student's data is **isolated** by account. |
| NFR-5 | Vouchers & reports must be **exportable to PDF / printable**. |
| NFR-6 | Creating a voucher and rendering a report responds in ≤ 2 seconds for typical learning-size data. |
| NFR-7 | Vietnamese UI, terminology aligned with VN accounting standards. |

---

## 11. Roadmap by Phase

| Phase | Content | Priority |
|---|---|---|
| **Phase 1 – MVP** | Module 1 (Company, Customers/Suppliers, CoA seed Circular 99/2025) + Module 2 (8 receive/pay scenarios, generating Cash Receipt/Payment/Payment Order) + General Journal + Trial Balance | P0 |
| **Phase 2** | Income Statement + Balance Sheet (wiring the B01-DN template) | P0 |
| **Phase 3** | Auto-fill chart of accounts from a template, amount-in-words, batch PDF export | P1 |
| **Phase 4** | Instructor role: create exercises, view/grade, cross-check results across students | P2 |
| **Phase 5** | Closing entries to 911, module expansion (purchasing/sales) | P2 |

---

## 12. Overall Acceptance Criteria

- ✅ All **8 scenarios** of cash transactions can be created (Receive/Pay × 111/112 × Customer/Supplier/general), each generating the correct printed voucher.
- ✅ A saved transaction **appears simultaneously** in the General Journal and correctly affects the Trial Balance.
- ✅ The Trial Balance is always **balanced** (all 3 total pairs equal).
- ✅ The Income Statement shows **accounts 5,7 as positive; accounts 6,8 in parentheses (negative)** and computes profit correctly.
- ✅ The Balance Sheet satisfies **Total Assets = Total Equity & Liabilities**.
- ✅ Editing a voucher → all reports recompute correctly.

---

## 13. Assumptions, Dependencies & Open Questions

**Assumptions:**
- A1: v1.0 serves learning purposes and **does not automatically close to account 911**; profit is derived by formula in the Income Statement.
- A2: The Circular 99/2025 chart of accounts is pre-seeded from the project-provided source; the PRD does not enumerate every account number to avoid discrepancies — the original file is the source of truth.

**Dependencies:**
- ✅ D1 (CLOSED): The B01-DN Balance Sheet template is available (`bao-cao-tinh-hinh-tai-chinh-theo-thong-tu99.docx`) → indicator-code ↔ account mapping finalized in §8.4 + Appendix B.
- ✅ D2 (CLOSED): The full text of Circular 99/2025/TT-BTC is available (`99_2025_TT-BTC_565484.docx`) → the source for importing the chart of accounts and the B01/B02 templates.
- D3 (new): A **detailed Account → Code mapping for all B01-DN indicators** is needed when expanding beyond cash transactions (Appendix B currently lists only accounts within v1.0 scope).

**Open questions for the project owner:**
- Q1: Confirm the rule that "decreases" for accounts leading 3,4 go on the **Debit** side (§8.2 / BR-3.2.4) — the original slide appears to contain a typo.
- Q2: Does the "Receive from Customer" transaction require splitting out VAT (`Credit 3331`), or is it optional?
- Q3: How do "Receive" (no specific customer) and "Receive from Customer" differ in their default contra account (e.g., 511/711 vs. 131)?
- Q4: Bank payments always use a **Payment Order**, while bank receipts print an "Accounting Voucher / Bank Credit Advice" — confirm this matches the intent.

---

## Appendix A – Default Journal-Entry Matrix for the 8 Scenarios

| # | Source | Transaction type | Default entry | Printed voucher |
|---|---|---|---|---|
| 1 | Cash (111) | Receive | Dr 111 / Cr [contra: 511, 711, 3387…] | Cash Receipt |
| 2 | Cash (111) | Receive from Customer | Dr 111 / Cr 131 (± Cr 3331 if taxed) | Cash Receipt |
| 3 | Bank (112) | Receive | Dr 112 / Cr [contra] | Accounting Voucher / Bank Credit Advice |
| 4 | Bank (112) | Receive from Customer | Dr 112 / Cr 131 | Bank Credit Advice |
| 5 | Cash (111) | Pay | Dr [contra: 642, 641, 211…] / Cr 111 | Cash Payment |
| 6 | Bank (112) | Pay | Dr [contra] / Cr 112 | Payment Order |
| 7 | Cash (111) | Pay Supplier | Dr 331 / Cr 111 | Cash Payment |
| 8 | Bank (112) | Pay Supplier | Dr 331 / Cr 112 | Payment Order |

*The specific contra account is chosen by the user per transaction; the table shows defaults to speed up data entry.*

---

## Appendix B – Account → Balance Sheet Indicator-Code Mapping (B01-DN)

> Lists only accounts **within v1.0 scope** (arising from cash transactions and common contra accounts). ⚠️ **Indicator code ≠ account number.** Figures are taken from **closing balances** on the Trial Balance.

**ASSETS side (take Debit balances):**

| Indicator | Code | Source account | Note |
|---|---|---|---|
| Cash | 111 | Debit of **111 + 112** | Aggregate indicator: cash + bank |
| Short-term trade receivables | 131 | Debit of **131** | By counterparty with a Debit balance |
| Short-term prepayments to suppliers | 132 | Debit of **331** | Supplier counterparties with a Debit balance |
| Other short-term receivables | 135 | Debit of **138, 141** | Advances (141), other receivables |
| Deductible VAT | 162 | Debit of **133** | |
| Inventories | 141 | Debit of **151–156** | If inventory transactions exist |
| Tangible fixed assets – Cost | 222 | Debit of **211** | |
| – Accumulated depreciation (*) | 223 | Credit of **214** | Negative `(...)` |

**EQUITY & LIABILITIES side (take Credit balances):**

| Indicator | Code | Source account | Note |
|---|---|---|---|
| Short-term trade payables | 311 | Credit of **331** | Supplier counterparties with a Credit balance |
| Short-term advances from customers | 312 | Credit of **131** | Customer counterparties with a Credit balance |
| Taxes and amounts payable to the State | 314 | Credit of **333** (3331, 3334…) | |
| Payables to employees | 315 | Credit of **334** | |
| Owner's contributed capital | 411 | Credit of **411** | |
| Undistributed post-tax profit | 420 | Credit of **421** | |

---

## Appendix C – Account → Income Statement Indicator-Code Mapping (B02-DN)

| Indicator | Code | Account | Column taken | Sign convention |
|---|---|---|---|---|
| Revenue from sales & services | 01 | 511 | Credit | Positive |
| Revenue deductions | 02 | 521 | Debit (reduces 511) | `(figure)` |
| Cost of goods sold | 11 | 632 | Debit | `(figure)` |
| Financial income | 22 | 515 | Credit | Positive |
| Financial expenses | 23 | 635 | Debit | `(figure)` |
| Selling expenses | 25 | 641 | Debit | `(figure)` |
| General & administrative expenses | 26 | 642 | Debit | `(figure)` |
| Other income | 31 | 711 | Credit | Positive |
| Other expenses | 32 | 811 | Debit | `(figure)` |
| Current corporate income tax expense | 51 | 821 | Debit | `(figure)` |

**Rule in brief:** accounts leading **5, 7 → total Credit → positive**; accounts leading **6, 8 → total Debit → in parentheses `(figure)`**. Aggregate codes (10, 20, 30, 40, 50, 60) are auto-computed by the formulas in §8.3.

---
*End of document – PRD AA-hub v1.1 (official Circular 99/2025 templates integrated).*
