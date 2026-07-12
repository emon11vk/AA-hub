# Feature Specification: AA-hub Accounting MVP

**Feature Branch**: `[001-accounting-mvp]`

**Created**: 2026-07-11

**Status**: Draft

**Input**: User description: "Hãy phân tích file prd.md và chuẩn hóa nó thành tài liệu spec.md"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Manage Company & Master Data (Priority: P1)

As a student, I need to view/edit my company profile and manage suppliers/customers so that I can use them as counterparties in vouchers.

**Why this priority**: Required as the foundational master data for all transactions.

**Independent Test**: Can be tested by creating/editing a company profile and a supplier/customer, then verifying the data is saved and retrievable.

**Acceptance Scenarios**:

1. **Given** a new student account, **When** they view their company profile, **Then** they see their assigned company info.
2. **Given** the supplier/customer list, **When** a user adds a new partner with a Tax code and Address, **Then** it is saved and available for voucher selection.

---

### User Story 2 - Post Cash/Bank Receipt Voucher (Priority: P1)

As a student, I need to enter cash and bank receipt transactions so that the system can automatically generate the accounting entries and printed vouchers.

**Why this priority**: Core data entry requirement for the accounting flow.

**Independent Test**: Can be fully tested by selecting "Cash Fund" or "Bank Deposit" and "Receive" or "Receive from Customer", entering data, and verifying the generated voucher and ledger entries.

**Acceptance Scenarios**:

1. **Given** the create-voucher form, **When** the user selects Cash Fund and Receive, and enters a balanced entry, **Then** a Cash Receipt voucher is generated.
2. **Given** the create-voucher form, **When** the user selects a customer counterparty, **Then** the address and tax code auto-populate.

---

### User Story 3 - Post Cash/Bank Payment Voucher (Priority: P1)

As a student, I need to enter cash and bank payment transactions so that the system can generate Cash Payment or Payment Order vouchers.

**Why this priority**: Core data entry for outgoing funds.

**Independent Test**: Can be fully tested by selecting "Pay" or "Pay Supplier", entering a balanced entry, and checking the output voucher.

**Acceptance Scenarios**:

1. **Given** the create-voucher form, **When** the user selects Bank Deposit and Pay Supplier, **Then** a Payment Order is generated with Cr 112.
2. **Given** an unbalanced entry, **When** the user clicks Save, **Then** the system blocks saving and shows an error.

---

### User Story 4 - Generate General Journal and Trial Balance (Priority: P1)

As a student, I need to view the General Journal and Trial Balance so that I can verify my ledger entries and ensure my accounts balance.

**Why this priority**: Essential reports for validating the correctness of the accounting entries (Total Debit = Total Credit).

**Independent Test**: Can be tested by opening the reports and verifying the figures match the ledger entries and opening balances.

**Acceptance Scenarios**:

1. **Given** posted vouchers, **When** the General Journal is opened, **Then** it lists all entries chronologically.
2. **Given** posted vouchers, **When** the Trial Balance is opened, **Then** it shows aggregated Debit/Credit movements and balances, with Total Debit = Total Credit.

---

### User Story 5 - Generate Financial Statements (Priority: P2)

As a student, I need to view the Income Statement and Statement of Financial Position (Balance Sheet) to see the final financial outcomes.

**Why this priority**: The ultimate goal of the accounting cycle, required for practice completion.

**Independent Test**: Can be tested by opening the reports and checking if the mapping rules (e.g., accounts 5,7 to positive; accounts 6,8 to negative) and balance formulas (Assets = Equity & Liabilities) hold true.

**Acceptance Scenarios**:

1. **Given** revenue and expense entries, **When** the Income Statement is viewed, **Then** profit is correctly computed without manual closing entries to 911.
2. **Given** closing balances in the Trial Balance, **When** the Balance Sheet is viewed, **Then** Total Assets equals Total Equity & Liabilities.

### Edge Cases

- What happens when a user attempts to save a voucher where Total Debit != Total Credit? (System must block and alert)
- How does system handle dual-nature accounts (e.g., 131, 331) in the Balance Sheet? (Debit balance goes to Assets, Credit balance goes to Liabilities)
- What happens if an indicator in a report has no data? (The indicator row and code remain, but with blank/zero amounts)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST strictly isolate each student's data by account.
- **FR-002**: System MUST automatically generate Cash Receipt, Cash Payment, and Payment Order vouchers in standard accounting format upon saving a transaction.
- **FR-003**: System MUST enforce that Total Debit equals Total Credit within any voucher before allowing it to be saved.
- **FR-004**: System MUST pull all report data (General Journal, Trial Balance, Income Statement, Balance Sheet) in real-time directly from ledger entries and opening balances.
- **FR-005**: System MUST automatically compute the amount in words from the numeric amount on printed vouchers using Vietnamese convention.
- **FR-006**: System MUST enforce Total Assets = Total Equity & Liabilities on the Balance Sheet and display a warning if unbalanced.
- **FR-007**: System MUST pre-seed the Chart of Accounts based on Circular 99/2025/TT-BTC.
- **FR-008**: System MUST map accounts to the B02-DN Income Statement indicators and B01-DN Balance Sheet indicators exactly as specified in the PRD (Appendix B and C).

### Key Entities

- **Company**: Represents the enterprise for a student's practice, tied 1-1 with the User account.
- **Partner**: Represents Customers and Suppliers used as counterparties.
- **Account**: Represents an account in the Chart of Accounts (Circular 99/2025/TT-BTC).
- **Voucher**: Represents an economic transaction document (PT, PC, UNC).
- **LedgerEntry**: Represents a single Debit or Credit line inside a Voucher.
- **OpeningBalance**: Represents the starting balance of an account for a given period.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of sample transactions yield a balanced Trial Balance (Total Debit movement = Total Credit movement) and a balanced Statement of Financial Position (Total Assets = Total Equity & Liabilities).
- **SC-002**: A user can create a voucher and view the corresponding printed voucher in ≤ 5 actions.
- **SC-003**: 0 manual steps are required for data to flow from a saved voucher into all four reports.
- **SC-004**: Creating a voucher and rendering a report responds in ≤ 2 seconds for typical learning-size data.

## Assumptions

- v1.0 serves learning purposes and does not automatically close to account 911; profit is derived by formula directly in the Income Statement.
- The Chart of Accounts is pre-seeded from the official Circular 99/2025/TT-BTC document provided in the project.
- Decreases for Equity/Liability accounts (leading 3, 4) go on the Debit side (per accounting principles).
- "Receive from Customer" does not strictly mandate VAT split out (can be added as an extra row by the user if needed).
- All bank payments generate a "Payment Order", while bank receipts generate an "Accounting Voucher / Bank Credit Advice".
- This MVP stops at account class 8. Multi-currency, multi-branch, and complex permissions are out of scope.
