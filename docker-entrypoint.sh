#!/bin/sh
set -e

echo " Waiting for PostgreSQL..."

# until nc -z db 5432; do
#   sleep 2
# done

echo "DB Ready"

# echo " Running migrations..."
# npx prisma migrate deploy

# echo " Running migrations..."
# npx prisma migrate deploy

# echo " Syncing Prisma schema with database..."
# npx prisma db push --accept-data-loss

# echo " Seeding database..."
# npx prisma db seed

# Check if Wallet table is empty
# WALLET_COUNT=$(npx prisma db execute --stdin <<EOF
# SELECT COUNT(*) FROM "Wallet";
# EOF
# )

# if echo "$WALLET_COUNT" | grep -q "0"; then
#   echo " Seeding database..."
#   npx prisma db seed
# else
#   echo "Database already seeded. Skipping seed."
# fi

# Optional: Run seed safely (will not fail container if already seeded)
# if [ "$RUN_SEED" = "true" ]; then
#   echo " Running database seed..."
#   npx prisma db seed || true
# fi

echo " Starting Application..."
exec npm run start
