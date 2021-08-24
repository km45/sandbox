DOCKER_COMPOSE_EXEC_COMMAND = docker-compose exec --user $$(id -u):$$(id -g)

.PHONY: up
up:
	docker-compose up --build -d

.PHONY: down
down:
	docker-compose down

.PHONY: shell
shell:
	$(DOCKER_COMPOSE_EXEC_COMMAND) develop /bin/bash

.PHONY: build
build:
	$(DOCKER_COMPOSE_EXEC_COMMAND) develop npx parcel build --public-url ./ src/index.html
