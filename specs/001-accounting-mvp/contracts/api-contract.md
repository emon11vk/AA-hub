# API Contracts

## Endpoints

### `POST /api/vouchers`
Creates a new voucher with ledger entries.
**Request**:
```json
{
  "voucherDate": "2026-07-11",
  "type": "CASH_RECEIPT",
  "description": "Receive cash from customer",
  "partnerId": "uuid-...",
  "entries": [
    { "accountCode": "1111", "direction": "DEBIT", "amount": 1000000 },
    { "accountCode": "131", "direction": "CREDIT", "amount": 1000000 }
  ]
}
```
**Response (201 Created)**:
```json
{
  "id": "voucher-uuid",
  "voucherNumber": "PT00001",
  "status": "success"
}
```
**Error (400 Bad Request)** (e.g., Unbalanced):
```json
{
  "error": "VOUCHER_UNBALANCED",
  "message": "Total Debit does not equal Total Credit."
}
```

### `GET /api/reports/trial-balance`
Returns the trial balance data for a period.
**Query Params**: `startDate`, `endDate`
**Response (200 OK)**:
```json
{
  "data": [
    {
      "accountCode": "1111",
      "openingDebit": 500000,
      "openingCredit": 0,
      "movementDebit": 1000000,
      "movementCredit": 200000,
      "closingDebit": 1300000,
      "closingCredit": 0
    }
  ]
}
```
