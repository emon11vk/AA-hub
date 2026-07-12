# Research: Technical Approaches

## Technology Stack
- **Decision**: Next.js (React) for full-stack web application with Prisma ORM and PostgreSQL.
- **Rationale**: Next.js provides a robust React framework with API routes, enabling a simplified architecture without maintaining a separate backend service initially. Prisma offers strong type-safety and straightforward database migrations, which is crucial for the strict accounting data schema. PostgreSQL supports ACID transactions natively, ensuring data consistency (Total Debit = Total Credit).
- **Alternatives considered**: Separate Vite/React frontend with an Express/Node backend (Adds operational overhead), SQLite (Not ideal for strict multi-tenant constraints if scaling).

## Tenant Isolation (Data Isolation & Security)
- **Decision**: Application-level `userId` filtering on every query.
- **Rationale**: Meets Constitution Principle II. Application-level filtering with Prisma (`where: { userId: currentUserId }`) is straightforward to implement and verify for MVP scope.
- **Alternatives considered**: Row-level security (RLS) in PostgreSQL (Too complex for MVP), Database per tenant (Too expensive).

## Real-time Reporting Engine
- **Decision**: SQL Aggregate queries directly on `LedgerEntry` table.
- **Rationale**: For learning-size data, standard `SUM(amount) GROUP BY accountCode` queries in PostgreSQL will easily return in < 2 seconds, meeting Constitution Principle IV and V.
- **Alternatives considered**: Pre-computed balances table (Adds complexity to voucher saves, risking synchronization issues if out of balance).
