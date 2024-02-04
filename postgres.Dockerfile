FROM postgres:14.2-alpine

COPY init_database.sql /docker-entypoint-initdb.d

COPY booking_db_create.sql /docker-entrypoint-initdb.d

# COPY create_test_db.sh /docker-entrypoint-initdb.d