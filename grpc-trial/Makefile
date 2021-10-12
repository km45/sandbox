.PHONY: shell
shell:
	docker compose exec --user $$(id -u):$$(id -g) cpp bash

.PHONY: up
up:
	docker compose up -d --build

.PHONY: down
down:
	docker compose down

.PHONY: build
build:
	cmake -G Ninja -S . -B build/Release
	cmake --build build/Release

.PHONY: lint-proto
lint-proto:
	docker run --volume "$$(pwd)/protos:/workspace" --workdir /workspace bufbuild/buf lint
