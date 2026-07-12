# Tasks: 001-accounting-mvp

**Input**: Design documents from `/specs/001-accounting-mvp/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: The examples below include test tasks. Tests are OPTIONAL - only include them if explicitly requested in the feature specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Create project structure per implementation plan
- [X] T002 Initialize Next.js project with Tailwind CSS dependencies
- [X] T003 [P] Configure linting and formatting tools

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T004 Setup database schema and Prisma migrations framework in `prisma/schema.prisma`
- [X] T005 [P] Implement authentication/authorization framework (e.g., NextAuth for tenant isolation) in `src/lib/auth.ts`
- [X] T006 [P] Create base layout and navigation structure in `src/app/layout.tsx`
- [X] T007 Define core models in `prisma/schema.prisma` (User, Company, Partner, Account, Voucher, LedgerEntry, OpeningBalance)
- [X] T008 Configure error handling and logging infrastructure in `src/lib/logger.ts`
- [X] T009 Create seed script for Chart of Accounts (Circular 99/2025/TT-BTC) in `prisma/seed.ts`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Manage Company & Master Data (Priority: P1) 🎯 MVP

**Goal**: View/edit company profile and manage suppliers/customers.

**Independent Test**: Can be tested by creating/editing a company profile and a supplier/customer, then verifying the data is saved and retrievable.

### Implementation for User Story 1

- [X] T010 [P] [US1] Create Company and Partner Prisma services in `src/services/masterData.ts`
- [X] T011 [P] [US1] Create GET/PUT API routes for Company in `src/app/api/company/route.ts`
- [X] T012 [P] [US1] Create GET/POST API routes for Partners in `src/app/api/partners/route.ts`
- [X] T013 [US1] Build Company Profile UI component in `src/app/(dashboard)/company/page.tsx`
- [X] T014 [US1] Build Partner List and creation UI in `src/app/(dashboard)/partners/page.tsx`

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Post Cash/Bank Receipt Voucher (Priority: P1)

**Goal**: Enter cash and bank receipt transactions so that the system can automatically generate the accounting entries.

**Independent Test**: Can be fully tested by selecting "Cash Fund" or "Bank Deposit" and "Receive", entering data, and verifying the generated voucher and ledger entries.

### Implementation for User Story 2

- [X] T015 [P] [US2] Create Voucher validation service (Total Debit = Total Credit) in `src/services/voucherValidation.ts`
- [X] T016 [P] [US2] Implement Voucher creation logic in `src/services/voucherService.ts`
- [X] T017 [US2] Create POST API route for Vouchers in `src/app/api/vouchers/route.ts`
- [X] T018 [US2] Build Create Voucher Form UI for receipts in `src/app/(dashboard)/vouchers/receipt/page.tsx`
- [X] T019 [US2] Integrate partner selection autocomplete in the voucher form.

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Post Cash/Bank Payment Voucher (Priority: P1)

**Goal**: Enter cash and bank payment transactions so that the system can generate Cash Payment or Payment Order vouchers.

**Independent Test**: Can be fully tested by selecting "Pay" or "Pay Supplier", entering a balanced entry, and checking the output voucher.

### Implementation for User Story 3

- [X] T020 [P] [US3] Extend Voucher creation logic for payment specific rules in `src/services/voucherService.ts`
- [X] T021 [US3] Build Create Voucher Form UI for payments in `src/app/(dashboard)/vouchers/payment/page.tsx`
- [X] T022 [US3] Add client-side validation for unbalanced entries in the voucher forms.

**Checkpoint**: All voucher entry features are independently functional

---

## Phase 6: User Story 4 - Generate General Journal and Trial Balance (Priority: P1)

**Goal**: View the General Journal and Trial Balance to verify ledger entries.

**Independent Test**: Open reports and verify figures match ledger entries and opening balances.

### Implementation for User Story 4

- [X] T023 [P] [US4] Create SQL aggregate logic for Trial Balance in `src/services/reportService.ts`
- [X] T024 [P] [US4] Create query logic for General Journal in `src/services/reportService.ts`
- [X] T025 [US4] Create GET API routes for General Journal in `src/app/api/reports/general-journal/route.ts`
- [X] T026 [US4] Create GET API routes for Trial Balance in `src/app/api/reports/trial-balance/route.ts`
- [X] T027 [US4] Build General Journal UI in `src/app/(dashboard)/reports/general-journal/page.tsx`
- [X] T028 [US4] Build Trial Balance UI in `src/app/(dashboard)/reports/trial-balance/page.tsx`

---

## Phase 7: User Story 5 - Generate Financial Statements (Priority: P2)

**Goal**: View the Income Statement and Statement of Financial Position (Balance Sheet).

**Independent Test**: Open reports and check mapping rules and balance formulas (Assets = Equity & Liabilities).

### Implementation for User Story 5

- [X] T029 [P] [US5] Implement Financial Statement mappings (Appendix B/C) in `src/services/financialStatements.ts`
- [X] T030 [P] [US5] Create GET API routes for Income Statement in `src/app/api/reports/income-statement/route.ts`
- [X] T031 [P] [US5] Create GET API routes for Balance Sheet in `src/app/api/reports/balance-sheet/route.ts`
- [X] T032 [US5] Build Income Statement UI in `src/app/(dashboard)/reports/income-statement/page.tsx`
- [X] T033 [US5] Build Balance Sheet UI in `src/app/(dashboard)/reports/balance-sheet/page.tsx`

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T034 [P] Code cleanup and refactoring across components
- [X] T035 Security hardening and tenant isolation checks
- [X] T036 Run quickstart.md validation scenarios to ensure end-to-end functionality

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-7)**: All depend on Foundational phase completion
  - User stories can proceed sequentially or in parallel (US1 -> US4)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2)
- **User Story 2 (P1)**: Can start after Foundational. Requires Partner and Company from US1.
- **User Story 3 (P1)**: Can start alongside US2.
- **User Story 4 (P1)**: Depends on Vouchers from US2 and US3 for real data.
- **User Story 5 (P2)**: Depends on Vouchers from US2/3 and Trial Balance logic from US4.

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel
- Once Foundational phase completes, APIs and UIs for user stories can be built in parallel
