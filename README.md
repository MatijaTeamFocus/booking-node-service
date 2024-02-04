# booking-node-service
Node.js backend service for managing parking spot bookings. The service provides RESTful API endpoints for creating, retrieving, updating, and deleting bookings. It utilizes TypeScript, Express.js, and TypeORM.

## Contributors

- Matija Milekic (matija.milekic@outlook.com)

## Tech task

- Tech task is available at 'task/Tech challenge.pdf'

## Setting up

- Install dependencies
```bash
$ npm i
```
- Set up your database and configure the connection in 'src/data-source.ts'.

## Running up the service

- Run a PostgreSQL container
```bash
$ docker run --name postgres-local -p 5432:5432 -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=booking_db -d postgres
```
- Run the service
```bash
$ npm run start
```

## Testing the service

```bash
$ make prepare-test
$ npm run test
```
## API Documentation

- Swagger documentation is available at 'src/swagger.yaml'

## Postman collection

- Postman collection is available at 'postman-collection/Booking Node Service.postman_collection.json'