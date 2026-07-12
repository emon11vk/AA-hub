<!-- 
Sync Impact Report:
- Version change: Initial → 1.0.0
- List of modified principles:
  - Added: I. Accounting Correctness First
  - Added: II. Data Isolation & Security
  - Added: III. Vietnamese Accounting Standards Alignment
  - Added: IV. Real-time Report Generation
  - Added: V. Performance & Responsiveness
- Added sections: Technology & Security Constraints, Development Workflow
- Removed sections: N/A
- Templates requiring updates:
  - ⚠ `.specify/templates/plan-template.md` (pending check)
  - ⚠ `.specify/templates/spec-template.md` (pending check)
  - ⚠ `.specify/templates/tasks-template.md` (pending check)
- Follow-up TODOs: Review templates for any necessary alignment with these new principles.
-->

# AA-hub Constitution

## Core Principles

### I. Accounting Correctness First
All balance constraints (Total Debit = Total Credit, Total Assets = Total Equity & Liabilities) MUST be automatically checked and strictly enforced. Accounting correctness is priority #1; the system must never save an unbalanced voucher.

### II. Data Isolation & Security
Each student's data MUST be strictly isolated by account to ensure a secure, individual practice environment. Data from one tenant (student) must never bleed into another.

### III. Vietnamese Accounting Standards Alignment
The UI, terminology, chart of accounts, and report templates MUST adhere strictly to Vietnamese accounting standards (Circular 99/2025/TT-BTC). Number and currency formats MUST use VN conventions (thousands separator = dot, VND).

### IV. Real-time Report Generation
All reports (General Journal, Trial Balance, Income Statement, Balance Sheet) MUST pull data in real time from the ledger entries. Report figures MUST NOT be entered manually (except opening balances).

### V. Performance & Responsiveness
The application MUST be a responsive web application that works well on common browsers. Creating a voucher and rendering a report MUST respond in ≤ 2 seconds for typical learning-size data.

## Technology & Security Constraints

- **Export & Print**: Vouchers and reports MUST support export to PDF and printable views.
- **Scope Limits (v1.0)**: The application stops at account class 8 (no automatic period-end closing entries to 911). Multi-currency, multi-branch, and complex permissions are excluded in the initial version.
- **Security**: As a multi-tenant system for students, tenant isolation is the primary security constraint.

## Development Workflow

Development MUST align with the phased roadmap:
- **Phase 1 (MVP)** focuses on master data, cash/bank transactions, General Journal, and Trial Balance.
- **Phase 2** covers the Income Statement and Balance Sheet.
- Follow-up phases introduce auto-fill templates, PDF exports, and Instructor roles.
- The standard flow (Voucher → Ledger Entries → Reports) MUST be validated continuously.

## Governance

This Constitution supersedes standard practices when conflicts arise. All PRs and code reviews MUST verify compliance with the accounting principles and data isolation rules. Any deviation from the officially integrated Circular 99/2025 templates requires explicit product owner approval.

**Version**: 1.0.0 | **Ratified**: 2026-07-11 | **Last Amended**: 2026-07-11
