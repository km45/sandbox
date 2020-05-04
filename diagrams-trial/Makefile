.PHONY: watch
watch:
	while inotifywait -e close_write diagram.py; do python diagram.py; done

.PHONY: build
build:
	python diagram.py
