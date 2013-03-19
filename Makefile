
all: install build

install:
	@echo install
	@npm install
	@./node_modules/.bin/component-install

build:
	@echo build
	@./node_modules/.bin/component-build


test: install build
	@echo test
	@./node_modules/.bin/mocha \
		--require chai \
		--reporter spec

.PHONY: test build
