#!/bin/sh
set -e

echo " Waiting for PostgreSQL..."

# until nc -z db 5432; do
#   sleep 2
# done

echo "DB Ready"

# echo "🚀 Running migrations..."
# npx prisma migrate deploy

# echo "🚀 Running migrations..."
# npx prisma migrate deploy

# echo " Seeding database..."
# npx prisma db seed

# Check if Wallet table is empty
# WALLET_COUNT=$(npx prisma db execute --stdin <<EOF
# SELECT COUNT(*) FROM "Wallet";
# EOF
# )

if echo "$WALLET_COUNT" | grep -q "0"; then
  echo "🌱 Seeding database..."
  npx prisma db seed
else
  echo "✅ Database already seeded. Skipping seed."
fi

echo " Starting Application..."
exec npm run start
