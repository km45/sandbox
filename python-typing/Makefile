.PHONY: shell
shell:
	docker compose exec --user $$(id -u):$$(id -g) develop bash

.PHONY: up
up:
	docker compose up -d --build

.PHONY: down
down:
	docker compose down

.PHONY: lint
lint:
	mypy .
