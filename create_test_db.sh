echo "CREATE BOOKING TEST DB";

# Create the test database
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "booking_db" <<-EOSQL
   CREATE DATABASE booking_db;
EOSQL

# Create the schema using the booking_db_create.sql file
# psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "booking_db" -f /docker-entrypoint-initdb.d/booking_db_create.sql

echo "BOOKING TEST DB CREATED!"