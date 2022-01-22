DOCKER_COMPOSE_EXEC_COMMAND = docker compose exec --user $$(id -u):$$(id -g)

.PHONY: up
up:
	docker compose up -d --build

.PHONY: down
down:
	docker compose down

.PHONY: shell
shell:
	$(DOCKER_COMPOSE_EXEC_COMMAND) develop sh

.PHONY: serve
serve:
	$(DOCKER_COMPOSE_EXEC_COMMAND) develop npx docsify serve docs
