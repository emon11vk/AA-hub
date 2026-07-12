# Implementation Plan: 001-accounting-mvp

**Branch**: `001-accounting-mvp` | **Date**: 2026-07-11 | **Spec**: [specs/001-accounting-mvp/spec.md](file:///D:/coding-space/AA-hub/specs/001-accounting-mvp/spec.md)

**Input**: Feature specification from `/specs/001-accounting-mvp/spec.md`

## Summary

The goal is to build an MVP for an accounting web application adhering to Vietnamese Accounting Standards (Circular 99/2025/TT-BTC). Core features include managing companies and partners, processing balanced cash and bank vouchers, and generating real-time General Journal, Trial Balance, Income Statement, and Balance Sheet reports.

## Technical Context

**Language/Version**: TypeScript, Node.js 18+

**Primary Dependencies**: Next.js (React), Prisma ORM, Tailwind CSS

**Storage**: PostgreSQL

**Testing**: Jest (Unit/Integration), Playwright (E2E)

**Target Platform**: Web Browsers (Responsive)

**Project Type**: Web Application

**Performance Goals**: < 2 seconds for voucher creation and report rendering

**Constraints**: Strict tenant data isolation by user account; rigorous double-entry balance validation.

**Scale/Scope**: Learning-size data, accounts up to class 8.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **I. Accounting Correctness First**: Data model and contracts enforce balanced vouchers.
- [x] **II. Data Isolation & Security**: Schema includes `userId` on all transactional and master data entities.
- [x] **III. Vietnamese Accounting Standards Alignment**: Using standard VN formats and pre-seeded Chart of Accounts.
- [x] **IV. Real-time Report Generation**: Reports query directly from Ledger Entries.
- [x] **V. Performance & Responsiveness**: Next.js and PostgreSQL ensure fast load times and rendering.

## Project Structure

### Documentation (this feature)

```text
specs/001-accounting-mvp/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── api-contract.md
└── tasks.md
```

### Source Code (repository root)

```text
src/
├── app/                  # Next.js App Router (Pages, API Routes)
├── components/           # React Components (UI, Forms, Reports)
├── lib/                  # Utilities (Formatters, Prisma Client)
├── services/             # Core Business Logic (Accounting rules)
└── styles/               # Tailwind CSS

prisma/
└── schema.prisma         # Database Schema and Models
```

**Structure Decision**: Next.js web application structure using the `app` router for both frontend rendering and backend API routes.

## Complexity Tracking

No constitution violations found. No complex alternatives necessary.
