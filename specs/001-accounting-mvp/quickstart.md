# Quickstart Validation Guide

## Prerequisites
- Node.js 18+
- PostgreSQL database
- Next.js development environment

## Setup
1. Clone the repository and navigate to root.
2. Run `npm install`
3. Copy `.env.example` to `.env` and set `DATABASE_URL`.
4. Run `npx prisma db push` to initialize schema.
5. Run `npx prisma db seed` to populate Chart of Accounts.
6. Run `npm run dev`.

## Validation Scenarios

### Scenario 1: Balanced Cash Receipt
1. Open the app at `http://localhost:3000`.
2. Login/Register a student account.
3. Navigate to "Vouchers" -> "Create Receipt".
4. Enter Debit 1111: 50,000 and Credit 5111: 50,000.
5. Click Save.
6. **Expected Outcome**: Success message, Voucher PT00001 generated.

### Scenario 2: Trial Balance Accuracy
1. Navigate to "Reports" -> "Trial Balance".
2. **Expected Outcome**: Account 1111 shows Movement Debit 50,000. Account 5111 shows Movement Credit 50,000. Total Debit Movement = 50,000, Total Credit Movement = 50,000.

### Scenario 3: Unbalanced Validation
1. Create a Payment Voucher.
2. Enter Debit 642: 10,000 and Credit 1111: 5,000.
3. Click Save.
4. **Expected Outcome**: UI shows an error preventing the save: "Total Debit must equal Total Credit".
