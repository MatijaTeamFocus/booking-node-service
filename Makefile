prepare-test:
	docker-compose -f docker-compose.test.yml up -d postgres_test

kill-test: 
	docker-compose -f docker-compose.test.yml stop && docker-compose -f docker-compose.test.yml down

run-test:
	npm run test