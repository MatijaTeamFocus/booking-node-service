FROM postgres:14.2-alpine

COPY init_database.sql /docker-entypoint-initdb.d

COPY init_tables.sql /docker-entrypoint-initdb.d