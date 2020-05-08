.PHONY: up
up:
	docker-compose up -d --build

.PHONY: down
down:
	docker-compose down

.PHONY: shell
shell:
	docker-compose exec develop bash

.PHONY: watch
watch:
	docker-compose exec develop bash -c "while inotifywait -e close_write diagram.py; do python diagram.py; done"

.PHONY: build
build:
	docker-compose exec develop python diagram.py

.PHONY: lint
lint:
	docker run --rm -i hadolint/hadolint < ./Dockerfile
