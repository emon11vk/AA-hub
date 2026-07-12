# Data Model

## Entities

### User
- `id`: String (UUID), Primary Key
- `email`: String, Unique
- `name`: String

### Company
- `id`: String (UUID), Primary Key
- `userId`: String (UUID), Foreign Key to User (Unique for 1-1 relationship)
- `companyName`: String
- `taxCode`: String
- `address`: String

### Partner
- `id`: String (UUID), Primary Key
- `userId`: String (UUID), Foreign Key to User (Tenant Isolation)
- `partnerCode`: String
- `name`: String
- `taxCode`: String
- `address`: String
- `type`: Enum (CUSTOMER, SUPPLIER, BOTH)

### Account
- `code`: String, Primary Key (e.g., "1111", "1121")
- `name`: String
- `nature`: Enum (DEBIT, CREDIT, DUAL)
- `level`: Int

### Voucher
- `id`: String (UUID), Primary Key
- `userId`: String (UUID), Foreign Key to User
- `voucherNumber`: String
- `voucherDate`: Date
- `description`: String
- `type`: Enum (CASH_RECEIPT, CASH_PAYMENT, BANK_RECEIPT, BANK_PAYMENT)
- `partnerId`: String (UUID), Optional Foreign Key to Partner
- `totalAmount`: Decimal

### LedgerEntry
- `id`: String (UUID), Primary Key
- `voucherId`: String (UUID), Foreign Key to Voucher
- `accountId`: String, Foreign Key to Account (`code`)
- `direction`: Enum (DEBIT, CREDIT)
- `amount`: Decimal
- `description`: String

### OpeningBalance
- `id`: String (UUID), Primary Key
- `userId`: String (UUID), Foreign Key to User
- `accountId`: String, Foreign Key to Account
- `year`: Int
- `debitBalance`: Decimal
- `creditBalance`: Decimal

## Relationships
- User 1:1 Company
- User 1:N Partner, Voucher, OpeningBalance
- Voucher 1:N LedgerEntry

## Validation Rules
- `LedgerEntry`: Within a Voucher, SUM(amount where direction = DEBIT) MUST EQUAL SUM(amount where direction = CREDIT).
- Isolation: All queries must filter by `userId`.
