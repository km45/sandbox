BUILD_TYPE := Debug
BUILD_DIR := build/$(BUILD_TYPE)

.PHONY: up
up:
	docker-compose up --build -d

.PHONY: down
down:
	docker-compose down

.PHONY: shell
shell:
	docker-compose exec --user $$(id -u):$$(id -g) develop bash

.PHONY: lint
lint:
	cpplint --recursive include src test

.PHONY: build
build:
	cmake -S . -B $(BUILD_DIR) -G Ninja -D CMAKE_BUILD_TYPE=$(BUILD_TYPE)
	cmake --build $(BUILD_DIR)

.PHONY: test
test:
	$(BUILD_DIR)/catch2trial_test

.PHONY: clean
clean:
	rm -rf build
