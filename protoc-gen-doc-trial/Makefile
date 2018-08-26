.PHONY: up
up:
	docker-compose up --build -d

.PHONY: down
down:
	docker-compose down

.PHONY: shell
shell:
	docker-compose exec --user `id -u`:`id -g` develop bash

.PHONY: clean
clean:
	rm -rf dist/doc/index.html dist/cpp/com

.PHONY: build
build: clean
#	Use --doc_out instead of --doc_opt
#	https://github.com/pseudomuto/protoc-gen-doc/issues/322
	find src/ -name *.proto -type f | \
	  xargs protoc \
		--cpp_out=dist/cpp \
		--doc_out=html,index.html:dist/doc \
	    --proto_path=src
