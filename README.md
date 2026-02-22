# Internal Wallet Service

A high-traffic loyalty reward and wallet management service built using Node.js, Express, PostgreSQL, and Prisma ORM.

This service supports:

1. Double-entry transactions
2. Atomic balance updates
3. Idempotent transaction processing
4. Serializable database transactions
5. Concurrency-safe operations

# Prerequisites

- Install SQL database (postgreSQL - pgadmin) on your local machine.
- Store or feed the connection string, username, password to integrating into the backend app
- Install Docker on youir local machine
- Node.js (v22+ recommended)

# Instruction to set up the project locally

1. Clone the project repo

```bash
git clone https://github.com/roshidhmohammed/internal-wallet-service-app.git
cd internal-wallet-service-app
```


2. Configure Environment Variables

  - For development stage - create *.env.development"

  Add:
```bash
PORT=
DATABASE_URL=""
POSTGRES_USER=
POSTGRES_PASSWORD=""
POSTGRES_DB=
NODE_ENV=""
```

    - For production stage - create *.env.production"

    Add:
```bash
PORT=
DATABASE_URL=""
POSTGRES_USER=
POSTGRES_PASSWORD=""
POSTGRES_DB=
NODE_ENV=""
```

3.  Install all the dependencies used in this app using the below command:

```bash
npm install
```

3.  Start the project for Development Environment

```bash
docker-compose -f docker-compose.production.yaml up --build
```

4. Check if DB container is running:
```bash
docker ps
```

Open [http://localhost:8000/health](http://localhost:8000/health) with your browser to see the app.


# How to spin up the database and run the seed script.

   - This project uses PostgreSQL + Prisma ORM running via Docker.

1. With the prisma/seed.js file, we can initialize the starting data into the db.

# Choice of technology and why.

- **Express.js** - Server side framework for node.js 
- **zod** - Input/ all type of data validation
- **nodemon** - Development auto-restart
- **prisma** - the ORM for postgresql database
- **postgreSQL** - The SQL Database that supports ACID compliance.
- **Docker** - Containerization

# Strategies for handling concurrency.

1. Serializable Transactions:
    All transactions run with:
```bash
isolationLevel: 'Serializable'
```
    This ensures strict ACID guarantees.
2. Idempotency Protection-
     Each transaction includes a unique referenceId enforced at the database level using a unique constraint.
     Prevents duplicate transaction execution.

3. Atomic Balance Updates:
     Balance updates use conditional atomic operations:
      - Prevent lost updates
      - Prevent double-spend
      - Avoid race conditions
4. Double-Entry Ledger System-
       Each transaction creates:
        - A debit entry
        - A debit entry

    Ensuring auditability and transaction consistency.
5. Composite Unique Constraints-
    - Prevents duplicate balance records under concurrency.

